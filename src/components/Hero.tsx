import Image from "next/image";
import RotatingTitle from "./RotatingTitle";
import TypeLine from "./TypeLine";
import { gmailCompose, person } from "@/content/resume";
import SectionLink from "./SectionLink";

function LinkedInMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.08 1.84 2.83 1.31 3.52 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .5z" />
    </svg>
  );
}

function MailMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

/**
 * A split hero: who and what on the left, portrait on the right. Every colour
 * comes from a token, so the same layout reads correctly on the dark ground and
 * on the paper light theme.
 */
export default function Hero() {
  return (
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-inner">
          <aside className="hero-follow" aria-label="Profiles">
            <span>Follow</span>
            <a href={person.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="is-linkedin">
              <LinkedInMark />
            </a>
            <a href={person.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="is-github">
              <GitHubMark />
            </a>
            <a href={gmailCompose("Hello Vijay")} target="_blank" rel="noreferrer noopener" aria-label="Email" className="is-mail">
              <MailMark />
            </a>
          </aside>

          <div className="hero-copy">
            <p className="hero-name">
              <TypeLine text={`Hey, I am ${person.name}`} highlight={person.name} />
            </p>
            <h1 id="hero-title" className="hero-title">
              <RotatingTitle roles={person.roles} />
            </h1>
            <p className="hero-open">
              <span className="tl-live" aria-hidden="true" />
              {person.openTo}
            </p>
            <p className="hero-lede">{person.summary}</p>
            <p className="hero-focus">{person.focusLine}</p>

            <div className="hero-cta">
              <a
                href={gmailCompose("Winter 2027 co-op enquiry")}
                target="_blank"
                rel="noreferrer noopener"
                className="hero-hire"
              >
                Hire me
              </a>
              <SectionLink id="about" className="hero-secondary">
                Explore my work
              </SectionLink>
            </div>

            {/* The three facts a recruiter screens on, on the home page only. */}
            <div className="hero-status">
              <span className="hero-badge">{person.mobility}</span>
              <span className="hero-badge">{person.workAuth}</span>
            </div>
          </div>

          <div className="hero-portrait">
            <span className="hero-frame" aria-hidden="true" />
            <Image
              src="/photos/vijay-cutout.png"
              alt={`${person.name}, software engineer`}
              width={1072}
              height={1430}
              priority
              sizes="(max-width: 900px) 78vw, 430px"
            />
          </div>
        </div>
      </section>
  );
}
