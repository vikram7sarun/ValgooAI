import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function PriceDelta({ changePct }: { changePct: number }) {
  const isFlat = Math.abs(changePct) < 0.001;
  const isUp = changePct > 0;

  if (isFlat) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-muted">
        <Minus className="h-3.5 w-3.5" />
        0.00%
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${isUp ? "text-gain" : "text-loss"}`}
    >
      {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {isUp ? "+" : ""}
      {changePct.toFixed(2)}%
    </span>
  );
}
