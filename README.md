# Vijay Puttarevaiah — Portfolio

Personal portfolio site. Next.js 16 (App Router) · TypeScript · Tailwind CSS v4.

## One thing to do before deploying

The **Resume** button in the hero links to `/resume.pdf`, which is not in the
repo yet. Compile the current base resume and drop the PDF in:

```
portfolio/public/resume.pdf
```

The base resume lives at
`../MyResumes/Vijay Puttarevaiah Master Resume (Software Developer Co-op).tex`.
Every PDF already in `../MyResumes/` predates the 2026-09-04 rework, so don't
reuse one of those — export a fresh copy.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npm run lint                 # eslint
npx tsc --noEmit             # typecheck
```

## Deploy to Vercel

```bash
npx vercel        # preview
npx vercel --prod # production
```

Or push to GitHub and import the repo at vercel.com — the defaults work, no
build configuration needed.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | no | Absolute Open Graph / canonical URLs. Falls back to `https://vijayputtarevaiah.vercel.app`. |
| `RESEND_API_KEY` | **yes, for the contact form** | Sends form submissions to your inbox. Without it the form returns a clear "not configured" message instead of failing silently. |
| `CONTACT_TO` | no | Destination address. Defaults to the email in `resume.ts`. |
| `CONTACT_FROM` | no | Sender. Defaults to `Portfolio <onboarding@resend.dev>`. |

### Turning on the contact form

1. Sign up at [resend.com](https://resend.com) — the free tier covers 100 emails/day.
2. **API Keys → Create API Key**, copy it.
3. Add `RESEND_API_KEY` in Vercel → Settings → Environment Variables, then redeploy.
4. For local testing, put it in `.env.local` (already gitignored).

You do **not** need to verify a domain. Resend's `onboarding@resend.dev`
sender works for delivery to your own account address, which is exactly what
this form does. Add `CONTACT_FROM` with a verified domain later if you want
the sender to read as yours.

### Contact form protections

The route at `src/app/api/contact/route.ts` applies, in order:

- **Rate limit** — 3 messages per IP per hour, checked before any other work.
- **Honeypot** — a hidden `company` field. Bots fill it; the response is a
  fake success so they learn nothing.
- **Timing check** — submissions under 3 seconds after the form opens are
  treated the same way.
- **Validation** — required fields, permissive email format, length caps
  (name 100, subject 150, message 4000).
- **Header-injection guard** — CR/LF stripped from single-line fields.
- **HTML escaping** on everything rendered into the email body.

One honest limitation: the rate limiter holds state in the memory of a single
serverless instance. Vercel may run several concurrently, so someone spraying
across cold starts could exceed 3/hour. It reliably stops the realistic case —
one person or script hammering the form. To make it airtight, swap the `Map`
in `src/lib/rateLimit.ts` for Upstash Redis; the function signature is
already the right shape.

## Where the content lives

**`src/content/resume.ts` is the single source of truth.** Every claim on the
site is defined there and nowhere else — components only render it. To change
copy, edit that file.

That file also documents the accuracy rules the content follows:

- **"3+ years"** of software engineering (Wipro 2yr3mo + Acuver 1yr = 3yr3mo).
  Never write 3.5 — 3.25 does not clear 3.5.
- **"5 years"** is *total industry* experience, not engineering experience.
- **Amazon was not a software engineering role.** It's rendered with an
  explicit qualifier so the timeline reads honestly.
- **The Shopizer pull request is open, not merged.** Say "submitted"/"open".
- **MeetFocus has no frontend.** Never describe UI work on it.
- Work authorization is **"Eligible to work in Canada"** — never anything
  implying permanent residency or citizenship.

## Structure

```
src/
  app/
    layout.tsx             metadata, Open Graph, JSON-LD, no-flash theme script
    page.tsx               section composition
    globals.css            design tokens, light/dark, reveal animation
    icon.tsx               generated favicon
    opengraph-image.tsx    generated 1200×630 social card
  components/
    Nav.tsx                sticky nav, scroll-spy, mobile menu
    Hero.tsx  About.tsx  Experience.tsx  Projects.tsx
    Expertise.tsx  Education.tsx  Contact.tsx
    Section.tsx            shared section shell
    Reveal.tsx             fade-up on scroll (IntersectionObserver)
    ThemeToggle.tsx        light/dark switch
  content/
    resume.ts              ← all content
```

## Design notes

- **One accent colour** (`#14508f`, carried over from the LaTeX resume) against
  a neutral base. No gradients, no glassmorphism.
- **Motion is one effect**: a short fade-and-lift on first scroll into view,
  fired once. Fully disabled under `prefers-reduced-motion`.
- **Skills are weighted, not exhaustive** — four primary groups render as
  filled cards, the rest as quiet supporting text.
- **Accessibility**: skip link, semantic landmarks, one `h1`, labelled
  sections, visible focus rings, `aria-current` on the active nav item.
