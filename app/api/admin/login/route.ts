import { NextResponse } from "next/server";
import { createSessionToken, setAdminSessionCookie, verifyAdminCredentials } from "@/lib/admin-auth";

type Bucket = { attempts: number; blockedUntil: number };

const MAX_ATTEMPTS = 6;
const BLOCK_MS = 10 * 60 * 1000;

const globalBuckets = globalThis as unknown as {
  __sbLoginBuckets?: Map<string, Bucket>;
};

function getBucketStore() {
  if (!globalBuckets.__sbLoginBuckets) {
    globalBuckets.__sbLoginBuckets = new Map<string, Bucket>();
  }
  return globalBuckets.__sbLoginBuckets;
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim() ?? "";
    const password = body.password?.trim() ?? "";
    const key = getClientKey(request);
    const buckets = getBucketStore();
    const now = Date.now();
    const bucket = buckets.get(key) || { attempts: 0, blockedUntil: 0 };

    if (bucket.blockedUntil > now) {
      return NextResponse.json(
        { ok: false, message: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    if (!verifyAdminCredentials(username, password)) {
      const attempts = bucket.attempts + 1;
      const blockedUntil = attempts >= MAX_ATTEMPTS ? now + BLOCK_MS : 0;
      buckets.set(key, { attempts, blockedUntil });
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    buckets.set(key, { attempts: 0, blockedUntil: 0 });
    const token = createSessionToken(username);
    await setAdminSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }
}
