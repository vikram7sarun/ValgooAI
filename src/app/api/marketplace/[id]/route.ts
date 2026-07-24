import { NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getListingDetail } from "@/lib/marketplace";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id } = await params;

    const listing = await getListingDetail(id, session.sub, session.role === "ADMIN");
    if (!listing) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
