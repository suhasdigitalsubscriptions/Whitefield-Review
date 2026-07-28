import type { DealershipConfig, ExperienceCategory } from "./types";

/**
 * Central dealership registry.
 *
 * V1 ships with only "whitefield" active. To bring a future outlet online:
 *   1. Duplicate one of the inactive entries below.
 *   2. Fill in the real name, address, and Google Review URL.
 *   3. Set `active: true`.
 *   4. Point that outlet's QR code at /review/<slug>.
 *
 * No other code changes are required - pages, metadata, and the API route
 * all read from this file.
 */
export const dealerships: Record<string, DealershipConfig> = {
  whitefield: {
    slug: "whitefield",
    name: "Epitome Kia Whitefield",
    dealershipName: "Epitome Automobiles Pvt Ltd",
    location: "Whitefield, Bengaluru",
    googleReviewUrl: "https://g.page/r/CbqyLezxFvTnEAE/review",
    active: true,
  },
  yelahanka: {
    slug: "yelahanka",
    name: "Epitome Kia Yelahanka",
    dealershipName: "Epitome Automobiles Pvt Ltd",
    location: "Yelahanka, Bengaluru",
    googleReviewUrl: "",
    active: false,
  },
  kolar: {
    slug: "kolar",
    name: "Epitome Kia Kolar",
    dealershipName: "Epitome Automobiles Pvt Ltd",
    location: "Kolar",
    googleReviewUrl: "",
    active: false,
  },
  avalahalli: {
    slug: "avalahalli",
    name: "Epitome Kia Avalahalli",
    dealershipName: "Epitome Automobiles Pvt Ltd",
    location: "Avalahalli, Bengaluru",
    googleReviewUrl: "",
    active: false,
  },
  varthur: {
    slug: "varthur",
    name: "Epitome Kia Varthur",
    dealershipName: "Epitome Automobiles Pvt Ltd",
    location: "Varthur, Bengaluru",
    googleReviewUrl: "",
    active: false,
  },
};

/** The slug used when no location is specified (root URL redirect target). */
export const DEFAULT_DEALERSHIP_SLUG = "whitefield";

/** Look up a dealership by slug. Returns undefined if the slug is unknown. */
export function getDealership(slug: string): DealershipConfig | undefined {
  return dealerships[slug];
}

/** Look up a dealership only if it's known AND currently active. */
export function getActiveDealership(slug: string): DealershipConfig | undefined {
  const d = getDealership(slug);
  return d && d.active ? d : undefined;
}

/**
 * The nine experience categories a customer can select in Step 2.
 * `grounding` is the only factual context passed to the AI for that
 * category - keep it neutral and generic so nothing is ever implied
 * beyond what the customer actually selected.
 */
export const experienceCategories: ExperienceCategory[] = [
  {
    id: "sales_experience",
    label: "Sales Experience",
    grounding: "the overall car buying / sales process",
  },
  {
    id: "sales_consultant",
    label: "Sales Consultant",
    grounding: "the sales consultant who assisted them",
  },
  {
    id: "staff",
    label: "Staff",
    grounding: "the dealership staff in general",
  },
  {
    id: "hospitality",
    label: "Hospitality",
    grounding: "the hospitality and comfort provided during the visit",
  },
  {
    id: "finance",
    label: "Finance",
    grounding: "the vehicle finance process",
  },
  {
    id: "insurance",
    label: "Insurance",
    grounding: "the vehicle insurance process",
  },
  {
    id: "accessories",
    label: "Accessories",
    grounding: "assistance choosing or fitting vehicle accessories",
  },
  {
    id: "vehicle_delivery",
    label: "Vehicle Delivery",
    grounding: "the vehicle delivery experience",
  },
  {
    id: "overall_experience",
    label: "Overall Experience",
    grounding: "their overall visit to the dealership",
  },
];

export const MAX_SELECTABLE_CATEGORIES = experienceCategories.length;

/** Site-wide metadata defaults, overridden per-dealership where relevant. */
export const siteConfig = {
  brandName: "Epitome Kia",
  defaultTitle: "Epitome Kia | Share Your Experience",
  defaultDescription: "Share your experience with Epitome Kia.",
  themeColor: "#171717",
};
