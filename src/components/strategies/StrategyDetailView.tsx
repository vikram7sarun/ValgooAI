"use client";

import { useState } from "react";
import type { StrategyDetail } from "@/types/algo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SignalFeed } from "@/components/dashboard/SignalFeed";

const RISK_TONE = {
  Low: "gain",
  Medium: "brown",
  High: "loss",
} as const;

export function StrategyDetailView({ initialStrategy }: { initialStrategy: StrategyDetail }) {
  const [strategy, setStrategy] = useState(initialStrategy);
  const [pending, setPending] = useState(false);

  const riskTone = RISK_TONE[strategy.riskLevel as keyof typeof RISK_TONE] ?? "brown";

  const handleDeploy = async (enabled: boolean) => {
    setPending(true);
    const previous = strategy;
    setStrategy((s) => ({ ...s, deployed: enabled }));

    try {
      const res = await fetch(`/api/strategies/${strategy.id}/deploy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) {
        setStrategy(previous);
      }
    } catch {
      setStrategy(previous);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-cream">{strategy.name}</h1>
            <Badge tone="brown">{strategy.marketType}</Badge>
          </div>
          <p className="mt-2 max-w-xl text-sm text-muted">{strategy.description}</p>
        </div>
        <Button
          variant={strategy.deployed ? "secondary" : "primary"}
          disabled={pending}
          onClick={() => handleDeploy(!strategy.deployed)}
        >
          {pending ? "..." : strategy.deployed ? "Undeploy" : "Deploy"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Win rate</p>
          <p className="mt-1 text-2xl font-semibold text-gain tabular-nums">{strategy.winRatePct}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Max drawdown</p>
          <p className="mt-1 text-2xl font-semibold text-loss tabular-nums">
            {strategy.maxDrawdownPct}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Avg return</p>
          <p className="mt-1 text-2xl font-semibold text-cream tabular-nums">
            {strategy.avgReturnPct}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Risk level</p>
          <p className="mt-2">
            <Badge tone={riskTone}>{strategy.riskLevel}</Badge>
          </p>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
          Recent activity
        </h2>
        <Card className="p-5">
          <SignalFeed signals={strategy.recentSignals} />
        </Card>
      </div>
    </div>
  );
}
