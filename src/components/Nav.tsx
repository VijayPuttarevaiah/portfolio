"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { navItems, navMore, person, recommendations } from "@/content/resume";
import Search from "./Search";
import ThemeToggle from "./ThemeToggle";
import { jumpToSection } from "./cinema/motionState";

/** Snappy enough to keep up with a scroll, soft enough not to look mechanical. */
const PILL_SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

export default function Nav() {
  const items = navItems;
  // Recommendations renders nothing while the array is empty, so keep it out of
  // the dropdown rather than offering a link that goes nowhere.
  const more = useMemo(
    () =>
      navMore.filter(
        (i) => i.id !== "recommendations" || recommendations.length > 0,
      ),
    [],
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  // Opened by click, so it has to be dismissed deliberately: outside click or
  // Escape. Hover no longer closes it out from under the pointer.
  useEffect(() => {
    if (!moreOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  /**
   * Jump straight there. The page sets scroll-behavior:smooth, which on a
   * 14,000px document means several seconds of travel to reach a section near
   * the end — so these links opt out of it for the duration of the jump.
   */
  const jump = useCallback((id: string) => {
    setMoreOpen(false);
    jumpToSection(id);
  }, []);

  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [rects, setRects] = useState<
    { left: number; width: number; top: number; height: number }[]
  >([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll-spy: highlight whichever section owns the upper third of the viewport.
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  /**
   * The pill animates between measured boxes rather than CSS transitions on
   * each link, so it reads as one object sliding along the bar instead of
   * several highlights fading in and out.
   */
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setRects(
      linkRefs.current.map((el) => {
        if (!el) return { left: 0, width: 0, top: 0, height: 0 };
        return {
          left: el.offsetLeft,
          width: el.offsetWidth,
          top: el.offsetTop,
          height: el.offsetHeight,
        };
      }),
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, items]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = items.findIndex((i) => i.id === active);
  const activeRect = activeIndex >= 0 ? rects[activeIndex] : undefined;
  const hoverRect = hovered !== null ? rects[hovered] : undefined;

  return (
    <header
      className={`cinema-nav sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 sm:px-8"
      >
        <div className="flex items-center gap-7">
          <a href="#top" className="nav-logo" aria-label={`${person.name} — home`}>
            <span aria-hidden="true">VP</span>
            <span className="sr-only">{person.name}</span>
          </a>

          <ul
            ref={listRef}
            onMouseLeave={() => setHovered(null)}
            className="relative hidden items-center gap-1 lg:flex"
          >
            {activeRect ? (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full bg-[var(--nav-pill)]"
                initial={false}
                animate={{
                  left: activeRect.left,
                  width: activeRect.width,
                  top: activeRect.top,
                  height: activeRect.height,
                  opacity: hovered !== null && hovered !== activeIndex ? 0.7 : 1,
                }}
                transition={{ ...PILL_SPRING, opacity: { duration: 0.12 } }}
              />
            ) : null}

            <AnimatePresence>
              {hoverRect && hovered !== activeIndex && activeRect ? (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-full bg-[var(--nav-pill)]"
                  initial={{ ...activeRect, opacity: 0 }}
                  animate={{ ...hoverRect, opacity: 0.45 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...PILL_SPRING, opacity: { duration: 0.12 } }}
                />
              ) : null}
            </AnimatePresence>

            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    jump(item.id);
                  }}
                  onMouseEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`relative z-10 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    active === item.id
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {more.length > 0 ? (
              <li className="nav-more" ref={moreRef}>
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  onClick={() => setMoreOpen((v) => !v)}
                  className="nav-more-trigger"
                >
                  Other
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {moreOpen ? (
                  <ul className="nav-more-menu">
                    {more.map((item) => (
                      <li key={item.id}>
                        <button type="button" onClick={() => jump(item.id)}>
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ) : null}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Search />

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] lg:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--border)] bg-[var(--bg)] lg:hidden"
        >
          <ul className="mx-auto max-w-5xl px-6 py-3 sm:px-8">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
