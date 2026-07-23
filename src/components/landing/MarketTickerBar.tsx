import type { MarketQuote } from "@/types/market";

export function MarketTickerBar({ quotes }: { quotes: MarketQuote[] }) {
  const loop = [...quotes, ...quotes];

  return (
    <div className="relative overflow-hidden border-y border-border bg-base-surface py-3">
      <div className="animate-[ticker_35s_linear_infinite] flex w-max gap-10 whitespace-nowrap px-6">
        {loop.map((q, i) => (
          <div key={`${q.symbol}-${i}`} className="flex items-center gap-2 text-sm">
            <span className="font-medium text-cream">{q.symbol}</span>
            <span className="tabular-nums text-muted">
              {q.price.toLocaleString("en-IN", {
                minimumFractionDigits: q.price < 10 ? 4 : 2,
                maximumFractionDigits: q.price < 10 ? 4 : 2,
              })}
            </span>
            <span className={q.changePct >= 0 ? "text-gain" : "text-loss"}>
              {q.changePct >= 0 ? "+" : ""}
              {q.changePct.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
