"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types each role out, holds it, deletes it, moves to the next. The first role
 * is always in the DOM for assistive tech so a screen reader gets a stable
 * title instead of a stream of half-typed words. Reduced motion pins the first.
 */
export default function RotatingTitle({
  roles,
  className,
}: {
  roles: readonly string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [still, setStill] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => {
        setStill(true);
        setCount(roles[0].length);
      }, 0);
      return () => window.clearTimeout(id);
    }
    const word = roles[index];
    const delay = erasing ? 38 : count === word.length ? 1600 : 72;
    timer.current = window.setTimeout(() => {
      if (!erasing && count < word.length) setCount(count + 1);
      else if (!erasing) setErasing(true);
      else if (count > 0) setCount(count - 1);
      else {
        setErasing(false);
        setIndex((i) => (i + 1) % roles.length);
      }
    }, delay);
    return () => window.clearTimeout(timer.current);
  }, [count, erasing, index, roles]);

  const word = roles[still ? 0 : index];
  // Two-tone, as before: the first word plain, the trailing word in accent.
  const split = word.lastIndexOf(" ") + 1;
  const typed = word.slice(0, count);
  const lead = typed.slice(0, Math.min(count, split));
  const rest = count > split ? typed.slice(split) : "";

  return (
    <span className={className}>
      <span aria-hidden="true">{lead}</span>
      <span className="type-hl" aria-hidden="true">
        {rest}
      </span>
      <span className="type-caret" aria-hidden="true" />
      <span className="sr-only">{roles[0]}</span>
    </span>
  );
}
