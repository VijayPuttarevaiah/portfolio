import { about } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function About() {
  return (
    <Section id="about" eyebrow="01 — About" title="Background" tinted>
      <div className="grid gap-12 md:grid-cols-[1.6fr_1fr] md:gap-16">
        <Reveal className="space-y-5">
          {about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-base leading-relaxed text-[var(--fg-muted)]"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={80}>
          <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            Currently interested in
          </h3>
          <ul className="mt-5 space-y-3">
            {about.interests.map((interest) => (
              <li
                key={interest}
                className="flex gap-3 text-sm leading-relaxed text-[var(--fg-muted)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] h-px w-3 shrink-0 bg-[var(--border-strong)]"
                />
                {interest}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
