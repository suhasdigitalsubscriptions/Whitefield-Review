import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getActiveDealership, experienceCategories } from "@/lib/config";
import { buildSystemPrompt, buildUserPrompt, pickToneVariant } from "@/lib/review-prompts";
import { generateReviewRateLimiter, getClientKey } from "@/lib/rate-limit";
import type { GenerateReviewRequest, GenerateReviewResponse } from "@/lib/types";

export const runtime = "nodejs";

// Defensive cap on raw request body size. The real payload is a handful of
// short category ids, so anything beyond this is malformed or abusive.
const MAX_BODY_BYTES = 4 * 1024;

const CATEGORY_ID_SET = new Set(experienceCategories.map((c) => c.id));
const MAX_CATEGORIES = experienceCategories.length;

const FRIENDLY_ERROR = "We couldn't create your review right now.";

function errorResponse(message: string, status: number): NextResponse<GenerateReviewResponse> {
  return NextResponse.json({ error: message }, { status });
}

/** Light defense-in-depth cleanup in case the model drifts from instructions. */
function sanitizeReviewText(text: string): string {
  let cleaned = text.trim();

  // Strip a small, well-known range of emoji code points.
  cleaned = cleaned.replace(
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu,
    ""
  );

  // Strip hashtags (e.g. "#Epitome") without eating normal punctuation.
  cleaned = cleaned.replace(/#\S+/g, "");

  // Collapse repeated exclamation marks down to at most one in a row,
  // and cap the total count in the review to one.
  const exclamationCount = (cleaned.match(/!/g) ?? []).length;
  if (exclamationCount > 1) {
    let seen = 0;
    cleaned = cleaned.replace(/!/g, () => {
      seen += 1;
      return seen === 1 ? "!" : ".";
    });
  }

  // Strip any wrapping quotation marks the model may have added.
  cleaned = cleaned.replace(/^["'\u201c]+|["'\u201d]+$/g, "");

  return cleaned.replace(/\s{2,}/g, " ").trim();
}

export async function POST(request: Request): Promise<NextResponse<GenerateReviewResponse>> {
  try {
    // --- Body size guard -------------------------------------------------
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_BODY_BYTES) {
      return errorResponse(FRIENDLY_ERROR, 413);
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return errorResponse(FRIENDLY_ERROR, 413);
    }

    // --- Parse ------------------------------------------------------------
    let body: GenerateReviewRequest;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return errorResponse(FRIENDLY_ERROR, 400);
    }

    // --- Validate dealership ----------------------------------------------
    if (typeof body.dealership !== "string") {
      return errorResponse(FRIENDLY_ERROR, 400);
    }
    const dealership = getActiveDealership(body.dealership);
    if (!dealership) {
      return errorResponse(FRIENDLY_ERROR, 400);
    }

    // --- Validate categories ------------------------------------------------
    if (!Array.isArray(body.categories) || body.categories.length === 0) {
      return errorResponse(FRIENDLY_ERROR, 400);
    }
    if (body.categories.length > MAX_CATEGORIES) {
      return errorResponse(FRIENDLY_ERROR, 400);
    }
    const uniqueIds = Array.from(new Set(body.categories));
    if (uniqueIds.some((id) => typeof id !== "string" || !CATEGORY_ID_SET.has(id))) {
      return errorResponse(FRIENDLY_ERROR, 400);
    }
    const selectedCategories = experienceCategories.filter((c) =>
      uniqueIds.includes(c.id)
    );

    // --- Rate limit ---------------------------------------------------------
    const clientKey = getClientKey(request);
    const rateLimit = generateReviewRateLimiter.check(clientKey);
    if (!rateLimit.allowed) {
      return errorResponse(
        "You're generating reviews a little too quickly. Please wait a moment and try again.",
        429
      );
    }

    // --- API key guard --------------------------------------------------
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Do not leak configuration details to the client.
      console.error("generate-review: OPENAI_API_KEY is not configured");
      return errorResponse(FRIENDLY_ERROR, 500);
    }

    const client = new OpenAI({ apiKey });
    const toneVariant = pickToneVariant(body.variationSeed);

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.9,
      top_p: 0.95,
      presence_penalty: 0.2,
      max_tokens: 220,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        {
          role: "user",
          content: buildUserPrompt(dealership, selectedCategories, toneVariant),
        },
      ],
    });

    const rawText = completion.choices?.[0]?.message?.content ?? "";
    const review = sanitizeReviewText(rawText);

    if (!review) {
      return errorResponse(FRIENDLY_ERROR, 502);
    }

    // Do NOT log review text or category selections - see privacy notes in README.
    return NextResponse.json({ review });
  } catch (err) {
    // Log only the error shape, never request content or generated text.
    console.error(
      "generate-review: unexpected error",
      err instanceof Error ? err.message : "unknown"
    );
    return errorResponse(FRIENDLY_ERROR, 500);
  }
}
