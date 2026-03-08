import type { ManagedPageKey } from "@/lib/site-config-schema";

export interface PageHeroContent {
  title: string;
  eyebrow: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const templatePageHeroes: Partial<Record<ManagedPageKey, PageHeroContent>> = {
  about: {
    title: "About",
    eyebrow: "Who We Are",
    description:
      "WowMindz is a modern technology studio focused on building digital systems, product ideas, and scalable solutions for the future.",
    ctaLabel: "View Projects",
    ctaHref: "/projects",
  },
  academics: {
    title: "Projects",
    eyebrow: "What We Build",
    description:
      "We design and ship product-focused digital solutions, scalable systems, and innovation-led initiatives.",
    ctaLabel: "Explore Our Work",
    ctaHref: "/contact",
  },
  admissions: {
    title: "Admissions",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  campus: {
    title: "Campus & Facilities",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  activities: {
    title: "Activities",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  contact: {
    title: "Contact",
    eyebrow: "Let's Build",
    description: "Reach out to discuss products, systems, and future-ready ideas.",
  },
  calendar: {
    title: "Calendar",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  blog: {
    title: "Blog",
    eyebrow: "Insights",
    description:
      "Practical writing on systems thinking, execution, technology, business, fitness discipline, and selected civil learnings.",
  },
  news: {
    title: "News",
    eyebrow: "Updates",
    description: "Latest announcements and updates.",
  },
  curriculum: {
    title: "Curriculum",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  transport: {
    title: "Transport",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  fees: {
    title: "Fees",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  faculty: {
    title: "Team",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  downloads: {
    title: "Downloads",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  policies: {
    title: "Policies",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  gallery: {
    title: "Gallery",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  achievements: {
    title: "Achievements",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  hostel: {
    title: "Hostel",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
  careers: {
    title: "Careers",
    eyebrow: "Overview",
    description: "This section is currently disabled for this template instance.",
  },
};

export const templateFooterHours = {
  hours: ["Monday - Saturday", "9:30 AM - 6:30 PM"],
  mapLink: "",
  copyright: "WowMindz Technologies © 2026",
};

export const contactPageContent = {
  officeTitle: "Office",
  officeSubtitle: "Connect with us directly for collaborations and project discussions.",
  visitHoursTitle: "Working Hours",
  visitHoursSubtitle: "General support and discovery-call availability.",
  visitHours: ["Monday - Saturday: 9:30 AM - 6:30 PM"],
  formTitle: "Inquiry Form",
  formSubtitle: "Share your requirement and we will get back to you.",
  mapEmbedUrl: "",
  mapLink: "",
};
