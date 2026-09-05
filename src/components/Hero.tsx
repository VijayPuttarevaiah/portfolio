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

export default function Hero() {
  // Only render the Resume button if the PDF is actually present. A dead
  // primary CTA is worse than no CTA; this makes the button appear on its
  // own the moment public/resume.pdf is added, with no code change.
  const resumeReady = fs.existsSync(
    path.join(process.cwd(), "public", "resume.pdf"),
  );

  return (
    <section id="top" className="relative isolate">
      <div className="hero-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            {person.availability}
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--fg)] sm:text-6xl">
            {person.name}
          </h1>
        </Reveal>

        <Reveal delay={110}>
          <p className="gradient-text mt-4 text-xl font-semibold sm:text-2xl">
            {person.headline}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)]">
            {person.tagline}
          </p>
        </Reveal>

        <Reveal delay={210}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
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
              href={`mailto:${person.email}`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              Contact
            </a>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--border)] pt-10 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp
                    value={stat.value}
                    className="block font-display text-4xl font-bold tracking-tight sm:text-5xl"
                    style={{ color: `var(--h${(i % 5) + 1})` }}
                  />
                  <span className="mt-1.5 block text-sm leading-snug text-[var(--fg-muted)]">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
