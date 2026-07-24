import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { runBacktest } from "@/lib/marketplace/backtest";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id: strategyId } = await params;

    const strategy = await prisma.marketplaceStrategy.findUnique({ where: { id: strategyId } });
    if (!strategy) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }
    if (strategy.ownerId !== session.sub) {
      return NextResponse.json({ error: "Only the owner can run a backtest" }, { status: 403 });
    }

    const report = runBacktest();

    await prisma.marketplaceBacktest.upsert({
      where: { strategyId },
      update: { ...report },
      create: { strategyId, ...report },
    });

    return NextResponse.json({ report });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
