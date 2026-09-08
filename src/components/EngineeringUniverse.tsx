import Reveal from "./Reveal";

const technologies = [
  { name: "Java", detail: "THE FOUNDATION" },
  { name: "Spring Boot", detail: "SERVICES THAT SHIP" },
  { name: "AWS", detail: "BUILT FOR THE CLOUD" },
  { name: "Docker", detail: "REPEATABLE BY DESIGN" },
  { name: "Kubernetes", detail: "RUNNING AT SCALE" },
  { name: "REST APIs", detail: "SYSTEMS, CONNECTED" },
];

export default function EngineeringUniverse() {
  return (
    <section id="universe" className="universe-runway" aria-labelledby="universe-title">
      <div className="universe-scene">
        <div className="universe-heading"><p className="cinema-label">01 / INSIDE MY ENGINEERING WORLD</p><h2 id="universe-title" className="display">Behind every experience.<br /><span className="serif-accent">A system that works.</span></h2></div>
        <div className="universe-stage">
          <div className="universe-ring universe-ring-one" aria-hidden="true" />
          <div className="universe-ring universe-ring-two" aria-hidden="true" />
          <div className="universe-core" aria-hidden="true"><span>VP</span><small>BUILD. SHIP. REFINE.</small></div>
          <ul className="universe-technologies">{technologies.map((tech, index) => <li key={tech.name} className={`universe-tech universe-tech-${index}`}><span>{tech.name}</span><small>{tech.detail}</small></li>)}</ul>
        </div>
        <Reveal className="universe-caption"><p>Backend services. Cloud infrastructure. Production reliability.</p><a href="#expertise">Explore the full toolkit <span aria-hidden="true">↗</span></a></Reveal>
      </div>
    </section>
  );
}
