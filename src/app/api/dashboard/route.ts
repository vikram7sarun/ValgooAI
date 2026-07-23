import { NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getUserDashboardAlgos } from "@/lib/dashboard";

export async function GET() {
  try {
    const session = await requireUser();
    const algos = await getUserDashboardAlgos(session.sub);
    return NextResponse.json({ algos });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
