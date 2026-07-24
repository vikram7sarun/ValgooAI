import Link from "next/link";
import type { MarketplaceListItem } from "@/types/marketplace";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function MarketplaceCard({
  listing,
  onRent,
  pending,
}: {
  listing: MarketplaceListItem;
  onRent: () => void;
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
        </div>
        <p className="mt-1 text-sm text-muted">by {listing.ownerName}</p>
      </div>

      {listing.winRatePct !== null ? (
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted">Win rate </span>
            <span className="font-semibold text-gain">{listing.winRatePct}%</span>
          </div>
          <div>
            <span className="text-muted">Return </span>
            <span
              className={`font-semibold ${listing.totalReturnPct! >= 0 ? "text-gain" : "text-loss"}`}
            >
              {listing.totalReturnPct! >= 0 ? "+" : ""}
              {listing.totalReturnPct}%
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No backtest published yet</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-cream">₹{listing.pricePerMonth}/mo</span>
        {listing.isOwner ? (
          <Badge tone="brown">Your strategy</Badge>
        ) : listing.isRenter ? (
          <Badge tone="gain">Rented</Badge>
        ) : (
          <Button className="px-4 py-2 text-sm" disabled={pending} onClick={onRent}>
            {pending ? "..." : "Rent"}
          </Button>
        )}
      </div>
    </Card>
  );
}
