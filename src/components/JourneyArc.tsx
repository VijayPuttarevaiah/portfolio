"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandMark from "./BrandMark";
import { educationJourney, professionalJourney } from "@/content/resume";
import type { JourneyStop } from "@/content/resume";
const W = 1200,
  H = 610;
/**
 * The line is a curved L: down the left, then bending right along the bottom,
 * passing under the clock. It is a cubic Bézier, so the drawn path and the
 * logo positions come from the same four control points and cannot drift.
 *
 * Coordinates are rounded because Math.sin/cos elsewhere are
 * implementation-defined; keeping one rounding rule avoids hydration mismatches.
 */
const clock = { cx: 880, cy: 192, r: 190 } as const;
const L = [
  [150, 110],
  [150, 430],
  [430, 505],
  [1130, 470],
] as const;
const pivot = { x: clock.cx, y: clock.cy };
const round2 = (n: number) => Math.round(n * 100) / 100;
const point = (t: number) => {
  const u = 1 - t;
  return {
    x: round2(
      u ** 3 * L[0][0] + 3 * u * u * t * L[1][0] + 3 * u * t * t * L[2][0] + t ** 3 * L[3][0],
    ),
    y: round2(
      u ** 3 * L[0][1] + 3 * u * u * t * L[1][1] + 3 * u * t * t * L[2][1] + t ** 3 * L[3][1],
    ),
  };
};
/**
 * Equal steps in the Bézier parameter are not equal steps along the curve — the
 * far end of this L covers far more ground per unit of t, which left the last
 * gap more than twice the first. This walks the curve once, builds a cumulative
 * length table, and converts a distance fraction back into a t value, so the
 * logos sit at equal distances.
 */
const ARC_STEPS = 600;
const arcLengths = (() => {
  const table = [0];
  let previous = point(0);
  let total = 0;
  for (let i = 1; i <= ARC_STEPS; i += 1) {
    const next = point(i / ARC_STEPS);
    total += Math.hypot(next.x - previous.x, next.y - previous.y);
    table.push(total);
    previous = next;
  }
  return { table, total };
})();

function tAtDistance(fraction: number) {
  const { table, total } = arcLengths;
  const target = Math.min(Math.max(fraction, 0), 1) * total;
  let lo = 0;
  let hi = table.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (table[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  const i = Math.max(1, lo);
  const span = table[i] - table[i - 1] || 1;
  return (i - 1 + (target - table[i - 1]) / span) / ARC_STEPS;
}

const start = point(0);
const curve = `M ${L[0][0]} ${L[0][1]} C ${L[1][0]} ${L[1][1]} ${L[2][0]} ${L[2][1]} ${L[3][0]} ${L[3][1]}`;

/**
 * The movement, as a skeleton clock: a dense cluster where every gear is
 * tangent to its parent, so the teeth genuinely mesh. Direction alternates
 * along the chain and speed goes as 1/r, which is what a real train does.
 */
const GEARS = [
  { cx: 0, cy: 20, r: 40, teeth: 20, dir: 1 },
  { cx: -63.9, cy: -3.3, r: 28, teeth: 14, dir: -1 },
  { cx: 49, cy: -21.1, r: 24, teeth: 12, dir: -1 },
  { cx: 0, cy: 90, r: 30, teeth: 15, dir: -1 },
  { cx: -79.6, cy: -46.5, r: 18, teeth: 10, dir: 1 },
  { cx: 47, cy: 107.1, r: 20, teeth: 11, dir: 1 },
  { cx: 83.6, cy: -1.1, r: 16, teeth: 9, dir: 1 },
] as const;

/** Degrees each gear turns across the whole scroll, from the 1/r relationship. */
const SPIN = 15000;

function Gear({
  cx,
  cy,
  r,
  teeth,
  dir,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  dir: number;
}) {
  const tooth = (r * Math.PI) / teeth / 1.85;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g
        className="clock-gear"
        style={{ ["--rate" as string]: ((dir * SPIN) / r).toFixed(1) }}
      >
        {Array.from({ length: teeth }, (_, i) => (
          <rect
            key={i}
            x={-tooth / 2}
            y={-(r + tooth * 0.6)}
            width={tooth}
            height={tooth * 1.25}
            rx={tooth * 0.22}
            fill="var(--gear-metal)"
            transform={`rotate(${(i * 360) / teeth})`}
          />
        ))}
        <circle r={r} fill="var(--gear-body)" stroke="var(--gear-metal)" strokeWidth="1.5" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={i}
            x={-r * 0.07}
            y={-r * 0.8}
            width={r * 0.14}
            height={r * 0.64}
            rx={r * 0.06}
            fill="var(--gear-metal)"
            opacity=".45"
            transform={`rotate(${(i * 360) / 6})`}
          />
        ))}
        <circle r={r * 0.22} fill="var(--gear-body)" stroke="var(--gear-metal)" strokeWidth="1.3" />
      </g>
    </g>
  );
}

