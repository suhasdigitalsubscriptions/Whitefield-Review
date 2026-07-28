"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DealershipConfig, FlowStep } from "@/lib/types";
import { experienceCategories } from "@/lib/config";
import { track } from "@/lib/analytics";
import BrandHeader from "./BrandHeader";
import ProgressIndicator from "./ProgressIndicator";
import WelcomeScreen from "./WelcomeScreen";
import ExperienceSelector from "./ExperienceSelector";
import ReviewGenerator from "./ReviewGenerator";
import GenerationError from "./GenerationError";
import ReviewEditor from "./ReviewEditor";
import SuccessScreen from "./SuccessScreen";
import { IconChevronLeft } from "./icons";

interface ReviewPortalProps {
  dealership: DealershipConfig;
}

type InternalStep = FlowStep | "error";

/** Keep the loading state on screen long enough to feel intentional. */
const MIN_LOADING_MS = 650;

type GenerateResult =
  | { ok: true; review: string }
  | { ok: false; message: string; status: number };

export default function ReviewPortal({ dealership }: ReviewPortalProps) {
  const [step, setStep] = useState<InternalStep>("welcome");
  const [selected, setSelected] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [generationErrorDetail, setGenerationErrorDetail] = useState<string>(
    "Please try again."
  );
  const [copyIssue, setCopyIssue] = useState(false);
  const [copiedSuccessfully, setCopiedSuccessfully] = useState(false);
  const variationSeedRef = useRef(0);

  useEffect(() => {
    track("portal_opened", dealership.slug);
    // Only fire once when the portal first mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }, []);

  const requestReview = useCallback(async (): Promise<GenerateResult> => {
    variationSeedRef.current += 1;
    const started = Date.now();
    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: selected,
          dealership: dealership.slug,
          variationSeed: variationSeedRef.current,
        }),
      });

      const elapsed = Date.now() - started;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
      }

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const parsed = data as { review?: unknown; error?: unknown } | null;

      if (!res.ok || !parsed || typeof parsed.review !== "string" || !parsed.review.trim()) {
        const message =
          parsed && typeof parsed.error === "string"
            ? parsed.error
            : "We couldn't create your review right now.";
        return { ok: false, message, status: res.status };
      }

      return { ok: true, review: parsed.review };
    } catch {
      const elapsed = Date.now() - started;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
      }
      return {
        ok: false,
        message: "We couldn't reach the server. Please check your connection.",
        status: 0,
      };
    }
  }, [selected, dealership.slug]);

  async function handleContinueFromSelect() {
    if (selected.length === 0) return;
    track("experience_selected", dealership.slug);
    setStep("generating");
    const result = await requestReview();
    if (result.ok) {
      setReview(result.review);
      setCopiedSuccessfully(false);
      setCopyIssue(false);
      setStep("edit");
      track("review_generated", dealership.slug);
    } else {
      setGenerationErrorDetail(
        result.status === 429 ? result.message : "Please try again."
      );
      setStep("error");
      track("review_generation_failed", dealership.slug);
    }
  }

  async function handleGenerateAnother() {
    setIsRegenerating(true);
    setRegenerateError(null);
    const result = await requestReview();
    setIsRegenerating(false);
    if (result.ok) {
      setReview(result.review);
      track("review_generated", dealership.slug);
    } else {
      setRegenerateError(
        result.status === 429
          ? result.message
          : "We couldn't create another version. Please try again."
      );
      track("review_generation_failed", dealership.slug);
    }
  }

  async function handleCopyAndContinue() {
    if (!review.trim()) return;
    try {
      await navigator.clipboard.writeText(review);
      setCopiedSuccessfully(true);
      setCopyIssue(false);
      track("review_copied", dealership.slug);
      setStep("success");
    } catch {
      setCopyIssue(true);
      setCopiedSuccessfully(false);
      track("review_copy_failed", dealership.slug);
    }
  }

  function handleContinueAnyway() {
    setStep("success");
  }

  function handleOpenGoogle() {
    track("google_review_clicked", dealership.slug);
    window.open(dealership.googleReviewUrl, "_blank", "noopener,noreferrer");
  }

  function handleBack() {
    if (step === "select") setStep("welcome");
    else if (step === "error") setStep("select");
    else if (step === "edit") setStep("select");
    else if (step === "success") setStep("edit");
  }

  const showTopBar = step !== "welcome";
  const canGoBack = step !== "generating";

  return (
    <div className="min-h-dvh w-full bg-[var(--color-mist)] sm:flex sm:items-center sm:justify-center sm:py-10">
    <div className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col bg-[var(--color-surface)] px-5 pb-10 pt-6 sm:min-h-0 sm:max-h-[880px] sm:overflow-y-auto sm:rounded-[32px] sm:border sm:border-[var(--color-line)] sm:shadow-[var(--shadow-lifted)]">
      {showTopBar && (
        <>
          <div className="mb-1 flex items-center">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              tabIndex={canGoBack ? 0 : -1}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-charcoal)] transition-colors hover:bg-black/5 ${
                canGoBack ? "" : "invisible"
              }`}
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-1 justify-center">
              <BrandHeader variant="compact" />
            </div>
            <span className="h-9 w-9" aria-hidden="true" />
          </div>
          <ProgressIndicator step={step === "error" ? "select" : step} />
        </>
      )}

      <main className="flex flex-1 flex-col">
        {step === "welcome" && (
          <WelcomeScreen dealership={dealership} onStart={() => setStep("select")} />
        )}

        {step === "select" && (
          <ExperienceSelector
            categories={experienceCategories}
            selected={selected}
            onToggle={toggleCategory}
            onContinue={handleContinueFromSelect}
          />
        )}

        {step === "generating" && <ReviewGenerator />}

        {step === "error" && (
          <GenerationError
            detail={generationErrorDetail}
            onRetry={handleContinueFromSelect}
            onBack={() => setStep("select")}
          />
        )}

        {step === "edit" && (
          <ReviewEditor
            review={review}
            onChange={setReview}
            onGenerateAnother={handleGenerateAnother}
            onCopyAndContinue={handleCopyAndContinue}
            onContinueAnyway={handleContinueAnyway}
            onBack={() => setStep("select")}
            isRegenerating={isRegenerating}
            regenerateError={regenerateError}
            copyIssue={copyIssue}
          />
        )}

        {step === "success" && (
          <SuccessScreen
            copied={copiedSuccessfully}
            onOpenGoogle={handleOpenGoogle}
            onBack={() => setStep("edit")}
          />
        )}
      </main>
    </div>
    </div>
  );
}
