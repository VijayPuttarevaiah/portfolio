import { certifications, leadership } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

const HUES = ["--h1", "--h2", "--h4"] as const;

/**
 * Certifications and leadership, split out of Education. They are a
 * different kind of credential and were competing for attention there.
 */
export default function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="07 — Certifications"
      title="Certifications & leadership"
      tinted
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {certifications.map((cert, i) => {
          const hue = HUES[i % HUES.length];
          const inProgress = Boolean(cert.status);
          const body = (
            <div
              className={`card-r flex h-full flex-col justify-between border-2 p-6 transition-shadow hover:shadow-xl ${
                inProgress ? "border-dashed" : ""
              }`}
              style={{ borderColor: `var(${hue})` }}
            >
              <div>
                <span
                  className="font-mono text-[0.65rem] uppercase tracking-[0.16em]"
                  style={{ color: `var(${hue})` }}
                >
                  {inProgress ? cert.status : "Certified"}
                </span>
                <p className="mt-3 text-base font-semibold leading-snug text-[var(--fg)]">
                  {cert.name}
                </p>
              </div>
              {cert.href ? (
                <span
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: `var(${hue})` }}
                >
                  Verify
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              ) : null}
            </div>
          );

          return (
            <Reveal key={cert.name} delay={i * 60}>
              {cert.href ? (
                <a href={cert.href} target="_blank" rel="noreferrer noopener" className="block h-full">
                  {body}
                </a>
              ) : (
                body
              )}
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={160}>
        <div className="card-r mt-6 border border-[var(--border)] p-6 sm:p-7">
          <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            Leadership
          </h3>
          <p className="mt-3 text-base font-semibold text-[var(--fg)]">
            {leadership.role}, {leadership.organization}
          </p>
          <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
            {leadership.detail}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
