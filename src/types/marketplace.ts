import type { MarketType } from "./algo";

export type MarketplaceStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface MarketplaceListItem {
  id: string;
  name: string;
  marketType: MarketType;
  pricePerMonth: number;
  ownerName: string;
  status: MarketplaceStatus;
  winRatePct: number | null;
  maxDrawdownPct: number | null;
  totalReturnPct: number | null;
  totalTrades: number | null;
  isOwner: boolean;
  isRenter: boolean;
  rentedUntil: string | null;
}

export interface MarketplaceDetail extends MarketplaceListItem {
  description: string | null;
  equityCurve: number[] | null;
}
