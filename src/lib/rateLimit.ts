/**
 * Sliding-window rate limiter, in memory.
 *
 * SCOPE, honestly stated: this lives in the memory of one serverless
 * instance. Vercel may run several concurrently and recycles them, so a
 * determined attacker spraying across cold starts can exceed the nominal
 * limit. What it reliably stops is the realistic case — one person or one
 * script hammering the form — which is what a personal contact form needs.
 *
 * If this ever needs to be airtight, swap the Map for Upstash Redis
 * (@upstash/ratelimit). The call signature below is deliberately the same
 * shape, so only the body of `checkRateLimit` changes.
 */

type Hit = { count: number; resetAt: number };

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3; // 3 messages per IP per hour
const MAX_KEYS = 5000; // hard cap so the Map cannot grow without bound

const hits = new Map<string, Hit>();

/** Drop expired entries; if still oversized, drop the oldest resets first. */
function prune(now: number) {
  for (const [key, hit] of hits) {
    if (hit.resetAt <= now) hits.delete(key);
  }
  if (hits.size > MAX_KEYS) {
    const sorted = [...hits.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
    for (const [key] of sorted.slice(0, hits.size - MAX_KEYS)) hits.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  prune(now);

  const existing = hits.get(key);

  if (!existing || existing.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1, retryAfter: 0 };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_PER_WINDOW - existing.count,
    retryAfter: 0,
  };
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
