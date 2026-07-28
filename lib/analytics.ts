import type { AnalyticsEvent } from "./types";

/**
 * Minimal, privacy-conscious analytics hook.
 *
 * Disabled by default. No customer content, names, phone numbers, emails,
 * or review text are ever passed through this function - only the fixed
 * anonymous event names defined in `AnalyticsEvent`, plus a dealership slug.
 *
 * To wire up a real provider (Vercel Analytics, Plausible, PostHog, etc.):
 *   1. Set NEXT_PUBLIC_ANALYTICS_ENABLED=true in your environment.
 *   2. Replace the body of `track()` below with a call to your provider's
 *      client-side event function, forwarding only `event` and `dealership`.
 */
export function track(event: AnalyticsEvent, dealership: string): void {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;

  // Default no-op implementation: forwards to window.dataLayer if present
  // (compatible with most tag-manager setups) without adding a dependency.
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, dealership });
  }
}
