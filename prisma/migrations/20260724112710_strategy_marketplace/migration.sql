-- CreateEnum
CREATE TYPE "MarketplaceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "marketplace_strategies" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "marketType" "MarketType" NOT NULL,
    "pricePerMonth" DOUBLE PRECISION NOT NULL,
    "status" "MarketplaceStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketplace_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_rentals" (
    "id" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strategy_rentals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_backtests" (
    "id" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "winRatePct" DOUBLE PRECISION NOT NULL,
    "maxDrawdownPct" DOUBLE PRECISION NOT NULL,
    "totalReturnPct" DOUBLE PRECISION NOT NULL,
    "totalTrades" INTEGER NOT NULL,
    "equityCurve" DOUBLE PRECISION[],
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketplace_backtests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketplace_strategies_status_idx" ON "marketplace_strategies"("status");

-- CreateIndex
CREATE INDEX "strategy_rentals_renterId_idx" ON "strategy_rentals"("renterId");

-- CreateIndex
CREATE INDEX "strategy_rentals_strategyId_idx" ON "strategy_rentals"("strategyId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_backtests_strategyId_key" ON "marketplace_backtests"("strategyId");

-- AddForeignKey
ALTER TABLE "marketplace_strategies" ADD CONSTRAINT "marketplace_strategies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_rentals" ADD CONSTRAINT "strategy_rentals_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_rentals" ADD CONSTRAINT "strategy_rentals_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "marketplace_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_backtests" ADD CONSTRAINT "marketplace_backtests_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "marketplace_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
