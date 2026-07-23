import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";

const deploySchema = z.object({ enabled: z.boolean() });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id: algoId } = await params;

    const body = await request.json().catch(() => null);
    const parsed = deploySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { enabled } = parsed.data;

    const algo = await prisma.algo.findUnique({ where: { id: algoId } });
    if (!algo) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    const userAlgo = await prisma.userAlgo.upsert({
      where: { userId_algoId: { userId: session.sub, algoId } },
      update: { enabled, enabledAt: enabled ? new Date() : undefined },
      create: { userId: session.sub, algoId, enabled, enabledAt: enabled ? new Date() : undefined },
    });

    return NextResponse.json({
      id: userAlgo.id,
      enabled: userAlgo.enabled,
      enabledAt: userAlgo.enabledAt,
    });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
