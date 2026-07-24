import { NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { verifySessionToken } from "@/lib/auth/jwt";
import {
  getAdminReturnToken,
  clearAdminReturnCookie,
  setRawSessionCookie,
} from "@/lib/auth/session";

export async function POST() {
  try {
    await requireUser();

    const returnToken = await getAdminReturnToken();
    if (!returnToken) {
      return NextResponse.json({ error: "No admin session to return to" }, { status: 400 });
    }

    const adminPayload = await verifySessionToken(returnToken);
    if (!adminPayload || adminPayload.role !== "ADMIN") {
      return NextResponse.json({ error: "Invalid admin session" }, { status: 400 });
    }

    await setRawSessionCookie(returnToken);
    await clearAdminReturnCookie();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
