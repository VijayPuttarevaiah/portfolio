import About from "@/components/About";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Expertise from "@/components/Expertise";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Recommendations from "@/components/Recommendations";
import { person } from "@/content/resume";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee text="Backend · Cloud · Platform" />
        <Journey />
        <About />
        <Experience />
        <Marquee text="Selected Work" hue="--h4" />
        <Projects />
        <Gallery />
        <Recommendations />
        <Expertise />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-[var(--fg-subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {person.name}
          </p>
          <div className="flex gap-6">
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-[var(--fg)]"
            >
              LinkedIn
            </a>
            <a
              href={person.github}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-[var(--fg)]"
            >
              GitHub
            </a>
            <a
              href={`mailto:${person.email}`}
              className="transition-colors hover:text-[var(--fg)]"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
