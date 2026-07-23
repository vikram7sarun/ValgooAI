import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation/profile";
import { generateResetToken } from "@/lib/auth/passwordReset";

const GENERIC_MESSAGE = "If an account exists for that email, a reset link has been sent.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Same response regardless of whether the account exists, to avoid email enumeration.
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const { rawToken, tokenHash, expiresAt } = generateResetToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { resetTokenHash: tokenHash, resetTokenExpiresAt: expiresAt },
  });

  const resetLink = `${request.nextUrl.origin}/reset-password?token=${rawToken}`;

  // No email provider is wired up yet (mirrors the mock market-data/signal
  // seams elsewhere in this app) — log the link server-side so it's usable
  // in local dev, and swap this for a real email send later.
  console.log(`[password-reset] ${email} -> ${resetLink}`);

  return NextResponse.json({
    message: GENERIC_MESSAGE,
    ...(process.env.NODE_ENV !== "production" ? { devResetLink: resetLink } : {}),
  });
}
