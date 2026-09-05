import Image from "next/image";
import { photos } from "@/content/resume";
import Reveal from "./Reveal";
import Section from "./Section";

const HUES = ["--h1", "--h2", "--h3", "--h4", "--h5"] as const;

/**
 * Photo strip.
 *
 * Renders nothing while `photos` is empty, so the section simply does not
 * exist until real images are added. Every photo must be one Vijay actually
 * supplies — never a stock image, never anything generated, since a picture
 * presented as "me at work" that isn't is a fabrication like any other.
 */
export default function Gallery() {
  if (photos.length === 0) return null;

  return (
    <Section
      id="gallery"
      eyebrow="In practice"
      title="On the job"
      intro="A few moments from the teams and projects behind the work above."
      tinted
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <Reveal as="li" key={photo.src} delay={i * 60}>
            <figure
              className="card-r h-full overflow-hidden border-2 bg-[var(--bg)]"
              style={{ borderColor: `var(${HUES[i % HUES.length]})` }}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              {photo.caption ? (
                <figcaption className="px-5 py-4 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {photo.caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
