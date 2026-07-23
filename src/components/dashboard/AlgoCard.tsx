import type { DashboardAlgo } from "@/types/algo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SignalFeed } from "./SignalFeed";

export function AlgoCard({ algo }: { algo: DashboardAlgo }) {
  const latest = algo.recentSignals[0];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-cream">{algo.name}</h3>
            <Badge tone="gain">Active</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">{algo.description}</p>
        </div>
        {latest && (
          <span className="shrink-0 text-xs text-muted">
            Last update: {new Date(latest.timestamp).toLocaleTimeString("en-IN")}
          </span>
        )}
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <SignalFeed signals={algo.recentSignals.slice(0, 8)} />
      </div>
    </Card>
  );
}
