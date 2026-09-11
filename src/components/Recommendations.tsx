"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { recommendations, type Recommendation } from "@/content/resume";
import Section from "./Section";

/** Initials, for anyone whose headshot has not been added yet. */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

type Entry = Recommendation & { key: number };

function Card({
  position,
  entry,
  onMove,
  width,
  height,
}: {
  position: number;
  entry: Entry;
  onMove: (steps: number) => void;
  width: number;
  height: number;
}) {
  const isCenter = position === 0;

  return (
    <article
      onClick={() => onMove(position)}
      aria-hidden={!isCenter}
      className={`rec-card ${isCenter ? "is-center" : ""}`}
      style={{
        width,
        height,
        transform: `translate(-50%, -50%)
          translateX(${width * 0.72 * position}px)
          translateY(${isCenter ? -18 : position % 2 ? 14 : -14}px)
          rotate(${isCenter ? 0 : position % 2 ? 2 : -2}deg)`,
      }}
    >
      <header className="rec-head">
        <span className="rec-avatar">
          {entry.photo ? (
            <Image src={entry.photo} alt="" width={52} height={52} sizes="52px" />
          ) : (
            <span aria-hidden="true">{initials(entry.name)}</span>
          )}
        </span>
        <span>
          <span className="rec-name">{entry.name}</span>
          <span className="rec-title">{entry.title}</span>
        </span>
      </header>

      <blockquote className="rec-quote">{entry.quote}</blockquote>

      <footer className="rec-foot">
        {[entry.relationship, entry.date].filter(Boolean).join(" · ")}
      </footer>
    </article>
  );
}

/**
 * A staggered deck rather than a single quote: it holds two well and reads
 * better the more that arrive. Cards are verbatim — a recommendation is
 * someone else's words and is never trimmed to fit.
 */
export default function Recommendations() {
  const [list, setList] = useState<Entry[]>(() =>
    recommendations.map((r, i) => ({ ...r, key: i })),
  );
  const [size, setSize] = useState({ width: 460, height: 400 });

  useEffect(() => {
    const update = () => {
      const wide = window.matchMedia("(min-width: 720px)").matches;
      setSize(wide ? { width: 460, height: 400 } : { width: 290, height: 470 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const move = useCallback((steps: number) => {
    if (steps === 0) return;
    setList((prev) => {
      const next = [...prev];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = next.shift();
          if (!item) return prev;
          next.push({ ...item, key: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = next.pop();
          if (!item) return prev;
          next.unshift({ ...item, key: Math.random() });
        }
      }
      return next;
    });
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <Section
      id="recommendations"
      title="In their words."
      intro="Written on LinkedIn by people who managed me directly. Quoted in full, unedited."
    >
      <div className="rec-stage" style={{ height: size.height + 150 }}>
        {list.map((entry, index) => {
          const position =
            list.length % 2
              ? index - (list.length - 1) / 2
              : index - list.length / 2;
          return (
            <Card
              key={entry.key}
              entry={entry}
              position={position}
              onMove={move}
              width={size.width}
              height={size.height}
            />
          );
        })}

        {recommendations.length > 1 ? (
          <div className="rec-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous recommendation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next recommendation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {/* Every quote in full, for screen readers and anyone the deck does not reach. */}
      <ul className="sr-only">
        {recommendations.map((r) => (
          <li key={r.name}>
            {r.name}, {r.title}. {r.relationship}. {r.quote}
          </li>
        ))}
      </ul>
    </Section>
  );
}
