import Image from "next/image";
import { person, stats } from "@/content/resume";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import CinemaMotion from "./CinemaMotion";
import TitleSequence from "./cinema/TitleSequence";

export default function Hero() {
  return (
    <>
      <section id="top" className="cinema-hero" aria-labelledby="hero-title">
        <CinemaMotion />
        <div className="cinema-grid" aria-hidden="true" />
        <div className="cinema-kicker">
          <span className="tl-live" /> {person.availability}
        </div>
        <div className="cinema-stage">
          <div className="cinema-edition" aria-hidden="true">
            PORTFOLIO — 2026
            <br />
            BACKEND / CLOUD / PLATFORM
          </div>
          <TitleSequence />
          <div className="cinema-portrait">
            <Image
              src="/photos/vijay-cinematic-closeup.webp"
              alt="Vijay Puttarevaiah wearing black sunglasses"
              fill
              sizes="(max-width: 640px) 180px, 260px"
              preload
              fetchPriority="high"
              className="cinema-photo"
            />
          </div>
          <div className="cinema-orbit" aria-hidden="true" />
          <p className="cinema-role">
            {person.headline}
            <span>Built to keep running.</span>
          </p>
          <a href="#projects" className="cinema-work">
            Explore my work <span aria-hidden="true">↗</span>
          </a>
          <div className="cinema-coordinate" aria-hidden="true">
            BASED IN HALIFAX, CANADA
            <br />
            44.6488° N / 63.5752° W
          </div>
        </div>
        <div className="cinema-bottom">
          <a href="#journey">
            Scroll to explore <span aria-hidden="true">↓</span>
          </a>
          <span>ENGINEERING WITH INTENT.</span>
          <a href={person.github} target="_blank" rel="noreferrer noopener">
            GitHub ↗
          </a>
        </div>
      </section>
      <div className="cinema-intro mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <Reveal>
          <p className="max-w-3xl text-xl leading-relaxed text-[var(--fg-muted)]">
            {person.tagline}
          </p>
        </Reveal>
        <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-[var(--border)] pt-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm text-[var(--fg-muted)]">{stat.label}</dt>
              <dd>
                <CountUp
                  value={stat.value}
                  className="display mt-3 block text-6xl text-[var(--accent)]"
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
