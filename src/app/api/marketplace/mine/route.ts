import { NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getMyListings } from "@/lib/marketplace";

export async function GET() {
  try {
    const session = await requireUser();
    const listings = await getMyListings(session.sub);
    return NextResponse.json({ listings });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
