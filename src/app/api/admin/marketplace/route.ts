import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/rbac";
import { getAllListingsForAdmin } from "@/lib/marketplace";

export async function GET() {
  try {
    await requireAdmin();
    const listings = await getAllListingsForAdmin();
    return NextResponse.json({ listings });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
