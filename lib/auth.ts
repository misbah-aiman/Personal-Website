// Edge-compatible auth using Web Crypto API.
// Works in both Next.js middleware (Edge runtime) and route handlers (Node).

export const COOKIE_NAME = "msb_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    "dev-only-fallback-secret-change-in-production-please-aaaaaaaaaaaaaa"
  );
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

function b64urlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes =
    buf instanceof Uint8Array ? buf : new Uint8Array(buf as ArrayBuffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return b64urlEncode(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++)
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = b64urlEncode(new TextEncoder().encode(String(exp)));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(payload);
  if (!timingSafeEqual(sig, expected)) return false;
  try {
    const expStr = new TextDecoder().decode(b64urlDecode(payload));
    const exp = Number(expStr);
    if (!Number.isFinite(exp)) return false;
    return Math.floor(Date.now() / 1000) < exp;
  } catch {
    return false;
  }
}

export function checkPassword(input: string | undefined | null): boolean {
  if (typeof input !== "string") return false;
  const expected = getAdminPassword();
  // Pad both to same length to keep timing safe for varying inputs.
  const a = input.padEnd(128, "\0").slice(0, 128);
  const b = expected.padEnd(128, "\0").slice(0, 128);
  return timingSafeEqual(a, b) && input.length === expected.length;
}
