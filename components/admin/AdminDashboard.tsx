"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ALL_MANAGED_PAGES,
  defaultSiteConfig,
  type ManagedPageKey,
  type SiteConfig,
  type SiteEvent,
  type SiteFile,
  type SitePost,
} from "@/lib/site-config-schema";
import type { InquiryItem } from "@/lib/inquiries-store";
import CustomSelect from "@/components/CustomSelect";

const PAGE_LABELS: Record<ManagedPageKey, string> = {
  home: "Home",
  about: "About",
  academics: "Academics",
  admissions: "Admissions",
  campus: "Campus",
  activities: "Activities",
  blog: "Blog",
  news: "News",
  contact: "Contact",
  calendar: "Calendar",
  gallery: "Gallery",
  transport: "Transport",
  curriculum: "Curriculum",
  fees: "Fees",
  faculty: "Faculty",
  downloads: "Downloads",
  policies: "Policies",
  hostel: "Hostel",
  careers: "Careers",
  achievements: "Achievements",
};

interface AdminDashboardProps {
  initialConfig: SiteConfig;
}

const BLOG_CATEGORIES = [
  "Academics",
  "Student Life",
  "Activities",
  "Sports",
  "Technology",
  "Health & Wellness",
  "Parenting & Guidance",
  "Achievements",
  "Others / Miscellaneous",
];

const NEWS_CATEGORIES = [
  "Announcements",
  "Events",
  "Achievements",
  "Competitions",
  "Admissions",
  "Infrastructure",
  "Notices",
  "Others / Miscellaneous",
];

const EVENT_CATEGORIES = [
  "Announcements",
  "Events",
  "Achievements",
  "Competitions",
  "Admissions",
  "Notices",
  "Academics",
  "Sports",
  "Others / Miscellaneous",
];

function emptyEvent(): SiteEvent {
  const now = Date.now();
  return {
    id: `event-${now}`,
    date: "",
    title: "",
    category: EVENT_CATEGORIES[0],
    location: "School Campus",
    shortDescription: "",
    description: "",
    image: "",
    status: "draft",
    scheduledAt: "",
  };
}

