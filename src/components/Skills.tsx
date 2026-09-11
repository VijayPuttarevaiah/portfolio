"use client";

import { useState } from "react";
import { skills } from "@/content/resume";

/**
 * Card grid with a clamped first view and a Load More reveal, following the
 * reference component's structure. Built on the site's own tokens rather than
 * shadcn's — this project has no `cn`, Card, Button or Icons primitives, and
 * pulling in radix + cva for one section would add three dependencies to style
 * six cards.
 */
const INITIAL = 6;

export default function Skills() {
  const [showAll, setShowAll] = useState(false);
  const hidden = skills.length - INITIAL;
  const shown = showAll ? skills : skills.slice(0, INITIAL);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="mx-auto max-w-6xl border-t border-[var(--border)] px-6 py-14 sm:px-8"
    >
      <h2
        id="skills-title"
        className="section-heading"
      >
        Skills
      </h2>
      <p className="skills-intro">
        The stack behind the work, grouped the way I would explain it in an
        interview.
      </p>

      <div className={`skills-wrap${showAll || hidden <= 0 ? "" : " is-clamped"}`}>
        <ul className="skills-grid">
          {shown.map((group) => (
            <li key={group.category} className="skill-card">
              <h3 className="skill-card-title">{group.category}</h3>
              <ul className="skill-chips">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {!showAll && hidden > 0 ? (
          <div className="skills-more">
            <button type="button" onClick={() => setShowAll(true)}>
              Show {hidden} more
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
