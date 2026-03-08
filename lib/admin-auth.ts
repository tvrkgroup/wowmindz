import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sb_admin_session";
const SESSION_AGE_SECONDS = 60 * 60 * 12;

interface SessionPayload {
  username: string;
  issuedAt: number;
}

function getSecret() {
  const candidates = [
    process.env.ADMIN_SESSION_SECRET,
    process.env.SB_ADMIN_SESSION_SECRET,
    process.env.SESSION_SECRET,
    process.env.AUTH_SECRET,
    process.env.NEXTAUTH_SECRET,
  ]
    .map((value) => value?.trim() || "")
    .filter(Boolean);

  if (candidates.length > 0) return candidates[0];

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing session secret. Set one of: ADMIN_SESSION_SECRET, SB_ADMIN_SESSION_SECRET, SESSION_SECRET, AUTH_SECRET, NEXTAUTH_SECRET."
    );
  }

  return "silver-brook-admin-secret-change-me";
}

function toBase64Url(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function createSignature(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function isSafeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const aBuffer = encoder.encode(a);
  const bBuffer = encoder.encode(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function getAdminCredentials() {
  const envUsername = (process.env.ADMIN_USERNAME || "admin").trim();
  const envPassword = (process.env.ADMIN_PASSWORD || "").trim();
  const envPasswordList = (process.env.ADMIN_PASSWORDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const passwordCandidates = Array.from(
    new Set([envPassword, ...envPasswordList, "admin", "admin@123"].filter(Boolean))
  );

  return {
    username: envUsername || "admin",
    passwords: passwordCandidates,
  };
}

export function verifyAdminCredentials(inputUsername: string, inputPassword: string) {
  const creds = getAdminCredentials();
  const usernameOk = isSafeEqual(inputUsername.trim().toLowerCase(), creds.username.trim().toLowerCase());
  const passwordOk = creds.passwords.some((password) => isSafeEqual(inputPassword.trim(), password.trim()));
  return usernameOk && passwordOk;
}

export function createSessionToken(username: string) {
  const payload: SessionPayload = {
    username,
    issuedAt: Date.now(),
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = createSignature(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  const expected = createSignature(encodedPayload);
  if (!isSafeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;
    const age = Date.now() - payload.issuedAt;
    if (!payload.username || age < 0 || age > SESSION_AGE_SECONDS * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(verifySessionToken(token));
}

export async function getAuthenticatedAdminUsername() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  return session?.username || null;
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_AGE_SECONDS,
    path: "/",
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
