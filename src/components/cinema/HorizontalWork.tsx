"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/content/resume";
export default function HorizontalWork() {
  const runway = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1000px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
      () => {
        const element = runway.current,
          rail = track.current;
        if (!element || !rail) return;
        element.classList.add("work-active");
        const distance = () =>
          Math.max(0, rail.scrollWidth - window.innerWidth);
        const tween = gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        const focused = (event: FocusEvent) => {
          const card = (event.target as HTMLElement).closest<HTMLElement>(
            ".work-shot",
          );
          const trigger = tween.scrollTrigger;
          if (card && trigger)
            window.scrollTo({
              top: trigger.start + Math.min(distance(), card.offsetLeft),
              behavior: "instant",
            });
        };
        rail.addEventListener("focusin", focused);
        return () => {
          rail.removeEventListener("focusin", focused);
          element.classList.remove("work-active");
        };
      },
    );
    return () => media.revert();
  }, []);
  return (
    <section
      id="projects"
      ref={runway}
      className="work-runway"
      aria-labelledby="projects-heading"
    >
      <div className="work-heading">
        <p className="cinema-label">03 / SELECTED WORK</p>
        <h2 id="projects-heading" className="display">
          Systems in motion.
        </h2>
        <span>SCROLL TO EXPLORE →</span>
      </div>
      <div className="work-track" ref={track}>
        {projects.map((project, i) => (
          <article className="work-shot" key={project.name}>
            <div className="work-visual work-poster">
              <div className="work-poster-grid" aria-hidden="true" />
              <span className="work-number" aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className="display">{project.name}</h3>
              <span className="work-image-caption">
                ENGINEERING / {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="work-summary">
              <div>
                <p className="work-blurb">{project.blurb}</p>
                <p className="work-problem">{project.problem}</p>
              </div>
              <div>
                <ul className="work-stack">
                  {project.stack.slice(0, 5).map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="work-source"
                >
                  {project.hrefLabel ?? "View project"} ↗
                </a>
              </div>
            </div>
            <details className="work-details" data-lenis-prevent>
              <summary>Engineering details & project status</summary>
              <p>{project.built}</p>
              <p>{project.status}</p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
