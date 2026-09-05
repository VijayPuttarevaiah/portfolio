# Logos

`wipro.svg` comes from simple-icons (CC0). Every other organisation is drawn
as a monogram badge in `BrandMark.tsx` — no icon set carries Acuver or NIE,
and Amazon's mark is not in simple-icons.

To upgrade any of them to a real logo: drop an SVG here named after the
organisation (`amazon.svg`, `acuver.svg`, `dalhousie.svg`, `nie.svg`) and add
the filename to the `LOGO_FILES` set in `src/components/BrandMark.tsx`. The
component prefers a file when one exists and falls back to the monogram.
