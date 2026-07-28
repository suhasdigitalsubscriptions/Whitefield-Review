"use client";

import { useState } from "react";
import { IconAlertCircle, IconChevronLeft, IconCopy, IconRefresh } from "./icons";

interface ReviewEditorProps {
  review: string;
  onChange: (value: string) => void;
  onGenerateAnother: () => void;
  onCopyAndContinue: () => void;
  onContinueAnyway: () => void;
  onBack: () => void;
  isRegenerating: boolean;
  regenerateError: string | null;
  copyIssue: boolean;
}

export default function ReviewEditor({
  review,
  onChange,
  onGenerateAnother,
  onCopyAndContinue,
  onContinueAnyway,
  onBack,
  isRegenerating,
  regenerateError,
  copyIssue,
}: ReviewEditorProps) {
  const [quickCopyState, setQuickCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  async function handleQuickCopy() {
    try {
      await navigator.clipboard.writeText(review);
      setQuickCopyState("copied");
    } catch {
      setQuickCopyState("failed");
    }
    setTimeout(() => setQuickCopyState("idle"), 2000);
  }

  const wordCount = review.trim().length === 0 ? 0 : review.trim().split(/\s+/).length;

  return (
    <div className="flex flex-1 flex-col animate-fade-rise">
      <h1 className="font-display text-[22px] font-bold text-[var(--color-charcoal)]">
        Your Review
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
        Feel free to edit the review so it accurately reflects your experience.
      </p>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)]">
          <textarea
            value={review}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Your review - editable"
            spellCheck
            className="brand-scroll h-full min-h-[200px] w-full resize-none bg-transparent p-4 text-[15px] leading-relaxed text-[var(--color-charcoal)] outline-none"
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[12px] text-[var(--color-ink-muted)]">
            {review.length} characters &middot; {wordCount} words
          </span>
          <button
            type="button"
            onClick={handleQuickCopy}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-accent-deep)]"
          >
            <IconCopy className="h-3.5 w-3.5" />
            {quickCopyState === "copied"
              ? "Copied"
              : quickCopyState === "failed"
              ? "Couldn't copy"
              : "Copy"}
          </button>
        </div>
      </div>

      {regenerateError && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fdf2e3] px-3.5 py-3 text-[13px] text-[var(--color-charcoal-soft)]">
          <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-deep)]" />
          <span>{regenerateError}</span>
        </div>
      )}

      {copyIssue && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fdf2e3] px-3.5 py-3 text-[13px] text-[var(--color-charcoal-soft)]">
          <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-deep)]" />
          <div className="flex-1">
            <p>Please copy the review manually using the text box.</p>
            <button
              type="button"
              onClick={onContinueAnyway}
              className="mt-1.5 font-semibold text-[var(--color-charcoal)] underline underline-offset-2"
            >
              Continue to Google Reviews anyway
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onGenerateAnother}
          disabled={isRegenerating}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-line)] bg-white py-3.5 text-[14px] font-semibold text-[var(--color-charcoal)] transition-colors disabled:opacity-60"
        >
          <IconRefresh className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
          {isRegenerating ? "Generating another..." : "Generate Another"}
        </button>
        <button
          type="button"
          onClick={onCopyAndContinue}
          disabled={review.trim().length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-4 text-[15px] font-semibold text-[var(--color-charcoal)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--color-accent-deep)] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy Review &amp; Continue
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-1.5 py-2 text-[13.5px] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-charcoal)]"
        >
          <IconChevronLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </div>
    </div>
  );
}
