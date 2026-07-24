import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getApprovedListings } from "@/lib/marketplace";
import { publishStrategySchema } from "@/lib/validation/marketplace";

export async function GET() {
  try {
    const session = await requireUser();
    const listings = await getApprovedListings(session.sub);
    return NextResponse.json({ listings });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();

    const body = await request.json().catch(() => null);
    const parsed = publishStrategySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { name, description, marketType, pricePerMonth } = parsed.data;

    const strategy = await prisma.marketplaceStrategy.create({
      data: { ownerId: session.sub, name, description, marketType, pricePerMonth },
    });

    return NextResponse.json({ id: strategy.id }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
