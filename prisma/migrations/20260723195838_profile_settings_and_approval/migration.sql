-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resetTokenHash" TEXT,
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'PENDING';
