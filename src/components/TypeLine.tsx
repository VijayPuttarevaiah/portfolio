"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types a line out once, on first view. The full string is always in the DOM
 * for assistive tech; only the visible copy animates, so a screen reader never
 * hears a half-typed word. Reduced motion skips straight to the finished line.
 */
export default function TypeLine({
  text,
  speed = 55,
  className,
  highlight,
}: {
  text: string;
  speed?: number;
  className?: string;
  /** Substring of `text` to colour differently, e.g. just the name. */
  highlight?: string;
}) {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let id = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // scheduled rather than set inline: a synchronous setState here would
      // cascade an extra render pass on mount
      const skip = window.setTimeout(() => {
        setShown(text.length);
        setDone(true);
      }, 0);
      return () => window.clearTimeout(skip);
    }
    const start = () => {
      id = window.setInterval(() => {
        setShown((n) => {
          if (n >= text.length) {
            window.clearInterval(id);
            setDone(true);
            return n;
          }
          return n + 1;
        });
      }, speed);
    };
    // only begin once it is actually on screen
    const node = host.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      start();
      return () => window.clearInterval(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [speed, text]);

  // Only the highlighted run takes the accent colour; the lead-in stays plain,
  // and the split follows the caret as the line types.
  const at = highlight ? text.indexOf(highlight) : -1;
  const typed = text.slice(0, shown);
  const lead = at < 0 ? typed : typed.slice(0, Math.min(shown, at));
  const rest = at < 0 || shown <= at ? "" : typed.slice(at);

  return (
    <span ref={host} className={className}>
      <span aria-hidden="true">{lead}</span>
      <span className="type-hl" aria-hidden="true">
        {rest}
      </span>
      <span className={`type-caret ${done ? "is-done" : ""}`} aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </span>
  );
}
