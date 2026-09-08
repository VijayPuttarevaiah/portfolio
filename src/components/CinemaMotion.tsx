"use client";

import { useEffect } from "react";

/** One frame per scroll/pointer update; no rendering loop while idle. */
export default function CinemaMotion() {
  useEffect(() => {
    const hero = document.getElementById("top");
    const universe = document.getElementById("universe");
    const progress = document.getElementById("reading-progress");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty("transform", `scaleX(${range > 0 ? window.scrollY / range : 0})`);
      const scroll = media.matches ? 0 : Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      hero?.style.setProperty("--hero-scroll", String(scroll));
      hero?.style.setProperty("--pointer-x", `${media.matches ? 0 : pointerX}px`);
      hero?.style.setProperty("--pointer-y", `${media.matches ? 0 : pointerY}px`);
      if (universe) {
        const bounds = universe.getBoundingClientRect();
        const phase = Math.max(0, Math.min(1, -bounds.top / Math.max(bounds.height - window.innerHeight, 1)));
        universe.style.setProperty("--scene-progress", String(media.matches ? 0 : phase));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = (event.clientX / window.innerWidth - .5) * 20;
      pointerY = (event.clientY / window.innerHeight - .5) * 12;
      schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    hero?.addEventListener("pointermove", pointer);
    media.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      hero?.removeEventListener("pointermove", pointer);
      media.removeEventListener("change", schedule);
    };
  }, []);
  return <div id="reading-progress" className="reading-progress" aria-hidden="true" />;
}
