"use client";

import type { ReactNode } from "react";
import { jumpToSection } from "./cinema/motionState";

/**
 * An in-page link that lands instantly and clears the sticky header.
 * A real <a href="#id"> underneath, so it still opens in a new tab, still
 * shows its target in the status bar, and still works without JavaScript.
 */
export default function SectionLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        jumpToSection(id);
      }}
    >
      {children}
    </a>
  );
}
