"use client";

import { useEffect, useRef, useState } from "react";
import { gmailCompose, person } from "@/content/resume";
import Reveal from "./Reveal";

type Mode = "closed" | "email";
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[0.95rem] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg-subtle)] focus:border-[var(--accent)]";

const MESSAGE_MAX = 4000;


function MailMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function Contact() {
  const [mode, setMode] = useState<Mode>("closed");
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
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <h2 id="contact-heading" className="section-heading">
            Contact
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--fg-muted)]">
            {person.availability}, and{" "}
            {person.workAuth.charAt(0).toLowerCase() + person.workAuth.slice(1)}. Pick
            whichever is easier.
          </p>

          <div className="contact-routes">
            <button
              type="button"
              onClick={() => {
                setMode("email");
                window.setTimeout(() => {
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  document.getElementById("name")?.focus({ preventScroll: true });
                }, 90);
              }}
              aria-expanded={mode === "email"}
              aria-controls="contact-form"
              className="contact-route is-primary"
            >
              <span>Write here</span>
              <span className="contact-route-note">Sends straight to my inbox</span>
            </button>

            <a
              href={gmailCompose("Hello Vijay")}
              target="_blank"
              rel="noreferrer noopener"
              className="contact-route"
            >
              <span>
                Open in Gmail <span aria-hidden="true">↗</span>
              </span>
              <span className="contact-route-note">Compose in your own account</span>
            </a>
          </div>
        </Reveal>

        {/* ---------- Email ---------- */}
        {mode === "email" ? (
          <div className="mt-10">
            <div
              className="contact-panel mt-5 p-6 sm:p-9"
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
                <form id="contact-form" onSubmit={onSubmit} noValidate>
                  {/* honeypot — hidden from people, tempting to bots */}
                  <div
                    className="absolute h-0 w-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-[var(--fg)]"
                      >
                        Your name
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        maxLength={100}
                        autoComplete="name"
                        className={inputClass}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-[var(--fg)]"
                      >
                        Your email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={200}
                        autoComplete="email"
                        className={inputClass}
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-[var(--fg)]"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      required
                      maxLength={150}
                      className={inputClass}
                      placeholder="Co-op opportunity at …"
                    />
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-baseline justify-between">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-[var(--fg)]"
                      >
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
                      style={{
                        background:
                          "linear-gradient(100deg, var(--h1), var(--h2))",
                      }}
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
              <a
                href={`mailto:${person.email}`}
                className="text-[var(--accent)] underline underline-offset-4"
              >
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
              {
                label: "Email",
                value: person.email,
                href: gmailCompose("Hello Vijay"),
                icon: <MailMark />,
              },
              {
                label: "LinkedIn",
                value: person.linkedinHandle,
                href: person.linkedin,
                icon: <LinkedInMark />,
              },
            ].map((link) => (
              <div key={link.label}>
                <dt className="contact-label">
                  <span className="contact-mark" aria-hidden="true">
                    {link.icon}
                  </span>
                  {link.label}
                </dt>
                <dd className="mt-2">
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noreferrer noopener"
                        : undefined
                    }
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
