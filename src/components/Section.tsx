import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
  /** Subtle alternating background to separate long sections. */
  tinted?: boolean;
};

export default function Section({
  id,
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
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <h2 id={`${id}-heading`} className="section-heading">
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
