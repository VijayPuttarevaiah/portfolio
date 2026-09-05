"use client";

import { useEffect, useRef } from "react";

/**
 * The journey spine, drawn as you scroll.
 *
 * A dim rail sits underneath; a bright gradient rail scales up over it in
 * proportion to how far the timeline has travelled through the viewport, so
 * the arc visibly draws itself as the reader moves down the page.
 *
 * The transform is written straight to the node rather than held in state:
 * scrolling then costs one style write per frame instead of a React render
 * per frame. Work is throttled through requestAnimationFrame and only ever
 * touches `transform`, so it stays on the compositor. Under
 * prefers-reduced-motion the lit rail is simply drawn in full.
 */
export default function TimelineSpine({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const litRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const lit = litRef.current;
    const container = root?.parentElement;
    if (!root || !lit || !container) return;

    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      lit.style.transform = "scaleY(1)";
      return;
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = container.getBoundingClientRect();
      // 0 when the top of the timeline reaches the lower third of the screen,
      // 1 once the bottom has passed the same line.
      const anchor = window.innerHeight * 0.66;
      const total = rect.height;
      const progress =
        total > 0 ? Math.min(Math.max((anchor - rect.top) / total, 0), 1) : 0;
      lit.style.transform = `scaleY(${progress})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className={`tl-rail ${className}`}>
      <span className="tl-rail-dim" />
      <span ref={litRef} className="tl-rail-lit" />
    </div>
  );
}
