"use client";

import { Analytics, track } from "@vercel/analytics/react";
import { useEffect } from "react";

export default function PortfolioAnalytics() {
  useEffect(() => {
    // Custom events require a supported Vercel plan and explicit project setup.
    if (process.env.NEXT_PUBLIC_PORTFOLIO_EVENTS !== "true" || navigator.doNotTrack === "1") return;
    const clicked = (event: MouseEvent) => {
      const target = (event.target as Element).closest('a, button');
      if (!target) return;
      if (target.matches('a[download]')) track('Resume downloaded');
      else if (target.matches('a[href^="mailto:"]')) track('Email opened');
      else if (target.matches('.ring-tile')) track('Project selected', { project: target.querySelector('.ring-tile-name')?.textContent ?? '' });
      else if (target.matches('#projects a[href^="https://github.com/"]')) track('Project source opened', { url: target.getAttribute('href') ?? '' });
    };
    document.addEventListener('click', clicked);
    const contact = document.getElementById('contact');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        track('Contact reached');
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    if (contact) observer.observe(contact);
    return () => { document.removeEventListener('click', clicked); observer.disconnect(); };
  }, []);
  return <Analytics beforeSend={(event) => {
    if (navigator.doNotTrack === '1') return null;
    const url = new URL(event.url);
    url.search = '';
    url.hash = '';
    return { ...event, url: url.toString() };
  }} />;
}
