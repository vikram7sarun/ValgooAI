import { NextResponse } from "next/server";
import { getSessionUser } from "./session";
import type { SessionPayload } from "./jwt";

export class AuthError extends Error {
  constructor(public status: 401 | 403, message: string) {
    super(message);
  }
}

export async function requireUser(): Promise<SessionPayload> {
  const user = await getSessionUser();
  if (!user) throw new AuthError(401, "Authentication required");
  return user;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new AuthError(403, "Admin access required");
  return user;
}

export function authErrorResponse(error: unknown): NextResponse | null {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}