/**
 * A vintage hand: slim shaft, pierced spade near the tip, and a counterweight
 * tail past the arbor. Built from the live angle and reach rather than a fixed
 * path, so the long hand can lengthen toward 2026 without the spade distorting.
 */
function handPath(cx: number, cy: number, angle: number, reach: number) {
  const co = Math.cos(angle),
    si = Math.sin(angle);
  const at = (d: number, o: number) => [
    round2(cx + co * d - si * o),
    round2(cy + si * d + co * o),
  ];
  const tail = Math.min(38, reach * 0.16);
  const spade = Math.max(reach - 34, reach * 0.72);
  const pts = [
    at(-tail, 0), at(-tail * 0.55, -5.4), at(0, -3), at(spade, -3.4),
    at(spade + 9, -9.5), at(reach, 0),
    at(spade + 9, 9.5), at(spade, 3.4), at(0, 3), at(-tail * 0.55, 5.4),
  ];
  return `M ${pts.map((q) => q.join(" ")).join(" L ")} Z`;
}

/** One company or client name, linked when it has an href. */
function OrgRun({ run }: { run: { label: string; href?: string } }) {
  if (!run.href) return <>{run.label}</>;
  return (
    <a
      className="journey-org-link"
      href={run.href}
      target="_blank"
      rel="noreferrer"
    >
      {run.label}
    </a>
  );
}

/** Renders the org line, turning any run that carries an href into a link. */
function OrgLine({ stop }: { stop: JourneyStop }) {
  if (!stop.orgLine) return <>{stop.org}</>;
  return (
    <>
      {stop.orgLine.map((run) =>
        run.href ? (
          <a
            key={run.text}
            className="journey-org-link"
            href={run.href}
            target="_blank"
            rel="noreferrer"
          >
            {run.text}
          </a>
        ) : (
          <span key={run.text}>{run.text}</span>
        ),
      )}
    </>
  );
}

