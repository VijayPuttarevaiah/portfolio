import Image from "next/image";

/**
 * The mark for an organisation on the timelines.
 *
 * Real logos are used where a freely-licensed file exists — Amazon,
 * Dalhousie and Wipro are all public domain via Wikimedia Commons.
 * Acuver and NIE have no free file, so they render as monogram badges in
 * their brand colour, which keeps the set visually coherent.
 *
 * Logos sit on a light tile rather than being colour-inverted: these marks
 * carry brand colour (Amazon's orange swoosh, Wipro's spectrum spiral) and
 * inverting them would destroy it.
 *
 * To promote a monogram to a real logo: drop an SVG in public/logos/ and add
 * its filename below. Nothing else changes.
 */
const LOGO_FILES: Record<string, string> = {
  amazon: "/logos/amazon.svg",
  dalhousie: "/logos/dalhousie.svg",
  wipro: "/logos/wipro.svg",
};

/** Brand colours for the ring, and initials for the monogram fallback. */
const BRAND: Record<string, { color: string; initials: string }> = {
  wipro: { color: "#7c5cbf", initials: "W" },
  amazon: { color: "#ff9900", initials: "A" },
  acuver: { color: "#5b8def", initials: "AC" },
  dalhousie: { color: "#ffcc00", initials: "D" },
  nie: { color: "#5ddb9c", initials: "NIE" },
};

export default function BrandMark({
  brand,
  label,
  size = 56,
}: {
  brand: string;
  /** Accessible name, e.g. "Wipro". */
  label: string;
  size?: number;
}) {
  const key = brand.toLowerCase();
  const meta =
    BRAND[key] ?? { color: "var(--accent)", initials: label.slice(0, 2).toUpperCase() };
  const file = LOGO_FILES[key];

  return (
    <span
      className={file ? "brand-tile" : "brand-mark"}
      style={{
        width: size,
        height: size,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["--brand" as any]: meta.color,
      }}
      role="img"
      aria-label={label}
    >
      {file ? (
        <Image
          src={file}
          alt=""
          width={size}
          height={size}
          className="brand-tile-img"
          aria-hidden="true"
        />
      ) : (
        <span className="brand-mark-text" aria-hidden="true">
          {meta.initials}
        </span>
      )}
    </span>
  );
}
