import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { person } from "@/content/resume";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Set NEXT_PUBLIC_SITE_URL in Vercel to the production domain so Open Graph
 * and canonical URLs resolve absolutely. Falls back to a sensible default.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vijayputtarevaiah.vercel.app";

const description =
  "Backend software engineer with 3+ years building Java and Spring Boot services, event-driven systems, and AWS infrastructure. Currently completing a Master of Applied Computer Science at Dalhousie University.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.name} — ${person.headline}`,
    template: `%s — ${person.name}`,
  },
  description,
  keywords: [
    "Backend Engineer",
    "Software Engineer",
    "Java",
    "Spring Boot",
    "Microservices",
    "AWS",
    "Kubernetes",
    "Distributed Systems",
    "Halifax",
    "Dalhousie University",
  ],
  authors: [{ name: person.name, url: siteUrl }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: `${person.name} — Portfolio`,
    title: `${person.name} — ${person.headline}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.headline}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f12" },
  ],
};

/**
 * Applied before first paint so a stored theme choice never flashes the
 * wrong palette. Kept tiny and dependency-free on purpose.
 */
const themeScript = `
(function () {
  document.documentElement.classList.add('js');
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.dataset.theme = stored;
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.headline,
    email: `mailto:${person.email}`,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Halifax",
      addressRegion: "NS",
      addressCountry: "CA",
    },
    sameAs: [person.github, person.linkedin],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Dalhousie University" },
      { "@type": "CollegeOrUniversity", name: "National Institute of Engineering" },
    ],
    knowsAbout: [
      "Java",
      "Spring Boot",
      "Microservices",
      "REST APIs",
      "AWS",
      "Docker",
      "Kubernetes",
      "Distributed Systems",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          suppressHydrationWarning
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-fg)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
