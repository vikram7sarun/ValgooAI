import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { updateProfileSchema } from "@/lib/validation/profile";

export async function GET() {
  try {
    const session = await requireUser();
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        country: true,
        experience: true,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireUser();

    const body = await request.json().catch(() => null);
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, phone, country, experience } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: {
        AND: [{ id: { not: session.sub } }, { OR: [{ email }, { phone }] }],
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Another account already uses this email or phone" },
        { status: 409 },
      );
    }

    const user = await prisma.user.update({
      where: { id: session.sub },
      data: { name, email, phone, country, experience },
      select: { id: true, name: true, email: true, phone: true, country: true, experience: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
