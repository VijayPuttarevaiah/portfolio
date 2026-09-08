# Cinematic portfolio implementation

The site keeps Next.js App Router, React, Tailwind CSS, the existing resume content, and the working contact API. Its visual system is charcoal, white and crimson, with muted brass reserved for the vintage compass instrument. Only the black-sunglasses portrait appears in the opening. The gallery contains the original workplace photographs.

## Run it

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run start
```

Copy `.env.example` locally if configuring contact delivery. Supply your own Resend credentials and verified sender; credentials are not included in the source download. The current production website is updated only when the review branch is merged into main.

## Component structure

```text
src/app/page.tsx                     Section composition
src/app/globals.css                  Tailwind import, theme and film styling
src/content/resume.ts                Existing factual content and photo list
src/components/Hero.tsx              Name-led opening and one portrait
src/components/Journey.tsx           Journey heading and reduced-motion fallback
src/components/JourneyArc.tsx        SVG compass, years, pointer, active milestone
src/components/About.tsx             Monologue and background information
src/components/Contact.tsx           Credits link and existing contact controls
src/components/cinema/
  CinematicEngine.tsx                Lenis, loading gate, capability checks
  FilmScene.tsx                      Single React Three Fiber canvas and frame loop
  shaders.ts                        Complete GLSL vertex/fragment programs
  motionState.ts                    Shared mutable frame values
  TitleSequence.tsx                  Framer Motion letter choreography
  Monologue.tsx                     ScrollTrigger word illumination
  HorizontalWork.tsx                Pinned horizontal projects and static fallback
