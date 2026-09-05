import { educationJourney, professionalJourney, type JourneyStop } from "@/content/resume";
import BrandMark from "./BrandMark";
import Reveal from "./Reveal";
import Section from "./Section";
import TimelineSpine from "./TimelineSpine";

function Track({
  stops,
  label,
  hue,
}: {
  stops: JourneyStop[];
  label: string;
  hue: string;
}) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: `var(${hue})` }}
          aria-hidden="true"
        />
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-[var(--fg)]">
          {label}
        </h3>
      </div>

      <ol className="relative pl-10">
        <TimelineSpine className="left-[27px]" />

        {stops.map((stop, i) => {
          const isNext = stop.kind === "next";
          const isNow = stop.kind === "now";

          return (
            <Reveal as="li" key={`${stop.year}-${stop.title}`} delay={i * 60}>
              <div className="relative pb-12 last:pb-4">
                <span className="absolute -left-10 top-0 z-10">
                  {isNext ? (
                    <span className="tl-next-mark" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  ) : (
                    <BrandMark brand={stop.brand} label={stop.org} size={54} />
                  )}
                </span>

                <div className="pt-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span
                      className="display t-year"
                      style={{ color: `var(${hue})` }}
                    >
                      {stop.year}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${
                        isNext ? "border border-dashed" : ""
                      }`}
                      style={
                        isNext
                          ? { color: `var(${hue})`, borderColor: `var(${hue})` }
                          : { background: `var(${hue})`, color: "var(--bg)" }
                      }
                    >
                      {stop.marker}
                    </span>
                    {isNow ? <span className="tl-live" aria-hidden="true" /> : null}
                  </div>

                  <h4 className="display mt-2 text-2xl leading-tight text-[var(--fg)] sm:text-3xl">
                    {stop.title}
                  </h4>
                  <p className="mt-1.5 text-[0.95rem] font-medium text-[var(--fg-muted)]">
                    {stop.org}
                  </p>
                  <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                    {stop.period}
                  </p>
                  <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                    {stop.summary}
                  </p>
                  {stop.note ? (
                    <p className="mt-3 text-xs italic text-[var(--fg-subtle)]">
                      {stop.note}
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Two separate arcs, side by side on desktop.
 *
 * Education and work are deliberately not merged: the five-year gap between
 * the degrees is the shape of the story, and interleaving them buries it.
 */
export default function Journey() {
  return (
    <Section
      id="journey"
      eyebrow="01 — The arc"
      title="Two tracks, one direction"
      intro="An electrical engineering degree, five years in industry, then back for a computer science master's. The education and the work run on separate clocks."
      tinted
    >
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
        <Track stops={educationJourney} label="Education" hue="--h3" />
        <Track stops={professionalJourney} label="Professional" hue="--h1" />
      </div>

      <Reveal delay={140}>
        <div className="mt-14 border-t border-[var(--border)] pt-8 text-center">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
            Available from January 2027
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[var(--fg-muted)]">
            Open to a Winter 2027 co-op on either a 4 month or an 8 month term.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
