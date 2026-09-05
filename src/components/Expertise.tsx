import { skillGroups } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

const HUES = ["--h1", "--h2", "--h3", "--h4"] as const;

export default function Expertise() {
  const primary = skillGroups.filter((g) => g.emphasis === "primary");
  const secondary = skillGroups.filter((g) => g.emphasis === "secondary");

  return (
    <Section
      id="expertise"
      eyebrow="04 — Expertise"
      title="Technical expertise"
      intro="Weighted, not exhaustive. The first four groups are where I've spent professional time; the rest is supporting range."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {primary.map((group, index) => (
          <Reveal key={group.title} delay={index * 50}>
            <div
              className="h-full rounded-2xl border-2 p-6"
              style={{
                borderColor: `var(${HUES[index % HUES.length]})`,
                background: `var(${HUES[index % HUES.length]}-soft)`,
              }}
            >
              <h3
                className="text-sm font-bold uppercase tracking-[0.08em]"
                style={{ color: `var(${HUES[index % HUES.length]})` }}
              >
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border bg-[var(--bg)] px-2.5 py-1 text-[0.78rem] font-medium text-[var(--fg)]"
                    style={{ borderColor: `var(${HUES[index % HUES.length]})` }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-6 grid gap-x-10 gap-y-7 rounded-xl border border-[var(--border)] p-6 sm:grid-cols-2">
          {secondary.map((group) => (
            <div key={group.title}>
              <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                {group.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--fg-muted)]">
                {group.skills.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
