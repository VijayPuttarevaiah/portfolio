import { projects } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

function ExternalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="03 — Selected work"
      title="Projects"
      intro="Four pieces of work chosen for what they demonstrate about engineering judgement rather than for breadth. Each states the problem first."
      tinted
    >
      <div className="space-y-6">
        {projects.map((project, index) => (
          <Reveal key={project.name} delay={index * 60}>
            <article className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 transition-colors hover:border-[var(--border-strong)] sm:p-8">
              <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--fg-muted)]">
                    {project.blurb}
                  </p>
                </div>
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
                  >
                    {project.hrefLabel ?? "View"}
                    <ExternalIcon />
                  </a>
                ) : null}
              </header>

              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                    Problem
                  </dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                    {project.problem}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                    What I built
                  </dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                    {project.built}
                  </dd>
                </div>
                {project.status ? (
                  <div>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                      Engineering detail
                    </dt>
                    <dd className="mt-2 text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                      {project.status}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-7 flex flex-wrap gap-2 border-t border-[var(--border)] pt-6">
                {project.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-[0.72rem] font-medium text-[var(--accent)]"
                  >
                    {concept}
                  </span>
                ))}
              </div>

              <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-[0.7rem] text-[var(--fg-subtle)]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
