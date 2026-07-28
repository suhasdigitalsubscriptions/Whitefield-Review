/**
 * Shared type definitions for the Epitome Kia review portal.
 */

/** A single dealership outlet configuration. */
export interface DealershipConfig {
  /** URL slug, e.g. "whitefield" -> /review/whitefield */
  slug: string;
  /** Public-facing display name, e.g. "Epitome Kia Whitefield" */
  name: string;
  /** Legal / corporate entity name */
  dealershipName: string;
  /** Human-readable location, e.g. "Whitefield, Bengaluru" */
  location: string;
  /** Full street address (optional, used for structured data / footer) */
  address?: string;
  /** Destination URL for posting a Google review */
  googleReviewUrl: string;
  /** Whether this outlet is live in production */
  active: boolean;
}

/** A selectable customer experience category shown in Step 2. */
export interface ExperienceCategory {
  /** Stable machine-readable identifier sent to the API */
  id: string;
  /** Label shown to the customer */
  label: string;
  /**
   * Short, neutral, factual grounding phrase describing what this category
   * covers. This is the ONLY context the AI receives about this category -
   * it must never imply anything the customer didn't select.
   */
  grounding: string;
}

/** Request body accepted by POST /api/generate-review */
export interface GenerateReviewRequest {
  /** Category ids selected by the customer (must match ExperienceCategory.id) */
  categories: string[];
  /** Dealership slug the review is being written for */
  dealership: string;
  /**
   * Optional client-generated variation token so "Generate Another" produces
   * a different result. Not trusted for anything security-sensitive.
   */
  variationSeed?: number;
}

/** Successful response from POST /api/generate-review */
export interface GenerateReviewSuccess {
  review: string;
}

/** Error response from POST /api/generate-review */
export interface GenerateReviewError {
  error: string;
}

export type GenerateReviewResponse = GenerateReviewSuccess | GenerateReviewError;

/** Steps in the customer-facing review flow. */
export type FlowStep = "welcome" | "select" | "generating" | "edit" | "success";

/** Anonymous, privacy-conscious analytics event names. */
export type AnalyticsEvent =
  | "portal_opened"
  | "experience_selected"
  | "review_generated"
  | "review_generation_failed"
  | "review_copied"
  | "review_copy_failed"
  | "google_review_clicked";
