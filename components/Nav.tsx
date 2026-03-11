"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { getPrimaryNavigation } from "@/config/page-registry";

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

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const config = useSiteConfig();
  const safeLinks = getPrimaryNavigation(config);
  const nameLines = config.schoolNameShort
    ? splitHeaderName(config.schoolNameShort)
    : safeFallback;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const mobileMenu = (
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
          <button className="mobile-menu-close" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <span />
            <span />
          </button>
        </div>
        <nav className="mobile-menu-links" aria-label="Mobile links">
          {safeLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={isActiveRoute(pathname, link.href) ? "is-active" : ""}
              style={{ ["--item-index" as string]: String(safeLinks.findIndex((item) => item.key === link.key)) }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-meta">
          <p>Involve. Solve. Evolve.</p>
          <a href={`tel:${formatPhoneForHref(config.contactPhone)}`}>{config.contactPhone}</a>
        </div>
      </aside>
    </div>
  );

  return (
    <>
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
            {safeLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={isActiveRoute(pathname, link.href) ? "is-active" : ""}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link href="/contact" className="button nav-contact-button">
              Contact Us
            </Link>
          </div>
          <button
            className={`nav-toggle ${open ? "is-open" : ""}`}
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
      </header>
      {mounted ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
