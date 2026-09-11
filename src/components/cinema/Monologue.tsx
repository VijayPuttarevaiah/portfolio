"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function Monologue({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current?.querySelectorAll(".monologue-word") ?? [],
        { opacity: 0.72 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            // Resolves by the time the paragraph is fully in view, so a jump
            // straight to this section lands on finished text rather than on
            // words still catching up. The long scrub did that catching-up
            // visibly, which read as the section loading late.
            start: "top 95%",
            end: "bottom 80%",
            scrub: 0.3,
          },
        },
      );
    });
    return () => media.revert();
  }, []);
  return (
    <p ref={ref} className={`monologue ${className}`.trim()}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="monologue-word">
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
