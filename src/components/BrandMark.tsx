import Image from "next/image";

/**
 * The mark for an organisation on the timelines.
 *
 * A real logo is used where one is freely licensed — currently only Wipro,
 * from simple-icons (CC0). Everything else renders as a monogram badge in
 * the organisation's brand colour, which stays visually consistent and
 * sidesteps trademark questions.
 *
 * To promote any monogram to a real logo: drop an SVG in public/logos/ and
 * add its filename here. No other change is needed.
 */
const LOGO_FILES: Record<string, string> = {
  wipro: "/logos/wipro.svg",
};

/** Brand colours, used for the monogram badges and the ring around logos. */
const BRAND: Record<string, { color: string; initials: string }> = {
  wipro: { color: "#7c5cbf", initials: "W" },
  amazon: { color: "#ff9900", initials: "A" },
  acuver: { color: "#5b8def", initials: "AC" },
  dalhousie: { color: "#ffcc00", initials: "D" },
  nie: { color: "#5ddb9c", initials: "NIE" },
};

export type BrandKey = keyof typeof BRAND;

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
  const meta = BRAND[key] ?? { color: "var(--accent)", initials: label.slice(0, 2).toUpperCase() };
  const file = LOGO_FILES[key];

  return (
    <span
      className="brand-mark"
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
          width={Math.round(size * 0.52)}
          height={Math.round(size * 0.52)}
          className="brand-mark-img"
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
