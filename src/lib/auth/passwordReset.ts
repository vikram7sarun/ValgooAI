import { randomBytes, createHash } from "crypto";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function generateResetToken(): { rawToken: string; tokenHash: string; expiresAt: Date } {
  const rawToken = randomBytes(32).toString("hex");
  return {
    rawToken,
    tokenHash: hashResetToken(rawToken),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  };
}
