import type { SiteEvent } from "@/lib/site-config-schema";

function parseDateValue(value: string): Date | null {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
}

export function isEventVisible(event: SiteEvent) {
  if (event.status === "published") return true;
  if (event.status !== "scheduled" || !event.scheduledAt) return false;
  const ts = Date.parse(event.scheduledAt);
  return !Number.isNaN(ts) && ts <= Date.now();
}

export function toEventDate(event: SiteEvent): Date | null {
  return parseDateValue(event.date);
}

export function toIsoDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function sortEventsAsc(events: SiteEvent[]) {
  return [...events].sort((a, b) => {
    const ad = toEventDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bd = toEventDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (ad === bd) return a.title.localeCompare(b.title);
    return ad - bd;
  });
}
