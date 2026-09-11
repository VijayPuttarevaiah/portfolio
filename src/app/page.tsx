import Certifications from "@/components/Certifications";
import Involvement from "@/components/Involvement";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Hero from "@/components/Hero";
import CinematicEngine from "@/components/cinema/CinematicEngine";
import Journey from "@/components/Journey";
import Nav from "@/components/Nav";
import ProjectBoxes from "@/components/ProjectBoxes";
import Recommendations from "@/components/Recommendations";
import Skills from "@/components/Skills";
import SectionIndex from "@/components/SectionIndex";

export default function Home() {
  return (
    <>
      <CinematicEngine />
      <Nav />
      <SectionIndex />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Journey />
        <Experience />
        <Education />
        <ProjectBoxes />
        <Certifications />
        <Involvement />
        <Recommendations />
        <Contact />
      </main>
    </>
  );
}
