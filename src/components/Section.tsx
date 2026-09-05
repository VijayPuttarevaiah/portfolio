import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id: string;
  /** Small uppercase eyebrow, e.g. "02 — Experience". */
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  /** Subtle alternating background to separate long sections. */
  tinted?: boolean;
};

export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  tinted = false,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-24 border-t border-[var(--border)] ${
        tinted ? "bg-[var(--bg-elevated)]" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            {eyebrow}
          </p>
          <h2
            id={`${id}-heading`}
            className="display t-section mt-4 text-[var(--fg)]"
          >
            {title}
          </h2>
          {intro ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--fg-muted)]">
              {intro}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
