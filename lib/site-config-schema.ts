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
  schoolName: "The Silver Brook Public School",
  schoolNameShort: "The Silver Brook",
  tagline: "Learning is the Key to Leadership",
  logoPath: "/logo.png",
  contactPhone: "+919944055929",
  contactEmail: "thesilverbrookpublicschool@gmail.com",
  address:
    "Pillaiyar Kovil Street, Near Astalakshmi Temple, Karatoor, Gobichettipalayam, Erode District - 638476",
  visiblePages: [...ALL_MANAGED_PAGES],
  menuPages: ["about", "academics", "admissions", "campus", "activities", "blog", "news", "contact"],
  hiddenPages: [],
  events: [
    {
      id: "event-1",
      date: "2026-03-05",
      title: "Annual Sports Day",
      category: "Events",
      location: "Main Sports Ground",
      shortDescription: "Inter-house athletics and team games.",
      description: "Inter-house athletics and team games with parent participation and awards.",
      status: "published",
    },
    {
      id: "event-2",
      date: "2026-03-18",
      title: "Parent-Teacher Meetings",
      category: "Announcements",
      location: "Academic Block",
      shortDescription: "Academic review and goal setting discussions.",
      description: "One-on-one discussions with teachers to review student progress and term goals.",
      status: "published",
    },
    {
      id: "event-3",
      date: "2026-04-02",
      title: "Science Expo",
      category: "Competitions",
      location: "Innovation Lab",
      shortDescription: "Student-led innovation and project showcase.",
      description: "Project showcase featuring robotics, environmental models, and STEM experiments.",
      status: "published",
    },
    {
      id: "event-4",
      date: "2026-04-20",
      title: "Summer Break Begins",
      category: "Notices",
      location: "School Campus",
      shortDescription: "End of term closing and holiday briefing.",
      description: "Final day briefing with holiday schedules and optional enrichment recommendations.",
      status: "published",
    },
  ],
  newsPosts: [
    {
      id: "news-1",
      slug: "admissions-open-2026-27",
      date: "March 2026",
      title: "Admissions Open for 2026-27",
      category: "Admissions",
      image: "/images/ai-campus-2.svg",
      summary: "Admissions are now open for Grades I to VII.",
      content:
        "Admissions are now open for Grades I to VII for academic year 2026-27. Families can contact the office to schedule a campus visit.",
      status: "published",
    },
  ],
  blogPosts: [
    {
      id: "blog-1",
      slug: "confidence-in-early-learners",
      date: "March 2026",
      title: "How We Build Confidence in Early Learners",
      category: "Learning",
      image: "/images/ai-campus-3.svg",
      summary: "A look at our classroom approach to confidence and leadership.",
      content:
        "At The Silver Brook Public School, we combine structured learning, activity-based teaching, and communication practice to help children become confident, curious learners.",
      status: "published",
    },
  ],
  siteFiles: [],
  theme: {
    paper: "#fbfaf6",
    brand400: "#6f93f5",
    brand600: "#2f5bd7",
    brand700: "#2345a6",
    surface: "#ffffff",
    surfaceSoft: "#eef3ff",
    highlight: "#dbe6ff",
    glareBlue: "#4976ec",
    glareGold: "#d4a648",
    glareBlur: 24,
    glareSpeed: 24,
    glareSize: 420,
    heroHighlight: "#dbe6ff",
    footerButton: "#2f5bd7",
  },
};
