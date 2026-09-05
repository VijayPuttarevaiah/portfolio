import { certifications, education, leadership } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Education() {
  return (
    <Section
      id="education"
      eyebrow="05 — Credentials"
      title="Education & certifications"
      tinted
    >
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            Education
          </h3>
          <ol className="mt-5 space-y-7">
            {education.map((entry) => (
              <li key={entry.credential}>
                <p className="text-base font-medium leading-snug text-[var(--fg)]">
                  {entry.credential}
                </p>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  {entry.institution} · {entry.location}
                </p>
                <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                  {entry.period}
                </p>
                <p className="mt-1.5 text-sm text-[var(--fg-muted)]">
                  {entry.detail}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={80}>
          <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            Certifications
          </h3>
          <ul className="mt-5 space-y-3">
            {certifications.map((cert) => (
              <li
                key={cert.name}
                className="flex flex-wrap items-baseline gap-x-2 text-sm text-[var(--fg-muted)]"
              >
                {cert.href ? (
                  <a
                    href={cert.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[var(--fg)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                  >
                    {cert.name}
                  </a>
                ) : (
                  <span className="text-[var(--fg)]">{cert.name}</span>
                )}
                {cert.status ? (
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                    {cert.status}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            Leadership
          </h3>
          <p className="mt-4 text-sm font-medium text-[var(--fg)]">
            {leadership.role}, {leadership.organization}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
            {leadership.detail}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
