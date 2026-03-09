import { promises as fs } from "fs";
import path from "path";
import {
  ALL_MANAGED_PAGES,
  defaultSiteConfig,
  type ManagedPageKey,
  type SiteConfig,
  type SiteEvent,
  type SiteFile,
  type SitePost,
} from "@/lib/site-config-schema";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "site-config.json");
const KV_KEY = "site-config";
const IS_VERCEL = process.env.VERCEL === "1";
const FIREBASE_KEY = "siteConfig";

function sanitizeEvent(input: Partial<SiteEvent>, index: number): SiteEvent {
  const date = (input.date ?? "").toString().trim().slice(0, 40);
  const title = (input.title ?? "").toString().trim().slice(0, 160);
  const statusCandidate = (input.status ?? "published").toString();
  const status =
    statusCandidate === "draft" || statusCandidate === "scheduled" || statusCandidate === "published"
      ? statusCandidate
      : "published";
  return {
    id: input.id?.toString().trim() || `event-${index + 1}`,
    date,
    title,
    category: (input.category ?? "Events").toString().trim().slice(0, 50),
    location: (input.location ?? "School Campus").toString().trim().slice(0, 120),
    shortDescription: (input.shortDescription ?? input.description ?? "").toString().trim().slice(0, 220),
    description: (input.description ?? "").toString().trim().slice(0, 1400),
    image: (input.image ?? "").toString().trim().slice(0, 220),
    status,
    scheduledAt: (input.scheduledAt ?? "").toString().trim().slice(0, 40),
  };
}

function sanitizePost(input: Partial<SitePost>, index: number, type: "news" | "blog"): SitePost {
  const title = (input.title ?? "").toString().trim().slice(0, 160);
  const slugSeed = input.slug ?? title ?? `${type}-${index + 1}`;
  const slugBase = slugSeed
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const statusCandidate = (input.status ?? "published").toString();
  const status =
    statusCandidate === "draft" || statusCandidate === "scheduled" || statusCandidate === "published"
      ? statusCandidate
      : "published";

  return {
    id: input.id?.toString().trim() || `${type}-${index + 1}`,
    slug: slugBase || `${type}-${index + 1}`,
    date: (input.date ?? "").toString().trim().slice(0, 40),
    title,
    category: (input.category ?? (type === "news" ? "News" : "Blog")).toString().trim().slice(0, 40),
    image: (input.image ?? "/images/ai-campus-1.svg").toString().trim().slice(0, 200),
    summary: (input.summary ?? "").toString().trim().slice(0, 260),
    content: (input.content ?? "").toString().trim().slice(0, 5000),
    status,
    scheduledAt: (input.scheduledAt ?? "").toString().trim().slice(0, 40),
  };
}

function sanitizeSiteFile(input: Partial<SiteFile>, index: number): SiteFile {
  const url = (input.url ?? "").toString().trim().slice(0, 600);
  return {
    id: input.id?.toString().trim() || `file-${Date.now()}-${index}`,
    name: (input.name ?? "").toString().trim().slice(0, 180),
    url,
    storagePath: (input.storagePath ?? "").toString().trim().slice(0, 300),
    publicId: (input.publicId ?? "").toString().trim().slice(0, 300),
    assetId: (input.assetId ?? "").toString().trim().slice(0, 160),
    mimeType: (input.mimeType ?? "").toString().trim().slice(0, 120),
    size: Number(input.size ?? 0) || 0,
    category: (input.category ?? "general").toString().trim().slice(0, 40),
    width: Number(input.width ?? 0) || 0,
    height: Number(input.height ?? 0) || 0,
    createdAt: (input.createdAt ?? new Date().toISOString()).toString().trim().slice(0, 60),
    uploadedBy: (input.uploadedBy ?? "").toString().trim().slice(0, 80),
  };
}

function sanitizeHexColor(value: string, fallback: string): string {
  const normalized = value.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized) ? normalized : fallback;
}

