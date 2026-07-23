# Valgoo.AI — Algorithmic Trading Platform (MVP)

A full-stack MVP for an algorithmic trading signal platform covering Indian
equities/commodities and forex. Visitors see a live mock market snapshot on
the landing page; registered users see the algos an admin has enabled for
them, with live signal updates streamed to their dashboard; admins onboard
users and toggle algo access per account.

> **Disclaimer**: This is a demonstration MVP. All market prices and algo
> signals are mock/sample data. Nothing here is investment advice, no real
> trades are placed, and this is not a licensed broker or advisor.

## Architecture

```
Browser
  │  fetch / EventSource (SSE)
  ▼
Next.js Route Handlers (Node runtime)  ── requireUser/requireAdmin (RBAC) ──▶ Prisma ──▶ Postgres
  ▲
  │  JWT httpOnly cookie, verified by:
  │   1) middleware.ts (Edge runtime) — first gate, redirects/401s
  │   2) requireUser()/requireAdmin() inside each route handler — second, independent gate
  │
instrumentation.ts (runs once per server boot, Node runtime)
  ├─ starts the mock signal generator (lib/signals/generator.ts)
  │    every 5s: for each algo enabled by at least one user, generates a
  │    mock signal, writes an AlgoSignal row, and emits it on an in-memory
  │    EventEmitter (lib/sse/eventBus.ts)
  └─ starts the mock market data ticker (lib/market/mockMarketData.ts)
       an in-memory store, unrelated to the DB, jittered every 4s and read
       by the public landing page via /api/market/snapshot

/api/algos/stream (SSE)
  on connect, loads the requesting user's enabled algoIds, subscribes to the
  event bus, and forwards only signals for that user's enabled algos —
  this is how per-user "live updates" are scoped without per-user channels.
```

### Data model (`prisma/schema.prisma`)

- **User** — name, email, phone, passwordHash, role (`USER`/`ADMIN`), status (`PENDING`/`ACTIVE`/`SUSPENDED`), resetTokenHash/resetTokenExpiresAt, country/experience.
- **Algo** — name, marketType (`INDIA`/`FOREX`), description, plus static mock performance stats: winRatePct, maxDrawdownPct, avgReturnPct, riskLevel (`Low`/`Medium`/`High`).
- **UserAlgo** — join table; `enabled`/`enabledAt` per user per algo. Written to by both the admin toggle (`/admin/users/[id]`) and the user's own self-service deploy (`/strategies`) — same row, two entry points.
- **AlgoSignal** — log of generated signals (instrument, signal, metric, timestamp) per algo; feeds both the dashboard's initial load and the SSE stream.

### Auth & RBAC

- Passwords hashed with `bcryptjs` (cost 12).
- Sessions are JWTs (`jose`, HS256) in an httpOnly, `sameSite=lax` cookie, 7-day expiry.
- **Two independent RBAC layers**: `middleware.ts` gates `/dashboard*`, `/admin*`,
  `/settings*`, and their `/api/*` equivalents at the edge; every admin route
  handler *also* calls `requireAdmin()` itself, so admin protection isn't just
  a hidden URL — it still holds even if the middleware matcher were ever
  misconfigured.

### Self-registration approval queue

New accounts created via `/register` get `status = PENDING` (the schema
default) and cannot log in — `/api/auth/login` (`src/app/api/auth/login/route.ts`)
checks `status` after verifying the password and rejects with a 403 if the
account isn't `ACTIVE`. Admins see a `PENDING` badge and an "Approve" button
per user on `/admin` (`src/components/admin/UsersTable.tsx`), which calls
`POST /api/admin/users/[id]/approve`. Users created directly by an admin
(via "+ Add user") are created `ACTIVE` immediately, since an admin already
vouches for them.

An admin can also **suspend** an already-active user via
`POST /api/admin/users/[id]/suspend` (blocked from targeting their own
account, same guard pattern as self-delete) — `/api/auth/login` rejects a
`SUSPENDED` user with a distinct message from the pending-approval one.
Reactivating a suspended user reuses the same `/approve` endpoint (both
cases just set `status: "ACTIVE"`), so there's no separate "reactivate"
route — only the button label differs in `UsersTable.tsx`. The admin users
table also has client-side search (name/email/phone) and pagination
(10 rows/page) since `getAdminUsers()` loads the full list up front — fine
at MVP scale, revisit with server-side pagination if the user count grows
much larger.

### Strategy catalog & self-service deploy

`/strategies` (`src/app/strategies/`) lets a logged-in user browse every
`Algo` with its win rate/max drawdown/avg return/risk level, and deploy or
undeploy it for their own account via `PATCH /api/strategies/[id]/deploy`
(`src/app/api/strategies/[id]/deploy/route.ts`) — no admin approval step,
unlike the registration queue. This writes to the same `UserAlgo` row the
admin toggle (`/admin/users/[id]`) already uses, so either path works and
they stay in sync; a strategy a user self-deploys shows up on `/dashboard`
with live signals exactly like an admin-enabled one. Clicking into a
strategy (`/strategies/[id]`) shows the full stat grid plus its 10 most
recent signals, reusing `getStrategyDetail()` (`src/lib/strategies.ts`).

Performance stats (win rate, drawdown, etc.) are **static values set in
`prisma/seed.ts`**, not computed from live signal history — deliberately
simple for now. **Broker linking is explicitly out of scope** for this
round (no OAuth, no real account connection, no order execution) — deploy
only ever toggles the local `UserAlgo.enabled` flag.