function emptyPost(type: "news" | "blog"): SitePost {
  const now = Date.now();
  return {
    id: `${type}-${now}`,
    slug: `${type}-${now}`,
    date: "",
    title: "",
    category: type === "news" ? NEWS_CATEGORIES[0] : BLOG_CATEGORIES[0],
    image: "/logo.png",
    summary: "",
    content: "",
    status: "draft",
    scheduledAt: "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function AdminDashboard({ initialConfig }: AdminDashboardProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [logoUploadFile, setLogoUploadFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [siteFileUpload, setSiteFileUpload] = useState<File | null>(null);
  const [siteFileCategory, setSiteFileCategory] = useState<string>("general");
  const [uploadingSiteFile, setUploadingSiteFile] = useState(false);
  const [siteFiles, setSiteFiles] = useState<SiteFile[]>(initialConfig.siteFiles || []);
  const [loadingSiteFiles, setLoadingSiteFiles] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [expandedNews, setExpandedNews] = useState<Record<string, boolean>>({});
  const [expandedBlogs, setExpandedBlogs] = useState<Record<string, boolean>>({});
  const [eventSnapshots, setEventSnapshots] = useState<Record<string, SiteEvent>>({});
  const [newsSnapshots, setNewsSnapshots] = useState<Record<string, SitePost>>({});
  const [blogSnapshots, setBlogSnapshots] = useState<Record<string, SitePost>>({});
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const sectionAnchors = [
    { id: "admin-branding", label: "Branding" },
    { id: "admin-theme", label: "Theme" },
    { id: "admin-visibility", label: "Visibility" },
    { id: "admin-events", label: "Events" },
    { id: "admin-news", label: "News" },
    { id: "admin-blog", label: "Blog" },
    { id: "admin-files", label: "Site Files" },
    { id: "admin-inquiries", label: "Inquiries" },
  ] as const;
  const [activePanel, setActivePanel] = useState<string>("admin-branding");
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [inquiryStorage, setInquiryStorage] = useState<string>("unconfigured");
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const visiblePageSet = useMemo(() => new Set(config.visiblePages), [config.visiblePages]);
  const menuPageSet = useMemo(() => new Set(config.menuPages), [config.menuPages]);

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const response = await fetch("/api/admin/inquiries", { cache: "no-store" });
      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        storage?: string;
        inquiries?: InquiryItem[];
      };
      if (!result.ok) {
        setStatus(result.message || "Unable to load inquiries");
        return;
      }
      setInquiries(result.inquiries || []);
      setInquiryStorage(result.storage || "unknown");
    } catch {
      setStatus("Unable to load inquiries");
    } finally {
      setLoadingInquiries(false);
    }
  };

  const loadSiteFiles = async () => {
    setLoadingSiteFiles(true);
    try {
      const response = await fetch("/api/admin/site-files", { cache: "no-store" });
      const result = (await response.json()) as { ok: boolean; message?: string; files?: SiteFile[] };
      if (!result.ok) {
        setStatus(result.message || "Unable to load site files");
        return;
      }
      const files = result.files || [];
      setSiteFiles(files);
      setConfig((prev) => ({ ...prev, siteFiles: files }));
    } catch {
      setStatus("Unable to load site files");
    } finally {
      setLoadingSiteFiles(false);
    }
  };

  useEffect(() => {
    if (activePanel !== "admin-inquiries") return;
    void loadInquiries();
  }, [activePanel]);

  useEffect(() => {
    if (activePanel !== "admin-files") return;
    void loadSiteFiles();
  }, [activePanel]);
  const themeColorFields: Array<{
    key:
      | "paper"
      | "brand400"
      | "brand600"
      | "brand700"
      | "surface"
      | "surfaceSoft"
      | "highlight"
      | "heroHighlight"
      | "footerButton"
      | "glareBlue"
      | "glareGold";
    label: string;
    description: string;
  }> = [
    { key: "paper", label: "Page Background", description: "Main page background color." },
    { key: "brand400", label: "Brand 400", description: "Soft accent color for chips and light accents." },
    { key: "brand600", label: "Brand 600", description: "Primary action color for buttons and links." },
    { key: "brand700", label: "Brand 700", description: "Strong brand tone for heading accents." },
    { key: "surface", label: "Card Surface", description: "Base card and panel background color." },
    { key: "surfaceSoft", label: "Soft Surface", description: "Secondary panel background color." },
    { key: "highlight", label: "Highlight", description: "Highlight and border-tint color." },
    {
      key: "heroHighlight",
      label: "Hero Highlight Background Color",
      description: "Background behind the home-page tagline.",
    },
    {
      key: "footerButton",
      label: "Footer Contact Button Color",
      description: "Background and border tone for the footer Contact Us button.",
    },
    { key: "glareBlue", label: "Gradient Color 1", description: "Primary color used in moving gradient." },
    { key: "glareGold", label: "Gradient Color 2", description: "Secondary color used in moving gradient." },
  ];

  const gradientNumericFields: Array<{
    key: "glareBlur" | "glareSpeed" | "glareSize";
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    unit: string;
  }> = [
    {
      key: "glareBlur",
      label: "Gradient Blur Strength",
      description: "Controls softness of the moving gradient glow.",
      min: 0,
      max: 80,
      step: 1,
      unit: "px",
    },
    {
      key: "glareSpeed",
      label: "Gradient Animation Speed",
      description: "Controls how fast the gradient animation moves.",
      min: 4,
      max: 60,
      step: 1,
      unit: "s",
    },
    {
      key: "glareSize",
      label: "Gradient Size",
      description: "Controls how large and diffused the gradient circle appears.",
      min: 140,
      max: 760,
      step: 10,
      unit: "px",
    },
  ];

  const updateEvent = (id: string, patch: Partial<SiteEvent>) => {
    setConfig((prev) => ({
      ...prev,
      events: prev.events.map((event) => (event.id === id ? { ...event, ...patch } : event)),
    }));
  };

  const updatePost = (type: "newsPosts" | "blogPosts", id: string, patch: Partial<SitePost>) => {
    setConfig((prev) => ({
      ...prev,
      [type]: prev[type].map((post) => {
        if (post.id !== id) return post;
        const next = { ...post, ...patch };
        if (patch.title && (!post.slug || post.slug.startsWith(type === "newsPosts" ? "news-" : "blog-"))) {
          next.slug = slugify(patch.title);
        }
        return next;
      }),
    }));
  };

  const removePost = (type: "newsPosts" | "blogPosts", id: string) => {
    setConfig((prev) => ({
      ...prev,
      [type]: prev[type].filter((post) => post.id !== id),
    }));
  };

  const addPost = (type: "newsPosts" | "blogPosts") => {
    const empty = emptyPost(type === "newsPosts" ? "news" : "blog");
    setConfig((prev) => ({
      ...prev,
      [type]: [empty, ...prev[type]],
    }));
    if (type === "newsPosts") {
      setExpandedNews((prev) => ({ ...prev, [empty.id]: true }));
      setNewsSnapshots((prev) => ({ ...prev, [empty.id]: deepClone(empty) }));
    } else {
      setExpandedBlogs((prev) => ({ ...prev, [empty.id]: true }));
      setBlogSnapshots((prev) => ({ ...prev, [empty.id]: deepClone(empty) }));
    }
  };

  const addEvent = () => {
    const next = emptyEvent();
    setConfig((prev) => ({ ...prev, events: [next, ...prev.events] }));
    setExpandedEvents((prev) => ({ ...prev, [next.id]: true }));
    setEventSnapshots((prev) => ({ ...prev, [next.id]: deepClone(next) }));
  };

  const confirmDeletePost = (type: "newsPosts" | "blogPosts", id: string) => {
    const accepted = window.confirm("Delete this article permanently?");
    if (!accepted) return;
    removePost(type, id);
    if (type === "newsPosts") setExpandedNews((prev) => ({ ...prev, [id]: false }));
    else setExpandedBlogs((prev) => ({ ...prev, [id]: false }));
  };

  const confirmDeleteEvent = (id: string) => {
    const accepted = window.confirm("Delete this event permanently?");
    if (!accepted) return;
    setConfig((prev) => ({ ...prev, events: prev.events.filter((event) => event.id !== id) }));
    setExpandedEvents((prev) => ({ ...prev, [id]: false }));
  };

  const toggleEditor = (type: "events" | "newsPosts" | "blogPosts", id: string) => {
    if (type === "events") {
      const currentlyOpen = Boolean(expandedEvents[id]);
      if (currentlyOpen) {
        const current = config.events.find((event) => event.id === id);
        const snapshot = eventSnapshots[id];
        const changed = Boolean(current && snapshot && JSON.stringify(current) !== JSON.stringify(snapshot));
        if (changed && !window.confirm("You have unsaved changes. Discard and close?")) return;
        closeEditor("events", id, changed);
        return;
      }
      const current = config.events.find((event) => event.id === id);
      if (current && !eventSnapshots[id]) {
        setEventSnapshots((snapshots) => ({ ...snapshots, [id]: deepClone(current) }));
      }
      setExpandedEvents((prev) => ({ ...prev, [id]: true }));
      return;
    }

    if (type === "newsPosts") {
      const currentlyOpen = Boolean(expandedNews[id]);
      if (currentlyOpen) {
        const current = config.newsPosts.find((post) => post.id === id);
        const snapshot = newsSnapshots[id];
        const changed = Boolean(current && snapshot && JSON.stringify(current) !== JSON.stringify(snapshot));
        if (changed && !window.confirm("You have unsaved changes. Discard and close?")) return;
        closeEditor("newsPosts", id, changed);
        return;
      }
      const current = config.newsPosts.find((post) => post.id === id);
      if (current && !newsSnapshots[id]) {
        setNewsSnapshots((snapshots) => ({ ...snapshots, [id]: deepClone(current) }));
      }
      setExpandedNews((prev) => ({ ...prev, [id]: true }));
      return;
    }

    const currentlyOpen = Boolean(expandedBlogs[id]);
    if (currentlyOpen) {
      const current = config.blogPosts.find((post) => post.id === id);
      const snapshot = blogSnapshots[id];
      const changed = Boolean(current && snapshot && JSON.stringify(current) !== JSON.stringify(snapshot));
      if (changed && !window.confirm("You have unsaved changes. Discard and close?")) return;
      closeEditor("blogPosts", id, changed);
      return;
    }
    const current = config.blogPosts.find((post) => post.id === id);
    if (current && !blogSnapshots[id]) {
      setBlogSnapshots((snapshots) => ({ ...snapshots, [id]: deepClone(current) }));
    }
    setExpandedBlogs((prev) => ({ ...prev, [id]: true }));
  };

  const closeEditor = (type: "events" | "newsPosts" | "blogPosts", id: string, discard: boolean) => {
    if (type === "events") {
      if (discard) {
        const snapshot = eventSnapshots[id];
        if (snapshot) updateEvent(id, snapshot);
      }
      setExpandedEvents((prev) => ({ ...prev, [id]: false }));
      setEventSnapshots((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    if (type === "newsPosts") {
      if (discard) {
        const snapshot = newsSnapshots[id];
        if (snapshot) updatePost("newsPosts", id, snapshot);
      }
      setExpandedNews((prev) => ({ ...prev, [id]: false }));
      setNewsSnapshots((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    if (discard) {
      const snapshot = blogSnapshots[id];
      if (snapshot) updatePost("blogPosts", id, snapshot);
    }
    setExpandedBlogs((prev) => ({ ...prev, [id]: false }));
    setBlogSnapshots((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const applyFormat = (postId: string, type: "bold" | "italic" | "line") => {
    const target = textareaRefs.current[postId];
    if (!target) return;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    const value = target.value;
    const selected = value.slice(start, end);
    let insertion = selected;
    if (type === "bold") insertion = `**${selected || "bold text"}**`;
    if (type === "italic") insertion = `*${selected || "italic text"}*`;
    if (type === "line") insertion = `\n- ${selected || "point"}`;
    const next = value.slice(0, start) + insertion + value.slice(end);
    target.value = next;
    target.dispatchEvent(new Event("input", { bubbles: true }));
  };

  async function saveConfig(nextConfig: SiteConfig) {
    setSaving(true);
    setStatus("Saving...");

    const payload: SiteConfig = { ...nextConfig };

    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { ok: boolean; message?: string; config?: SiteConfig };
      if (!result.ok || !result.config) {
        setStatus(result.message || "Unable to save changes");
        return;
      }

      setConfig(result.config);
      setStatus("Saved successfully");
      router.refresh();
    } catch {
      setStatus("Save failed due to network/server error");
    } finally {
      setSaving(false);
    }
  }

  async function resetToBaseline() {
    setSaving(true);
    setStatus("Rolling back to baseline...");
    try {
      const response = await fetch("/api/admin/config/reset", { method: "POST" });
      const result = (await response.json()) as { ok: boolean; message?: string; config?: SiteConfig };
      if (!result.ok || !result.config) {
        setStatus(result.message || "Rollback failed");
        return;
      }
      setConfig(result.config);
      setStatus("Rolled back to baseline config");
      router.refresh();
    } catch {
      setStatus("Rollback failed due to network/server error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogoToGitHub() {
    if (!logoUploadFile) {
      setStatus("Pick an image file first.");
      return;
    }

    setUploadingLogo(true);
    setStatus("Uploading logo to GitHub...");
    const formData = new FormData();
    formData.append("file", logoUploadFile);

    try {
      const response = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        logoPath?: string;
        committedPath?: string;
      };

      if (!result.ok || !result.logoPath) {
        setStatus(result.message || "Logo upload failed");
        return;
      }

      setConfig((prev) => ({ ...prev, logoPath: result.logoPath as string }));
      setStatus(`Logo uploaded (${result.committedPath}). Click "Save Settings" to apply.`);
    } catch {
      setStatus("Logo upload failed due to network/server error");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function uploadSiteFile() {
    if (!siteFileUpload) {
      setStatus("Pick a file first.");
      return;
    }

    setUploadingSiteFile(true);
    setStatus("Uploading file...");
    const formData = new FormData();
    formData.append("file", siteFileUpload);
    formData.append("category", siteFileCategory);

    try {
      const response = await fetch("/api/admin/upload-file", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        file?: SiteFile;
      };

      if (!result.ok || !result.file) {
        setStatus(result.message || "File upload failed");
        return;
      }

      setSiteFiles((prev) => [result.file as SiteFile, ...prev]);
      setConfig((prev) => ({ ...prev, siteFiles: [result.file as SiteFile, ...(prev.siteFiles || [])] }));
      setSiteFileUpload(null);
      setStatus("File uploaded successfully.");
    } catch {
      setStatus("File upload failed due to network/server error");
    } finally {
      setUploadingSiteFile(false);
    }
  }

  async function removeSiteFile(id: string) {
    const accepted = window.confirm("Delete this file from media library?");
    if (!accepted) return;
    try {
      const response = await fetch(`/api/admin/site-files/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { ok: boolean; message?: string };
      if (!result.ok) {
        setStatus(result.message || "Unable to delete file");
        return;
      }
      setSiteFiles((prev) => prev.filter((item) => item.id !== id));
      setConfig((prev) => ({ ...prev, siteFiles: (prev.siteFiles || []).filter((item) => item.id !== id) }));
      setStatus("File deleted.");
    } catch {
      setStatus("Unable to delete file");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">Control Center</p>
              <h1>Website Dashboard</h1>
              <p>Manage theme, homepage, calendar, contact details, footer and publishing in one place.</p>
            </div>
            <button type="button" className="button secondary" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="admin-quick-nav">
            {sectionAnchors.map((item) => (
              <button
                type="button"
                key={item.id}
                className={activePanel === item.id ? "is-active" : ""}
                onClick={() => setActivePanel(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="admin-sections">
            <section
              className={`admin-section-box ${activePanel === "admin-branding" ? "is-active" : "is-hidden"}`}
              id="admin-branding"
            >
              <h3>Homepage Settings</h3>
              <p className="admin-help">Core school identity and public contact information.</p>
              <div className="admin-grid">
                <label>
                  School Name
                  <input
                    value={config.schoolName}
                    onChange={(event) => setConfig({ ...config, schoolName: event.target.value })}
                  />
                </label>
                <label>
                  Header Name (short)
                  <input
                    value={config.schoolNameShort}
                    onChange={(event) => setConfig({ ...config, schoolNameShort: event.target.value })}
                  />
                </label>
                <label>
                  Tagline
                  <input
                    value={config.tagline}
                    onChange={(event) => setConfig({ ...config, tagline: event.target.value })}
                  />
                </label>
                <label>
                  Logo Path
                  <input
                    value={config.logoPath}
                    onChange={(event) => setConfig({ ...config, logoPath: event.target.value })}
                    placeholder="/logo.png"
                  />
                </label>
                <label>
                  Upload Logo to GitHub
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(event) => setLogoUploadFile(event.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    className="button secondary admin-upload-btn"
                    onClick={uploadLogoToGitHub}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? "Uploading..." : "Upload Logo"}
                  </button>
                </label>
                <label>
                  Phone
                  <input
                    value={config.contactPhone}
                    onChange={(event) => setConfig({ ...config, contactPhone: event.target.value })}
                  />
                </label>
                <label>
                  Email
                  <input
                    value={config.contactEmail}
                    onChange={(event) => setConfig({ ...config, contactEmail: event.target.value })}
                  />
                </label>
              </div>
              <label className="admin-field">
                Address
                <textarea
                  value={config.address}
                  onChange={(event) => setConfig({ ...config, address: event.target.value })}
                  rows={3}
                />
              </label>
            </section>

            <section
              className={`admin-section-box ${activePanel === "admin-theme" ? "is-active" : "is-hidden"}`}
              id="admin-theme"
            >
              <h3>Theme Settings</h3>
              <p className="admin-help">Global theme controls used across buttons, cards, dropdowns, highlights and gradients.</p>
              <div className="admin-grid">
                {themeColorFields.map((item) => (
                  <label key={item.key}>
                    {item.label}
                    <p className="admin-help">{item.description}</p>
                    <div className="admin-theme-field">
                      <input
                        type="color"
                        value={config.theme[item.key]}
                        onChange={(event) =>
                          setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              [item.key]: event.target.value,
                            },
                          })
                        }
                      />
                      <input
                        value={config.theme[item.key]}
                        onChange={(event) =>
                          setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              [item.key]: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </label>
                ))}
                {gradientNumericFields.map((item) => (
                  <label key={item.key}>
                    {item.label}
                    <p className="admin-help">{item.description}</p>
                    <div className="admin-range-field">
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        value={config.theme[item.key]}
                        onChange={(event) =>
                          setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              [item.key]: Number(event.target.value),
                            },
                          })
                        }
                      />
                      <span>{config.theme[item.key]}{item.unit}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="admin-color-strip">
                <div className="admin-color-swatch">
                  Paper
                  <span className="admin-color-preview" style={{ background: config.theme.paper }} />
                </div>
                <div className="admin-color-swatch">
                  Brand 400
                  <span className="admin-color-preview" style={{ background: config.theme.brand400 }} />
                </div>
                <div className="admin-color-swatch">
                  Brand 600
                  <span className="admin-color-preview" style={{ background: config.theme.brand600 }} />
                </div>
                <div className="admin-color-swatch">
                  Card Surface
                  <span className="admin-color-preview" style={{ background: config.theme.surface }} />
                </div>
                <div className="admin-color-swatch">
                  Highlight
                  <span className="admin-color-preview" style={{ background: config.theme.highlight }} />
                </div>
                <div className="admin-color-swatch">
                  Hero Highlight
                  <span className="admin-color-preview" style={{ background: config.theme.heroHighlight }} />
                </div>
                <div className="admin-color-swatch">
                  Footer Button
                  <span className="admin-color-preview" style={{ background: config.theme.footerButton }} />
                </div>
              </div>
              <div className="admin-inline-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      theme: defaultSiteConfig.theme,
                    }))
                  }
                >
                  Reset Theme Only
                </button>
              </div>
            </section>

            <section
              className={`admin-section-box ${activePanel === "admin-visibility" ? "is-active" : "is-hidden"}`}
              id="admin-visibility"
            >
              <h3>Navigation & Visibility</h3>
              <p className="admin-help">Checked means shown. Unchecked means hidden.</p>
              <h4>Page Visibility (general)</h4>
              <div className="admin-check-grid">
                {ALL_MANAGED_PAGES.map((page) => (
                  <label key={page} className="admin-check">
                    <input
                      type="checkbox"
                      checked={visiblePageSet.has(page)}
                      onChange={(event) => {
                        const nextVisible = new Set(config.visiblePages);
                        const nextMenu = new Set(config.menuPages);
                        if (event.target.checked) {
                          nextVisible.add(page);
                        } else {
                          nextVisible.delete(page);
                          nextMenu.delete(page);
                        }
                        setConfig({
                          ...config,
                          visiblePages: Array.from(nextVisible) as ManagedPageKey[],
                          menuPages: Array.from(nextMenu) as ManagedPageKey[],
                          hiddenPages: ALL_MANAGED_PAGES.filter((item) => !nextVisible.has(item)),
                        });
                      }}
                    />
                    <span>{PAGE_LABELS[page]}</span>
                  </label>
                ))}
              </div>
              <h4>Show In Menu</h4>
              <div className="admin-check-grid">
                {ALL_MANAGED_PAGES.map((page) => {
                  const disabled = !visiblePageSet.has(page);
                  return (
                    <label key={`${page}-menu`} className={`admin-check ${disabled ? "is-disabled" : ""}`}>
                      <input
                        type="checkbox"
                        checked={menuPageSet.has(page) && !disabled}
                        disabled={disabled}
                        onChange={(event) => {
                          const next = new Set(config.menuPages);
                          if (event.target.checked) next.add(page);
                          else next.delete(page);
                          setConfig({
                            ...config,
                            menuPages: Array.from(next) as ManagedPageKey[],
                          });
                        }}
                      />
                      <span>{PAGE_LABELS[page]}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section
              className={`admin-section-box ${activePanel === "admin-events" ? "is-active" : "is-hidden"}`}
              id="admin-events"
            >
              <div className="admin-section-head">
                <h3>Calendar Settings</h3>
                <button type="button" className="button secondary" onClick={addEvent}>
                  Add Event
                </button>
              </div>
              <p className="admin-help">Events power the calendar dates, event list, and event details panel.</p>
          <div className="admin-article-list">
            {config.events.map((event) => (
              <article className="admin-article-card" key={event.id}>
                <div className="admin-article-actions">
                  <strong>{event.title || "Untitled event"}</strong>
                  <button type="button" className="button secondary" onClick={() => toggleEditor("events", event.id)}>
                    {expandedEvents[event.id] ? "Close Edit" : "Edit"}
                  </button>
                </div>
                <p className="admin-help">
                  {event.date || "No date"} · {event.category || "No category"} · {event.status}
                </p>
                {expandedEvents[event.id] ? (
                  <>
                    <div className="admin-grid">
                      <label>
                        Title
                        <input value={event.title} placeholder="Event title" onChange={(e) => updateEvent(event.id, { title: e.target.value })} />
                      </label>
                      <label>
                        Date
                        <input type="date" value={event.date} onChange={(e) => updateEvent(event.id, { date: e.target.value })} />
                      </label>
                      <label>
                        Category
                        <CustomSelect
                          value={event.category}
                          onChange={(next) => updateEvent(event.id, { category: next })}
                          ariaLabel="Select event category"
                          options={(EVENT_CATEGORIES.includes(event.category)
                            ? EVENT_CATEGORIES
                            : [event.category, ...EVENT_CATEGORIES]
                          ).map((item) => ({ value: item, label: item }))}
                        />
                      </label>
                      <label>
                        Location
                        <input value={event.location} placeholder="Campus / Hall / Ground" onChange={(e) => updateEvent(event.id, { location: e.target.value })} />
                      </label>
                      <label>
                        Status
                        <CustomSelect
                          value={event.status}
                          onChange={(next) => updateEvent(event.id, { status: next as SiteEvent["status"] })}
                          ariaLabel="Select event status"
                          options={[
                            { value: "draft", label: "Draft" },
                            { value: "published", label: "Published" },
                            { value: "scheduled", label: "Scheduled" },
                          ]}
                        />
                      </label>
                      {event.status === "scheduled" ? (
                        <label>
                          Schedule Time
                          <input
                            type="datetime-local"
                            value={event.scheduledAt || ""}
                            onChange={(e) => updateEvent(event.id, { scheduledAt: e.target.value })}
                          />
                        </label>
                      ) : null}
                      <label>
                        Image URL / Path
                        <input value={event.image || ""} placeholder="/images/event-cover.jpg" onChange={(e) => updateEvent(event.id, { image: e.target.value })} />
                      </label>
                    </div>
                    <label className="admin-field">
                      Short Description
                      <textarea
                        rows={2}
                        placeholder="Brief summary for lists and previews"
                        value={event.shortDescription}
                        onChange={(e) => updateEvent(event.id, { shortDescription: e.target.value })}
                      />
                    </label>
                    <label className="admin-field">
                      Full Description
                      <textarea
                        rows={4}
                        placeholder="Detailed event information"
                        value={event.description}
                        onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                      />
                    </label>
                    <div className="admin-rich-toolbar">
                      <button type="button" className="button secondary" onClick={() => closeEditor("events", event.id, false)}>
                        Save and Close
                      </button>
                      <button type="button" className="button secondary" onClick={() => closeEditor("events", event.id, true)}>
                        Discard Changes
                      </button>
                      <button type="button" className="button secondary" onClick={() => confirmDeleteEvent(event.id)}>
                        Delete Event
                      </button>
                    </div>
                  </>
                ) : null}
              </article>
            ))}
          </div>
            </section>

            <section
              className={`admin-section-box ${activePanel === "admin-news" ? "is-active" : "is-hidden"}`}
              id="admin-news"
            >
              <div className="admin-section-head">
                <h3>News Settings</h3>
                <button type="button" className="button secondary" onClick={() => addPost("newsPosts")}>
                  Add News
                </button>
              </div>
              <p className="admin-help">Create, schedule, hide or publish school news updates.</p>
          <div className="admin-article-list">
            {config.newsPosts.map((post) => (
              <article className="admin-article-card" key={post.id}>
                <div className="admin-article-actions">
                  <strong>{post.title || "Untitled news"}</strong>
                  <button type="button" className="button secondary" onClick={() => toggleEditor("newsPosts", post.id)}>
                    {expandedNews[post.id] ? "Close Edit" : "Edit"}
                  </button>
                </div>
                <p className="admin-help">
                  {post.date || "No date"} · {post.category || "No category"} · {post.status}
                </p>
                {expandedNews[post.id] ? (
                  <>
                    <div className="admin-grid">
                      <label>
                        Title
                        <input value={post.title} placeholder="Article title" onChange={(e) => updatePost("newsPosts", post.id, { title: e.target.value })} />
                      </label>
                      <label>
                        Slug
                        <input value={post.slug} placeholder="article-slug" onChange={(e) => updatePost("newsPosts", post.id, { slug: slugify(e.target.value) })} />
                      </label>
                      <label>
                        Date
                        <input type="date" value={post.date} onChange={(e) => updatePost("newsPosts", post.id, { date: e.target.value })} />
                      </label>
                      <label>
                        Category
                        <CustomSelect
                          value={post.category}
                          onChange={(next) => updatePost("newsPosts", post.id, { category: next })}
                          ariaLabel="Select news category"
                          options={(NEWS_CATEGORIES.includes(post.category)
                            ? NEWS_CATEGORIES
                            : [post.category, ...NEWS_CATEGORIES]
                          ).map((item) => ({ value: item, label: item }))}
                        />
                      </label>
                      <label>
                        Status
                        <CustomSelect
                          value={post.status}
                          onChange={(next) =>
                            updatePost("newsPosts", post.id, { status: next as SitePost["status"] })
                          }
                          ariaLabel="Select news status"
                          options={[
                            { value: "draft", label: "Draft" },
                            { value: "published", label: "Published" },
                            { value: "scheduled", label: "Scheduled" },
                          ]}
                        />
                      </label>
                      {post.status === "scheduled" ? (
                        <label>
                          Schedule Time
                          <input
                            type="datetime-local"
                            value={post.scheduledAt || ""}
                            onChange={(e) => updatePost("newsPosts", post.id, { scheduledAt: e.target.value })}
                          />
                        </label>
                      ) : null}
                      <label>
                        Image URL / Path
                        <input value={post.image} placeholder="/logo.png" onChange={(e) => updatePost("newsPosts", post.id, { image: e.target.value })} />
                      </label>
                    </div>
                    <label className="admin-field">
                      Summary
                      <textarea rows={2} value={post.summary} onChange={(e) => updatePost("newsPosts", post.id, { summary: e.target.value })} />
                    </label>
                    <div className="admin-rich-toolbar">
                      <button type="button" className="button secondary" onClick={() => applyFormat(post.id, "bold")}>Bold</button>
                      <button type="button" className="button secondary" onClick={() => applyFormat(post.id, "italic")}>Italic</button>
                      <button type="button" className="button secondary" onClick={() => applyFormat(post.id, "line")}>Bullet</button>
                      <button type="button" className="button secondary" onClick={() => closeEditor("newsPosts", post.id, false)}>
                        Save and Close
                      </button>
                      <button type="button" className="button secondary" onClick={() => closeEditor("newsPosts", post.id, true)}>
                        Discard Changes
                      </button>
                      <button type="button" className="button secondary" onClick={() => confirmDeletePost("newsPosts", post.id)}>
                        Delete Article
                      </button>
                    </div>
                    <label className="admin-field">
                      Content
                      <textarea
                        rows={6}
                        ref={(node) => {
                          textareaRefs.current[post.id] = node;
                        }}
                        value={post.content}
                        onChange={(e) => updatePost("newsPosts", post.id, { content: e.target.value })}
                      />
                    </label>
                  </>
                ) : null}
              </article>
            ))}
          </div>
            </section>

            <section
              className={`admin-section-box ${activePanel === "admin-blog" ? "is-active" : "is-hidden"}`}
              id="admin-blog"
            >
              <div className="admin-section-head">
                <h3>Blog Settings</h3>
                <button type="button" className="button secondary" onClick={() => addPost("blogPosts")}>
                  Add Blog
                </button>
              </div>
              <p className="admin-help">Manage rich articles with category, schedule, image and content formatting.</p>
          <div className="admin-article-list">
            {config.blogPosts.map((post) => (
              <article className="admin-article-card" key={post.id}>
                <div className="admin-article-actions">
                  <strong>{post.title || "Untitled blog"}</strong>
                  <button type="button" className="button secondary" onClick={() => toggleEditor("blogPosts", post.id)}>
                    {expandedBlogs[post.id] ? "Close Edit" : "Edit"}
                  </button>
                </div>
                <p className="admin-help">
                  {post.date || "No date"} · {post.category || "No category"} · {post.status}
                </p>
                {expandedBlogs[post.id] ? (
                  <>
                    <div className="admin-grid">
                      <label>
                        Title
                        <input value={post.title} placeholder="Article title" onChange={(e) => updatePost("blogPosts", post.id, { title: e.target.value })} />
                      </label>
                      <label>
                        Slug
                        <input value={post.slug} placeholder="article-slug" onChange={(e) => updatePost("blogPosts", post.id, { slug: slugify(e.target.value) })} />
                      </label>
                      <label>
                        Date
                        <input type="date" value={post.date} onChange={(e) => updatePost("blogPosts", post.id, { date: e.target.value })} />
                      </label>
                      <label>
                        Category
                        <CustomSelect
                          value={post.category}
                          onChange={(next) => updatePost("blogPosts", post.id, { category: next })}
                          ariaLabel="Select blog category"
                          options={(BLOG_CATEGORIES.includes(post.category)
                            ? BLOG_CATEGORIES
                            : [post.category, ...BLOG_CATEGORIES]
                          ).map((item) => ({ value: item, label: item }))}
                        />
                      </label>
                      <label>
                        Status
                        <CustomSelect
                          value={post.status}
                          onChange={(next) =>
                            updatePost("blogPosts", post.id, { status: next as SitePost["status"] })
                          }
                          ariaLabel="Select blog status"
                          options={[
                            { value: "draft", label: "Draft" },
                            { value: "published", label: "Published" },
                            { value: "scheduled", label: "Scheduled" },
                          ]}
                        />
                      </label>
                      {post.status === "scheduled" ? (
                        <label>
                          Schedule Time
                          <input
                            type="datetime-local"
                            value={post.scheduledAt || ""}
                            onChange={(e) => updatePost("blogPosts", post.id, { scheduledAt: e.target.value })}
                          />
                        </label>
                      ) : null}
                      <label>
                        Image URL / Path
                        <input value={post.image} placeholder="/logo.png" onChange={(e) => updatePost("blogPosts", post.id, { image: e.target.value })} />
                      </label>
                    </div>
                    <label className="admin-field">
                      Summary
                      <textarea rows={2} value={post.summary} onChange={(e) => updatePost("blogPosts", post.id, { summary: e.target.value })} />
                    </label>
                    <div className="admin-rich-toolbar">
                      <button type="button" className="button secondary" onClick={() => applyFormat(post.id, "bold")}>Bold</button>
                      <button type="button" className="button secondary" onClick={() => applyFormat(post.id, "italic")}>Italic</button>
                      <button type="button" className="button secondary" onClick={() => applyFormat(post.id, "line")}>Bullet</button>
                      <button type="button" className="button secondary" onClick={() => closeEditor("blogPosts", post.id, false)}>
                        Save and Close
                      </button>
                      <button type="button" className="button secondary" onClick={() => closeEditor("blogPosts", post.id, true)}>
                        Discard Changes
                      </button>
                      <button type="button" className="button secondary" onClick={() => confirmDeletePost("blogPosts", post.id)}>
                        Delete Article
                      </button>
                    </div>
                    <label className="admin-field">
                      Content
                      <textarea
                        rows={6}
                        ref={(node) => {
                          textareaRefs.current[post.id] = node;
                        }}
                        value={post.content}
                        onChange={(e) => updatePost("blogPosts", post.id, { content: e.target.value })}
                      />
                    </label>
                  </>
                ) : null}
              </article>
            ))}
              </div>
            </section>

            <section
              className={`admin-section-box ${activePanel === "admin-files" ? "is-active" : "is-hidden"}`}
              id="admin-files"
            >
              <div className="admin-section-head">
                <h3>Site Files</h3>
                <button type="button" className="button secondary" onClick={() => void loadSiteFiles()}>
                  Refresh
                </button>
              </div>
              <p className="admin-help">
                Upload files directly to Cloudinary and reuse URLs across blog, news, events, and pages.
              </p>
              <div className="admin-grid">
                <label>
                  Upload file
                  <CustomSelect
                    value={siteFileCategory}
                    onChange={setSiteFileCategory}
                    ariaLabel="Select file category"
                    options={[
                      { value: "general", label: "General" },
                      { value: "images", label: "Images" },
                      { value: "events", label: "Events" },
                      { value: "news", label: "News" },
                      { value: "blogs", label: "Blogs" },
                      { value: "branding", label: "Branding" },
                      { value: "documents", label: "Documents" },
                    ]}
                  />
                  <input
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    onChange={(event) => setSiteFileUpload(event.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    className="button secondary admin-upload-btn"
                    onClick={uploadSiteFile}
                    disabled={uploadingSiteFile}
                  >
                    {uploadingSiteFile ? "Uploading..." : "Upload File"}
                  </button>
                </label>
              </div>
              {loadingSiteFiles ? <p className="admin-help">Loading files...</p> : null}
              <div className="admin-article-list">
                {siteFiles.length === 0 ? (
                  <p className="admin-help">No site files uploaded yet.</p>
                ) : (
                  siteFiles.map((file) => (
                    <article className="admin-article-card" key={file.id}>
                      {file.mimeType?.startsWith("image/") ? (
                        <img src={file.url} alt={file.name} className="article-preview-thumb" />
                      ) : null}
                      <div className="admin-article-actions">
                        <strong>{file.name}</strong>
                        <span className="admin-help">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <p className="admin-help">
                        {(file.category || "general").toUpperCase()} · {file.mimeType || "file"}
                      </p>
                      <input value={file.url} readOnly />
                      <div className="admin-rich-toolbar">
                        <button
                          type="button"
                          className="button secondary"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(file.url);
                              setStatus("File URL copied");
                            } catch {
                              setStatus("Unable to copy URL");
                            }
                          }}
                        >
                          Copy URL
                        </button>
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => void removeSiteFile(file.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section
              className={`admin-section-box ${activePanel === "admin-inquiries" ? "is-active" : "is-hidden"}`}
              id="admin-inquiries"
            >
              <div className="admin-section-head">
                <h3>Inquiries Inbox</h3>
                <button type="button" className="button secondary" onClick={() => void loadInquiries()}>
                  Refresh
                </button>
              </div>
              <p className="admin-help">
                Storage: <strong>{inquiryStorage}</strong>
              </p>
              {loadingInquiries ? <p className="admin-help">Loading inquiries...</p> : null}
              {!loadingInquiries && inquiries.length === 0 ? (
                <p className="admin-help">No inquiries received yet.</p>
              ) : null}
              <div className="admin-article-list">
                {inquiries.map((item) => (
                  <article className="admin-article-card" key={item.id}>
                    <div className="admin-article-actions">
                      <strong>{item.name}</strong>
                      <span className="admin-help">
                        {new Date(item.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="article-category">{item.type === "feedback" ? "Feedback" : "Inquiry"}</p>
                    <p>
                      <strong>Phone:</strong> {item.phone}
                    </p>
                    {item.email ? (
                      <p>
                        <strong>Email:</strong> {item.email}
                      </p>
                    ) : null}
                    <p>{item.message}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="admin-actions">
            <button type="button" className="button" disabled={saving} onClick={() => saveConfig(config)}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setConfig(defaultSiteConfig);
                setStatus("Loaded defaults in form. Click Save Settings to apply.");
              }}
            >
              Reset Form to Defaults
            </button>
            <button type="button" className="button secondary" disabled={saving} onClick={resetToBaseline}>
              Rollback to Baseline
            </button>
            <span className="admin-status">{status}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
