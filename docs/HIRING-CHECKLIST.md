# Hiring-facing portfolio

The September 2026 reference was checked against the current source, including the project ring added after the earlier cinematic preview. The compass journey remains unchanged.

## Implemented

- Immediate first content: removed the full-screen shader/font loading gate. Decorative WebGL loads later and remains disabled on mobile/coarse pointers and for reduced-motion visitors.
- Visible work eligibility, resume PDF download, and direct email in the hero.
- Public resume copied from the owner's master PDF, with GPA corrected to 3.88/4.30 as confirmed by the owner. The original source PDF is unchanged.
- Interactive Triage architecture: five stages, explanatory details, and a human-approval branch. Explicitly an illustration, not a live AWS endpoint. The MTTR figure remains a target.
- Project rotation is opt-in and pauses on focus/hover. Reduced-motion disables rotation transitions. Fixed accessible names and inactive-card contrast.
- Correct education list structure and screen-reader-accessible monologue text; its initial scroll state now remains readable.
- Visible update date in the footer.
- Vercel Analytics page views on Vercel deployments. Query strings and fragments are removed; Do Not Track is respected for page views. No form content is collected.
- Optional project selection, source click, resume download, email click and contact-reach events. Enable only on a supported Vercel plan with `NEXT_PUBLIC_PORTFOLIO_EVENTS=true` after enabling Web Analytics in the Vercel dashboard. Events are off by default.

## Already present and retained

Plain role headline; four project case studies with problem/implementation/status; source links including Shopizer PR #1094; truthful numeric scope and target qualifiers; hidden empty Recommendations; email/LinkedIn/GitHub; outcome-led experience; grouped skills; responsive navigation; reduced-motion journey fallback; Open Graph image and canonical metadata.

## Owner choices and remaining limits

Keep the connected Vercel domain, as requested. Analytics requires dashboard activation; custom-event reporting depends on the Vercel plan. No paid account changes were made. No public AWS API or recorded production demonstration is claimed. Existing skills/content were retained rather than inflating claims or adding unsupported numbers.

## Validation

Production build and ESLint pass. Resume and Open Graph routes return HTTP 200. The 390px mobile hero and interactive approval path were checked; desktop walkthrough and keyboard activation were checked. Lighthouse was run locally against the production build under its simulated mobile conditions. Reports are lab measurements, not field Core Web Vitals or a physical-device certification.
