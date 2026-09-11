# Parked: hero tool marquee

Removed from the hero on request; kept here verbatim so it can go back without
being rebuilt. Nothing in this folder is imported or compiled.

The data (`heroTools`, 31 entries) is still exported from `src/content/resume.ts`
and the icons are still in `public/tools/`, so restoring this needs only the JSX
and the CSS below.

## JSX — goes inside `Hero.tsx`, after `</div>` closing `.hero-inner`

```tsx
{/* Full stack, scrolling. The list is rendered twice and the track is
    translated by exactly half its width, so the loop has no seam. The
    second copy is hidden from assistive tech. */}
<div className="hero-marquee" aria-label="Tools and technologies">
  <div className="hero-marquee-track">
    {[0, 1].map((copy) => (
      <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {heroTools.map((tool) => (
          <li key={`${copy}-${tool.name}`}>
            <Image src={tool.icon} alt="" width={26} height={26} />
            <span>{tool.name}</span>
          </li>
        ))}
      </ul>
    ))}
  </div>
</div>
```

Also re-add `heroTools` to the import from `@/content/resume`.

## CSS — goes in `globals.css`

```css
.hero-marquee{
  position:relative;margin-top:clamp(1.5rem,3vw,2.5rem);
  padding:18px 0;overflow:hidden;
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
}
.hero-marquee-track{display:flex;width:max-content;animation:hero-marquee 46s linear infinite}
.hero-marquee:hover .hero-marquee-track{animation-play-state:paused}
.hero-marquee ul{display:flex;align-items:center;gap:38px;margin:0;padding:0 19px;list-style:none}
.hero-marquee li{
  display:flex;align-items:center;gap:9px;white-space:nowrap;
  font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;
  color:var(--fg-muted);transition:color .3s ease;
}
.hero-marquee li:hover{color:var(--fg)}
.hero-marquee img{width:26px;height:26px}
@keyframes hero-marquee{to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){
  .hero-marquee-track{animation:none}
  .hero-marquee{overflow-x:auto}
}
```
