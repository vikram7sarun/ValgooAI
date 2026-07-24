import { cookies } from "next/headers";
import { signSessionToken, verifySessionToken, type SessionPayload } from "./jwt";

export const SESSION_COOKIE = "session";
export const ADMIN_RETURN_COOKIE = "admin_return_token";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ADMIN_RETURN_COOKIE);
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getRawSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function setAdminReturnCookie(rawToken: string) {
  const store = await cookies();
  store.set(ADMIN_RETURN_COOKIE, rawToken, COOKIE_OPTIONS);
}

export async function getAdminReturnToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_RETURN_COOKIE)?.value ?? null;
}

export async function clearAdminReturnCookie() {
  const store = await cookies();
  store.delete(ADMIN_RETURN_COOKIE);
}

export async function setRawSessionCookie(rawToken: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, rawToken, COOKIE_OPTIONS);
}