```

## Exact scrolling and GSAP logic

`CinematicEngine.tsx` creates Lenis only when reduced motion is off:

```ts
const lenis = new Lenis({
  lerp: 0.085,
  smoothWheel: true,
  syncTouch: false,
  anchors: { offset: -80 },
  prevent: node => node.tagName === "TEXTAREA",
});
lenis.on("scroll", event => {
  motionState.speed = Math.min(Math.abs(event.velocity) / 18, 3);
  ScrollTrigger.update();
});
const tick = (time: number) => {
  lenis.raf(time * 1000);
  motionState.speed *= 0.92;
};
gsap.ticker.add(tick);
```

The source's ticker additionally writes `--scroll-chroma` for title RGB displacement. MatchMedia cleanup removes the ticker and destroys Lenis. The integration follows [Lenis's documented GSAP synchronization](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger).

`HorizontalWork.tsx` uses the actual track width, rather than a guessed scroll length:

```ts
const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);
const tween = gsap.to(rail, {
  x: () => -distance(),
  ease: "none",
  scrollTrigger: {
    trigger: element,
    start: "top top",
    end: () => `+=${distance()}`,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
});
```

Background cover parallax is independently scrubbed from -5 to +5 percent using `containerAnimation: tween`. This uses [ScrollTrigger's container animation and pinning API](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Tab focus scrolls the owning project into view. Detailed project descriptions expand within a bounded native scrolling area in the pinned layout.

The monologue targets `.monologue-word` and scrubs opacity from 0.18 to 1, with `stagger: 0.08`, from `top 85%` to `bottom 50%`. All words remain readable without JavaScript or under reduced motion.

## Exact Three.js and shader implementation

The complete shaders are in `src/components/cinema/shaders.ts`, not pseudocode. `FilmScene.tsx` attaches them to `THREE.ShaderMaterial` through React Three Fiber:

- `particleVertex`: animated particle drift, cursor repulsion and velocity-driven Z displacement. Repulsion is `normalize(delta + vec2(.001)) * exp(-distanceToPointer * 2.0) * .8`.
- `particleFragment`: soft crimson points using radial `smoothstep` and additive blending.
- `screenFragment`: cursor orb, delayed trail, localized grain, vignette and a small velocity-based color displacement. Pointer and trail uniforms interpolate at 0.3 and 0.12 per frame.
- `wireVertex`: a rotating icosahedron deformed by scroll speed, with sinusoidal displacement. The mesh rotates at 0.07 and 0.1 radians per second on its X/Y axes.
- `wireFragment`: low-opacity wireframe shading, visible only while About is in view.

`useFrame` updates shader material refs directly. No per-frame React state updates are used. React Three Fiber owns the geometries/materials and disposes them on unmount.

The particle field is a shader-driven swarm, not a computational fluid-dynamics simulation. Project hover uses a CSS RGB/glitch composite of the existing architectural photos; it does not create additional WebGL contexts or claim to be a liquid simulation. Images are labeled architectural studies, not screenshots of the backend projects.

## Kinetic title and loading

Framer Motion treats VIJAY as five independent letter spans. Each animates its clipping rectangle, vertical offset, vertical stretch and blur over 1.1 seconds, staggered by 85 milliseconds. The surname uses a 1.2-second tracking and blur reveal. A static accessible full-name label remains on the heading.

The black loading screen waits for the hero image decode, fonts, and the first WebGL frame where supported. A two-second deadline releases it even if an asset or GPU initialization fails. It does not prevent clicking or scrolling. A CSS deadline also releases the overlay without JavaScript. No audio autoplays; the opening uses a visual pulse.

## Compass journey

`JourneyArc.tsx` keeps the original chronological data and scroll runway. The drawing leg ends at `path.getPointAtLength(progress * totalLength)`. The engraved dial rotates its needle with:

```ts
const angle = Math.atan2(pt.y - HINGE.y, pt.x - HINGE.x) * 180 / Math.PI + 90;
needleRef.current.setAttribute("transform", `rotate(${angle} ${HINGE.x} ${HINGE.y})`);
```

The instrument includes 48 etched ticks, cardinal labels, a muted metal gradient, drafting legs, a crosshair nib, and an illuminated trail. As the pointer reaches each year, its milestone details and logo take focus. Reduced-motion visitors receive the existing static education/work tracks.

## Key styling

- `.cinema-name`, `.kinetic-first`, `.cinema-surname`: massive name, letter animation and white surname.
- `.cinema-portrait`: smaller black-sunglasses portrait underneath the name.
- `.film-canvas`: one fixed, pointer-transparent canvas.
- `.film-loader`, `.film-pulse`: fail-open opening sequence.
- `.work-active`, `.work-track`, `.work-shot`: desktop horizontal rail.
- `.work-cover`, `.work-rgb`: image parallax and hover glitch.
- `.monologue-word`: scroll-lit words.
- `.credits-link`, `.credits-roll`: huge email link and hover marquee.
- `.film-credits`: restrained uppercase credit typography.
- Existing Tailwind classes such as `grid`, `gap-12`, `md:grid-cols-[1.6fr_1fr]`, `border-t`, `max-w-5xl`, `px-6`, `sm:px-8`, `py-20` and `sm:py-28` retain responsive content structure.

Contact hover uses a single restrained exposure pulse, not a repeating strobe. The normal pointer remains available for precise interaction while the WebGL light trails it.

## Performance and fallbacks

- One WebGL canvas, 650 particles, DPR capped at 1.25, antialiasing off, low-power preference.
- Demand rendering invalidated at 30fps; hidden tabs stop requesting frames.
- Canvas only mounts at 900px+ with a fine pointer, motion enabled and WebGL2 available.
- Error boundary and context-loss handler leave the HTML portfolio usable.
- Horizontal pinning only at 1000px+ width and 760px+ height with motion enabled.
- Every project is a vertical card until the horizontal enhancement activates, including no-JS and reduced-motion cases.
- GSAP contexts, listeners, timers and Lenis instances are cleaned up on unmount or media changes.
- No new generated imagery; existing workplace assets supply the project visual studies.

Validation: production compilation, TypeScript and ESLint passed during implementation. Browser interaction testing, device GPU performance profiling, and live email delivery were not performed; hardware-specific frame rates are not guaranteed.
