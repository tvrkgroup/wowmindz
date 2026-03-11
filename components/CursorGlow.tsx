"use client";

import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const root = document.documentElement;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    let animationFrame = 0;
    let decayTimer: ReturnType<typeof setTimeout> | null = null;

    const target = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.38 };
    const current = { x: target.x, y: target.y };
    const last = { x: target.x, y: target.y };
    const cursorEase = isCoarse ? 0.14 : 0.24;
    const ambientEase = isCoarse ? 0.01 : 0;

    const updateVariables = () => {
      current.x += (target.x - current.x) * cursorEase;
      current.y += (target.y - current.y) * cursorEase;
      const ambientX = current.x + (target.x - current.x) * ambientEase;
      const ambientY = current.y + (target.y - current.y) * ambientEase;
      const dx = target.x - last.x;
      const dy = target.y - last.y;
      const speed = Math.min(1, Math.hypot(dx, dy) / 42);
      const angle = Math.atan2(dy, dx);
      const stretchX = 1 + speed * 0.42;
      const stretchY = 1 - speed * 0.18;

      root.style.setProperty("--cursor-x", `${current.x}px`);
      root.style.setProperty("--cursor-y", `${current.y}px`);
      root.style.setProperty("--ambient-x", `${ambientX}px`);
      root.style.setProperty("--ambient-y", `${ambientY}px`);
      root.style.setProperty("--cursor-nx", ((current.x / window.innerWidth - 0.5) * 2).toFixed(4));
      root.style.setProperty("--cursor-ny", ((current.y / window.innerHeight - 0.5) * 2).toFixed(4));
      root.style.setProperty("--cursor-speed", speed.toFixed(3));
      root.style.setProperty("--cursor-angle", `${angle}rad`);
      root.style.setProperty("--mesh-stretch-x", stretchX.toFixed(3));
      root.style.setProperty("--mesh-stretch-y", stretchY.toFixed(3));
      last.x = target.x;
      last.y = target.y;
      animationFrame = window.requestAnimationFrame(updateVariables);
    };

    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      root.style.setProperty("--cursor-intensity", isCoarse ? "0.16" : "0.24");
      if (decayTimer) clearTimeout(decayTimer);
      decayTimer = setTimeout(() => {
        root.style.setProperty("--cursor-intensity", isCoarse ? "0.11" : "0.15");
      }, 240);
    };

    const onPointerDown = () => root.style.setProperty("--cursor-press", "1");
    const onPointerUp = () => root.style.setProperty("--cursor-press", "0");
    const onLeave = () => root.style.setProperty("--cursor-intensity", isCoarse ? "0.1" : "0.14");
    const onResize = () => {
      target.x = Math.min(target.x, window.innerWidth);
      target.y = Math.min(target.y, window.innerHeight);
    };

    root.style.setProperty("--cursor-x", `${target.x}px`);
    root.style.setProperty("--cursor-y", `${target.y}px`);
    root.style.setProperty("--ambient-x", `${target.x}px`);
    root.style.setProperty("--ambient-y", `${target.y}px`);
    root.style.setProperty("--cursor-intensity", isCoarse ? "0.14" : "0.2");
    root.style.setProperty("--cursor-press", "0");
    root.style.setProperty("--cursor-nx", "0");
    root.style.setProperty("--cursor-ny", "0");
    root.style.setProperty("--cursor-speed", "0");
    root.style.setProperty("--cursor-angle", "0rad");
    root.style.setProperty("--mesh-stretch-x", "1");
    root.style.setProperty("--mesh-stretch-y", "1");
    animationFrame = window.requestAnimationFrame(updateVariables);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (decayTimer) clearTimeout(decayTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
