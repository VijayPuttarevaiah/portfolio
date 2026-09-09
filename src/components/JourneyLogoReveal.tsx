"use client";

import { useEffect, useRef, useState } from "react";
import BrandMark from "./BrandMark";

/** Mount only the active, visible clip; static artwork survives blocked playback. */
export default function JourneyLogoReveal({ brand, label, active, reduced }: {
  brand: string; label: string; active: boolean; reduced: boolean;
}) {
  const container = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const node = container.current;
    if (!node || !active || reduced) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold:.5});
    observer.observe(node);
    return () => observer.disconnect();
  }, [active, reduced]);
  const enabled = active && visible && !reduced;
  useEffect(() => {
    const clip = video.current;
    if (!clip || !enabled) return;
    let cancelled = false;
    const play = () => {
      if (document.hidden) { clip.pause(); return; }
      if (!clip.ended) void clip.play().catch(() => { if (!cancelled) setPlaying(false); });
    };
    play();
    document.addEventListener('visibilitychange', play);
    return () => { cancelled = true; clip.pause(); document.removeEventListener('visibilitychange', play); };
  }, [enabled]);
  return <span ref={container} className="journey-logo-reveal">
    <BrandMark brand={brand} label={label} size={58} />
    {enabled && <video
      ref={video}
      className="journey-logo-video"
      style={{opacity:playing ? 1 : 0}}
      src={`/videos/journey/${brand}.mp4`}
      poster={`/videos/journey/${brand}-poster.webp`}
      muted playsInline autoPlay preload="auto"
      aria-hidden="true" tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      onError={() => setPlaying(false)}
    />}
  </span>;
}
