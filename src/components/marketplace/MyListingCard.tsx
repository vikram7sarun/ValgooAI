import Link from "next/link";
import type { MarketplaceListItem } from "@/types/marketplace";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const STATUS_TONE = {
  PENDING: "muted",
  APPROVED: "gain",
  REJECTED: "loss",
} as const;

export function MyListingCard({
  listing,
  onRunBacktest,
  pending,
}: {
  listing: MarketplaceListItem;
  onRunBacktest: () => void;
  pending: boolean;
}) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div>
        <div className="flex items-center gap-2">
          <Link href={`/marketplace/${listing.id}`} className="hover:underline">
            <h3 className="text-base font-semibold text-cream">{listing.name}</h3>
          </Link>
          <Badge tone="brown">{listing.marketType}</Badge>
          <Badge tone={STATUS_TONE[listing.status]}>{listing.status}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">₹{listing.pricePerMonth}/mo</p>
      </div>

      {listing.winRatePct !== null ? (
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted">Win rate </span>
            <span className="font-semibold text-gain">{listing.winRatePct}%</span>
          </div>
          <div>
            <span className="text-muted">Max drawdown </span>
            <span className="font-semibold text-loss">{listing.maxDrawdownPct}%</span>
          </div>
          <div>
            <span className="text-muted">Trades </span>
            <span className="font-semibold text-cream">{listing.totalTrades}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No backtest run yet</p>
      )}

      <Button variant="secondary" className="self-start px-4 py-2 text-sm" disabled={pending} onClick={onRunBacktest}>
        {pending ? "Running…" : listing.winRatePct !== null ? "Re-run backtest" : "Run backtest"}
      </Button>
    </Card>
  );
}
