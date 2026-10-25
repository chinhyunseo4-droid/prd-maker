import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "crypto";

export function createToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(token: string | undefined, hash: string) {
  if (!token) return false;
  const received = Buffer.from(hashToken(token), "hex");
  const expected = Buffer.from(hash, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}
