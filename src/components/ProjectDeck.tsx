"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/content/resume";

const HUES = ["--h1", "--h2", "--h3", "--h5"] as const;

/** Past this many pixels, releasing throws the card instead of snapping back. */
const DISTANCE_THRESHOLD = 110;
/** Or past this speed in px/ms, however short the drag was. */
const VELOCITY_THRESHOLD = 0.45;
/** Must match the .deck-card transition duration in globals.css. */
const FLING_MS = 320;

function ExternalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={dir === "left" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Swipeable project deck.
 *
 * Drag the top card and it follows the pointer with a rotation proportional
 * to how far it has travelled; release past a distance or velocity threshold
 * and it flies off, revealing the next. Two cards peek out behind so the
 * stack reads as a deck rather than a single panel.
 *
 * Three deliberate decisions:
 *
 * 1. No animation library. Pointer Events plus direct writes to `transform`
 *    keep every frame on the compositor and add nothing to the bundle.
 * 2. Every card stays in the DOM. A recruiter's crawler and a screen reader
 *    both see all four projects; only the presentation is a deck. Cards that
 *    are not on top are marked `inert`, so focus can never land on a link
 *    hidden behind another card.
 * 3. Dragging is never the only way through. Buttons, arrow keys and the
 *    dots all advance the deck, and under prefers-reduced-motion the throw
 *    animation is skipped entirely.
 */
export default function ProjectDeck() {
  const total = projects.length;
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef({ active: false, startX: 0, startY: 0, startT: 0, dx: 0 });
  const busy = useRef(false);

  const reduced = useCallback(
    () =>
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  /** Advance the deck, optionally throwing the top card out first. */
  const go = useCallback(
    (dir: 1 | -1, throwOut: boolean) => {
      if (busy.current) return;
      const card = cardRefs.current[index];

      const commit = () => {
        setIndex((i) => (i + dir + total) % total);
        if (card) {
          card.classList.remove("is-flinging");
          card.style.transform = "";
          card.style.opacity = "";
        }
        busy.current = false;
      };

      if (!throwOut || !card || reduced()) {
        commit();
        return;
      }

      busy.current = true;
      const distance = (typeof window !== "undefined" ? window.innerWidth : 900) * 1.1;
      card.classList.add("is-flinging");
      card.style.transform = `translate3d(${dir * distance}px, 40px, 0) rotate(${dir * 22}deg)`;
      card.style.opacity = "0";
      window.setTimeout(commit, FLING_MS);
    },
    [index, total, reduced],
  );

  // Arrow keys move through the deck whenever it is on screen and focused.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1, true);
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (busy.current) return;
    // Let links and buttons inside the card work normally.
    if ((event.target as HTMLElement).closest("a,button")) return;
    const card = cardRefs.current[index];
    if (!card) return;

    card.setPointerCapture(event.pointerId);
    drag.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startT: performance.now(),
      dx: 0,
    };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const card = cardRefs.current[index];
    if (!card) return;

    const dx = event.clientX - drag.current.startX;
    const dy = event.clientY - drag.current.startY;
    drag.current.dx = dx;

    // Rotation scales with horizontal travel, capped so it never looks silly.
    const rotation = Math.max(-14, Math.min(14, dx / 16));
    card.style.transform = `translate3d(${dx}px, ${dy * 0.25}px, 0) rotate(${rotation}deg)`;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);

    const card = cardRefs.current[index];
    const { dx, startT } = drag.current;
    const velocity = Math.abs(dx) / Math.max(performance.now() - startT, 1);
    const thrown =
      Math.abs(dx) > DISTANCE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

    if (card) {
      try {
        card.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer already released — nothing to do.
      }
    }

    if (thrown) {
      go(dx > 0 ? 1 : -1, true);
    } else if (card) {
      // Under threshold: spring back to centre.
      card.classList.add("is-flinging");
      card.style.transform = "";
      window.setTimeout(() => card.classList.remove("is-flinging"), FLING_MS);
    }
  };

  // Clear any inline transform left on a card when the index changes.
  useEffect(() => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.transform = "";
      card.style.opacity = "";
    }
  }, [index]);

  return (
    <div className="deck-wrap">
      <div
        className="deck"
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects — drag a card, or use the arrow keys"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {projects.map((project, i) => {
          const rel = (i - index + total) % total;
          const isTop = rel === 0;
          const hue = HUES[i % HUES.length];

          return (
            <div
              key={project.name}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className={`deck-card${isTop ? " is-top" : ""}${
                isTop && dragging ? " is-dragging" : ""
              }`}
              style={{
                zIndex: total - rel,
                // Cards behind sit lower and smaller, so the stack has depth.
                ["--rel-y" as string]: `${Math.min(rel, 3) * 15}px`,
                ["--rel-s" as string]: `${1 - Math.min(rel, 3) * 0.045}`,
                ["--rel-o" as string]: rel > 2 ? "0" : "1",
                ["--hue" as string]: `var(${hue})`,
              }}
              inert={!isTop}
              aria-hidden={!isTop}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? endDrag : undefined}
              onPointerCancel={isTop ? endDrag : undefined}
            >
              <div className="deck-card-inner">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="deck-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {project.status ? (
                    <span className="deck-status">{project.status}</span>
                  ) : null}
                </div>

                <h3 className="display mt-4 text-[2rem] leading-none text-[var(--fg)] sm:text-[2.6rem]">
                  {project.name}
                </h3>
                <p className="mt-2 text-base font-medium text-[var(--fg-muted)]">
                  {project.blurb}
                </p>

                <div className="deck-body">
                  <p className="text-[0.94rem] leading-relaxed text-[var(--fg-muted)]">
                    {project.problem}
                  </p>
                  <p className="mt-3 text-[0.94rem] leading-relaxed text-[var(--fg-muted)]">
                    {project.built}
                  </p>
                </div>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li key={tech} className="deck-chip">
                      {tech}
                    </li>
                  ))}
                </ul>

                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="deck-link"
                  >
                    {project.hrefLabel ?? "View"}
                    <ExternalIcon />
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="deck-controls">
        <button
          type="button"
          className="deck-btn"
          onClick={() => go(-1, true)}
          aria-label="Previous project"
        >
          <Arrow dir="left" />
        </button>

        <div className="deck-dots" role="tablist" aria-label="Choose a project">
          {projects.map((project, i) => (
            <button
              key={project.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={project.name}
              className={`deck-dot${i === index ? " is-on" : ""}`}
              style={{ ["--hue" as string]: `var(${HUES[i % HUES.length]})` }}
              onClick={() => {
                if (!busy.current) setIndex(i);
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className="deck-btn"
          onClick={() => go(1, true)}
          aria-label="Next project"
        >
          <Arrow dir="right" />
        </button>
      </div>

      <p className="deck-hint" aria-live="polite">
        <span className="sm:hidden">Swipe</span>
        <span className="hidden sm:inline">Drag a card or use ← →</span>
        {" · "}
        {index + 1} of {total}
      </p>
    </div>
  );
}
