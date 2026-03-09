import { promises as fs } from "fs";
import path from "path";

export interface InquiryItem {
  id: string;
  type: "feedback" | "inquiry";
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_PATH = path.join(DATA_DIR, "inquiries.json");
const KV_KEY = "site-inquiries";
const FIREBASE_KEY = "inquiries";

function pickFirstEnv(keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

function pickEnvByPattern(patterns: RegExp[]): string {
  const keys = Object.keys(process.env);
  for (const key of keys) {
    if (!patterns.every((pattern) => pattern.test(key))) continue;
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

function getFirebaseCredentials() {
  const base =
    pickFirstEnv([
      "FIREBASE_DB_URL",
      "FIREBASE_DATABASE_URL",
      "SB_FIREBASE_DB_URL",
      "NEXT_PUBLIC_FIREBASE_DB_URL",
    ]) || pickEnvByPattern([/FIREBASE/i, /(DB|DATABASE)?_?URL/i]);
  const secret =
    pickFirstEnv([
      "FIREBASE_DB_SECRET",
      "FIREBASE_SECRET",
      "FIREBASE_DATABASE_SECRET",
      "SB_FIREBASE_DB_SECRET",
      "NEXT_PUBLIC_FIREBASE_DB_SECRET",
    ]) || pickEnvByPattern([/FIREBASE/i, /(SECRET|TOKEN)/i]);
  return { base, secret };
}

function normalizeInquiry(input: Partial<InquiryItem>, index: number): InquiryItem {
  return {
    id: input.id?.toString().trim() || `inquiry-${Date.now()}-${index}`,
    type: input.type === "feedback" ? "feedback" : "inquiry",
    name: (input.name ?? "").toString().trim().slice(0, 80),
    phone: (input.phone ?? "").toString().trim().slice(0, 30),
    email: (input.email ?? "").toString().trim().slice(0, 120),
    message: (input.message ?? "").toString().trim().slice(0, 1200),
    createdAt: (input.createdAt ?? new Date().toISOString()).toString().trim().slice(0, 60),
  };
}

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function hasFirebaseConfig() {
  const { base, secret } = getFirebaseCredentials();
  return Boolean(base && secret);
}

async function kvFetch(pathname: string) {
  const baseUrl = process.env.KV_REST_API_URL as string;
  const token = process.env.KV_REST_API_TOKEN as string;
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`KV request failed: ${response.status}`);
  return response.json();
}

async function readInquiriesLocal(): Promise<InquiryItem[]> {
  try {
    const raw = await fs.readFile(INQUIRIES_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<InquiryItem>[];
    return Array.isArray(parsed) ? parsed.map(normalizeInquiry) : [];
  } catch {
    return [];
  }
}

async function writeInquiriesLocal(next: InquiryItem[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(INQUIRIES_PATH, JSON.stringify(next, null, 2), "utf8");
}

async function readInquiriesFromKv(): Promise<InquiryItem[]> {
  if (!hasKvConfig()) return [];
  try {
    const result = (await kvFetch(`/get/${encodeURIComponent(KV_KEY)}`)) as { result?: string };
    if (!result?.result) return [];
    const parsed = JSON.parse(result.result) as Partial<InquiryItem>[];
    return Array.isArray(parsed) ? parsed.map(normalizeInquiry) : [];
  } catch {
    return [];
  }
}

async function writeInquiriesToKv(next: InquiryItem[]) {
  if (!hasKvConfig()) return;
  const payload = encodeURIComponent(JSON.stringify(next));
  await kvFetch(`/set/${encodeURIComponent(KV_KEY)}/${payload}`);
}

async function readInquiriesFromFirebase(): Promise<InquiryItem[]> {
  if (!hasFirebaseConfig()) return [];
  const { base, secret } = getFirebaseCredentials();
  const response = await fetch(`${base.replace(/\/$/, "")}/${FIREBASE_KEY}.json?auth=${secret}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Firebase read failed: ${response.status}`);
  const payload = (await response.json()) as Partial<InquiryItem>[] | null;
  return Array.isArray(payload) ? payload.map(normalizeInquiry) : [];
}

async function writeInquiriesToFirebase(next: InquiryItem[]) {
  if (!hasFirebaseConfig()) return;
  const { base, secret } = getFirebaseCredentials();
  const response = await fetch(`${base.replace(/\/$/, "")}/${FIREBASE_KEY}.json?auth=${secret}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(next),
  });
  if (!response.ok) throw new Error(`Firebase write failed: ${response.status}`);
}

export function getInquiryStorageMode(): "firebase" | "kv" | "file" | "unconfigured" {
  if (hasFirebaseConfig()) return "firebase";
  if (hasKvConfig()) return "kv";
  if (process.env.VERCEL === "1") return "unconfigured";
  return "file";
}

export async function listInquiries(): Promise<InquiryItem[]> {
  const mode = getInquiryStorageMode();
  if (mode === "firebase") return readInquiriesFromFirebase();
  if (mode === "kv") return readInquiriesFromKv();
  if (mode === "file") return readInquiriesLocal();
  return [];
}

export async function addInquiry(item: InquiryItem) {
  const mode = getInquiryStorageMode();
  if (mode === "unconfigured") {
    throw new Error(
      "Inquiry storage is not configured. Add Firebase (FIREBASE_DB_URL, FIREBASE_DB_SECRET) or KV (KV_REST_API_URL, KV_REST_API_TOKEN)."
    );
  }

  const existing = await listInquiries();
  existing.unshift(item);

  if (mode === "firebase") {
    await writeInquiriesToFirebase(existing);
    return;
  }

  if (mode === "kv") {
    await writeInquiriesToKv(existing);
    return;
  }

  await writeInquiriesLocal(existing);
}
