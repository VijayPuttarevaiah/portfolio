import { journey, type JourneyKind } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

/** One hue per stop, cycling; "now" and "next" override to the accent. */
const HUES = ["--h1", "--h2", "--h3", "--h4", "--h5"] as const;

const KIND_LABEL: Record<JourneyKind, string> = {
  education: "Education",
  work: "Work",
  now: "Current",
  next: "Target",
};

/**
 * The whole arc on one spine: where it started, where it is, where it's
 * going. Alternates left/right on desktop so each stop gets visual weight;
 * collapses to a single left spine on mobile.
 *
 * The final "next" stop is a target the copy frames as "seeking". It is
 * rendered hollow and dashed so nobody reads it as a role already held.
 */
export default function Journey() {
  return (
    <Section
      id="journey"
      eyebrow="01 — The arc"
      title="Where it started, where it is, where it's going"
      intro="Electrical engineering degree to enterprise backend systems to a graduate degree in computer science — and what comes next."
      tinted
    >
      <ol className="relative">
        {/* spine: left on mobile, centred on md+ */}
        <div
          aria-hidden="true"
          className="tl-spine left-[7px] md:left-1/2 md:-translate-x-1/2"
        />

        {/* START cap */}
        <li className="relative mb-10 list-none">
          <span
            aria-hidden="true"
            className="tl-cap left-0 md:left-1/2 md:-translate-x-1/2"
            style={{ ["--dot" as string]: "var(--h1)" }}
          />
          <p className="ml-8 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--fg-subtle)] md:ml-0 md:text-center">
            Start · 2015
          </p>
        </li>

        {journey.map((stop, i) => {
          const hue =
            stop.kind === "now" || stop.kind === "next"
              ? "--accent"
              : HUES[i % HUES.length];
          const right = i % 2 === 1;
          const isNow = stop.kind === "now";
          const isNext = stop.kind === "next";

          return (
            <Reveal as="li" key={`${stop.year}-${stop.title}`} delay={i * 50}>
              <div className="relative grid pb-12 last:pb-0 md:grid-cols-2 md:gap-x-16">
                {/* dot on the spine */}
                <span
                  aria-hidden="true"
                  className={`tl-dot left-0 top-2 md:left-1/2 md:-translate-x-1/2 ${
                    isNow ? "tl-now" : ""
                  } ${isNext ? "tl-next" : ""}`}
                  style={{ ["--dot" as string]: `var(${hue})` }}
                />

                {/* year, opposite side on desktop */}
                <p
                  className={`hidden md:block md:pt-1 ${
                    right ? "md:order-1 md:text-right" : "md:order-2 md:text-left"
                  }`}
                >
                  <span
                    className="font-display text-5xl font-bold tracking-tight"
                    style={{ color: `var(${hue})`, opacity: 0.9 }}
                  >
                    {stop.year}
                  </span>
                </p>

                {/* card */}
                <article
                  className={`ml-8 md:ml-0 ${
                    right ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <div
                    className={`card-r border-2 p-6 sm:p-7 ${
                      isNext ? "border-dashed bg-transparent" : "bg-[var(--bg-elevated)]"
                    }`}
                    style={{ borderColor: `var(${hue})` }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          background: isNext ? "transparent" : `var(${hue})`,
                          color: isNext ? `var(${hue})` : "var(--bg)",
                          border: isNext ? `1px dashed var(${hue})` : "none",
                        }}
                      >
                        {stop.marker}
                      </span>
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                        {KIND_LABEL[stop.kind]}
                      </span>
                      <span
                        className="font-display text-base font-bold md:hidden"
                        style={{ color: `var(${hue})` }}
                      >
                        {stop.year}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--fg)] sm:text-xl">
                      {stop.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[var(--fg-muted)]">
                      {stop.org}
                    </p>
                    <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                      {stop.period}
                    </p>

                    <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                      {stop.summary}
                    </p>

                    {stop.note ? (
                      <p className="mt-3 text-xs italic text-[var(--fg-subtle)]">
                        {stop.note}
                      </p>
                    ) : null}
                  </div>
                </article>
              </div>
            </Reveal>
          );
        })}

        {/* END cap — the arc terminates here, deliberately open-ended */}
        <li className="relative mt-2 list-none">
          <span
            aria-hidden="true"
            className="tl-cap tl-cap-end left-0 md:left-1/2 md:-translate-x-1/2"
            style={{ ["--dot" as string]: "var(--accent)" }}
          />
          <div className="ml-8 md:ml-0 md:text-center">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
              End of the road so far
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--fg-muted)]">
              Ten years from an engineering degree to production backend work
              to a graduate degree. The next stop is open — that is what the
              dashed marker above is for.
            </p>
          </div>
        </li>
      </ol>
    </Section>
  );
}
