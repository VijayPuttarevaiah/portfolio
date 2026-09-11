import { about, stats } from "@/content/resume";
import Reveal from "./Reveal";
import SectionLink from "./SectionLink";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The lead paragraph with the two tenures bolded, everything else plain. */
function Lead({ text, emphasis }: { text: string; emphasis: readonly string[] }) {
  const parts = text.split(new RegExp(`(${emphasis.map(escape).join("|")})`, "g"));
  return (
    <p className="about-lead">
      {parts.map((part, i) =>
        emphasis.includes(part) ? <strong key={i}>{part}</strong> : part,
      )}
    </p>
  );
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-6xl border-t border-[var(--border)] px-6 py-10 sm:px-8">
      <h2 id="about-title" className="section-heading">
        About me
      </h2>

      <div className="about-grid mt-6">
        <div className="about-story">
          <Lead text={about.lead} emphasis={about.leadEmphasis} />
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="about-aside">
          <Reveal className="focus-card">
            <h3 className="focus-card-label">Current focus</h3>
            <ul className="focus-list">
              {about.interests.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </Reveal>

          <ul className="stat-row">
            {stats.map((stat) => (
              <li key={stat.label}>
                <SectionLink id={stat.href} className="stat-card">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </SectionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
