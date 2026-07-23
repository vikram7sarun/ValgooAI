"use client";

import { useState } from "react";
import type { StrategyListItem } from "@/types/algo";
import { StrategyCard } from "./StrategyCard";

export function StrategyCatalog({ initialStrategies }: { initialStrategies: StrategyListItem[] }) {
  const [strategies, setStrategies] = useState(initialStrategies);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDeploy = async (algoId: string, enabled: boolean) => {
    setPendingId(algoId);
    const previous = strategies;
    setStrategies((prev) =>
      prev.map((s) => (s.id === algoId ? { ...s, deployed: enabled } : s)),
    );

    try {
      const res = await fetch(`/api/strategies/${algoId}/deploy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) {
        setStrategies(previous);
      }
    } catch {
      setStrategies(previous);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          pending={pendingId === strategy.id}
          onDeploy={(next) => handleDeploy(strategy.id, next)}
        />
      ))}
    </div>
  );
}
