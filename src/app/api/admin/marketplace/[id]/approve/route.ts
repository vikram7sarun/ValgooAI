import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, authErrorResponse } from "@/lib/auth/rbac";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const strategy = await prisma.marketplaceStrategy.update({
      where: { id },
      data: { status: "APPROVED" },
      select: { id: true, status: true },
    });

    return NextResponse.json(strategy);
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
