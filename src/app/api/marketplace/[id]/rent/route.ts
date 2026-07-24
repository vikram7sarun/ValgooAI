import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";

const RENTAL_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id: strategyId } = await params;

    const strategy = await prisma.marketplaceStrategy.findUnique({ where: { id: strategyId } });
    if (!strategy) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }
    if (strategy.status !== "APPROVED") {
      return NextResponse.json({ error: "This strategy isn't available to rent" }, { status: 400 });
    }
    if (strategy.ownerId === session.sub) {
      return NextResponse.json({ error: "You already own this strategy" }, { status: 400 });
    }

    const rental = await prisma.strategyRental.create({
      data: {
        renterId: session.sub,
        strategyId,
        expiresAt: new Date(Date.now() + RENTAL_PERIOD_MS),
      },
    });

    return NextResponse.json({ expiresAt: rental.expiresAt }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
