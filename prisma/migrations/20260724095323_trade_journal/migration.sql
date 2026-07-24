-- CreateEnum
CREATE TYPE "TradeDirection" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "TradeTag" AS ENUM ('FOMO', 'REVENGE', 'LATE_ENTRY', 'PERFECT_TRADE');

-- CreateTable
CREATE TABLE "trade_journal_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "algoId" TEXT,
    "instrument" TEXT NOT NULL,
    "direction" "TradeDirection" NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION,
    "entryTime" TIMESTAMP(3) NOT NULL,
    "exitTime" TIMESTAMP(3),
    "screenshotUrl" TEXT,
    "reason" TEXT,
    "emotion" TEXT,
    "mistake" TEXT,
    "news" TEXT,
    "tags" "TradeTag"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trade_journal_entries_userId_entryTime_idx" ON "trade_journal_entries"("userId", "entryTime");

-- AddForeignKey
ALTER TABLE "trade_journal_entries" ADD CONSTRAINT "trade_journal_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_journal_entries" ADD CONSTRAINT "trade_journal_entries_algoId_fkey" FOREIGN KEY ("algoId") REFERENCES "algos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
