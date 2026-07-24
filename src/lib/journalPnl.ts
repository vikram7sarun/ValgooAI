import type { TradeDirection } from "@/types/journal";

export function computePnlPct(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number | null,
): number | null {
  if (exitPrice === null) return null;
  const delta = direction === "BUY" ? exitPrice - entryPrice : entryPrice - exitPrice;
  return (delta / entryPrice) * 100;
}
