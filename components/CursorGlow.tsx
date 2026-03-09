"use client";

import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const root = document.documentElement;
    let decayTimer: ReturnType<typeof setTimeout> | null = null;

    const setCursor = (x: number, y: number) => {
      root.style.setProperty("--cursor-x", `${x}px`);
      root.style.setProperty("--cursor-y", `${y}px`);
      root.style.setProperty("--cursor-intensity", "0.42");
      if (decayTimer) clearTimeout(decayTimer);
      decayTimer = setTimeout(() => {
        root.style.setProperty("--cursor-intensity", "0.2");
      }, 180);
    };

    const onMouseMove = (event: MouseEvent) => {
      setCursor(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      setCursor(touch.clientX, touch.clientY);
    };

    const onPointerDown = () => root.style.setProperty("--cursor-press", "1");
    const onPointerUp = () => root.style.setProperty("--cursor-press", "0");
    const onLeave = () => root.style.setProperty("--cursor-intensity", "0.1");

    root.style.setProperty("--cursor-x", "50vw");
    root.style.setProperty("--cursor-y", "35vh");
    root.style.setProperty("--cursor-intensity", "0.18");
    root.style.setProperty("--cursor-press", "0");

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      if (decayTimer) clearTimeout(decayTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return null;
}
