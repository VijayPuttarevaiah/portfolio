"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
export default function TitleSequence() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    window.addEventListener("cinema-intro-ready", start, { once: true });
    const timeout = setTimeout(start, 0);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("cinema-intro-ready", start);
    };
  }, []);
  return (
    <h1 id="hero-title" className="cinema-name" aria-label="Vijay Puttarevaiah">
      <span className="kinetic-first" aria-hidden="true">
        {[..."VIJAY"].map((letter, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={
              reduced || !ready
                ? {}
                : {
                    clipPath: ["inset(100% 0 0)", "inset(0% 0 0)"],
                    y: [26, 0],
                    scaleY: [1.18, 1],
                    filter: ["blur(6px)", "blur(0px)"],
                  }
            }
            transition={{
              duration: 0.45,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {letter}
          </motion.span>
        ))}
      </span>
      <motion.span
        aria-hidden="true"
        className="cinema-surname"
        initial={false}
        animate={
          reduced || !ready
            ? {}
            : {
                opacity: [0, 1],
                letterSpacing: [".26em", ".14em"],
                filter: ["blur(8px)", "blur(0px)"],
              }
        }
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        PUTTAREVAIAH
      </motion.span>
    </h1>
  );
}
