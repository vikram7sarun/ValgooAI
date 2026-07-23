import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/validation/profile";

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireUser();

    const body = await request.json().catch(() => null);
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: session.sub } });
    if (!user) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: session.sub }, data: { passwordHash } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
