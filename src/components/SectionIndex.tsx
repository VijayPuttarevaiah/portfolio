"use client";

import { useCallback, useMemo } from "react";
import { navItems } from "@/content/resume";
import TableOfContent, { type TableOfContentItem } from "./ui/table-of-content";
import { jumpToSection } from "./cinema/motionState";

/** One line per section, so the preview card says something worth reading. */
const BLURBS: Record<string, string> = {
  about: "Three and a half years of backend work, and what I care about in a system.",
  skills: "Languages, frameworks, cloud and tooling, grouped by kind.",
  journey: "2015 to now, as a compass sweeping the years that got me here.",
  experience: "Acuver, Wipro and Amazon — grouped by engagement, with the client named.",
  education: "A computer science master's at Dalhousie, and the engineering degree before it.",
  projects: "Six builds, each with its own case study page.",
  certifications: "AWS and Linux Foundation credentials, each verifiable on Credly.",
  involvement: "Student Representative at the Dalhousie Machine Learning Society.",
  recommendations: "Written on LinkedIn by people who managed me directly.",
  contact: "Email, phone, GitHub and LinkedIn — whichever is easier.",
};

/**
 * A scrubbable index of the page, fixed to the left edge on wide screens.
 * Selection previews as you scrub; only a commit — pointer release or Enter —
 * actually navigates, so passing over a section never yanks the page.
 */
export default function SectionIndex() {
  const items = useMemo<TableOfContentItem[]>(
    () =>
      navItems.map((item) => ({
        id: item.id,
        title: item.label,
        description: BLURBS[item.id] ?? "",
      })),
    [],
  );

  const onCommit = useCallback(
    (index: number) => {
      const target = navItems[index];
      if (!target) return;
      jumpToSection(target.id);
    },
    [],
  );

  return (
    <div className="section-index" aria-hidden={false}>
      <TableOfContent items={items} label="Jump to a section" onCommit={onCommit} />
    </div>
  );
}
