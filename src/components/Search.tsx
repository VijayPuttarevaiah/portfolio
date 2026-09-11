"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  about,
  certifications,
  education,
  educationJourney,
  experience,
  involvement,
  professionalJourney,
  projects,
  skills,
} from "@/content/resume";

type Hit = {
  section: string;
  sectionId: string;
  title: string;
  body: string;
};

/**
 * The index covers only what is actually rendered. Skills were indexed until
 * the Expertise section came off the page — searching content that has no
 * section to scroll to is worse than not finding it at all.
 */
function buildIndex(): Hit[] {
  const hits: Hit[] = [];

  skills.forEach((group) =>
    hits.push({
      section: "Skills",
      sectionId: "skills",
      title: group.category,
      body: group.items.join(" "),
    }),
  );

  [about.lead, ...about.paragraphs].forEach((p) =>
    hits.push({ section: "About", sectionId: "about", title: "About", body: p }),
  );
  about.interests.forEach((i) =>
    hits.push({ section: "About", sectionId: "about", title: "Currently interested in", body: i }),
  );

  [...educationJourney, ...professionalJourney].forEach((stop) =>
    hits.push({
      section: "Journey",
      sectionId: "journey",
      title: `${stop.year} · ${stop.title}`,
      body: `${stop.org} ${stop.period} ${stop.marker}`,
    }),
  );

  experience.forEach((role) => {
    hits.push({
      section: "Experience",
      sectionId: "experience",
      title: `${role.title} · ${role.company}`,
      body: `${role.period} ${role.duration} ${role.stack.join(" ")}`,
    });
    role.engagements.forEach((eng) => {
      eng.bullets.forEach((b) =>
        hits.push({
          section: "Experience",
          sectionId: "experience",
          title: `${eng.project}${eng.client ? ` · ${eng.client}` : ""}`,
          body: b,
        }),
      );
    });
  });

  projects.forEach((project) => {
    hits.push({
      section: "Projects",
      sectionId: "projects",
      title: project.name,
      body: `${project.blurb} ${project.problem} ${project.stack.join(" ")}`,
    });
    hits.push({
      section: "Projects",
      sectionId: "projects",
      title: `${project.name} · what I built`,
      body: project.built,
    });
  });

  education.forEach((e) =>
    hits.push({
      section: "Education",
      sectionId: "education",
      title: e.credential,
      body: `${e.institution} ${e.location} ${e.period} ${e.detail}`,
    }),
  );

  involvement.forEach((entry) =>
    hits.push({
      section: "Beyond work",
      sectionId: "involvement",
      title: `${entry.role} · ${entry.organization}`,
      body: entry.bullets.join(" "),
    }),
  );

  certifications.forEach((c) =>
    hits.push({
      section: "Certifications",
      sectionId: "certifications",
      title: c.name,
      body: `${c.issuer} ${c.blurb}`,
    }),
  );

  return hits;
}

/** Substring scoring — a title match outranks a body match, earlier outranks later. */
function score(hit: Hit, query: string) {
  const q = query.toLowerCase();
  const title = hit.title.toLowerCase();
  const body = hit.body.toLowerCase();
  const inTitle = title.indexOf(q);
  const inBody = body.indexOf(q);
  if (inTitle === -1 && inBody === -1) return -1;
  if (inTitle !== -1) return 1000 - inTitle;
  return 500 - Math.min(inBody, 400);
}

/** Wraps the matched run so a reader can see why a result came back. */
function Highlight({ text, query }: { text: string; query: string }) {
  const at = text.toLowerCase().indexOf(query.toLowerCase());
  if (at === -1 || !query) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="search-mark">{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

/** Trims a long body down to the window around the match. */
function snippet(body: string, query: string) {
  const at = body.toLowerCase().indexOf(query.toLowerCase());
  if (at <= 70) return body.slice(0, 150) + (body.length > 150 ? "…" : "");
  return "…" + body.slice(at - 60, at + 90) + (body.length > at + 90 ? "…" : "");
}

function MagnifierIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

/** Same spring family as the nav pill, so the two controls feel like one system. */
const DOCK_SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return index
      .map((hit) => ({ hit, s: score(hit, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((r) => r.hit);
  }, [index, query]);

  // Adjusting state during render rather than in an effect: a new query means
  // the previous highlight index is stale, and an effect would render the
  // stale one for a frame first.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setCursor(0);
  }

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  // Cmd/Ctrl-K opens it from anywhere, Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const go = useCallback(
    (hit: Hit) => {
      close();
      const el = document.getElementById(hit.sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [close],
  );

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
  };

  return (
    <div className="search-dock">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="icon"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Search the portfolio"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={DOCK_SPRING}
            className="search-trigger"
          >
            <MagnifierIcon />
          </motion.button>
        ) : (
          <motion.form
            key="field"
            initial={{ width: 34, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 34, opacity: 0 }}
            transition={DOCK_SPRING}
            onSubmit={(e) => {
              e.preventDefault();
              if (results[cursor]) go(results[cursor]);
            }}
            className="search-form"
          >
            <span className="search-form-icon">
              <MagnifierIcon />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search"
              role="combobox"
              aria-label="Search the portfolio"
              aria-controls="search-results"
              aria-expanded={results.length > 0}
              aria-autocomplete="list"
              aria-activedescendant={results[cursor] ? `search-option-${cursor}` : undefined}
              autoComplete="off"
            />
            <button type="button" onClick={close} aria-label="Close search">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && query.trim().length >= 2 ? (
          <motion.ul
            id="search-results"
            role="listbox"
            aria-label="Search results"
            className="search-results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {results.length === 0 ? (
              <li className="search-empty">Nothing matches “{query.trim()}”.</li>
            ) : (
              results.map((hit, i) => (
                <li key={`${hit.sectionId}-${hit.title}-${i}`} id={`search-option-${i}`} role="option" aria-selected={i === cursor}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(hit)}
                    className={i === cursor ? "search-hit is-active" : "search-hit"}
                  >
                    <span className="search-hit-section">{hit.section}</span>
                    <span className="search-hit-title">
                      <Highlight text={hit.title} query={query.trim()} />
                    </span>
                    <span className="search-hit-body">
                      <Highlight text={snippet(hit.body, query.trim())} query={query.trim()} />
                    </span>
                  </button>
                </li>
              ))
            )}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
