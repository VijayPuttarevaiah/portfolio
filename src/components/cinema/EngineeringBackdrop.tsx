"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
const routes = [
  "M 770 500 C 640 460 700 260 470 210 S 270 170 110 250",
  "M 770 500 C 860 380 1020 430 1100 240",
  "M 770 500 C 550 620 370 450 150 530",
  "M 770 500 C 670 330 860 160 700 80",
];
export default function EngineeringBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.running =
        entry.isIntersecting && !document.hidden ? "true" : "false";
    });
    observer.observe(node);
    const visibility = () => {
      node.dataset.running =
        !document.hidden && node.getBoundingClientRect().bottom > 0
          ? "true"
          : "false";
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="engineering-backdrop"
      aria-hidden="true"
      data-running="true"
    >
      <Image
        src="/photos/engineering-background.webp"
        alt=""
        fill
        fetchPriority="high"
        sizes="100vw"
        className="engineering-scene"
        priority
      />
      <div className="laptop-glow" />
      <svg
        className="data-flow"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="packet-glow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        {routes.map((route, i) => (
          <g key={route}>
            <path d={route} fill="none" stroke={["#7ddfff", "#b49aff", "#79e3ba", "#f2c77d"][i]} strokeOpacity=".13" />
            <path
              d={route}
              fill="none"
              stroke={["#7ddfff", "#b49aff", "#79e3ba", "#f2c77d"][i]}
              strokeWidth="2"
              pathLength="100"
              strokeDasharray="2 98"
              className="data-packet"
              style={{
                animationDelay: `${i * -1.7}s`,
                animationDuration: `${7 + i}s`,
              }}
            />
            <path
              d={route}
              fill="none"
              stroke={["#7ddfff", "#b49aff", "#79e3ba", "#f2c77d"][i]}
              strokeWidth="5"
              pathLength="100"
              strokeDasharray="2 98"
              filter="url(#packet-glow)"
              className="data-packet"
              style={{
                animationDelay: `${i * -1.7}s`,
                animationDuration: `${7 + i}s`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
