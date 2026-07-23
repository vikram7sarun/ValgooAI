import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, authErrorResponse } from "@/lib/auth/rbac";
import { toggleAlgoSchema } from "@/lib/validation/admin";
import { getUserAlgoToggles } from "@/lib/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const algos = await getUserAlgoToggles(id);
    return NextResponse.json({ algos });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: userId } = await params;

    const body = await request.json().catch(() => null);
    const parsed = toggleAlgoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { algoId, enabled } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userAlgo = await prisma.userAlgo.upsert({
      where: { userId_algoId: { userId, algoId } },
      update: { enabled, enabledAt: enabled ? new Date() : undefined },
      create: { userId, algoId, enabled, enabledAt: enabled ? new Date() : undefined },
    });

    return NextResponse.json({ id: userAlgo.id, enabled: userAlgo.enabled, enabledAt: userAlgo.enabledAt });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
