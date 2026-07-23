import { NextResponse } from "next/server";
import { getMarketSnapshot } from "@/lib/market/mockMarketData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ quotes: getMarketSnapshot() });
}
