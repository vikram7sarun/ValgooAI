"use client";

import { useState } from "react";
import type { MarketplaceDetail } from "@/types/marketplace";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EquityCurveChart } from "./EquityCurveChart";

export function ListingDetailView({ initialListing }: { initialListing: MarketplaceDetail }) {
  const [listing, setListing] = useState(initialListing);
  const [pending, setPending] = useState(false);

  const unlocked = listing.isOwner || listing.isRenter;

  const handleRent = async () => {
    setPending(true);
    try {
      const res = await fetch(`/api/marketplace/${listing.id}/rent`, { method: "POST" });
      if (res.ok) {
        const detailRes = await fetch(`/api/marketplace/${listing.id}`);
        if (detailRes.ok) {
          const body = await detailRes.json();
          setListing(body.listing);
        }
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? "Could not rent this strategy");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-cream">{listing.name}</h1>
          <Badge tone="brown">{listing.marketType}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          by {listing.ownerName} · ₹{listing.pricePerMonth}/mo
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Win rate</p>
          <p className="mt-1 text-2xl font-semibold text-gain tabular-nums">
            {listing.winRatePct !== null ? `${listing.winRatePct}%` : "—"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Max drawdown</p>
          <p className="mt-1 text-2xl font-semibold text-loss tabular-nums">
            {listing.maxDrawdownPct !== null ? `${listing.maxDrawdownPct}%` : "—"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Total return</p>
          <p
            className={`mt-1 text-2xl font-semibold tabular-nums ${
              listing.totalReturnPct !== null && listing.totalReturnPct < 0 ? "text-loss" : "text-gain"
            }`}
          >
            {listing.totalReturnPct !== null
              ? `${listing.totalReturnPct >= 0 ? "+" : ""}${listing.totalReturnPct}%`
              : "—"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Trades</p>
          <p className="mt-1 text-2xl font-semibold text-cream tabular-nums">
            {listing.totalTrades ?? "—"}
          </p>
        </Card>
      </div>

      {unlocked ? (
        <>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
              Description
            </h2>
            <Card className="p-5">
              <p className="whitespace-pre-wrap text-sm text-cream">{listing.description}</p>
            </Card>
          </div>
          {listing.equityCurve && listing.equityCurve.length > 1 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
                Equity curve
              </h2>
              <Card className="p-5">
                <EquityCurveChart equityCurve={listing.equityCurve} />
              </Card>
            </div>
          )}
          {listing.isRenter && listing.rentedUntil && (
            <p className="text-sm text-muted">
              Rented until {new Date(listing.rentedUntil).toLocaleDateString("en-IN")}
            </p>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <h3 className="text-base font-semibold text-cream">Rent to see the full strategy</h3>
          <p className="max-w-sm text-sm text-muted">
            The full description and equity curve unlock once you rent this strategy.
          </p>
          <Button disabled={pending} onClick={handleRent}>
            {pending ? "…" : `Rent — ₹${listing.pricePerMonth}/mo`}
          </Button>
        </Card>
      )}
    </div>
  );
}
