import ProjectDeck from "./ProjectDeck";
import Section from "./Section";

/**
 * Projects, presented as a draggable deck.
 *
 * The deck itself is a client component; this stays a server component so the
 * section heading and intro render in the initial HTML.
 */
export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="04 — Selected work"
      title="Projects"
      intro="Four pieces of work chosen for what they demonstrate about engineering judgement rather than for breadth. Each states the problem first."
      tinted
    >
      <ProjectDeck />
    </Section>
  );
}
