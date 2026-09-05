"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** e.g. "3+", "5", "3.88", "85%" — digits animate, everything else is kept. */
  value: string;
  className?: string;
  style?: React.CSSProperties;
  durationMs?: number;
};

/** Pull the first number out of a label, keeping whatever wraps it. */
function parse(value: string) {
  const match = value.match(/^(\D*)([\d.]+)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const target = Number.parseFloat(digits);
  if (!Number.isFinite(target)) return null;
  const decimals = digits.includes(".") ? digits.split(".")[1]!.length : 0;
  return { prefix, target, suffix, decimals };
}

/**
 * Counts a number up when it first scrolls into view, once.
 *
 * Falls back to the literal string if the value has no number in it, and
 * skips the animation entirely under prefers-reduced-motion — in both cases
 * the final value is what renders, so nothing is ever missing.
 */
export default function CountUp({
  value,
  className,
  style,
  durationMs = 1400,
}: Props) {
  // Memoised deliberately. `parse` returns a fresh object, and this value is
  // an effect dependency — without this the effect tore down and restarted on
  // every animation frame, cancelling itself and leaving the counter stuck
  // near zero instead of reaching its target.
  const parsed = useMemo(() => parse(value), [value]);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() =>
    parsed ? `${parsed.prefix}0${parsed.suffix}` : value,
  );

  useEffect(() => {
    if (!parsed) return;
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    const settle = () =>
      setDisplay(
        `${parsed.prefix}${parsed.target.toFixed(parsed.decimals)}${parsed.suffix}`,
      );

    if (reduced || typeof IntersectionObserver === "undefined") {
      settle();
      return;
    }

    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / durationMs, 1);
      // easeOutExpo — fast then settles, reads as confident rather than slow
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = parsed.target * eased;
      setDisplay(
        `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`,
      );
      if (t < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [parsed, durationMs]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
