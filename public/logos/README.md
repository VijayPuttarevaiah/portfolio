# Logos

| File | Source | Licence |
|---|---|---|
| `amazon.svg` | Wikimedia Commons | Public domain |
| `dalhousie.svg` | Wikimedia Commons | Public domain |
| `wipro.svg` | Wikimedia Commons | Public domain |

**Acuver and NIE have no freely-licensed file available.** They render as
monogram badges instead (`AC`, `NIE`) in their brand colours.

To add either as a real logo: save an SVG here as `acuver.svg` or `nie.svg`,
then add the filename to `LOGO_FILES` in `src/components/BrandMark.tsx`. The
component prefers a file when one exists and falls back to the monogram.

Logos render on a white tile rather than colour-inverted, so brand colour
(Amazon's swoosh, Wipro's spectrum) survives against the dark page.
