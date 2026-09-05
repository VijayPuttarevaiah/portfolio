/**
 * Repeating ticker. Purely decorative, so it is hidden from assistive tech.
 * The track is duplicated and translated by exactly -50%, which makes the
 * loop seamless without measuring anything at runtime.
 */
export default function Marquee({
  text,
  hue = "--h1",
}: {
  text: string;
  hue?: string;
}) {
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="marquee-item">
      {text}
      <span className="marquee-dot" style={{ background: `var(${hue})` }} />
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items}
        {items}
      </div>
    </div>
  );
}
