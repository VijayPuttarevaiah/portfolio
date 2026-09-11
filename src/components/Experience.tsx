import Image from "next/image";
import BrandMark from "./BrandMark";
import { achievements, experience } from "@/content/resume";
import Reveal from "./Reveal";

const BRAND: Record<string, string> = {
  Wipro: "wipro",
  "Acuver Consulting": "acuver",
  Amazon: "amazon",
};

/**
 * Bullets carry ** ** around the metrics and technology names they want
 * emphasised. Opening verbs are deliberately left plain.
 */
function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Trophy mark shown beside each award. */
function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 4h10v5a5 5 0 0 1-10 0V4Z M7 5H4.5a2.5 2.5 0 0 0 2.5 4 M17 5h2.5a2.5 2.5 0 0 1-2.5 4 M12 14v3 M9 20h6 M10 17h4l.6 3h-5.2l.6-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="mx-auto max-w-6xl border-t border-[var(--border)] px-6 py-14 sm:px-8"
    >
      <h2 id="experience-title" className="section-heading">
        Professional experience
      </h2>

      <ol className="mt-10 space-y-16">
        {experience.map((role, index) => {
          const awards = achievements.filter(
            (award) => "company" in award && award.company === role.company,
          );
          return (
          <Reveal as="li" key={role.company} delay={index * 60}>
            {/* Logo, dates and tenure sit in the right rail: as a left column
                they left most of that width empty down the length of the role. */}
            <article className="experience-story">
              {/* The office photo is the card's backdrop, masked and dimmed. */}
              {role.photo ? (
                <figure className="experience-location">
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src={role.photo.src}
                      alt={role.photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 1100px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption>{role.photo.caption}</figcaption>
                </figure>
              ) : null}

              <div className="experience-row">
              <div className="experience-meta">
                <div className="experience-brand">
                  <BrandMark brand={BRAND[role.company] ?? "amazon"} label={role.company} size={84} />
                </div>
                <p className="experience-period">{role.period}</p>
                <p className="experience-duration">{role.duration}</p>
              </div>

              <div className="experience-body">
                <h3 className="experience-role">{role.title}</h3>
                <p className="experience-company">
                  {role.companyUrl ? (
                    <a href={role.companyUrl} target="_blank" rel="noreferrer noopener">
                      {role.company}
                    </a>
                  ) : (
                    role.company
                  )}
                </p>

                <ul className="experience-stack">
                  {role.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>

                {role.note ? <p className="experience-note">{role.note}</p> : null}

                <div className="mt-7 space-y-7">
                  {role.engagements.map((engagement) => (
                    <div key={engagement.project}>
                      <div className="experience-project">
                        <h4>
                          <span className="experience-key">Project Name:</span>{" "}
                          {engagement.project}
                        </h4>
                        {engagement.client ? (
                          <p className="experience-client">
                            <span className="experience-key">, Client:</span>{" "}
                            {engagement.clientUrl ? (
                              <a href={engagement.clientUrl} target="_blank" rel="noreferrer noopener">
                                {engagement.client}
                              </a>
                            ) : (
                              engagement.client
                            )}
                          </p>
                        ) : null}
                        <p className="experience-engagement-period">{engagement.period}</p>
                      </div>

                      <ul className="experience-bullets">
                        {engagement.bullets.map((bullet) => (
                          <li key={bullet.slice(0, 40)}>
                            <span aria-hidden="true" />
                            <span>
                              <Emphasis text={bullet} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {awards.length ? (
                  <div className="experience-recognition">
                    <h4>Recognition</h4>
                    <ul>
                      {awards.map((award) => (
                        <li key={award.name}>
                          <TrophyIcon />
                          <span>{award.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              </div>
            </article>
          </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
