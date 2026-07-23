import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, authErrorResponse } from "@/lib/auth/rbac";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    if (id === session.sub) {
      return NextResponse.json({ error: "You cannot suspend your own account" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status: "SUSPENDED" },
      select: { id: true, status: true },
    });

    return NextResponse.json({ id: user.id, status: user.status });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
