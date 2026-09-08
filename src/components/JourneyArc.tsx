"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { educationJourney, professionalJourney, type JourneyStop } from "@/content/resume";
import BrandMark from "./BrandMark";

export type ArcStop = JourneyStop & { track: "education" | "professional" };

/** The arc the years sit on — upper-left down to lower-right, the way time reads. */
const PATH_D = "M 55 105 C 290 205 430 335 660 350 C 800 359 905 322 965 258";

/** Where the compass is hinged. Both legs swing from here. */
const HINGE = { x: 726, y: 26 };

/** The resting leg: fixed angle and length, the one that does not draw. */
const REST_LEG = { angle: 62, length: 210 };

const VIEW = { w: 1020, h: 430 };
const LEAD_IN = 0.08;
const SPAN = 0.84;
/** The sweep finishes before the runway ends so the last stop holds on screen. */
const SWEEP_END = 0.82;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const rad = (deg: number) => (deg * Math.PI) / 180;

export default function JourneyArc({ reduced }: { reduced: boolean }) {
  const stops = useMemo(() => {
    const all: ArcStop[] = [
      ...educationJourney.map((s) => ({ ...s, track: "education" as const })),
      ...professionalJourney.map((s) => ({ ...s, track: "professional" as const })),
    ];
    return all.sort((a, b) => Number(a.year) - Number(b.year));
  }, []);

  const runwayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const drawLegRef = useRef<SVGLineElement>(null);
  const sweepRef = useRef<SVGCircleElement>(null);
  const compassRef = useRef<SVGGElement>(null);
  const flareRef = useRef<SVGGElement>(null);
  const markRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [activeIndex, setActiveIndex] = useState(reduced ? stops.length - 1 : -1);

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
   * Scroll drives the compass. The drawing leg, the sweep circle, the trail and
   * the flare are written straight to the DOM — re-rendering this SVG sixty
   * times a second is what makes a section like this stutter on a phone. React
   * only hears about it when the active stop changes.
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
      const raw = travel <= 0 ? 1 : -rect.top / travel;
      const progress = clamp(raw / SWEEP_END, 0, 1);

      const pt = path.getPointAtLength(progress * total);

      if (litRef.current) litRef.current.style.strokeDashoffset = String(1 - progress);

      if (drawLegRef.current) {
        drawLegRef.current.setAttribute("x2", String(pt.x));
        drawLegRef.current.setAttribute("y2", String(pt.y));
      }
      if (sweepRef.current) {
        const r = Math.hypot(pt.x - HINGE.x, pt.y - HINGE.y);
        sweepRef.current.setAttribute("r", String(r));
      }
      if (compassRef.current) {
        compassRef.current.style.opacity = progress > 0.015 && progress < 0.995 ? "1" : "0";
      }
      if (flareRef.current) {
        flareRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      }

      let idx = -1;
      stopT.forEach((t, i) => {
        if (progress >= t - 0.02) idx = i;
      });
      markRefs.current.forEach((mark, i) => {
        if (mark) mark.dataset.lit = progress >= stopT[i] - 0.02 ? "true" : "false";
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
  const restEnd = {
    x: HINGE.x + Math.cos(rad(REST_LEG.angle)) * REST_LEG.length,
    y: HINGE.y + Math.sin(rad(REST_LEG.angle)) * REST_LEG.length,
  };

  return (
    <div ref={runwayRef} className={reduced ? "" : "h-[340vh]"}>
      <div
        className={
          reduced ? "" : "sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16"
        }
      >
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[12rem_1fr] lg:gap-10">
            <p className="font-display text-[0.7rem] font-bold uppercase leading-[2] tracking-[0.4em] text-[var(--fg-subtle)] lg:pt-8">
              A journey
              <br />
              through
              <br />
              time
            </p>

            <div>
              <div className="relative w-full" style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}>
                <svg
                  viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
                  className="absolute inset-0 h-full w-full"
                  role="img"
                  aria-label="Timeline of education and work from 2015 to 2026"
                >
                  <defs>
                    <linearGradient id="arc-lit" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--h4)" stopOpacity="0.3" />
                      <stop offset="55%" stopColor="var(--h4)" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="arc-glow" x="-70%" y="-70%" width="240%" height="240%">
                      <feGaussianBlur stdDeviation="6" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="beam-glow" x="-70%" y="-70%" width="240%" height="240%">
                      <feGaussianBlur stdDeviation="3.5" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="flare">
                      <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.95" />
                      <stop offset="35%" stopColor="var(--h4)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="var(--h4)" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Unwalked years: a dotted gold line waiting to be drawn. */}
                  <path
                    d={PATH_D}
                    fill="none"
                    stroke="var(--h4)"
                    strokeOpacity="0.34"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="1 9"
                  />

                  {/* The drawn trail. pathLength=1 keeps the reveal maths in 0..1. */}
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

                  {/* The compass: a resting leg, a drawing leg, and the circle it sweeps. */}
                  <g
                    ref={compassRef}
                    style={{ opacity: reduced ? 0 : 0, transition: "opacity .5s ease" }}
                  >
                    <circle
                      ref={sweepRef}
                      cx={HINGE.x}
                      cy={HINGE.y}
                      r="0"
                      fill="none"
                      stroke="var(--h4)"
                      strokeOpacity="0.28"
                      strokeWidth="1"
                      strokeDasharray="3 10"
                    />
                    <line
                      x1={HINGE.x}
                      y1={HINGE.y}
                      x2={restEnd.x}
                      y2={restEnd.y}
                      stroke="var(--fg)"
                      strokeOpacity="0.4"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <line
                      ref={drawLegRef}
                      x1={HINGE.x}
                      y1={HINGE.y}
                      x2={HINGE.x}
                      y2={HINGE.y}
                      stroke="var(--h4)"
                      strokeOpacity="0.8"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      filter="url(#beam-glow)"
                    />
                    <circle cx={HINGE.x} cy={HINGE.y} r="4" fill="var(--fg)" fillOpacity="0.75" />
                  </g>

                  {/* The point being drawn. */}
                  <g ref={flareRef} transform={`translate(${HINGE.x} ${HINGE.y})`}>
                    <circle r="42" fill="url(#flare)" />
                    <circle r="4" fill="var(--fg)" filter="url(#arc-glow)" />
                  </g>
                </svg>

                {/* Logos and years ride on top, positioned off the measured path. */}
                {points.map((pt, i) => {
                  const stop = stops[i];
                  const above = stop.track === "education";
                  return (
                    <div
                      key={`${stop.year}-${stop.title}`}
                      ref={(el) => {
                        markRefs.current[i] = el;
                      }}
                      className="arc-mark absolute -translate-x-1/2 -translate-y-1/2"
                      data-lit={reduced ? "true" : "false"}
                      style={{
                        left: `${(pt.x / VIEW.w) * 100}%`,
                        top: `${(pt.y / VIEW.h) * 100}%`,
                      }}
                    >
                      <div
                        className={`flex flex-col items-center gap-1.5 ${above ? "flex-col-reverse" : ""}`}
                      >
                        <span className="arc-mark-logo">
                          <BrandMark brand={stop.brand} label={stop.org} size={44} />
                        </span>
                        <span className="arc-mark-year font-display text-lg font-bold sm:text-xl">
                          {stop.year}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* The stop the compass is currently on. */}
              <div className="mt-4 min-h-[9.5rem] border-t border-[var(--border)] pt-5">
                {active ? (
                  <div key={active.title} className="arc-card">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          background: active.track === "education" ? "var(--h3)" : "var(--h1)",
                          color: "var(--bg)",
                        }}
                      >
                        {active.marker}
                      </span>
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                        {active.period}
                      </span>
                    </div>
                    <h3 className="display mt-2.5 text-2xl leading-tight text-[var(--fg)] sm:text-3xl">
                      {active.title}
                    </h3>
                    <p className="mt-1.5 text-[0.95rem] font-medium text-[var(--fg-muted)]">
                      {active.org}
                    </p>
                    <p className="mt-2.5 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                      {active.summary}
                    </p>
                    {active.note ? (
                      <p className="mt-2 text-xs italic text-[var(--fg-subtle)]">{active.note}</p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--fg-subtle)]">Scroll to walk the years.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
