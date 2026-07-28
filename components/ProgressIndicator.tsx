import type { FlowStep } from "@/lib/types";
import { IconChevronRight } from "./icons";

const PROGRESS: Record<FlowStep, number> = {
  welcome: 0,
  select: 5,
  generating: 50,
  edit: 62,
  success: 100,
};

const LABELS = ["Experience", "Review", "Done"];

interface ProgressIndicatorProps {
  step: FlowStep;
}

/**
 * A thin "road" the customer travels along as they move through the
 * journey - a small marker glides forward at each step, echoing the
 * dealership/automotive subject instead of a generic numbered stepper.
 */
export default function ProgressIndicator({ step }: ProgressIndicatorProps) {
  const progress = PROGRESS[step];
  const isGenerating = step === "generating";

  return (
    <div
      className="w-full px-1 pt-1 pb-4"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Review progress"
    >
      <div className="relative h-5">
        {/* Road base */}
        <div
          className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 rounded-full bg-[var(--color-line)]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 10px, rgba(23,23,23,0.10) 10px 14px)",
          }}
        />
        {/* Distance covered */}
        <div
          className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-[var(--color-accent)] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-charcoal)] text-[var(--color-surface)] shadow-[var(--shadow-soft)] transition-[left] duration-500 ease-out"
          style={{ left: `${progress}%` }}
        >
          <IconChevronRight
            className={`h-3 w-3 ${isGenerating ? "animate-pulse" : ""}`}
            strokeWidth={2.5}
          />
        </div>
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] font-medium text-[var(--color-ink-muted)]">
        {LABELS.map((label, i) => {
          const thresholds = [0, 50, 100];
          const isActive = progress >= thresholds[i];
          return (
            <span
              key={label}
              className={isActive ? "text-[var(--color-charcoal)]" : undefined}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
