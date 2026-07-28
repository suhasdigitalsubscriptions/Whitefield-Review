import { IconAlertCircle, IconChevronLeft, IconRefresh } from "./icons";

interface GenerationErrorProps {
  detail: string;
  onRetry: () => void;
  onBack: () => void;
}

export default function GenerationError({ detail, onRetry, onBack }: GenerationErrorProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center animate-fade-rise">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf2e3] text-[var(--color-accent-deep)]">
        <IconAlertCircle className="h-7 w-7" />
      </div>

      <div>
        <p className="font-display text-[18px] font-bold text-[var(--color-charcoal)]">
          We couldn&apos;t create your review right now.
        </p>
        <p className="mt-1.5 text-[14px] text-[var(--color-ink-muted)]">{detail}</p>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <button
          type="button"
          onClick={onRetry}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-4 text-[15px] font-semibold text-[var(--color-charcoal)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--color-accent-deep)] hover:text-white active:scale-[0.98]"
        >
          <IconRefresh className="h-4 w-4" />
          Try Again
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
