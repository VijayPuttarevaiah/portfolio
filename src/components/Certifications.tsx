import Image from "next/image";
import { certifications, certificationsInProgress } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

/**
 * One row per certification: the real Credly badge, what the certification
 * covers, and a link that verifies it. The whole row is the link, and it lifts
 * and scales slightly on hover so it reads as one clickable object rather than
 * a card with a link buried in it.
 */
export default function Certifications() {
  return (
    <Section id="certifications" title="Certifications">
      {/* One grid holding all four, earned and in progress, so the whole set
          lands in a single screen rather than a column you have to scroll. */}
      <ul className="cert-grid">
        {certifications.map((cert, i) => (
          <Reveal as="li" key={cert.name} delay={i * 70}>
            <a
              href={cert.href}
              target="_blank"
              rel="noreferrer noopener"
              className="cert-row"
            >
              <span className="cert-badge">
                <Image
                  src={cert.badge}
                  alt=""
                  width={120}
                  height={120}
                  sizes="96px"
                />
              </span>

              <span className="cert-body">
                <span className="cert-issuer">{cert.issuer}</span>
                <span className="cert-name">{cert.name}</span>
                <span className="cert-blurb">{cert.blurb}</span>
                <span className="cert-verify">
                  Verify on Credly
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </span>
            </a>
          </Reveal>
        ))}

        {certificationsInProgress.map((cert, i) => (
            <Reveal as="li" key={cert.name} delay={220 + i * 60}>
              {/* Not a link and not styled like one: there is nothing to verify
                  yet, and a row that looks clickable would imply there is. */}
              <div className="cert-row is-progress">
                <span className="cert-badge">
                  <Image
                    src={cert.badge}
                    alt=""
                    width={120}
                    height={120}
                    sizes="96px"
                  />
                </span>

                <span className="cert-body">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-blurb">{cert.blurb}</span>
                  <span className="cert-status">In progress — not yet certified</span>
                </span>
              </div>
            </Reveal>
        ))}
      </ul>
    </Section>
  );
}
