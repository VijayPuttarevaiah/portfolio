import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Expertise from "@/components/Expertise";
import Hero from "@/components/Hero";
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
        <About />
        <Experience />
        <Projects />
        <Gallery />
        <Recommendations />
        <Expertise />
        <Education />
        <Contact />
      </main>
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-[var(--fg-subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {person.name}
          </p>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em]">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </footer>
    </>
  );
}
