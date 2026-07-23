-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('INDIA', 'FOREX');

-- CreateEnum
CREATE TYPE "SignalAction" AS ENUM ('BUY', 'SELL', 'HOLD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "country" TEXT,
    "experience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "algos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marketType" "MarketType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "algos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_algos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "algoId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "enabledAt" TIMESTAMP(3),

    CONSTRAINT "user_algos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "algo_signals" (
    "id" TEXT NOT NULL,
    "algoId" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "signal" "SignalAction" NOT NULL,
    "metric" DOUBLE PRECISION,
    "metricLabel" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "algo_signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "algos_name_key" ON "algos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_algos_userId_algoId_key" ON "user_algos"("userId", "algoId");

-- CreateIndex
CREATE INDEX "algo_signals_algoId_timestamp_idx" ON "algo_signals"("algoId", "timestamp");

-- AddForeignKey
ALTER TABLE "user_algos" ADD CONSTRAINT "user_algos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_algos" ADD CONSTRAINT "user_algos_algoId_fkey" FOREIGN KEY ("algoId") REFERENCES "algos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "algo_signals" ADD CONSTRAINT "algo_signals_algoId_fkey" FOREIGN KEY ("algoId") REFERENCES "algos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
