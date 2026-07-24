"use client";

import { useState } from "react";
import type { MarketplaceListItem } from "@/types/marketplace";
import { Table, Thead, Th, Tr, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const STATUS_TONE = {
  PENDING: "muted",
  APPROVED: "gain",
  REJECTED: "loss",
} as const;

export function AdminMarketplaceTable({ initialListings }: { initialListings: MarketplaceListItem[] }) {
  const [listings, setListings] = useState(initialListings);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleModerate = async (id: string, action: "approve" | "reject") => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/marketplace/${id}/${action}`, { method: "POST" });
      if (res.ok) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status: action === "approve" ? "APPROVED" : "REJECTED" } : l,
          ),
        );
      }
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Name</Th>
          <Th>Owner</Th>
          <Th>Market</Th>
          <Th>Price/mo</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </Thead>
      <tbody>
        {listings.map((listing) => (
          <Tr key={listing.id}>
            <Td className="font-medium text-cream">{listing.name}</Td>
            <Td className="text-muted">{listing.ownerName}</Td>
            <Td>
              <Badge tone="brown">{listing.marketType}</Badge>
            </Td>
            <Td className="text-muted">₹{listing.pricePerMonth}</Td>
            <Td>
              <Badge tone={STATUS_TONE[listing.status]}>{listing.status}</Badge>
            </Td>
            <Td>
              {listing.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    disabled={pendingId === listing.id}
                    onClick={() => handleModerate(listing.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    className="px-3 py-1.5 text-xs"
                    disabled={pendingId === listing.id}
                    onClick={() => handleModerate(listing.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Td>
          </Tr>
        ))}
        {listings.length === 0 && (
          <Tr>
            <Td colSpan={6} className="text-center text-muted">
              No published strategies yet.
            </Td>
          </Tr>
        )}
      </tbody>
    </Table>
  );
}
