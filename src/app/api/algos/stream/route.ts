import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/rbac";
import { onAlgoSignal } from "@/lib/sse/eventBus";

export const dynamic = "force-dynamic";

const PING_INTERVAL_MS = 15000;

export async function GET(request: NextRequest) {
  const session = await requireUser().catch(() => null);
  if (!session) {
    return new Response("Authentication required", { status: 401 });
  }

  const enabledAlgos = await prisma.userAlgo.findMany({
    where: { userId: session.sub, enabled: true },
    select: { algoId: true },
  });
  const allowedAlgoIds = new Set(enabledAlgos.map((a) => a.algoId));

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send("connected", { ok: true });

      const unsubscribe = onAlgoSignal((event) => {
        if (allowedAlgoIds.has(event.algoId)) {
          send("signal", event);
        }
      });

      const pingId = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, PING_INTERVAL_MS);

      const cleanup = () => {
        clearInterval(pingId);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
