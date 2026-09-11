import { involvement } from "@/content/resume";
import BrandMark from "./BrandMark";
import Reveal from "./Reveal";
import Section from "./Section";

/**
 * Everything outside the job. Kept apart from Certifications, which should
 * only hold credentials someone else issued and anyone can verify.
 */
export default function Involvement() {
  return (
    <Section
      id="involvement"
      title="Not all of it is code."
    >
      <ul className="involve-list">
        {involvement.map((entry, i) => (
          <Reveal as="li" key={`${entry.organization}-${entry.role}`} delay={i * 70}>
            <article className="involve-row">
              <span className="involve-mark">
                <BrandMark brand={entry.brand} label={entry.organization} size={120} />
              </span>
              <div>
                <h3 className="involve-role">{entry.role}</h3>
                <p className="involve-org">{entry.organization}</p>
                <ul className="involve-bullets">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 40)}>
                      <span aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
