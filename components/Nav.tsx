"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/campus", label: "Campus" },
  { href: "/activities", label: "Activities" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-shell">
      <div className="container nav-bar">
        <Link href="/" className="logo">
          <img className="logo-image" src="/logo.png" alt="The Silver Brook Public School logo" />
          <span className="logo-text">
            <strong>The Silver Brook</strong>
            <span>Public School</span>
          </span>
        </Link>
        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link href="/admissions" className="button">
            Apply Now
          </Link>
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-drawer ${open ? "open" : ""}`}>
        <div className="nav-drawer-panel">
          <div className="nav-drawer-head">
            <img className="logo-image" src="/logo.png" alt="The Silver Brook Public School logo" />
            <button
              className="nav-close"
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="nav-drawer-links">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/admissions" className="button" onClick={() => setOpen(false)}>
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
