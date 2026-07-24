"use client";

import { useState } from "react";
import type { MarketplaceListItem } from "@/types/marketplace";
import { MarketplaceCard } from "./MarketplaceCard";

export function MarketplaceBrowseGrid({ initialListings }: { initialListings: MarketplaceListItem[] }) {
  const [listings, setListings] = useState(initialListings);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleRent = async (id: string) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/marketplace/${id}/rent`, { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, isRenter: true, rentedUntil: body.expiresAt } : l)),
        );
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? "Could not rent this strategy");
      }
    } finally {
      setPendingId(null);
    }
  };

  if (listings.length === 0) {
    return <p className="text-sm text-muted">No approved strategies yet — check back soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <MarketplaceCard
          key={listing.id}
          listing={listing}
          pending={pendingId === listing.id}
          onRent={() => handleRent(listing.id)}
        />
      ))}
    </div>
  );
}