export default function JourneyArc({ reduced }: { reduced: boolean }) {
  const stops = useMemo(
    () =>
      [...educationJourney, ...professionalJourney].sort(
        (a, b) => Number(a.year) - Number(b.year),
      ),
    [],
  );
  const times = useMemo(
    () =>
      stops.map((_, i) =>
        tAtDistance(0.04 + (i * 0.92) / (stops.length - 1)),
      ),
    [stops],
  );
  const runway = useRef<HTMLDivElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const trail = useRef<SVGPathElement>(null),
    arm = useRef<SVGPathElement>(null),
    rest = useRef<SVGPathElement>(null),
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
      const p = point(t);
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
      arm.current?.setAttribute(
        "d",
        handPath(
          pivot.x,
          pivot.y,
          Math.atan2(p.y - pivot.y, p.x - pivot.x),
          Math.hypot(p.x - pivot.x, p.y - pivot.y),
        ),
      );
      nib.current?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      // Gears turn only as the hand moves — the movement is driven by scroll,
      // not by a timer, so a still page shows a still clock.
      svg.current?.style.setProperty("--journey-t", t.toFixed(5));
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
      <div className="drafting-sticky" data-jump-anchor>
        <div className="drafting-heading">
          <h2
            id="journey-title"
            className="section-heading"
          >
            A journey through time
          </h2>
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
              ref={svg}
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
                {/* Hour hand, fixed at four o'clock. The long hand is the one
                    that travels, so the hour hand is what states the time. */}
                <path
                  ref={rest}
                  d={handPath(pivot.x, pivot.y, Math.PI / 6, 96)}
                  fill="url(#draft-metal)"
                  stroke="#3c3018"
                  strokeWidth=".5"
                  opacity=".9"
                />
                <path
                  ref={arm}
                  d={handPath(
                    pivot.x,
                    pivot.y,
                    Math.atan2(start.y - pivot.y, start.x - pivot.x),
                    Math.hypot(start.x - pivot.x, start.y - pivot.y),
                  )}
                  fill="url(#draft-metal)"
                  stroke="#3c3018"
                  strokeWidth=".5"
                />
                <circle
                  cx={pivot.x}
                  cy={pivot.y}
                  r="15"
                  fill="url(#draft-flare)"
                />

                {/* Clock face. Sixty minute ticks with every fifth drawn long,
                    Roman numerals at the quarters, and a brass bezel. */}
                <g className="compass-rose" transform={`translate(${clock.cx} ${clock.cy})`}>
                  {/* Bezel: the two rings sit adjacent, with the minute track
                      running in the narrow band between them. */}
                  {/* Bezel: the two rings sit adjacent, with the minute track
                      running in the narrow band between them. */}
                  <circle r={clock.r} fill="none" stroke="var(--compass-ink)" strokeWidth="1.3" opacity=".55" />
                  <circle r={clock.r - 13} fill="none" stroke="var(--compass-ink)" strokeWidth="1" opacity=".42" />

                  {Array.from({ length: 60 }, (_, i) => {
                    const long = i % 5 === 0;
                    return (
                      <line
                        key={i}
                        x1="0"
                        y1={-(clock.r - 1)}
                        x2="0"
                        y2={-(clock.r - (long ? 12 : 6))}
                        stroke="var(--compass-ink)"
                        strokeWidth={long ? 1.5 : 0.6}
                        opacity={long ? 0.68 : 0.36}
                        transform={`rotate(${i * 6})`}
                      />
                    );
                  })}

                  {/* All twelve numerals around the rim, upright, plus rivets on
                      the bezel — the skeleton-clock treatment from the reference. */}
                  {["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"].map(
                    (label, i) => {
                      const a = ((i * 30 - 90) * Math.PI) / 180;
                      const rr = clock.r - 34;
                      return (
                        <text
                          key={label}
                          x={round2(Math.cos(a) * rr)}
                          y={round2(Math.sin(a) * rr + 7)}
                          textAnchor="middle"
                          fontSize={i % 3 === 0 ? 23 : 18}
                          letterSpacing="1"
                          fill="var(--compass-ink)"
                          opacity={i % 3 === 0 ? 0.66 : 0.44}
                        >
                          {label}
                        </text>
                      );
                    },
                  )}
                  {Array.from({ length: 12 }, (_, i) => {
                    const a = ((i * 30 - 90) * Math.PI) / 180;
                    const rr = clock.r - 6.5;
                    return (
                      <circle
                        key={i}
                        cx={round2(Math.cos(a) * rr)}
                        cy={round2(Math.sin(a) * rr)}
                        r="3.2"
                        fill="var(--gear-metal)"
                        opacity=".7"
                      />
                    );
                  })}

                  {/* The movement. */}
                  <g opacity=".62">
                    {GEARS.map((g) => (
                      <Gear key={`${g.cx}-${g.cy}`} {...g} />
                    ))}
                  </g>

                  <circle r="13" fill="#2c2416" stroke="#c2a367" strokeWidth="1.4" />
                  <circle r="4.5" fill="#e8d1a0" />
                </g>

                <circle cx={pivot.x} cy={pivot.y} r="5" fill="#fff3cb" />
                <path
                  d={`M ${pivot.x} ${pivot.y - 9} V ${pivot.y - 26}`}
                  stroke="url(#draft-metal)"
                  strokeWidth="7"
                />
              </g>
              <g ref={nib} transform={`translate(${start.x} ${start.y})`}>
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
            <div className="journey-detail-meta">
              <span className="journey-detail-badge">{stops[active].marker}</span>
              <span>{stops[active].period}</span>
            </div>
            {/* On the work stops the marker is the designation, so the title
                would repeat it — there the employer becomes the headline. */}
            {stops[active].company ? (
              <div className="journey-detail-lines">
                <h3>
                  <span className="journey-detail-key">Company -</span>{" "}
                  <OrgRun run={stops[active].company} />
                </h3>
                {stops[active].clients?.length ? (
                  <p>
                    <span className="journey-detail-key">Client -</span>{" "}
                    {stops[active].clients.map((client, i) => (
                      <span key={client.label}>
                        {i > 0 ? ", " : null}
                        <OrgRun run={client} />
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                <h3>{stops[active].title}</h3>
                <p className="journey-detail-org"><OrgLine stop={stops[active]} /></p>
              </>
            )}
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
