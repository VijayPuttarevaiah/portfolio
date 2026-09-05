"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { recommendations } from "@/content/resume";
import Reveal from "./Reveal";

const HUES = ["--h1", "--h2", "--h3", "--h4", "--h5"] as const;

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
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
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Swipeable testimonial carousel — one recommendation at a time.
 *
 * Renders nothing when there are no recommendations, so the section simply
 * does not exist until real content is added to `recommendations` in
 * src/content/resume.ts. Nothing here is ever placeholder text: quotes
 * attributed to named people must be genuine.
 */
export default function Recommendations() {
  const items = recommendations;
  const count = items.length;

  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  /** Drag distance as a % of viewport width — kept in state so render
      never has to measure the DOM. */
  const [dragPct, setDragPct] = useState(0);
  const startX = useRef(0);
  const widthRef = useRef(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Keyboard: left/right when the carousel has focus.
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      }
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (count === 0) return null;

  function onPointerDown(e: React.PointerEvent) {
    if (count < 2) return;
    setDragging(true);
    startX.current = e.clientX;
    widthRef.current = (e.currentTarget as HTMLElement).clientWidth || 1;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setDragPct(((e.clientX - startX.current) / widthRef.current) * 100);
  }

  function onPointerUp() {
    if (!dragging) return;
    // Commit the swipe once dragged past 18% of the viewport, so short
    // flicks on mobile still register.
    const THRESHOLD_PCT = 18;
    if (dragPct <= -THRESHOLD_PCT) go(index + 1);
    else if (dragPct >= THRESHOLD_PCT) go(index - 1);
    setDragging(false);
    setDragPct(0);
  }

  const offsetPct = -index * 100;
  const shift = offsetPct + (dragging ? dragPct : 0);

  return (
    <section
      id="recommendations"
      aria-labelledby="recommendations-heading"
      className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--bg-sunken)]"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            Recommendations
          </p>
          <h2
            id="recommendations-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl"
          >
            What colleagues say
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div
            ref={viewportRef}
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            aria-label="Recommendations from colleagues"
            className="mt-10 cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: "pan-y" }}
          >
            <div
              className="carousel-track"
              data-dragging={dragging ? "true" : "false"}
              style={{ transform: `translate3d(${shift}%,0,0)` }}
            >
              {items.map((item, i) => {
                const hue = HUES[i % HUES.length];
                return (
                  <figure
                    key={`${item.name}-${i}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}`}
                    aria-hidden={i !== index}
                    className="w-full shrink-0 select-none px-0.5"
                  >
                    <div
                      className="h-full rounded-2xl border bg-[var(--bg)] p-7 sm:p-10"
                      style={{
                        borderColor: `var(${hue})`,
                        boxShadow: `inset 0 3px 0 0 var(${hue})`,
                      }}
                    >
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        style={{ color: `var(${hue})` }}
                      >
                        <path
                          d="M9.5 6C6.8 7.6 5 10.4 5 13.6c0 2.6 1.6 4.4 3.8 4.4 2 0 3.5-1.5 3.5-3.5S10.9 11 9.1 11c-.3 0-.6 0-.8.1.4-1.6 1.5-3 3-4L9.5 6Zm9 0c-2.7 1.6-4.5 4.4-4.5 7.6 0 2.6 1.6 4.4 3.8 4.4 2 0 3.5-1.5 3.5-3.5S19.9 11 18.1 11c-.3 0-.6 0-.8.1.4-1.6 1.5-3 3-4L18.5 6Z"
                          fill="currentColor"
                        />
                      </svg>

                      <blockquote className="mt-5">
                        <p className="text-lg leading-relaxed text-[var(--fg)] sm:text-xl">
                          {item.quote}
                        </p>
                      </blockquote>

                      <figcaption className="mt-7 border-t border-[var(--border)] pt-5">
                        <p className="font-semibold text-[var(--fg)]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-sm text-[var(--fg-muted)]">
                          {item.title}
                        </p>
                        {item.relationship ? (
                          <p className="mt-1 text-xs text-[var(--fg-subtle)]">
                            {item.relationship}
                          </p>
                        ) : null}
                      </figcaption>
                    </div>
                  </figure>
                );
              })}
            </div>
          </div>
        </Reveal>

        {count > 1 ? (
          <Reveal delay={120}>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2" role="tablist" aria-label="Choose recommendation">
                {items.map((item, i) => (
                  <button
                    key={`dot-${item.name}-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Recommendation ${i + 1} of ${count}`}
                    onClick={() => go(i)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: i === index ? "1.75rem" : "0.5rem",
                      background:
                        i === index
                          ? `var(${HUES[i % HUES.length]})`
                          : "var(--border-strong)",
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous recommendation"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <ChevronIcon dir="left" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next recommendation"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <ChevronIcon dir="right" />
                </button>
              </div>
            </div>

            {/* Announce slide changes to screen readers without moving focus. */}
            <p aria-live="polite" className="sr-only">
              Recommendation {index + 1} of {count}: {items[index].name}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
