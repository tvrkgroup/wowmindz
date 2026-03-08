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
    const contentType = request.headers.get("content-type") || "";
    let username = "";
    let password = "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { username?: string; password?: string };
      username = body.username?.trim() ?? "";
      password = body.password?.trim() ?? "";
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      username = form.get("username")?.toString().trim() ?? "";
      password = form.get("password")?.toString().trim() ?? "";
    } else {
      // Fallback for proxies/clients that send plain text body.
      const raw = await request.text();
      try {
        const parsed = JSON.parse(raw) as { username?: string; password?: string };
        username = parsed.username?.trim() ?? "";
        password = parsed.password?.trim() ?? "";
      } catch {
        const params = new URLSearchParams(raw);
        username = params.get("username")?.trim() ?? "";
        password = params.get("password")?.trim() ?? "";
      }
    }

    if (!username || !password) {
      return NextResponse.json({ ok: false, message: "Username and password are required" }, { status: 400 });
    }

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown login error";
    console.error("[admin/login] failed:", message);
    return NextResponse.json({ ok: false, message: "Server error during login" }, { status: 500 });
  }
}
