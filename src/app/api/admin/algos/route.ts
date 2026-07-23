import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/rbac";
import { getAdminAlgos } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();
    const algos = await getAdminAlgos();
    return NextResponse.json({ algos });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
