import { projects } from "@/content/resume";

/**
 * One box per project: what it is, what it is built with, and a link to the
 * code. The box itself is the link, so the whole card is the click target.
 */
export default function ProjectBoxes() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto max-w-6xl border-t border-[var(--border)] px-6 py-6 sm:px-8"
    >
      <h2 id="projects-title" className="section-heading">
        Projects
      </h2>

      <ul className="project-boxes">
        {projects.map((project) => (
          <li key={project.slug}>
            <a
              className="project-box"
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="project-box-name">{project.name}</span>
              <span className="project-box-blurb">{project.blurb}</span>
              <span className="project-box-summary">{project.summary}</span>

              <span className="project-box-stack">
                {project.stack.slice(0, 4).map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </span>

              <span className="project-box-cta">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
                </svg>
                {project.hrefLabel ?? "GitHub"}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
