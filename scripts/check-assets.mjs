// Reports which optional assets have been supplied. Run: node scripts/check-assets.mjs
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const pub = join(process.cwd(), "public");
const row = (ok, label, note = "") =>
  console.log(`  ${ok ? "present" : "MISSING"}  ${label}${note ? "  — " + note : ""}`);

console.log("\nPhotos  (public/photos/)");
const wanted = ["wipro-campus", "wipro-entrance", "acuver-office", "vijay-office"];
const dir = join(pub, "photos");
const found = existsSync(dir)
  ? readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  : [];
for (const w of wanted) {
  const hit = found.find((f) => f.toLowerCase().startsWith(w));
  row(Boolean(hit), `photos/${w}.*`, hit ?? "");
}
const extra = found.filter((f) => !wanted.some((w) => f.toLowerCase().startsWith(w)));
if (extra.length) console.log(`  extra files found: ${extra.join(", ")}`);

console.log("\nLogos  (public/logos/)");
for (const l of ["amazon", "dalhousie", "wipro", "acuver", "nie"]) {
  const f = existsSync(join(pub, "logos"))
    ? readdirSync(join(pub, "logos")).find((x) => x.toLowerCase().startsWith(l))
    : null;
  row(Boolean(f), `logos/${l}.*`, f ?? "monogram fallback");
}
console.log("");
