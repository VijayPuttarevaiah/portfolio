"use client";

import { useCallback, useSyncExternalStore } from "react";

type Mode = "light" | "dark";

/** Local notifier so a click re-reads the snapshot immediately. */
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
  };
}

/** Effective theme: an explicit choice if one is set, else the OS preference. */
function getSnapshot(): Mode {
  const explicit = document.documentElement.dataset.theme as Mode | undefined;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** null on the server so the icon renders nothing until the theme is known. */
function getServerSnapshot(): Mode | null {
  return null;
}

/**
 * Light/dark toggle. First paint is handled by an inline script in layout.tsx,
 * so there is no flash of the wrong theme; this only reads and flips it.
 *
 * Uses useSyncExternalStore rather than useEffect + setState — the theme lives
 * in the DOM and the OS, which is external state by definition.
 */
export default function ThemeToggle() {
  const mode = useSyncExternalStore<Mode | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    const next: Mode = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing or blocked storage — the toggle still works for this
      // page view, it just will not be remembered.
    }
    emit();
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
    >
      {mode === null ? null : mode === "dark" ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 13.2A8.2 8.2 0 1 1 10.8 4a6.4 6.4 0 0 0 9.2 9.2Z" />
        </svg>
      )}
    </button>
  );
}
