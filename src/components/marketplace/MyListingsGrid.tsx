"use client";

import { useState } from "react";
import type { MarketplaceListItem } from "@/types/marketplace";
import { MyListingCard } from "./MyListingCard";

export function MyListingsGrid({ initialListings }: { initialListings: MarketplaceListItem[] }) {
  const [listings, setListings] = useState(initialListings);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleRunBacktest = async (id: string) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/marketplace/${id}/backtest`, { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        setListings((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  winRatePct: body.report.winRatePct,
                  maxDrawdownPct: body.report.maxDrawdownPct,
                  totalReturnPct: body.report.totalReturnPct,
                  totalTrades: body.report.totalTrades,
                }
              : l,
          ),
        );
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? "Could not run backtest");
      }
    } finally {
      setPendingId(null);
    }
  };

  if (listings.length === 0) {
    return (
      <p className="text-sm text-muted">
        You haven&apos;t published any strategies yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <MyListingCard
          key={listing.id}
          listing={listing}
          pending={pendingId === listing.id}
          onRunBacktest={() => handleRunBacktest(listing.id)}
        />
      ))}
    </div>
  );
}
