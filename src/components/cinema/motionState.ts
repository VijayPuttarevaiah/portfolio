/** Mutable animation bridge: hot frame values never trigger React renders. */
export const motionState = {
  x: -10,
  y: -10,
  speed: 0,
  about: 0,
  hero: 1,
  ready: false,
};

/**
 * Lenis owns the scroll position while smooth scrolling is on: it re-applies
 * its own animated value every frame, so a raw window.scrollTo gets overwritten
 * on the next tick and the page drifts back. Nav jumps go through here instead.
 */
type ImmediateScroller = {
  scrollTo: (target: number, options: { immediate: boolean }) => void;
};

export const scrollBridge: { lenis: ImmediateScroller | null } = { lenis: null };

/** Land on `top` instantly, whichever scroller is in charge. */
export function jumpToOffset(top: number) {
  if (scrollBridge.lenis) {
    scrollBridge.lenis.scrollTo(top, { immediate: true });
    return;
  }
  window.scrollTo({ top, behavior: "auto" });
}

/**
 * Land on a section by id. scroll-margin-top varies per section, so the
 * landing is computed here instead: clear the sticky header by a fixed gap,
 * every time, from whichever control was clicked.
 */
export function jumpToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  // A section may nominate an inner sticky element as the thing to frame. The
  // journey runway does: landing on the section box left its stage sitting a
  // header's height below where it pins, so the detail panel fell off screen.
  // Scrolling to the pin point instead frames the whole composition at once.
  const anchor = el.querySelector<HTMLElement>("[data-jump-anchor]");
  const top = anchor
    ? anchor.getBoundingClientRect().top +
      window.scrollY -
      (parseFloat(getComputedStyle(anchor).top) || 0)
    : el.getBoundingClientRect().top +
      window.scrollY -
      ((document.querySelector("header")?.offsetHeight ?? 64) + 16);

  jumpToOffset(Math.max(0, top));
  window.setTimeout(() => {
    root.style.scrollBehavior = previous;
  }, 60);
}
