import type { ManagedPageKey, SiteConfig } from "@/lib/site-config-schema";

export interface TemplatePageDef {
  key: ManagedPageKey;
  href: string;
  label: string;
  showInPrimaryNav: boolean;
  showInFooterQuickLinks: boolean;
}

export const TEMPLATE_PAGE_REGISTRY: Record<ManagedPageKey, TemplatePageDef> = {
  home: { key: "home", href: "/", label: "Home", showInPrimaryNav: false, showInFooterQuickLinks: false },
  about: { key: "about", href: "/about", label: "About", showInPrimaryNav: true, showInFooterQuickLinks: false },
  academics: {
    key: "academics",
    href: "/projects",
    label: "Projects",
    showInPrimaryNav: true,
    showInFooterQuickLinks: true,
  },
  admissions: {
    key: "admissions",
    href: "/admissions",
    label: "Admissions",
    showInPrimaryNav: true,
    showInFooterQuickLinks: true,
  },
  campus: { key: "campus", href: "/campus", label: "Campus", showInPrimaryNav: true, showInFooterQuickLinks: true },
  activities: {
    key: "activities",
    href: "/activities",
    label: "Activities",
    showInPrimaryNav: true,
    showInFooterQuickLinks: false,
  },
  news: { key: "news", href: "/news", label: "News", showInPrimaryNav: true, showInFooterQuickLinks: true },
  contact: {
    key: "contact",
    href: "/contact",
    label: "Contact",
    showInPrimaryNav: true,
    showInFooterQuickLinks: false,
  },
  calendar: {
    key: "calendar",
    href: "/calendar",
    label: "Calendar",
    showInPrimaryNav: false,
    showInFooterQuickLinks: false,
  },
  gallery: { key: "gallery", href: "/gallery", label: "Gallery", showInPrimaryNav: false, showInFooterQuickLinks: false },
  transport: {
    key: "transport",
    href: "/transport",
    label: "Transport",
    showInPrimaryNav: false,
    showInFooterQuickLinks: false,
  },
  curriculum: {
    key: "curriculum",
    href: "/curriculum",
    label: "Curriculum",
    showInPrimaryNav: false,
    showInFooterQuickLinks: false,
  },
  fees: { key: "fees", href: "/fees", label: "Fees", showInPrimaryNav: false, showInFooterQuickLinks: false },
  faculty: { key: "faculty", href: "/faculty", label: "Faculty", showInPrimaryNav: false, showInFooterQuickLinks: false },
  downloads: {
    key: "downloads",
    href: "/downloads",
    label: "Downloads",
    showInPrimaryNav: false,
    showInFooterQuickLinks: false,
  },
  policies: {
    key: "policies",
    href: "/policies",
    label: "Policies",
    showInPrimaryNav: false,
    showInFooterQuickLinks: false,
  },
  hostel: { key: "hostel", href: "/hostel", label: "Hostel", showInPrimaryNav: false, showInFooterQuickLinks: false },
  careers: {
    key: "careers",
    href: "/careers",
    label: "Careers",
    showInPrimaryNav: false,
    showInFooterQuickLinks: false,
  },
  achievements: {
    key: "achievements",
    href: "/achievements",
    label: "Achievements",
    showInPrimaryNav: false,
    showInFooterQuickLinks: false,
  },
  blog: { key: "blog", href: "/blog", label: "Blog", showInPrimaryNav: true, showInFooterQuickLinks: false },
};

export function isPageVisibleInTemplate(config: SiteConfig, page: ManagedPageKey) {
  const hiddenFallback = config.hiddenPages || [];
  const visiblePages = config.visiblePages || [];
  if (visiblePages.length > 0) return visiblePages.includes(page);
  return !hiddenFallback.includes(page);
}

export function isPageVisibleInMenu(config: SiteConfig, page: ManagedPageKey) {
  if (!isPageVisibleInTemplate(config, page)) return false;
  const menuPages = config.menuPages || [];
  if (menuPages.length > 0) return menuPages.includes(page);
  return TEMPLATE_PAGE_REGISTRY[page].showInPrimaryNav;
}

export function getPrimaryNavigation(config: SiteConfig) {
  return Object.values(TEMPLATE_PAGE_REGISTRY).filter((item) => isPageVisibleInMenu(config, item.key));
}

export function getFooterQuickLinks(config: SiteConfig) {
  return Object.values(TEMPLATE_PAGE_REGISTRY).filter(
    (item) => item.showInFooterQuickLinks && isPageVisibleInTemplate(config, item.key)
  );
}
