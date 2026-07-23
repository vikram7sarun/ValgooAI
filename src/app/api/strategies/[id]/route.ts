import { NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getStrategyDetail } from "@/lib/strategies";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id } = await params;

    const strategy = await getStrategyDetail(id, session.sub);
    if (!strategy) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    return NextResponse.json({ strategy });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
