import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation/profile";
import { hashResetToken } from "@/lib/auth/passwordReset";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const tokenHash = hashResetToken(token);

  const user = await prisma.user.findFirst({
    where: { resetTokenHash: tokenHash, resetTokenExpiresAt: { gt: new Date() } },
  });

  if (!user) {
    return NextResponse.json({ error: "This reset link is invalid or has expired" }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });

  return NextResponse.json({ ok: true });
}
