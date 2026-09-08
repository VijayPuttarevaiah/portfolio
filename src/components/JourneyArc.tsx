"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { educationJourney, professionalJourney } from "@/content/resume";
import BrandMark from "./BrandMark";
const W = 1200,
  H = 610;
const pivot = { x: 880, y: 35 };
const curve = "M 105 140 Q 520 360 1090 290";
const point = (t: number) => ({
  x: (1 - t) ** 2 * 105 + 2 * (1 - t) * t * 520 + t * t * 1090,
  y: (1 - t) ** 2 * 140 + 2 * (1 - t) * t * 360 + t * t * 290,
});
export default function JourneyArc({ reduced }: { reduced: boolean }) {
  const stops = useMemo(
    () =>
      [...educationJourney, ...professionalJourney].sort(
        (a, b) => Number(a.year) - Number(b.year),
      ),
    [],
  );
  const times = useMemo(
    () => stops.map((_, i) => 0.04 + (i * 0.92) / (stops.length - 1)),
    [stops],
  );
  const runway = useRef<HTMLDivElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null),
    arm = useRef<SVGLineElement>(null),
    rest = useRef<SVGLineElement>(null),
    nib = useRef<SVGGElement>(null),
    progressLine = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const pathLength = trail.current?.getTotalLength() || 1;
    let frame = 0,
      last = -1;
    const paint = () => {
      frame = 0;
      const el = runway.current;
      if (!el) return;
      const t = Math.max(
        0,
        Math.min(
          1,
          -el.getBoundingClientRect().top /
            (Math.max(1, el.offsetHeight - window.innerHeight) * 0.88),
        ),
      );
      const p = point(t),
        r = point(Math.max(0.02, t - 0.24));
      // Arc-length fraction keeps the glowing trail attached to the compass tip.
      if (trail.current) {
        let length = 0,
          previous = point(0);
        for (let j = 1; j <= 40; j++) {
          const next = point((t * j) / 40);
          length += Math.hypot(next.x - previous.x, next.y - previous.y);
          previous = next;
        }
        trail.current.style.strokeDashoffset = String(
          1 - length / pathLength,
        );
      }
      arm.current?.setAttribute("x2", String(p.x));
      arm.current?.setAttribute("y2", String(p.y));
      rest.current?.setAttribute("x2", String(r.x));
      rest.current?.setAttribute("y2", String(r.y));
      nib.current?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      let index = 0;
      times.forEach((time, i) => {
        if (t >= time - 0.035) index = i;
      });
      stage.current?.style.setProperty(
        "--camera",
        String(index / (stops.length - 1)),
      );
      progressLine.current?.style.setProperty("transform", `scaleX(${t})`);
      if (index !== last) {
        last = index;
        setActive(index);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [reduced, stops.length, times]);
  const select = (index: number) => {
    const el = runway.current;
    if (el)
      window.scrollTo({
        top:
          window.scrollY +
          el.getBoundingClientRect().top +
          times[index] *
            Math.max(1, el.offsetHeight - window.innerHeight) *
            0.88,
        behavior: reduced ? "instant" : "smooth",
      });
  };
  return (
    <div ref={runway} className="drafting-runway">
      <div className="drafting-sticky">
        <div className="drafting-heading">
          <p>
            A JOURNEY
            <br />
            THROUGH TIME
          </p>
          <span>
            {stops[0].year} — {stops[stops.length - 1].year}
            <br />
            EDUCATION / EXPERIENCE
          </span>
        </div>
        <div className="drafting-viewport">
          <div ref={stage} className="drafting-stage">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="drafting-svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="draft-metal">
                  <stop stopColor="#7a603b" />
                  <stop offset=".42" stopColor="#f4e3bc" />
                  <stop offset=".65" stopColor="#b89a62" />
                  <stop offset="1" stopColor="#6f552e" />
                </linearGradient>
                <linearGradient id="draft-gold">
                  <stop stopColor="#c59a46" />
                  <stop offset="1" stopColor="#ffdf8d" />
                </linearGradient>
                <radialGradient id="draft-flare">
                  <stop stopColor="#fff5cd" />
                  <stop offset=".18" stopColor="#ffc553" stopOpacity=".7" />
                  <stop offset="1" stopColor="#ff7e18" stopOpacity="0" />
                </radialGradient>
                <filter id="draft-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g opacity=".3" fill="none" stroke="var(--compass-ink)">
                <circle cx={pivot.x} cy={pivot.y} r="320" />
                <circle cx={pivot.x} cy={pivot.y} r="331" strokeWidth=".6" />
                {Array.from({ length: 90 }, (_, i) => (
                  <line
                    key={i}
                    x1={pivot.x}
                    y1={pivot.y + 320}
                    x2={pivot.x}
                    y2={pivot.y + (i % 5 === 0 ? 309 : 315)}
                    transform={`rotate(${i * 4} ${pivot.x} ${pivot.y})`}
                    strokeWidth={i % 5 === 0 ? 1 : 0.5}
                  />
                ))}
              </g>
              <path d={curve} stroke="#9c7a39" fill="none" opacity=".6" />
              {Array.from({ length: 111 }, (_, i) => {
                const p = point(i / 110);
                return (
                  <line
                    key={i}
                    x1={p.x}
                    y1={p.y + 4}
                    x2={p.x - 2}
                    y2={p.y + (i % 5 === 0 ? 16 : 10)}
                    stroke="#af8b49"
                    strokeWidth={i % 5 === 0 ? 1.4 : 0.7}
                    opacity=".65"
                  />
                );
              })}
              <path
                ref={trail}
                d={curve}
                stroke="url(#draft-gold)"
                strokeWidth="3"
                fill="none"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
                filter="url(#draft-glow)"
              />
              <g strokeLinecap="round">
                <line
                  ref={rest}
                  x1={pivot.x}
                  y1={pivot.y}
                  x2="105"
                  y2="140"
                  stroke="url(#draft-metal)"
                  strokeWidth="3"
                  opacity=".55"
                />
                <line
                  ref={arm}
                  x1={pivot.x}
                  y1={pivot.y}
                  x2="105"
                  y2="140"
                  stroke="url(#draft-metal)"
                  strokeWidth="4"
                />
                <circle
                  cx={pivot.x}
                  cy={pivot.y}
                  r="15"
                  fill="url(#draft-flare)"
                />
                <circle cx={pivot.x} cy={pivot.y} r="5" fill="#fff3cb" />
                <path
                  d={`M ${pivot.x} ${pivot.y - 9} V ${pivot.y - 26}`}
                  stroke="url(#draft-metal)"
                  strokeWidth="7"
                />
              </g>
              <g ref={nib} transform="translate(105 140)">
                <circle r="28" fill="url(#draft-flare)" />
                <path d="M -3 -16 L 3 -16 L 0 0 Z" fill="#fff0c1" />
                <circle r="3" fill="#fff4cf" filter="url(#draft-glow)" />
              </g>
            </svg>
            {stops.map((stop, i) => {
              const p = point(times[i]);
              return (
                <button
                  key={`${stop.year}-${stop.org}`}
                  type="button"
                  className="drafting-card"
                  data-track={stop.kind === "education" || stop.kind === "now" ? "education" : "work"}
                  data-state={
                    i === active ? "active" : i < active ? "past" : "ahead"
                  }
                  style={{
                    left: `${(p.x / W) * 100}%`,
                    top: `${(p.y / H) * 100}%`,
                  }}
                  aria-label={`${stop.year}: ${stop.org}`}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => select(i)}
                >
                  <span className="drafting-year">{stop.year}</span>
                  <span className="journey-zoom-mark"><BrandMark brand={stop.brand} label={stop.org} size={58} /></span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="drafting-detail">
          <div key={`${stops[active].year}-${stops[active].org}`} className="journey-detail-content" data-lenis-prevent>
            <div className="journey-detail-meta"><span className="journey-detail-badge">{stops[active].marker}</span><span>{stops[active].period}</span></div>
            <h3>{stops[active].title}</h3>
            <p className="journey-detail-org">{stops[active].org}</p>
            <p className="journey-detail-summary">{stops[active].summary}</p>
            {stops[active].note ? <p className="journey-detail-note">{stops[active].note}</p> : null}
          </div>
          <div className="drafting-index">
            <span>
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(stops.length).padStart(2, "0")}
            </span>
            <div>
              <i ref={progressLine} />
            </div>
            <small>SCROLL TO TRACE THE YEARS</small>
          </div>
        </div>
      </div>
    </div>
  );
}
