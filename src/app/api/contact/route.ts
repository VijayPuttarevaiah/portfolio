import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, clientKey } from "@/lib/rateLimit";
import { person } from "@/content/resume";

/** Node runtime: the rate limiter keeps state between warm invocations. */
export const runtime = "nodejs";

const LIMITS = {
  name: 100,
  email: 200,
  subject: 150,
  message: 4000,
};

/** Minimum seconds between the form rendering and submitting. Bots are instant. */
const MIN_FILL_SECONDS = 3;

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isEmail(value: string): boolean {
  // Deliberately permissive: reject the obviously malformed, let the rest
  // through. Over-strict email regexes reject valid addresses.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= LIMITS.email;
}

/** Strip CR/LF so nothing can inject extra headers via the subject line. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  // 1. Rate limit before doing any work.
  const key = clientKey(request.headers);
  const limit = checkRateLimit(key);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many messages. Try again in about ${Math.ceil(
          limit.retryAfter / 60,
        )} minutes.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // 2. Parse.
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("Could not read that request.");
  }

  const name = singleLine(String(body.name ?? ""));
  const email = singleLine(String(body.email ?? ""));
  const subject = singleLine(String(body.subject ?? ""));
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.company ?? ""); // hidden field, humans leave blank
  const renderedAt = Number(body.renderedAt ?? 0);

  // 3. Bot checks. Both fail silently as success so bots learn nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }
  if (
    Number.isFinite(renderedAt) &&
    renderedAt > 0 &&
    Date.now() - renderedAt < MIN_FILL_SECONDS * 1000
  ) {
    return NextResponse.json({ ok: true });
  }

  // 4. Validate.
  if (!name) return bad("Please add your name.");
  if (name.length > LIMITS.name) return bad("That name is too long.");
  if (!isEmail(email)) return bad("That email address does not look right.");
  if (!subject) return bad("Please add a subject.");
  if (subject.length > LIMITS.subject) return bad("That subject is too long.");
  if (!message) return bad("Please add a message.");
  if (message.length > LIMITS.message) {
    return bad(`Please keep the message under ${LIMITS.message} characters.`);
  }

  // 5. Send.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — cannot send.");
    return NextResponse.json(
      {
        ok: false,
        error:
          "The contact form is not configured yet. Please email me directly.",
      },
      { status: 503 },
    );
  }

  // Resend allows onboarding@resend.dev without domain verification, but only
  // to the account owner's own address — which is exactly this use case.
  const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO ?? person.email;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `[Portfolio] ${subject}`,
      replyTo: email, // replying in the mail client goes straight to the sender
      text: [
        `From:    ${name} <${email}>`,
        `Subject: ${subject}`,
        "",
        message,
        "",
        "—",
        "Sent from the contact form on your portfolio.",
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#14121f">
          <p style="margin:0 0 4px"><strong>From:</strong> ${escapeHtml(name)}
            &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;</p>
          <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <div style="white-space:pre-wrap;padding:16px;background:#f6f5fb;border-radius:10px">${escapeHtml(
            message,
          )}</div>
          <p style="margin-top:20px;font-size:13px;color:#6b6785">
            Sent from the contact form on your portfolio.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend rejected the send:", error);
      return NextResponse.json(
        { ok: false, error: "Could not send that. Please email me directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, remaining: limit.remaining });
  } catch (err) {
    console.error("[contact] Unexpected failure:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please email me directly." },
      { status: 500 },
    );
  }
}
