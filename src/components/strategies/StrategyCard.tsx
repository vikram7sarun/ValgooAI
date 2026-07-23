import Link from "next/link";
import type { StrategyListItem } from "@/types/algo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const RISK_TONE = {
  Low: "gain",
  Medium: "brown",
  High: "loss",
} as const;

export function StrategyCard({
  strategy,
  onDeploy,
  pending,
}: {
  strategy: StrategyListItem;
  onDeploy: (next: boolean) => void;
  pending: boolean;
}) {
  const riskTone = RISK_TONE[strategy.riskLevel as keyof typeof RISK_TONE] ?? "brown";

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div>
        <div className="flex items-center gap-2">
          <Link href={`/strategies/${strategy.id}`} className="hover:underline">
            <h3 className="text-base font-semibold text-cream">{strategy.name}</h3>
          </Link>
          <Badge tone="brown">{strategy.marketType}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">{strategy.description}</p>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-muted">Win rate </span>
          <span className="font-semibold text-gain">{strategy.winRatePct}%</span>
        </div>
        <Badge tone={riskTone}>{strategy.riskLevel} risk</Badge>
      </div>

      <div className="flex items-center justify-between">
        <Link href={`/strategies/${strategy.id}`} className="text-sm text-brown-300 hover:text-brown-200">
          View details
        </Link>
        <Button
          variant={strategy.deployed ? "secondary" : "primary"}
          className="px-4 py-2 text-sm"
          disabled={pending}
          onClick={() => onDeploy(!strategy.deployed)}
        >
          {pending ? "..." : strategy.deployed ? "Undeploy" : "Deploy"}
        </Button>
      </div>
    </Card>
  );
}
