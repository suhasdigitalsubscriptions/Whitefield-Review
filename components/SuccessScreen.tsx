import { IconCheck, IconChevronLeft, IconExternalLink } from "./icons";

interface SuccessScreenProps {
  copied: boolean;
  onOpenGoogle: () => void;
  onBack: () => void;
}

export default function SuccessScreen({ copied, onOpenGoogle, onBack }: SuccessScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6 text-center animate-fade-rise">
      <div className="animate-check-pop flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-charcoal)] text-[var(--color-accent)]">
        <IconCheck className="h-7 w-7" strokeWidth={2.5} />
      </div>

      <div>
        <h1 className="font-display text-[22px] font-bold text-[var(--color-charcoal)]">
          You&apos;re Almost Done!
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-muted)]">
          {copied
            ? "Your review has been copied."
            : "Please copy your review above before continuing."}
          <br />
          Please paste your review on Google and submit it.
        </p>
      </div>

      <div className="mt-2 flex w-full flex-col gap-2.5">
        <button
          type="button"
          onClick={onOpenGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-4 text-[15px] font-semibold text-[var(--color-charcoal)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--color-accent-deep)] hover:text-white active:scale-[0.98]"
        >
          Open Google Reviews
          <IconExternalLink className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-line)] bg-white py-3.5 text-[14px] font-semibold text-[var(--color-charcoal)]"
        >
          <IconChevronLeft className="h-4 w-4" />
          Back to Review
        </button>
      </div>

      <p className="px-2 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
        Your review should reflect your genuine experience. Feel free to edit
        it before posting.
      </p>
    </div>
  );
}
