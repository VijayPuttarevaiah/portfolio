"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function Monologue({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current?.querySelectorAll(".monologue-word") ?? [],
        { opacity: 0.62 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "bottom 50%",
            scrub: 1,
          },
        },
      );
    });
    return () => media.revert();
  }, []);
  return (
    <p ref={ref} className="monologue">
      {text.split(" ").map((word, i) => (
        <span key={i} className="monologue-word">
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