### Password reset — another mock-delivery seam

Same philosophy as the mock market data/signals: the reset-token *mechanics*
are fully real (random token, sha256-hashed at rest, 1-hour expiry — see
`src/lib/auth/passwordReset.ts`), but there's no email provider wired up yet.
`POST /api/auth/forgot-password` logs the reset link to the server console
and, only when `NODE_ENV !== "production"`, also returns it directly in the
JSON response so local testing doesn't require SMTP setup. **Swap point for
later**: replace the `console.log` in
`src/app/api/auth/forgot-password/route.ts` with a real email send (e.g.
Resend/SendGrid) and drop the dev-mode response field — nothing else in the
reset flow (`/api/auth/reset-password`, the `/reset-password` page) needs to
change.

### Real-time design — and its current limitation

The event bus (`lib/sse/eventBus.ts`) is a plain Node `EventEmitter` kept on
`globalThis`. That means live signal delivery only works within **one server
process** — fine for local dev / a single-instance deployment, but it will
**not** fan out across multiple instances behind a load balancer. If this app
is ever scaled horizontally, swap the `emit`/`on` calls for Redis pub/sub or
Postgres `LISTEN/NOTIFY` — the SSE route and every dashboard component only
depend on that `emit`/`on` interface, so nothing else needs to change.

## Swapping mock data for a real feed later

Two independent seams, both designed so consuming code never changes:

1. **Landing page ticker** — replace the internals of
   `getMarketSnapshot()` in [`src/lib/market/mockMarketData.ts`](src/lib/market/mockMarketData.ts)
   with a call to a real market-data provider. `MarketsLive`/`MarketTickerBar`/`MarketCard`
   and `/api/market/snapshot` all just consume whatever this function returns.
2. **Algo signals** — replace the `setInterval` loop in
   [`src/lib/signals/generator.ts`](src/lib/signals/generator.ts) with a real
   broker/data-feed subscription or webhook handler that calls the same two
   steps the mock loop does: `prisma.algoSignal.create(...)` then
   `emitAlgoSignal(event)`. The SSE route, the dashboard, and the schema are
   all untouched.

Real broker order execution, KYC/compliance, billing, and licensed market
data are explicitly out of scope for this MVP.

## Local development setup

Prerequisites: Node.js 20+, Docker Desktop.

### First-time setup

Run this once, when setting the project up for the first time:

```bash
cp .env.example .env
# edit .env and set JWT_SECRET, e.g.:
openssl rand -base64 32

docker compose up -d        # starts Postgres on localhost:5432
npm install
npm run prisma:migrate      # creates the schema
npm run prisma:seed         # seeds admin, a test user, and 3 algos
npm run dev                 # http://localhost:3000
```

### Restarting later (next day / after a reboot)

Postgres data lives in a named Docker volume (`valgooai_valgoo_pgdata`), so it
survives container/computer restarts. You do **not** need to repeat
`npm install`, `npm run prisma:migrate`, or `npm run prisma:seed` — just bring
the services back up:

```bash
# 1. Start Docker Desktop if it isn't already running
open -a Docker            # macOS; wait ~10-20s for it to finish starting

# 2. Start Postgres (reuses existing data/volume)
cd /path/to/ValgooAI
docker compose up -d

# 3. Start the app
npm run dev                # http://localhost:3000
```

The mock signal generator and market ticker boot automatically on server
start via `instrumentation.ts` — look for `[signal-generator] started...` in
the terminal output to confirm.

Optionally, to browse the database in a UI instead of `psql`:

```bash
npx prisma studio           # http://localhost:5555
```

Only re-run `npm install` if `node_modules` was deleted, and only re-run
`npm run prisma:migrate`/`npm run prisma:seed` if you intentionally reset the
database (see `npm run db:reset` below) or pulled new schema changes.

### Troubleshooting

| Symptom | Fix |
|---|---|
| Port 3000 already in use | `lsof -ti:3000 \| xargs kill -9`, then retry `npm run dev` |
| App can't connect to Postgres | `docker compose ps` to confirm the container is `Up`; check logs with `docker compose logs postgres` |
| Docker daemon not running | `open -a Docker` (macOS) and wait for it to fully start before `docker compose up -d` |
| Forgot the seeded login credentials | See the Seeded accounts table below |

### Seeded accounts

| Role  | Email               | Password    | Notes                                   |
|-------|---------------------|-------------|------------------------------------------|
| Admin | admin@valgoo.ai      | Admin@123   | Full access to `/admin`                  |
| User  | trader@valgoo.ai     | Test@123    | Gold Algo enabled — live signals flowing |

Rotate or remove these credentials before deploying anywhere non-local.

### Useful scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server (also boots the mock signal generator + ticker) |
| `npm run prisma:migrate` | Apply/create migrations |
| `npm run prisma:seed` | Re-run the seed script |
| `npm run db:reset` | Drop, recreate, migrate, and reseed the database |
| `npx prisma studio` | Browse/edit the database in a UI at `http://localhost:5555` |

## Known MVP limitations

- No real broker integration or order execution.
- No KYC/compliance/audit-trail features.
- No billing/subscriptions.
- No licensed real-time market data — all prices/signals are mock/random-walk.
- Live updates are single-process only (see Real-time design above).
