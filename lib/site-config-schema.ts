export type ManagedPageKey =
  | "home"
  | "about"
  | "academics"
  | "admissions"
  | "campus"
  | "activities"
  | "news"
  | "contact"
  | "calendar"
  | "gallery"
  | "transport"
  | "curriculum"
  | "fees"
  | "faculty"
  | "downloads"
  | "policies"
  | "hostel"
  | "careers"
  | "achievements"
  | "blog";

export interface SiteEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  location: string;
  shortDescription: string;
  description: string;
  image?: string;
  status: "published" | "draft" | "scheduled";
  scheduledAt?: string;
}

export interface SitePost {
  id: string;
  slug: string;
  date: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  content: string;
  status: "published" | "draft" | "scheduled";
  scheduledAt?: string;
}

export interface SiteFile {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  publicId?: string;
  assetId?: string;
  mimeType: string;
  size: number;
  category: string;
  width?: number;
  height?: number;
  createdAt: string;
  uploadedBy?: string;
}

export interface SiteProject {
  id: string;
  title: string;
  company: string;
  description: string;
  website: string;
  coverImage: string;
  galleryImages: string[];
  status: "published" | "draft";
}

export interface SiteConfig {
  schoolName: string;
  schoolNameShort: string;
  tagline: string;
  logoPath: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  visiblePages: ManagedPageKey[];
  menuPages: ManagedPageKey[];
  hiddenPages: ManagedPageKey[];
  events: SiteEvent[];
  newsPosts: SitePost[];
  blogPosts: SitePost[];
  projects: SiteProject[];
  siteFiles: SiteFile[];
  theme: {
    paper: string;
    brand400: string;
    brand600: string;
    brand700: string;
    surface: string;
    surfaceSoft: string;
    highlight: string;
    glareBlue: string;
    glareGold: string;
    glareBlur: number;
    glareSpeed: number;
    glareSize: number;
    heroHighlight: string;
    footerButton: string;
  };
}

export const ALL_MANAGED_PAGES: ManagedPageKey[] = [
  "home",
  "about",
  "academics",
  "admissions",
  "campus",
  "activities",
  "news",
  "contact",
  "calendar",
  "gallery",
  "transport",
  "curriculum",
  "fees",
  "faculty",
  "downloads",
  "policies",
  "hostel",
  "careers",
  "achievements",
  "blog",
];

export const defaultSiteConfig: SiteConfig = {
  schoolName: "WowMindz Technologies",
  schoolNameShort: "WowMindz",
  tagline: "Involve. Solve. Evolve.",
  logoPath: "/assets/branding/logo.png",
  contactPhone: "+91 999 102 3333",
  contactEmail: "wowmindz@gmail.com",
  address: "",
  visiblePages: ["home", "about", "academics", "blog", "contact"],
  menuPages: ["home", "academics", "blog", "about", "contact"],
  hiddenPages: [
    "admissions",
    "activities",
    "campus",
    "news",
    "calendar",
    "gallery",
    "transport",
    "curriculum",
    "fees",
    "faculty",
    "downloads",
    "policies",
    "hostel",
    "careers",
    "achievements",
  ],
  events: [],
  newsPosts: [],
  blogPosts: [
    {
      id: "blog-1",
      slug: "systems-thinking-in-modern-product-building",
      date: "March 2026",
      title: "Systems Thinking in Modern Product Building",
      category: "Tech",
      image: "/images/ai-campus-3.svg",
      summary: "Why product execution improves when teams design systems instead of isolated features.",
      content:
        "Product quality compounds when teams think in systems. At WowMindz, we map dependencies, feedback loops, and execution constraints early so each release improves the next one. This creates cleaner decisions, better delivery speed, and stronger long-term outcomes.",
      status: "published",
    },
  ],
  projects: [
    {
      id: "project-1",
      title: "ktvr.in",
      company: "KTVR",
      description: "Core platform and execution stream for digital products and scalable operations.",
      website: "https://ktvr.in",
      coverImage: "/images/ai-campus-1.svg",
      galleryImages: ["/images/ai-campus-1.svg", "/images/ai-campus-2.svg"],
      status: "published",
    },
    {
      id: "project-2",
      title: "prathipa.com",
      company: "Prathipa",
      description: "Brand and product web presence focused on positioning, trust, and conversion-ready content.",
      website: "https://prathipa.com",
      coverImage: "/images/ai-campus-3.svg",
      galleryImages: ["/images/ai-campus-3.svg", "/images/ai-campus-4.svg"],
      status: "published",
    },
    {
      id: "project-3",
      title: "wowmyspace.com",
      company: "WowMySpace",
      description: "Digital ecosystem initiative for audience growth, engagement, and platform integration.",
      website: "https://wowmyspace.com",
      coverImage: "/images/ai-campus-5.svg",
      galleryImages: ["/images/ai-campus-5.svg", "/images/ai-campus-6.svg"],
      status: "published",
    },
  ],
  siteFiles: [],
  theme: {
    paper: "#0A0A0B",
    brand400: "#60A5FA",
    brand600: "#3B82F6",
    brand700: "#93C5FD",
    surface: "#111214",
    surfaceSoft: "#17191D",
    highlight: "#23272F",
    glareBlue: "#2563EB",
    glareGold: "#374151",
    glareBlur: 24,
    glareSpeed: 24,
    glareSize: 420,
    heroHighlight: "#13161B",
    footerButton: "#3B82F6",
  },
};
