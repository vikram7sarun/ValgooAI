import type { DashboardSignal } from "@/types/algo";
import { Badge } from "@/components/ui/Badge";

const SIGNAL_TONE = {
  BUY: "gain",
  SELL: "loss",
  HOLD: "muted",
} as const;

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function SignalFeed({ signals }: { signals: DashboardSignal[] }) {
  if (signals.length === 0) {
    return <p className="text-sm text-muted">Waiting for the first signal…</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {signals.map((s) => (
        <li key={s.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <div className="flex items-center gap-3">
            <Badge tone={SIGNAL_TONE[s.signal]}>{s.signal}</Badge>
            <span className="text-cream">{s.instrument}</span>
            {s.metric !== null && (
              <span className="tabular-nums text-muted">
                {s.metricLabel}: {s.metric.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span className="shrink-0 tabular-nums text-xs text-muted">{formatTime(s.timestamp)}</span>
        </li>
      ))}
    </ul>
  );
}
