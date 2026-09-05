import { person } from "@/content/resume";
import Reveal from "./Reveal";

export default function Contact() {
  const links = [
    { label: "Email", value: person.email, href: `mailto:${person.email}` },
    { label: "Phone", value: person.phone, href: `tel:${person.phone.replace(/[^\d]/g, "")}` },
    { label: "GitHub", value: person.githubHandle, href: person.github },
    { label: "LinkedIn", value: person.linkedinHandle, href: person.linkedin },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            07 — Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl"
          >
            Open to software engineering roles.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--fg-muted)]">
            {person.availability}, and {person.workAuth.toLowerCase()}. The
            fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <a
            href={`mailto:${person.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)] transition-opacity hover:opacity-90"
          >
            {person.email}
          </a>
        </Reveal>

        <Reveal delay={130}>
          <dl className="mt-14 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-[var(--border)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((link) => (
              <div key={link.label}>
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                  {link.label}
                </dt>
                <dd className="mt-2">
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noreferrer noopener"
                        : undefined
                    }
                    className="text-sm text-[var(--fg)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                  >
                    {link.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
