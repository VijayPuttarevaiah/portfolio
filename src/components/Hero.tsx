import fs from "node:fs";
import path from "node:path";
import { person, stats } from "@/content/resume";
import CountUp from "./CountUp";
import Reveal from "./Reveal";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * The landing screen.
 *
 * Deliberately full-viewport and type-led: the name is set in the condensed
 * display face at poster scale, so the first thing on screen is a statement
 * rather than a paragraph. Everything below the fold is reached by scrolling,
 * and the scroll cue says so explicitly.
 */
export default function Hero() {
  // Only render the Resume button if the PDF is actually present. A dead
  // primary CTA is worse than no CTA; this makes the button appear on its
  // own the moment public/resume.pdf is added, with no code change.
  const resumeReady = fs.existsSync(
    path.join(process.cwd(), "public", "resume.pdf"),
  );

  const [first, ...rest] = person.name.split(" ");
  const last = rest.join(" ");

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <div className="hero-glow" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-28 sm:px-8">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            <span className="tl-live" aria-hidden="true" />
            {person.availability}
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="display t-hero mt-7 text-[var(--fg)]">
            <span className="block">{first}</span>
            <span className="gradient-text block">{last}</span>
          </h1>
        </Reveal>

        <Reveal delay={130}>
          <div className="mt-8 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
            <p className="display text-[1.6rem] leading-tight text-[var(--fg-muted)] sm:text-[2rem]">
              {person.headline}
            </p>
            <p className="max-w-xl text-lg leading-relaxed text-[var(--fg-muted)]">
              {person.tagline}
            </p>
          </div>
        </Reveal>

        <Reveal delay={190}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {resumeReady ? (
              <a
                href={person.resumeHref}
                className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(100deg, var(--h1), var(--h2))" }}
              >
                Resume
                <ArrowIcon />
              </a>
            ) : null}
            <a
              href={person.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-elevated)]"
            >
              GitHub
            </a>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className={
                resumeReady
                  ? "inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-elevated)]"
                  : "group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              }
              style={
                resumeReady
                  ? undefined
                  : { background: "linear-gradient(100deg, var(--h1), var(--h2))" }
              }
            >
              LinkedIn
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              Contact
            </a>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--border)] pt-9 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp
                    value={stat.value}
                    className="display block text-5xl sm:text-6xl"
                    style={{ color: `var(--h${(i % 5) + 1})` }}
                  />
                  <span className="mt-2 block text-sm leading-snug text-[var(--fg-muted)]">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <a
        href="#journey"
        className="scroll-cue group mx-auto mb-8 flex w-fit items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--fg-subtle)] transition-colors hover:text-[var(--fg)]"
      >
        Scroll to follow the journey
        <span className="scroll-cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
