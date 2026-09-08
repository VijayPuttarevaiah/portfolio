import { experience } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="03 — Experience"
      title="Where I've worked"
      intro="Three years of software engineering across enterprise retail and healthcare platforms, preceded by two years in transaction risk analysis at Amazon."
    >
      <ol className="space-y-14">
        {experience.map((role, index) => (
          <Reveal as="li" key={role.company} delay={index * 60}>
            <article className="grid gap-6 md:grid-cols-[13rem_1fr] md:gap-10">
              <div className="md:pt-1">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
                  {role.period}
                </p>
                <p className="mt-1.5 text-sm font-medium text-[var(--fg-muted)]">
                  {role.duration}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
                  {role.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  {role.companyUrl ? (
                    <a
                      href={role.companyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:decoration-[var(--accent)]"
                    >
                      {role.company}
                    </a>
                  ) : (
                    role.company
                  )}
                </p>

                {role.note ? (
                  <p className="mt-3 border-l-2 border-[var(--border-strong)] py-0.5 pl-3 text-sm italic leading-relaxed text-[var(--fg-subtle)]">
                    {role.note}
                  </p>
                ) : null}

                <p className="mt-4 text-base leading-relaxed text-[var(--fg-muted)]">
                  {role.context}
                </p>

                <div className="mt-6 space-y-7">
                  {role.engagements.map((engagement) => (
                    <div key={engagement.project}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="text-[0.95rem] font-semibold text-[var(--fg)]">
                          {engagement.project}
                        </h4>
                        {engagement.client ? (
                          <p className="text-sm text-[var(--fg-muted)]">
                            {engagement.clientUrl ? (
                              <a
                                href={engagement.clientUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:decoration-[var(--accent)]"
                              >
                                {engagement.client}
                              </a>
                            ) : (
                              engagement.client
                            )}
                          </p>
                        ) : null}
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
                          {engagement.period}
                        </p>
                      </div>

                      <ul className="mt-3 space-y-3">
                        {engagement.bullets.map((bullet) => (
                          <li
                            key={bullet.slice(0, 40)}
                            className="flex gap-3 text-[0.95rem] leading-relaxed text-[var(--fg-muted)]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
                  {role.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-[0.7rem] text-[var(--fg-subtle)]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
