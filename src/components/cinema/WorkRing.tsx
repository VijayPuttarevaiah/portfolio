"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import TriageArchitecture from "./TriageArchitecture";
import { projects } from "@/content/resume";

/** How long each project holds before the ring advances. */
const AUTOPLAY_MS = 6000;

/** Spring physics for the ring rotation. */
const SPRING = { type: "spring", stiffness: 60, damping: 16, mass: 0.7 } as const;

const RADIUS_MIN = 130;
const RADIUS_MAX = 300;
const RADIUS_WIDTH_RATIO = 0.34;
const PERSPECTIVE_MULTIPLIER = 2.4;
/** Tilt of the ring plane, so it reads as a turntable rather than a flat row. */
const RING_TILT_DEG = 14;

const EASE = [0.22, 1, 0.36, 1] as const;

function Ring() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(220);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  const count = projects.length;
  const angleStep = 360 / count;

  const steps = Math.round(rotation / angleStep);
  const activeIndex = ((-steps % count) + count) % count;
  const active = projects[activeIndex];

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      setRadius(Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, width * RADIUS_WIDTH_RATIO)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /**
   * Autoplay stops while a visitor is reading — hover, focus, or a reduced-motion
   * preference. Content that moves itself under someone mid-sentence is the
   * fastest way to make a carousel hostile.
   */
  useEffect(() => {
    if (reduced || paused || !autoplay) return;
    const id = setInterval(() => setRotation((r) => r + angleStep), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [angleStep, paused, reduced, autoplay]);

  const rotate = useCallback(
    (dir: "prev" | "next") =>
      setRotation((r) => r + (dir === "prev" ? -angleStep : angleStep)),
    [angleStep],
  );

  const goTo = useCallback(
    (index: number) => {
      // Rotate by the shortest path to the requested project.
      setRotation((r) => {
        const current = ((-Math.round(r / angleStep) % count) + count) % count;
        let delta = current - index;
        if (delta > count / 2) delta -= count;
        if (delta < -count / 2) delta += count;
        return r + delta * angleStep;
      });
    },
    [angleStep, count],
  );

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={containerRef}
        className="relative mx-auto h-[210px] w-full max-w-3xl sm:h-[240px]"
      >
        <div
          className="relative h-full w-full"
          style={{ perspective: radius * PERSPECTIVE_MULTIPLIER }}
        >
          {projects.map((project, index) => {
            const targetAngle = rotation + angleStep * index;
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={project.name}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: targetAngle }}
                transition={reduced ? { duration: 0 } : SPRING}
              >
                <motion.button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={isActive}
                  className={`ring-tile ${isActive ? "ring-tile-active" : ""}`}
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: -targetAngle, rotateX: RING_TILT_DEG, z: radius }}
                  transition={reduced ? { duration: 0 } : SPRING}
                >
                  <span className="ring-tile-name">{project.name}</span>
                  <span className="ring-tile-blurb">{project.stack[0]}</span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <RingButton label="Previous project" onClick={() => rotate("prev")} dir="prev" />
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
          {activeIndex + 1} / {count}
        </p>
        <RingButton label="Next project" onClick={() => rotate("next")} dir="next" />
        {!reduced && <button type="button" className="project-play" aria-pressed={autoplay} onClick={() => setAutoplay(!autoplay)}>{autoplay ? "Pause rotation" : "Play rotation"}</button>}
      </div>

      <div className="mt-8 min-h-[24rem] sm:min-h-[21rem]">
        <AnimatePresence mode="wait">
          <motion.article
            key={active.name}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            aria-live="polite"
          >
            <h3 className="display text-2xl leading-tight text-[var(--fg)] sm:text-3xl">
              {active.name}
            </h3>
            <p className="mt-1.5 text-[0.95rem] font-medium text-[var(--fg-muted)]">
              {active.blurb}
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                  The problem
                </p>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--fg-muted)]">
                  {active.problem}
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                  What I built
                </p>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--fg-muted)]">
                  {active.built}
                </p>
              </div>
            </div>

            {active.name === "Triage" && <TriageArchitecture />}

            {active.status ? (
              <p className="mt-5 border-l-2 border-[var(--border-strong)] py-0.5 pl-3 text-[0.88rem] leading-relaxed text-[var(--fg-subtle)]">
                {active.status}
              </p>
            ) : null}

            <ul className="mt-5 flex flex-wrap gap-2">
              {active.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-[0.7rem] text-[var(--fg-subtle)]"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {active.href ? (
              <a
                href={active.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-block text-sm underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:decoration-[var(--accent)]"
              >
                {active.hrefLabel ?? "View"} &rarr;
              </a>
            ) : null}
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

function RingButton({
  label,
  onClick,
  dir,
}: {
  label: string;
  onClick: () => void;
  dir: "prev" | "next";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)] active:scale-90"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={dir === "next" ? { transform: "scaleX(-1)" } : undefined}
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

/**
 * Projects as a rotating ring over a detail panel.
 *
 * Replaces the pinned horizontal rail. The section chrome — label, display
 * heading — is kept so this reads as part of the same cut as the rest of the
 * film, rather than a component bolted on from somewhere else.
 */
export default function WorkRing() {
  return (
    <section id="projects" className="ring-section" aria-labelledby="projects-heading">
      <div className="work-heading">
        <p className="cinema-label">03 / SELECTED WORK</p>
        <h2 id="projects-heading" className="display">
          Systems in motion.
        </h2>
      </div>
      <div className="ring-body">
        <Ring />
      </div>
    </section>
  );
}
