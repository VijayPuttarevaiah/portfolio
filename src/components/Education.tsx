import { education } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Education() {
  return (
    <Section
      id="education"
      eyebrow="06 — Education"
      title="Education"
    >
      <ol className="grid gap-6 sm:grid-cols-2">
        {education.map((entry, i) => (
          <Reveal key={entry.credential} delay={i * 70}>
            <li
              className="card-r h-full border-2 p-6 sm:p-7"
              style={{ borderColor: i === 0 ? "var(--h3)" : "var(--h2)" }}
            >
              <p
                className="font-mono text-[0.65rem] uppercase tracking-[0.16em]"
                style={{ color: i === 0 ? "var(--h3)" : "var(--h2)" }}
              >
                {entry.period}
              </p>
              <p className="mt-3 text-lg font-semibold leading-snug text-[var(--fg)]">
                {entry.credential}
              </p>
              <p className="mt-1.5 text-sm text-[var(--fg-muted)]">
                {entry.institution} · {entry.location}
              </p>
              <p className="mt-3 text-sm font-medium text-[var(--fg-muted)]">
                {entry.detail}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
