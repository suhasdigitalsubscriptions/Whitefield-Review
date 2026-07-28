/**
 * Rate limiting abstraction.
 *
 * V1 uses an in-memory sliding-window limiter. This is intentionally simple
 * and has a known limitation in serverless environments: each function
 * instance (and each region/cold start) has its own memory, so the limit is
 * enforced per-instance rather than globally. For a single-showroom QR-code
 * flow with low concurrent traffic this is a reasonable V1 trade-off and
 * avoids adding a database for V1.
 *
 * RECOMMENDED PRODUCTION UPGRADE:
 * Swap `MemoryRateLimiter` for a store-backed limiter such as
 * `@upstash/ratelimit` + Upstash Redis (works natively on Vercel), or
 * Vercel KV. Because callers only depend on the `RateLimiter` interface
 * below, that swap requires no changes outside this file.
 */

export interface RateLimitResult {
  /** Whether the request is allowed to proceed */
  allowed: boolean;
  /** Seconds the caller should wait before retrying, if not allowed */
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

interface Bucket {
  timestamps: number[];
}

class MemoryRateLimiter implements RateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {}

  check(key: string): RateLimitResult {
    const now = Date.now();
    const bucket = this.buckets.get(key) ?? { timestamps: [] };

    // Drop timestamps outside the current window.
    bucket.timestamps = bucket.timestamps.filter(
      (t) => now - t < this.windowMs
    );

    if (bucket.timestamps.length >= this.maxRequests) {
      const oldest = bucket.timestamps[0];
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((this.windowMs - (now - oldest)) / 1000)
      );
      this.buckets.set(key, bucket);
      return { allowed: false, retryAfterSeconds };
    }

    bucket.timestamps.push(now);
    this.buckets.set(key, bucket);

    // Opportunistic cleanup so the map doesn't grow unbounded on a
    // long-lived instance.
    if (this.buckets.size > 5000) {
      for (const [k, b] of this.buckets) {
        if (b.timestamps.every((t) => now - t >= this.windowMs)) {
          this.buckets.delete(k);
        }
      }
    }

    return { allowed: true };
  }
}

/**
 * Limiter applied to POST /api/generate-review.
 * 10 requests per 5 minutes per client is generous for a genuine customer
 * (initial draft + a few "Generate Another" clicks) while blocking scripted
 * abuse of the OpenAI-backed endpoint.
 */
export const generateReviewRateLimiter: RateLimiter = new MemoryRateLimiter(
  10,
  5 * 60 * 1000
);

/** Best-effort client identifier from standard proxy headers (Vercel sets these). */
export function getClientKey(request: Request): string {
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
