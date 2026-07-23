import { NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getStrategiesForUser } from "@/lib/strategies";

export async function GET() {
  try {
    const session = await requireUser();
    const strategies = await getStrategiesForUser(session.sub);
    return NextResponse.json({ strategies });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
