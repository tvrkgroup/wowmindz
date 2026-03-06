import { promises as fs } from "fs";
import path from "path";
import {
  ALL_MANAGED_PAGES,
  defaultSiteConfig,
  type ManagedPageKey,
  type SiteConfig,
  type SiteEvent,
} from "@/lib/site-config-schema";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "site-config.json");
const KV_KEY = "site-config";

function sanitizeEvent(input: Partial<SiteEvent>, index: number): SiteEvent {
  const date = (input.date ?? "").toString().trim().slice(0, 40);
  const title = (input.title ?? "").toString().trim().slice(0, 160);
  return {
    id: input.id?.toString().trim() || `event-${index + 1}`,
    date,
    title,
  };
}

function sanitizeHexColor(value: string, fallback: string): string {
  const normalized = value.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized) ? normalized : fallback;
}

function sanitizeConfig(input: Partial<SiteConfig>): SiteConfig {
  const rawHiddenPages = Array.isArray(input.hiddenPages) ? input.hiddenPages : [];
  const hiddenPages = rawHiddenPages.filter((page): page is ManagedPageKey =>
    ALL_MANAGED_PAGES.includes(page as ManagedPageKey)
  );

  const eventsInput = Array.isArray(input.events) ? input.events : defaultSiteConfig.events;
  const events = eventsInput
    .map((item, index) => sanitizeEvent(item, index))
    .filter((item) => item.date && item.title);

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
    hiddenPages,
    events: events.length > 0 ? events : defaultSiteConfig.events,
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
    },
  };
}

async function ensureConfigFile() {
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

async function kvFetch(pathname: string) {
  const baseUrl = process.env.KV_REST_API_URL as string;
  const token = process.env.KV_REST_API_TOKEN as string;
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
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

export async function getSiteConfig(): Promise<SiteConfig> {
  const kvConfig = await readConfigFromKv();
  if (kvConfig) return kvConfig;

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
  if (hasKvConfig()) {
    await writeConfigToKv(merged);
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
  return config.hiddenPages.includes(page);
}

export async function resetSiteConfigToDefault() {
  return saveSiteConfig(defaultSiteConfig);
}
