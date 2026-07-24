import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { MarketplaceListItem, MarketplaceDetail } from "@/types/marketplace";

const withRelations = {
  owner: { select: { name: true } },
  backtest: true,
} satisfies Prisma.MarketplaceStrategyInclude;

type StrategyWithRelations = Prisma.MarketplaceStrategyGetPayload<{ include: typeof withRelations }>;

async function getActiveRentalMap(userId: string, strategyIds: string[]): Promise<Map<string, Date>> {
  if (!userId || strategyIds.length === 0) return new Map();
  const rentals = await prisma.strategyRental.findMany({
    where: { renterId: userId, strategyId: { in: strategyIds }, expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: "desc" },
  });
  const map = new Map<string, Date>();
  for (const r of rentals) {
    if (!map.has(r.strategyId)) map.set(r.strategyId, r.expiresAt);
  }
  return map;
}

function toListItem(
  strategy: StrategyWithRelations,
  userId: string,
  rentalMap: Map<string, Date>,
): MarketplaceListItem {
  const isOwner = strategy.ownerId === userId;
  const rentedUntil = rentalMap.get(strategy.id) ?? null;

  return {
    id: strategy.id,
    name: strategy.name,
    marketType: strategy.marketType,
    pricePerMonth: strategy.pricePerMonth,
    ownerName: strategy.owner.name,
    status: strategy.status,
    winRatePct: strategy.backtest?.winRatePct ?? null,
    maxDrawdownPct: strategy.backtest?.maxDrawdownPct ?? null,
    totalReturnPct: strategy.backtest?.totalReturnPct ?? null,
    totalTrades: strategy.backtest?.totalTrades ?? null,
    isOwner,
    isRenter: rentedUntil !== null,
    rentedUntil: rentedUntil ? rentedUntil.toISOString() : null,
  };
}

export async function getApprovedListings(userId: string): Promise<MarketplaceListItem[]> {
  const strategies = await prisma.marketplaceStrategy.findMany({
    where: { status: "APPROVED" },
    include: withRelations,
    orderBy: { createdAt: "desc" },
  });
  const rentalMap = await getActiveRentalMap(userId, strategies.map((s) => s.id));
  return strategies.map((s) => toListItem(s, userId, rentalMap));
}

export async function getMyListings(userId: string): Promise<MarketplaceListItem[]> {
  const strategies = await prisma.marketplaceStrategy.findMany({
    where: { ownerId: userId },
    include: withRelations,
    orderBy: { createdAt: "desc" },
  });
  const rentalMap = await getActiveRentalMap(userId, strategies.map((s) => s.id));
  return strategies.map((s) => toListItem(s, userId, rentalMap));
}

export async function getAllListingsForAdmin(): Promise<MarketplaceListItem[]> {
  const strategies = await prisma.marketplaceStrategy.findMany({
    include: withRelations,
    orderBy: { createdAt: "desc" },
  });
  return strategies.map((s) => toListItem(s, "", new Map()));
}

export async function getListingDetail(
  id: string,
  userId: string,
  isAdmin = false,
): Promise<MarketplaceDetail | null> {
  const strategy = await prisma.marketplaceStrategy.findUnique({
    where: { id },
    include: withRelations,
  });
  if (!strategy) return null;

  const isOwner = strategy.ownerId === userId;
  if (strategy.status !== "APPROVED" && !isOwner && !isAdmin) {
    return null;
  }

  const rentalMap = await getActiveRentalMap(userId, [strategy.id]);
  const item = toListItem(strategy, userId, rentalMap);
  const unlocked = item.isOwner || item.isRenter || isAdmin;

  return {
    ...item,
    description: unlocked ? strategy.description : null,
    equityCurve: unlocked ? strategy.backtest?.equityCurve ?? null : null,
  };
}
