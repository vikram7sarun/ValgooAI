import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, authErrorResponse } from "@/lib/auth/rbac";
import { createSessionCookie, getRawSessionToken, setAdminReturnCookie } from "@/lib/auth/session";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminSession = await requireAdmin();
    const { id: targetUserId } = await params;

    if (targetUserId === adminSession.sub) {
      return NextResponse.json(
        { error: "You cannot impersonate your own account" },
        { status: 400 },
      );
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (targetUser.role === "ADMIN") {
      return NextResponse.json({ error: "Cannot impersonate another admin" }, { status: 400 });
    }

    const currentToken = await getRawSessionToken();
    if (!currentToken) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    await setAdminReturnCookie(currentToken);
    await createSessionCookie({
      sub: targetUser.id,
      role: targetUser.role,
      email: targetUser.email,
      impersonatedBy: adminSession.sub,
    });

    await prisma.impersonationLog.create({
      data: { adminId: adminSession.sub, targetUserId: targetUser.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
