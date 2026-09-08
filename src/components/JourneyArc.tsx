"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { educationJourney, professionalJourney, type JourneyStop } from "@/content/resume";

export type ArcStop = JourneyStop & { track: "education" | "professional" };

/**
 * The arc the years sit on. Sweeps from upper-left down to lower-right, the
 * same direction the reference reads in, so time moves the way English does.
 */
const PATH_D =
  "M 55 105 C 290 205 430 335 660 350 C 800 359 905 322 965 258";

/** Where the sweeping needle is hinged. Sits above the curve, off to the right. */
const PIVOT = { x: 742, y: 34 };

/** Lead-in and lead-out, so the first year is not lit before the sweep starts. */
const LEAD_IN = 0.08;
const SPAN = 0.84;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function useStops(): ArcStop[] {
  return useMemo(() => {
    const all: ArcStop[] = [
      ...educationJourney.map((s) => ({ ...s, track: "education" as const })),
      ...professionalJourney.map((s) => ({ ...s, track: "professional" as const })),
    ];
    return all.sort((a, b) => Number(a.year) - Number(b.year));
  }, []);
}

export default function JourneyArc({ reduced }: { reduced: boolean }) {
  const stops = useStops();
  const runwayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const litRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGLineElement>(null);
  const needleGroupRef = useRef<SVGGElement>(null);
  const flareRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  /** Only the discrete state lives in React — it changes once per stop, not per frame. */
  const [activeIndex, setActiveIndex] = useState(reduced ? -2 : -1);

  /** Position of each stop along the path, measured once the path is in the DOM. */
  const stopT = useMemo(
    () => stops.map((_, i) => LEAD_IN + (stops.length === 1 ? 0 : i / (stops.length - 1)) * SPAN),
    [stops],
  );

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setPoints(
      stopT.map((t) => {
        const p = path.getPointAtLength(t * len);
        return { x: p.x, y: p.y };
      }),
    );
  }, [stopT]);

  /**
   * Scroll drives the sweep. Everything continuous — the trail, the needle, the
   * flare — is written straight to the DOM, because re-rendering the whole SVG
   * sixty times a second is what makes this kind of section stutter on a phone.
   * React only hears about it when the active stop changes, six times in total.
   */
  useEffect(() => {
    if (reduced) return;
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    let frame = 0;
    let lastIndex = -1;

    const paint = () => {
      frame = 0;
      const el = runwayRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      // Finish the sweep before the runway ends, so the final stop — the one
      // that matters most — holds on screen instead of flashing past on exit.
      const raw = travel <= 0 ? 1 : -rect.top / travel;
      const progress = clamp(raw / 0.82, 0, 1);

      if (litRef.current) {
        litRef.current.style.strokeDashoffset = String(1 - progress);
      }

      const pt = path.getPointAtLength(progress * total);
      if (needleRef.current) {
        needleRef.current.setAttribute("x2", String(pt.x));
        needleRef.current.setAttribute("y2", String(pt.y));
      }
      if (needleGroupRef.current) {
        needleGroupRef.current.style.opacity =
          progress > 0.02 && progress < 0.995 ? "0.75" : "0";
      }
      if (flareRef.current) {
        flareRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      }

      let idx = -1;
      stopT.forEach((t, i) => {
        if (progress >= t - 0.02) idx = i;
      });
      nodeRefs.current.forEach((node, i) => {
        if (node) node.dataset.lit = progress >= stopT[i] - 0.02 ? "true" : "false";
      });
      if (idx !== lastIndex) {
        lastIndex = idx;
        setActiveIndex(idx);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, stopT]);

  const active = activeIndex >= 0 ? stops[activeIndex] : null;

  return (
    <div ref={runwayRef} className={reduced ? "" : "h-[320vh]"}>
      <div
        className={
          reduced
            ? ""
            : "sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
        }
      >
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[13rem_1fr] lg:gap-12">
            <p className="font-display text-[0.72rem] font-bold uppercase leading-[1.9] tracking-[0.42em] text-[var(--fg-subtle)] lg:pt-6">
              A journey
              <br />
              through
              <br />
              time
            </p>

            <div>
              <svg
                viewBox="0 0 1020 430"
                className="w-full"
                role="img"
                aria-label="Timeline of education and work from 2015 to 2027"
              >
                <defs>
                  <linearGradient id="arc-lit" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--h4)" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="var(--h4)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="arc-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="flare">
                    <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.9" />
                    <stop offset="45%" stopColor="var(--h4)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="var(--h4)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Dial rings, hinged on the needle's pivot. */}
                <g stroke="var(--border-strong)" fill="none" opacity="0.5">
                  {[150, 232, 314].map((r) => (
                    <circle
                      key={r}
                      cx={PIVOT.x}
                      cy={PIVOT.y}
                      r={r}
                      strokeDasharray="2 9"
                      strokeWidth="1"
                    />
                  ))}
                </g>

                {/* The path, unlit then lit. pathLength=1 keeps the dash maths in 0..1. */}
                <path
                  d={PATH_D}
                  fill="none"
                  stroke="var(--border-strong)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    pathRef.current = el;
                    litRef.current = el;
                  }}
                  d={PATH_D}
                  fill="none"
                  stroke="url(#arc-lit)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={reduced ? 0 : 1}
                  filter="url(#arc-glow)"
                />

                {/* Sweeping needle, hinged at the pivot and landing on the flare. */}
                <g ref={needleGroupRef} style={{ opacity: 0, transition: "opacity .4s ease" }}>
                  <line
                    ref={needleRef}
                    x1={PIVOT.x}
                    y1={PIVOT.y}
                    x2={PIVOT.x}
                    y2={PIVOT.y}
                    stroke="var(--fg)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  <circle cx={PIVOT.x} cy={PIVOT.y} r="3" fill="var(--fg-subtle)" />
                </g>

                {/* Flare at the head of the trail, moved by transform each frame. */}
                <g ref={flareRef} transform={`translate(${PIVOT.x} ${PIVOT.y})`}>
                  <circle r="46" fill="url(#flare)" />
                  <circle r="4.5" fill="var(--fg)" filter="url(#arc-glow)" />
                </g>

                {/* Year nodes. Education rides above the arc, work below it. */}
                {points.map((pt, i) => {
                  const stop = stops[i];
                  const above = stop.track === "education";
                  return (
                    <g
                      key={`${stop.year}-${stop.title}`}
                      ref={(el) => {
                        nodeRefs.current[i] = el;
                      }}
                      className="arc-node"
                      data-lit={reduced ? "true" : "false"}
                      style={
                        {
                          "--node-hue": above ? "var(--h3)" : "var(--h1)",
                        } as React.CSSProperties
                      }
                    >
                      <circle cx={pt.x} cy={pt.y} r="5" />
                      <text
                        x={pt.x}
                        y={pt.y + (above ? -22 : 34)}
                        textAnchor="middle"
                        className="font-display"
                        fontSize="26"
                        fontWeight="700"
                      >
                        {stop.year}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* The stop the sweep is currently on. */}
              <div className="mt-6 min-h-[10rem] border-t border-[var(--border)] pt-6">
                {active ? (
                  <div key={active.title}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          background:
                            active.track === "education" ? "var(--h3)" : "var(--h1)",
                          color: "var(--bg)",
                        }}
                      >
                        {active.marker}
                      </span>
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                        {active.period}
                      </span>
                    </div>
                    <h3 className="display mt-3 text-2xl leading-tight text-[var(--fg)] sm:text-3xl">
                      {active.title}
                    </h3>
                    <p className="mt-1.5 text-[0.95rem] font-medium text-[var(--fg-muted)]">
                      {active.org}
                    </p>
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                      {active.summary}
                    </p>
                    {active.note ? (
                      <p className="mt-2 text-xs italic text-[var(--fg-subtle)]">
                        {active.note}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--fg-subtle)]">
                    Scroll to move through the years.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Every stop, for screen readers and for anyone the canvas does not reach. */}
      <ol className="sr-only">
        {stops.map((stop) => (
          <li key={`sr-${stop.year}-${stop.title}`}>
            {stop.year} — {stop.title}, {stop.org}. {stop.period}. {stop.summary}
          </li>
        ))}
      </ol>
    </div>
  );
}
