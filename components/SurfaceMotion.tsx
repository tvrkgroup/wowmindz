"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SurfaceMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const surfaces = document.querySelectorAll<HTMLElement>(
      ".card, .info-card, .projects-card, .article-preview-card, [data-interactive-surface]",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.inView = String(
            entry.isIntersecting,
          );
        });
      },
      { rootMargin: "-10% 0px -15% 0px", threshold: 0.2 },
    );
    surfaces.forEach((surface) => observer.observe(surface));

    let currentAnimation: Animation | undefined;
    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        reducedMotion.matches
      )
        return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href*="#"]',
      );
      if (!anchor || anchor.target === "_blank") return;
      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      let id: string;
      try {
        id = decodeURIComponent(url.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      // Keep native anchor navigation, history, and smooth scrolling intact.
      const heading = target.querySelector<HTMLElement>("h2, h3") || target;
      currentAnimation?.cancel();
      currentAnimation = heading.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0.8, transform: "translateY(3px)", offset: 0.25 },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 1100, easing: "ease-out" },
      );
    };
    document.addEventListener("click", onAnchorClick);
    return () => {
      observer.disconnect();
      surfaces.forEach((surface) => {
        delete surface.dataset.inView;
      });
      document.removeEventListener("click", onAnchorClick);
      currentAnimation?.cancel();
    };
  }, [pathname]);

  return null;
}
