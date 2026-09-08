"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motionState } from "./motionState";
import "lenis/dist/lenis.css";
const FilmScene = dynamic(() => import("./FilmScene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function CinematicEngine() {
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    document.documentElement.dataset.cinemaReady = "true";
    window.dispatchEvent(new Event("cinema-intro-ready"));
    const lost = () => setWebgl(false);
    window.addEventListener("cinema-webgl-lost", lost);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -80 },
        prevent: (node) => node.tagName === "TEXTAREA",
      });
      const tick = (time: number) => {
        lenis.raf(time * 1000);
        motionState.speed *= 0.92;
        document.documentElement.style.setProperty(
          "--scroll-chroma",
          `${Math.min(motionState.speed, 3) * 1.5}px`,
        );
      };
      lenis.on("scroll", (event: Lenis) => {
        motionState.speed = Math.min(Math.abs(event.velocity) / 18, 3);
        ScrollTrigger.update();
      });
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("cinema-motion");
      return () => {
        lenis.destroy();
        gsap.ticker.remove(tick);
        document.documentElement.classList.remove("cinema-motion");
        document.documentElement.style.removeProperty("--scroll-chroma");
      };
    });
    media.add(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const probe = document.createElement("canvas");
        const context = probe.getContext("webgl2");
        const enabled = !!context;
        context?.getExtension("WEBGL_lose_context")?.loseContext();
        const id = setTimeout(() => {
          setWebgl(enabled);
        }, 1200);
        const pointer = (event: PointerEvent) => {
          motionState.x = event.clientX / window.innerWidth;
          motionState.y = event.clientY / window.innerHeight;
        };
        window.addEventListener("pointermove", pointer, { passive: true });
        const hero = ScrollTrigger.create({
          trigger: "#top",
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            motionState.hero = self.isActive ? 1 : 0;
          },
        });
        const about = ScrollTrigger.create({
          trigger: "#about",
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            motionState.about = Math.sin(self.progress * Math.PI);
          },
        });
        return () => {
          clearTimeout(id);
          setWebgl(false);
          window.removeEventListener("pointermove", pointer);
          hero.kill();
          about.kill();
        };
      },
    );
    return () => {
      media.revert();
      window.removeEventListener("cinema-webgl-lost", lost);
    };
  }, []);
  return (
    <>
      <div className="film-vignette" aria-hidden="true" />
      {webgl && (
        <div className="film-canvas" aria-hidden="true">
          <SceneBoundary>
            <FilmScene />
          </SceneBoundary>
        </div>
      )}

    </>
  );
}
