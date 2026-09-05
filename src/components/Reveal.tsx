"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger within a group, in ms. Kept small — this is a nudge, not a show. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Fade-and-lift on first scroll into view.
 *
 * Deliberately conservative: it fires once then disconnects, and
 * prefers-reduced-motion is handled in CSS rather than here.
 *
 * The hidden starting state is scoped to `.js .reveal` in globals.css, and the
 * `js` class is added by the inline script in layout.tsx — so a visitor with
 * JavaScript disabled sees all content at full opacity rather than a blank
 * page. That also means no setState-in-effect is needed to "arm" the element.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Defensive fallback for environments without IntersectionObserver.
    // Written straight to the DOM rather than through state: this runs
    // directly in the effect body, and setState there is both unnecessary
    // and flagged by react-hooks/set-state-in-effect.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className}`}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
