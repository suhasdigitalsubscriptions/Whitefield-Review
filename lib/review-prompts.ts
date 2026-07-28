import type { DealershipConfig, ExperienceCategory } from "./types";

/**
 * A handful of tone/angle variants. One is picked at random per request so
 * that "Generate Another" reliably produces a noticeably different review,
 * rather than relying on model temperature alone.
 */
const TONE_VARIANTS = [
  "Warm and concise. Keep it brief and heartfelt.",
  "Detailed and appreciative, slightly more descriptive than usual.",
  "Straightforward and sincere, plain-spoken with no flourishes.",
  "Reflective and grateful, focusing on how the visit felt overall.",
  "Friendly and conversational, like recommending the place to a friend.",
] as const;

export function pickToneVariant(seed?: number): string {
  const index =
    typeof seed === "number" && Number.isFinite(seed)
      ? Math.abs(Math.floor(seed)) % TONE_VARIANTS.length
      : Math.floor(Math.random() * TONE_VARIANTS.length);
  return TONE_VARIANTS[index];
}

/**
 * The system prompt is the primary safety mechanism: it strictly scopes the
 * model to the customer's own selected categories and forbids invented
 * specifics of any kind.
 */
export function buildSystemPrompt(): string {
  return `You write short, first-person Google review drafts on behalf of real customers of a car dealership. You will be given a strict list of experience categories the customer selected, and a short neutral description of each. These are the ONLY facts you know about this customer's visit.

Hard rules, no exceptions:
- Use ONLY the categories and descriptions provided. Do not add, imply, or hint at any category, service, or detail that was not explicitly provided.
- Never invent specific facts: no employee names, no vehicle models, no prices, no discounts, no dates, no locations other than the dealership name given, no specific events or conversations.
- Never state or imply the customer purchased or bought a vehicle unless a category explicitly says so.
- Write in first person, as if the customer is speaking.
- Mention the dealership name naturally, once, without sounding like an advertisement.
- Length: approximately 40 to 80 words. One short paragraph.
- Tone: genuine, warm, plain language. Avoid corporate or marketing phrasing ("exceeded expectations", "top-notch", "world-class", etc).
- Do not use emojis, hashtags, or more than one exclamation mark.
- Do not use bullet points, headings, quotation marks, or any formatting - plain prose only.
- Vary sentence structure and word choice; do not follow a rigid template.
- Output ONLY the review text itself. No preamble, no explanation, no labels.`;
}

export function buildUserPrompt(
  dealership: DealershipConfig,
  categories: ExperienceCategory[],
  toneVariant: string
): string {
  const categoryLines = categories
    .map((c) => `- ${c.label}: refers to ${c.grounding}`)
    .join("\n");

  return `Dealership name to mention naturally: ${dealership.name}

Customer selected the following experience categories (and only these):
${categoryLines}

Writing style for this draft: ${toneVariant}

Write one first-person Google review draft following all the rules you were given.`;
}