function sanitizeNumber(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function sanitizeConfig(input: Partial<SiteConfig>): SiteConfig {
  const rawHiddenPages = Array.isArray(input.hiddenPages) ? input.hiddenPages : [];
  const hiddenPages = rawHiddenPages.filter((page): page is ManagedPageKey =>
    ALL_MANAGED_PAGES.includes(page as ManagedPageKey)
  );
  const hasVisibleInput = Array.isArray(input.visiblePages);
  const rawVisiblePages = hasVisibleInput
    ? input.visiblePages
    : ALL_MANAGED_PAGES.filter((page) => !hiddenPages.includes(page));
  const visiblePageCandidates = rawVisiblePages ?? [];
  const visiblePages = visiblePageCandidates.filter((page): page is ManagedPageKey =>
    ALL_MANAGED_PAGES.includes(page as ManagedPageKey)
  );
  const hasMenuInput = Array.isArray(input.menuPages);
  const rawMenuPages = hasMenuInput ? input.menuPages : defaultSiteConfig.menuPages;
  const menuPageCandidates = rawMenuPages ?? [];
  const menuPages = menuPageCandidates.filter((page): page is ManagedPageKey =>
    ALL_MANAGED_PAGES.includes(page as ManagedPageKey)
  );

  const hasEventsInput = Array.isArray(input.events);
  const eventsInput = (hasEventsInput ? input.events : defaultSiteConfig.events) ?? [];
  const events = eventsInput
    .map((item, index) => sanitizeEvent(item, index))
    .filter((item) => item.status === "draft" || Boolean(item.date && item.title));

  const hasNewsInput = Array.isArray(input.newsPosts);
  const newsPostsInput = (hasNewsInput ? input.newsPosts : defaultSiteConfig.newsPosts) ?? [];
  const newsPosts = newsPostsInput
    .map((item, index) => sanitizePost(item, index, "news"))
    .filter((item) => item.status === "draft" || Boolean(item.date && item.title && item.summary));

  const hasBlogInput = Array.isArray(input.blogPosts);
  const blogPostsInput = (hasBlogInput ? input.blogPosts : defaultSiteConfig.blogPosts) ?? [];
  const blogPosts = blogPostsInput
    .map((item, index) => sanitizePost(item, index, "blog"))
    .filter((item) => item.status === "draft" || Boolean(item.date && item.title && item.summary));

  const siteFilesInput = Array.isArray(input.siteFiles) ? input.siteFiles : defaultSiteConfig.siteFiles;
  const siteFiles = siteFilesInput
    .map((item, index) => sanitizeSiteFile(item, index))
    .filter((item) => item.url.length > 0);

  return {
    schoolName: (input.schoolName ?? defaultSiteConfig.schoolName).toString().trim(),
    schoolNameShort: (input.schoolNameShort ?? defaultSiteConfig.schoolNameShort)
      .toString()
      .trim(),
    tagline: (input.tagline ?? defaultSiteConfig.tagline).toString().trim(),
    logoPath: (input.logoPath ?? defaultSiteConfig.logoPath).toString().trim(),
    contactPhone: (input.contactPhone ?? defaultSiteConfig.contactPhone).toString().trim(),
    contactEmail: (input.contactEmail ?? defaultSiteConfig.contactEmail).toString().trim(),
    address: (input.address ?? defaultSiteConfig.address).toString().trim(),
    visiblePages: hasVisibleInput ? visiblePages : visiblePages.length > 0 ? visiblePages : [...ALL_MANAGED_PAGES],
    menuPages: hasMenuInput ? menuPages : menuPages.length > 0 ? menuPages : defaultSiteConfig.menuPages,
    hiddenPages,
    events: hasEventsInput ? events : events.length > 0 ? events : defaultSiteConfig.events,
    newsPosts: hasNewsInput ? newsPosts : newsPosts.length > 0 ? newsPosts : defaultSiteConfig.newsPosts,
    blogPosts: hasBlogInput ? blogPosts : blogPosts.length > 0 ? blogPosts : defaultSiteConfig.blogPosts,
    siteFiles,
    theme: {
      paper: sanitizeHexColor(input.theme?.paper ?? defaultSiteConfig.theme.paper, defaultSiteConfig.theme.paper),
      brand400: sanitizeHexColor(
        input.theme?.brand400 ?? defaultSiteConfig.theme.brand400,
        defaultSiteConfig.theme.brand400
      ),
      brand600: sanitizeHexColor(
        input.theme?.brand600 ?? defaultSiteConfig.theme.brand600,
        defaultSiteConfig.theme.brand600
      ),
      brand700: sanitizeHexColor(
        input.theme?.brand700 ?? defaultSiteConfig.theme.brand700,
        defaultSiteConfig.theme.brand700
      ),
      surface: sanitizeHexColor(
        input.theme?.surface ?? defaultSiteConfig.theme.surface,
        defaultSiteConfig.theme.surface
      ),
      surfaceSoft: sanitizeHexColor(
        input.theme?.surfaceSoft ?? defaultSiteConfig.theme.surfaceSoft,
        defaultSiteConfig.theme.surfaceSoft
      ),
      highlight: sanitizeHexColor(
        input.theme?.highlight ?? defaultSiteConfig.theme.highlight,
        defaultSiteConfig.theme.highlight
      ),
      glareBlue: sanitizeHexColor(
        input.theme?.glareBlue ?? defaultSiteConfig.theme.glareBlue,
        defaultSiteConfig.theme.glareBlue
      ),
      glareGold: sanitizeHexColor(
        input.theme?.glareGold ?? defaultSiteConfig.theme.glareGold,
        defaultSiteConfig.theme.glareGold
      ),
      glareBlur: sanitizeNumber(input.theme?.glareBlur, defaultSiteConfig.theme.glareBlur, 0, 80),
      glareSpeed: sanitizeNumber(input.theme?.glareSpeed, defaultSiteConfig.theme.glareSpeed, 4, 60),
      glareSize: sanitizeNumber(input.theme?.glareSize, defaultSiteConfig.theme.glareSize, 140, 760),
      heroHighlight: sanitizeHexColor(
        input.theme?.heroHighlight ?? defaultSiteConfig.theme.heroHighlight,
        defaultSiteConfig.theme.heroHighlight
      ),
      footerButton: sanitizeHexColor(
        input.theme?.footerButton ?? defaultSiteConfig.theme.footerButton,
        defaultSiteConfig.theme.footerButton
      ),
    },
  };
}

async function ensureConfigFile() {
  if (IS_VERCEL) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CONFIG_PATH);
  } catch {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultSiteConfig, null, 2), "utf8");
  }
}

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function hasFirebaseConfig() {
  return Boolean(process.env.FIREBASE_DB_URL && process.env.FIREBASE_DB_SECRET);
}

