import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  sub: string;
  role: "USER" | "ADMIN";
  email: string;
  impersonatedBy?: string;
};

const ALG = "HS256";
const EXPIRY = "7d";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "USER" || payload.role === "ADMIN")
    ) {
      const impersonatedBy =
        typeof payload.impersonatedBy === "string" ? payload.impersonatedBy : undefined;
      return { sub: payload.sub, role: payload.role, email: payload.email, impersonatedBy };
    }
    return null;
  } catch {
    return null;
  }
}
