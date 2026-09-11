import { education } from "@/content/resume";
import BrandMark from "./BrandMark";
import Reveal from "./Reveal";
import Section from "./Section";

/**
 * Same row rhythm as Certifications: mark, then the record, so the two
 * credential sections read as one system rather than two layouts.
 */
export default function Education() {
  return (
    <Section id="education" title="Education">
      <ul className="record-rows">
        {education.map((entry, i) => (
          <Reveal as="li" key={entry.credential} delay={i * 70}>
            <article className="record-row">
              <span className="record-mark">
                <BrandMark
                  brand={entry.institution.includes("Dalhousie") ? "dalhousie" : "nie"}
                  label={entry.institution}
                  size={120}
                />
              </span>

              <span className="record-body">
                <span className="record-name">{entry.credential}</span>
                <span className="record-blurb">
                  {entry.institution} · {entry.location}
                </span>
                <span className="record-note">{entry.detail}</span>
                {"coursework" in entry && entry.coursework.length ? (
                  <>
                  <span className="record-coursework-label">Coursework</span>
                  <ul className="record-coursework">
                    {entry.coursework.map((course) => (
                      <li key={course}>
                        <span aria-hidden="true" />
                        {course}
                      </li>
                    ))}
                  </ul>
                  </>
                ) : null}
              </span>

              <span className="record-period">{entry.period}</span>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
