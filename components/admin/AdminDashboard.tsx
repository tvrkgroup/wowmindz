"use client";

import { useMemo, useState } from "react";
import {
  ALL_MANAGED_PAGES,
  defaultSiteConfig,
  type ManagedPageKey,
  type SiteConfig,
  type SiteEvent,
} from "@/lib/site-config-schema";

const PAGE_LABELS: Record<ManagedPageKey, string> = {
  home: "Home",
  about: "About",
  academics: "Academics",
  admissions: "Admissions",
  campus: "Campus",
  activities: "Activities",
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

function normalizeEventInput(value: string): SiteEvent[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [date, ...titleParts] = line.split("|");
      return {
        id: `event-${index + 1}`,
        date: (date ?? "").trim(),
        title: titleParts.join("|").trim(),
      };
    })
    .filter((item) => item.date && item.title);
}

export default function AdminDashboard({ initialConfig }: AdminDashboardProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [eventsRawInput, setEventsRawInput] = useState(
    initialConfig.events.map((event) => `${event.date} | ${event.title}`).join("\n")
  );
  const [logoUploadFile, setLogoUploadFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const eventsPreview = useMemo(() => normalizeEventInput(eventsRawInput), [eventsRawInput]);

  async function saveConfig(nextConfig: SiteConfig) {
    setSaving(true);
    setStatus("Saving...");

    const payload: SiteConfig = {
      ...nextConfig,
      events: eventsPreview,
    };

    const response = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { ok: boolean; message?: string; config?: SiteConfig };
    if (!result.ok || !result.config) {
      setSaving(false);
      setStatus(result.message || "Unable to save changes");
      return;
    }

    setConfig(result.config);
    setEventsRawInput(result.config.events.map((event) => `${event.date} | ${event.title}`).join("\n"));
    setSaving(false);
    setStatus("Saved successfully");
  }

  async function resetToBaseline() {
    setSaving(true);
    setStatus("Rolling back to baseline...");
    const response = await fetch("/api/admin/config/reset", { method: "POST" });
    const result = (await response.json()) as { ok: boolean; message?: string; config?: SiteConfig };
    setSaving(false);
    if (!result.ok || !result.config) {
      setStatus(result.message || "Rollback failed");
      return;
    }
    setConfig(result.config);
    setEventsRawInput(result.config.events.map((event) => `${event.date} | ${event.title}`).join("\n"));
    setStatus("Rolled back to baseline config");
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
    setUploadingLogo(false);

    if (!result.ok || !result.logoPath) {
      setStatus(result.message || "Logo upload failed");
      return;
    }

    setConfig((prev) => ({ ...prev, logoPath: result.logoPath as string }));
    setStatus(
      `Logo uploaded (${result.committedPath}). Click "Save Settings" to apply it to website config.`
    );
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
              <p>Manage branding, theme, page visibility, and events without code changes.</p>
            </div>
            <button type="button" className="button secondary" onClick={logout}>
              Logout
            </button>
          </div>

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
              Logo Path (inside `public`)
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
              Phone (with country code)
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

          <div className="divider" />

          <h3>Theme Colors</h3>
          <div className="admin-grid">
            <label>
              Page Background
              <input
                type="color"
                value={config.theme.paper}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, paper: event.target.value },
                  })
                }
              />
              <input
                value={config.theme.paper}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, paper: event.target.value },
                  })
                }
                placeholder="#fbfaf6"
              />
            </label>
            <label>
              Brand 400
              <input
                type="color"
                value={config.theme.brand400}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, brand400: event.target.value },
                  })
                }
              />
              <input
                value={config.theme.brand400}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, brand400: event.target.value },
                  })
                }
                placeholder="#6f93f5"
              />
            </label>
            <label>
              Brand 600
              <input
                type="color"
                value={config.theme.brand600}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, brand600: event.target.value },
                  })
                }
              />
              <input
                value={config.theme.brand600}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, brand600: event.target.value },
                  })
                }
                placeholder="#2f5bd7"
              />
            </label>
            <label>
              Brand 700
              <input
                type="color"
                value={config.theme.brand700}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, brand700: event.target.value },
                  })
                }
              />
              <input
                value={config.theme.brand700}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    theme: { ...config.theme, brand700: event.target.value },
                  })
                }
                placeholder="#2345a6"
              />
            </label>
          </div>

          <div className="divider" />

          <h3>Page Visibility</h3>
          <p className="admin-help">Checked means hidden (returns 404 and removed from menu).</p>
          <div className="admin-check-grid">
            {ALL_MANAGED_PAGES.map((page) => (
              <label key={page} className="admin-check">
                <input
                  type="checkbox"
                  checked={config.hiddenPages.includes(page)}
                  onChange={(event) => {
                    const hiddenSet = new Set(config.hiddenPages);
                    if (event.target.checked) hiddenSet.add(page);
                    else hiddenSet.delete(page);
                    setConfig({ ...config, hiddenPages: Array.from(hiddenSet) as ManagedPageKey[] });
                  }}
                />
                <span>{PAGE_LABELS[page]}</span>
              </label>
            ))}
          </div>

          <div className="divider" />

          <h3>News / Events</h3>
          <p className="admin-help">
            One line per event in this format: <code>Date | Event title</code>
          </p>
          <textarea
            className="admin-events"
            rows={7}
            value={eventsRawInput}
            onChange={(event) => setEventsRawInput(event.target.value)}
          />
          <p className="admin-help">Valid events parsed: {eventsPreview.length}</p>

          <div className="admin-actions">
            <button type="button" className="button" disabled={saving} onClick={() => saveConfig(config)}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setConfig(defaultSiteConfig);
                setEventsRawInput(defaultSiteConfig.events.map((event) => `${event.date} | ${event.title}`).join("\n"));
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
