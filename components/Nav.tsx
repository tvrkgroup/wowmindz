"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import type { ManagedPageKey } from "@/lib/site-config-schema";

const navLinks = [
  { href: "/about", label: "About", pageKey: "about" },
  { href: "/academics", label: "Academics", pageKey: "academics" },
  { href: "/admissions", label: "Admissions", pageKey: "admissions" },
  { href: "/campus", label: "Campus", pageKey: "campus" },
  { href: "/activities", label: "Activities", pageKey: "activities" },
  { href: "/blog", label: "Blog", pageKey: "blog" },
  { href: "/news", label: "News", pageKey: "news" },
  { href: "/contact", label: "Contact", pageKey: "contact" },
] as const satisfies ReadonlyArray<{ href: string; label: string; pageKey: ManagedPageKey }>;

function formatPhoneForHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function splitHeaderName(name: string) {
  const cleaned = name.trim().replace(/\s+/g, " ");
  const words = cleaned.split(" ").filter(Boolean);

  if (/public school/i.test(cleaned)) {
    const lineOne = cleaned.replace(/public school/i, "").trim();
    return {
      lineOne: lineOne || "The Silver Brook",
      lineTwo: "Public School",
    };
  }

  if (words.length <= 3) {
    return {
      lineOne: words.join(" ") || "The Silver Brook",
      lineTwo: "Public School",
    };
  }

  const middle = Math.ceil(words.length / 2);
  return {
    lineOne: words.slice(0, middle).join(" "),
    lineTwo: words.slice(middle).join(" "),
  };
}

const safeFallback = {
  lineOne: "The Silver Brook",
  lineTwo: "Public School",
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const config = useSiteConfig();
  const hiddenFallback = (config.hiddenPages || []) as ManagedPageKey[];
  const visiblePages = (config.visiblePages || []) as ManagedPageKey[];
  const menuPages = (config.menuPages || []) as ManagedPageKey[];
  const visibleLinks = navLinks.filter((link) => {
    const generallyVisible = visiblePages.length > 0 ? visiblePages.includes(link.pageKey) : !hiddenFallback.includes(link.pageKey);
    const inMenu = menuPages.length > 0 ? menuPages.includes(link.pageKey) : generallyVisible;
    return generallyVisible && inMenu;
  });
  const nameLines = config.schoolNameShort
    ? splitHeaderName(config.schoolNameShort)
    : safeFallback;

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
          <img className="logo-image" src={config.logoPath || "/logo.png"} alt={`${config.schoolName} logo`} />
          <span className="logo-text">
            <strong>{nameLines.lineOne}</strong>
            <span>{nameLines.lineTwo}</span>
          </span>
        </Link>
        <nav className="nav-links">
          {visibleLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          {(visiblePages.length > 0 ? visiblePages.includes("admissions") : !hiddenFallback.includes("admissions")) ? (
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
              <img className="logo-image" src={config.logoPath || "/logo.png"} alt={`${config.schoolName} logo`} />
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
            {visibleLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {(visiblePages.length > 0 ? visiblePages.includes("admissions") : !hiddenFallback.includes("admissions")) ? (
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