async function kvFetch(pathname: string) {
  const baseUrl = process.env.KV_REST_API_URL as string;
  const token = process.env.KV_REST_API_TOKEN as string;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`);
  }
  return response.json();
}

async function readConfigFromKv(): Promise<SiteConfig | null> {
  if (!hasKvConfig()) return null;
  try {
    const result = (await kvFetch(`/get/${encodeURIComponent(KV_KEY)}`)) as { result?: string };
    if (!result?.result) return null;
    return sanitizeConfig(JSON.parse(result.result) as Partial<SiteConfig>);
  } catch {
    return null;
  }
}

async function writeConfigToKv(config: SiteConfig) {
  if (!hasKvConfig()) return;
  const payload = encodeURIComponent(JSON.stringify(config));
  await kvFetch(`/set/${encodeURIComponent(KV_KEY)}/${payload}`);
}

async function readConfigFromFirebase(): Promise<SiteConfig | null> {
  if (!hasFirebaseConfig()) return null;
  const base = process.env.FIREBASE_DB_URL as string;
  const secret = process.env.FIREBASE_DB_SECRET as string;

  const response = await fetch(`${base.replace(/\/$/, "")}/${FIREBASE_KEY}.json?auth=${secret}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(
      `Firebase read failed: ${response.status}. Verify FIREBASE_DB_URL, FIREBASE_DB_SECRET, and database access rules.`
    );
  }
  const payload = (await response.json()) as Partial<SiteConfig> | null;
  if (!payload) return null;
  return sanitizeConfig(payload);
}

async function writeConfigToFirebase(config: SiteConfig) {
  const base = process.env.FIREBASE_DB_URL as string;
  const secret = process.env.FIREBASE_DB_SECRET as string;
  const response = await fetch(`${base.replace(/\/$/, "")}/${FIREBASE_KEY}.json?auth=${secret}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    const hint =
      response.status === 401 || response.status === 403
        ? "Auth denied. Check FIREBASE_DB_SECRET and ensure write access is allowed."
        : response.status === 404
          ? "Path not found. Check FIREBASE_DB_URL points to your Realtime Database root."
          : "Check Firebase URL, secret, and rules.";
    throw new Error(`Firebase write failed: ${response.status}. ${hint}`);
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const firebaseConfig = await readConfigFromFirebase().catch(() => null);
  if (firebaseConfig) return firebaseConfig;

  const kvConfig = await readConfigFromKv();
  if (kvConfig) return kvConfig;
  if (IS_VERCEL) return defaultSiteConfig;

  await ensureConfigFile();
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    return sanitizeConfig(parsed);
  } catch {
    return defaultSiteConfig;
  }
}

export async function saveSiteConfig(nextConfig: Partial<SiteConfig>): Promise<SiteConfig> {
  const merged = sanitizeConfig(nextConfig);
  if (hasFirebaseConfig()) {
    await writeConfigToFirebase(merged);
  } else if (hasKvConfig()) {
    await writeConfigToKv(merged);
  } else if (IS_VERCEL) {
    throw new Error(
      "No dynamic storage configured. Set Firebase (FIREBASE_DB_URL, FIREBASE_DB_SECRET) or KV."
    );
  } else {
    await ensureConfigFile();
    await fs.writeFile(CONFIG_PATH, JSON.stringify(merged, null, 2), "utf8");
  }
  return merged;
}

export async function updateSiteConfig(partial: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getSiteConfig();
  const merged = {
    ...current,
    ...partial,
    theme: {
      ...current.theme,
      ...(partial.theme ?? {}),
    },
  };
  return saveSiteConfig(merged);
}

export async function isPageHidden(page: ManagedPageKey): Promise<boolean> {
  const config = await getSiteConfig();
  if (Array.isArray(config.visiblePages) && config.visiblePages.length > 0) {
    return !config.visiblePages.includes(page);
  }
  return config.hiddenPages.includes(page);
}

export async function resetSiteConfigToDefault() {
  return saveSiteConfig(defaultSiteConfig);
}
