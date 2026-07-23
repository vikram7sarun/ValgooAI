"use client";

import { useState } from "react";
import type { UserAlgoToggle } from "@/types/admin";
import { UserAlgoToggleRow } from "./UserAlgoToggleRow";

export function UserAlgoManager({ userId, initialAlgos }: { userId: string; initialAlgos: UserAlgoToggle[] }) {
  const [algos, setAlgos] = useState(initialAlgos);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleToggle = async (algoId: string, enabled: boolean) => {
    setPendingId(algoId);
    const previous = algos;
    setAlgos((prev) => prev.map((a) => (a.id === algoId ? { ...a, enabled } : a)));

    try {
      const res = await fetch(`/api/admin/users/${userId}/algos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algoId, enabled }),
      });
      if (!res.ok) {
        setAlgos(previous);
      }
    } catch {
      setAlgos(previous);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {algos.map((algo) => (
        <UserAlgoToggleRow
          key={algo.id}
          algo={algo}
          disabled={pendingId === algo.id}
          onToggle={(next) => handleToggle(algo.id, next)}
        />
      ))}
    </div>
  );
}
