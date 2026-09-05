"use client";

import { useEffect, useRef, useState } from "react";
import { person } from "@/content/resume";
import Reveal from "./Reveal";

type Mode = "choose" | "call" | "email";
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[0.95rem] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg-subtle)] focus:border-[var(--accent)]";

const MESSAGE_MAX = 4000;

export default function Contact() {
  const [mode, setMode] = useState<Mode>("choose");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  /** Stamped when the form first opens — the API rejects instant submits. */
  const renderedAt = useRef(0);

  useEffect(() => {
    if (mode === "email" && renderedAt.current === 0) {
      renderedAt.current = Date.now();
    }
  }, [mode]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    setStatus({ kind: "sending" });

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          company: data.get("company"), // honeypot
          renderedAt: renderedAt.current,
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus({ kind: "sent" });
        setMessage("");
      } else {
        setStatus({
          kind: "error",
          message: json.error ?? "Could not send that. Please try again.",
        });
      }
    } catch {
      setStatus({
        kind: "error",
        message: "Network problem. Please check your connection and retry.",
      });
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the address is visible on screen anyway.
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            08 — Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl"
          >
            Open to software engineering roles.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--fg-muted)]">
            {person.availability}, and {person.workAuth.toLowerCase()}. Pick
            whichever is easier.
          </p>
        </Reveal>

        {/* ---------- Step 1: choose a channel ---------- */}
        {mode === "choose" ? (
          <Reveal delay={80}>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("call")}
                className="card-r flex items-start gap-4 border-2 p-6 text-left transition-shadow hover:shadow-xl"
                style={{ borderColor: "var(--h2)" }}
              >
                <span
                  className="mt-0.5 shrink-0 rounded-xl p-2.5"
                  style={{ background: "var(--h2-soft)", color: "var(--h2)" }}
                >
                  <PhoneIcon />
                </span>
                <span>
                  <span className="block text-lg font-semibold text-[var(--fg)]">
                    Call
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-[var(--fg-muted)]">
                    Quickest for a short conversation.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode("email")}
                className="card-r flex items-start gap-4 border-2 p-6 text-left transition-shadow hover:shadow-xl"
                style={{ borderColor: "var(--h1)" }}
              >
                <span
                  className="mt-0.5 shrink-0 rounded-xl p-2.5"
                  style={{ background: "var(--h1-soft)", color: "var(--h1)" }}
                >
                  <MailIcon />
                </span>
                <span>
                  <span className="block text-lg font-semibold text-[var(--fg)]">
                    Email
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-[var(--fg-muted)]">
                    Write a message here and it reaches my inbox.
                  </span>
                </span>
              </button>
            </div>
          </Reveal>
        ) : null}

        {/* ---------- Call ---------- */}
        {mode === "call" ? (
          <div className="mt-10">
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <BackIcon /> Back
            </button>
            <div
              className="card-r mt-5 border-2 p-7 sm:p-9"
              style={{ borderColor: "var(--h2)" }}
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                Phone
              </p>
              <a
                href={`tel:${person.phone.replace(/[^\d]/g, "")}`}
                className="mt-3 block font-display text-3xl font-bold tracking-tight transition-opacity hover:opacity-80 sm:text-4xl"
                style={{ color: "var(--h2)" }}
              >
                {person.phone}
              </a>
              <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">
                I am on Atlantic Time. If I miss the call, a text or an email
                gets a faster reply.
              </p>
            </div>
          </div>
        ) : null}

        {/* ---------- Email ---------- */}
        {mode === "email" ? (
          <div className="mt-10">
            <button
              type="button"
              onClick={() => {
                setMode("choose");
                setStatus({ kind: "idle" });
              }}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <BackIcon /> Back
            </button>

            <div
              className="card-r mt-5 border-2 p-6 sm:p-9"
              style={{ borderColor: "var(--h1)" }}
            >
              {status.kind === "sent" ? (
                <div className="py-6 text-center">
                  <p
                    className="font-display text-2xl font-bold"
                    style={{ color: "var(--h3)" }}
                  >
                    Message sent
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--fg-muted)]">
                    It has landed in my inbox and I will reply to the address
                    you gave. Thanks for reaching out.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus({ kind: "idle" })}
                    className="mt-6 text-sm font-medium text-[var(--accent)] underline underline-offset-4"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  {/* honeypot — hidden from people, tempting to bots */}
                  <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--fg)]">
                        Your name
                      </label>
                      <input id="name" name="name" required maxLength={100} autoComplete="name" className={inputClass} placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--fg)]">
                        Your email
                      </label>
                      <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="jane@company.com" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[var(--fg)]">
                      Subject
                    </label>
                    <input id="subject" name="subject" required maxLength={150} className={inputClass} placeholder="Co-op opportunity at …" />
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-baseline justify-between">
                      <label htmlFor="message" className="block text-sm font-medium text-[var(--fg)]">
                        Message
                      </label>
                      <span className="font-mono text-[0.7rem] text-[var(--fg-subtle)]">
                        {message.length}/{MESSAGE_MAX}
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={7}
                      maxLength={MESSAGE_MAX}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputClass} resize-y`}
                      placeholder="A bit about the role or what you would like to talk about."
                    />
                  </div>

                  {status.kind === "error" ? (
                    <p
                      role="alert"
                      className="mt-4 rounded-xl border-2 px-4 py-3 text-sm"
                      style={{ borderColor: "var(--h5)", color: "var(--h5)" }}
                    >
                      {status.message}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={status.kind === "sending"}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: "linear-gradient(100deg, var(--h1), var(--h2))" }}
                    >
                      {status.kind === "sending" ? "Sending…" : "Send message"}
                    </button>
                    <p className="text-xs leading-relaxed text-[var(--fg-subtle)]">
                      Goes straight to my inbox. Limited to 3 messages an hour
                      to keep out spam.
                    </p>
                  </div>
                </form>
              )}
            </div>

            <p className="mt-5 text-sm text-[var(--fg-muted)]">
              Prefer your own mail client?{" "}
              <a href={`mailto:${person.email}`} className="text-[var(--accent)] underline underline-offset-4">
                {person.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="ml-3 rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </p>
          </div>
        ) : null}

        {/* ---------- Always-visible links ---------- */}
        <Reveal delay={130}>
          <dl className="mt-14 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-[var(--border)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Email", value: person.email, href: `mailto:${person.email}` },
              { label: "Phone", value: person.phone, href: `tel:${person.phone.replace(/[^\d]/g, "")}` },
              { label: "GitHub", value: person.githubHandle, href: person.github },
              { label: "LinkedIn", value: person.linkedinHandle, href: person.linkedin },
            ].map((link) => (
              <div key={link.label}>
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                  {link.label}
                </dt>
                <dd className="mt-2">
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="text-sm text-[var(--fg)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                  >
                    {link.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
