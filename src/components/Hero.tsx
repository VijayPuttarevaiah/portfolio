import { person, stats } from "@/content/resume";
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
  return (
    <section id="top" className="relative">
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            {person.location} · {person.workAuth}
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--fg)] sm:text-6xl">
            {person.name}
          </h1>
        </Reveal>

        <Reveal delay={110}>
          <p className="mt-4 text-xl font-medium text-[var(--accent)] sm:text-2xl">
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
            <a
              href={person.resumeHref}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition-opacity hover:opacity-90"
            >
              Resume
              <ArrowIcon />
            </a>
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
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-elevated)]"
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
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl font-semibold tracking-tight text-[var(--fg)]">
                    {stat.value}
                  </span>
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
