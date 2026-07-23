import type { MarketQuote } from "@/types/market";
import { Card } from "@/components/ui/Card";
import { PriceDelta } from "@/components/ui/PriceDelta";

export function MarketCard({ quote }: { quote: MarketQuote }) {
  return (
    <Card className="flex flex-col gap-2 p-5 transition-colors hover:border-brown-500/50">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{quote.name}</span>
        <span className="text-xs text-muted/70">{quote.symbol}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-cream tabular-nums">
          {quote.price.toLocaleString("en-IN", {
            minimumFractionDigits: quote.price < 10 ? 4 : 2,
            maximumFractionDigits: quote.price < 10 ? 4 : 2,
          })}
        </span>
        {quote.unit && <span className="text-sm text-muted">{quote.unit}</span>}
      </div>
      <PriceDelta changePct={quote.changePct} />
    </Card>
  );
}
