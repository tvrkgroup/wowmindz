"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { getPrimaryNavigation, isPageVisibleInTemplate } from "@/config/page-registry";

function formatPhoneForHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function splitHeaderName(name: string) {
  const cleaned = name.trim().replace(/\s+/g, " ");
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length <= 2) {
    return {
      lineOne: words.join(" ") || "WowMindz",
      lineTwo: "Technologies",
    };
  }

  const middle = Math.ceil(words.length / 2);
  return {
    lineOne: words.slice(0, middle).join(" "),
    lineTwo: words.slice(middle).join(" "),
  };
}

const safeFallback = {
  lineOne: "WowMindz",
  lineTwo: "Technologies",
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const config = useSiteConfig();
  const safeLinks = getPrimaryNavigation(config);
  const nameLines = config.schoolNameShort
    ? splitHeaderName(config.schoolNameShort)
    : safeFallback;
  const admissionsEnabled = isPageVisibleInTemplate(config, "admissions");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="nav-shell">
      <div className="container nav-bar">
        <Link href="/" className="logo">
          <img className="logo-image" src={config.logoPath || "/logo.svg"} alt={`${config.schoolName} logo`} />
          <span className="logo-text">
            <strong>{nameLines.lineOne}</strong>
            <span>{nameLines.lineTwo}</span>
          </span>
        </Link>
        <nav className="nav-links">
          {safeLinks.map((link) => (
            <Link key={link.key} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          {admissionsEnabled ? (
            <Link href="/admissions" className="button">
              Apply Now
            </Link>
          ) : null}
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Close mobile menu"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
        />
        <aside className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="mobile-menu-head">
            <div className="mobile-menu-brand">
              <img className="logo-image" src={config.logoPath || "/logo.svg"} alt={`${config.schoolName} logo`} />
              <div className="logo-text">
                <strong>{nameLines.lineOne}</strong>
                <span>{nameLines.lineTwo}</span>
              </div>
            </div>
            <button
              className="mobile-menu-close"
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              X
            </button>
          </div>
          <nav className="mobile-menu-links" aria-label="Mobile links">
            {safeLinks.map((link) => (
              <Link key={link.key} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {admissionsEnabled ? (
              <Link href="/admissions" className="button" onClick={() => setOpen(false)}>
                Apply Now
              </Link>
            ) : null}
            <a href={`tel:${formatPhoneForHref(config.contactPhone)}`}>Call Office</a>
          </nav>
        </aside>
      </div>
    </header>
  );
}
