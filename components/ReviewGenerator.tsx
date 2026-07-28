import { IconSteeringWheel } from "./icons";

export default function ReviewGenerator() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-7 py-10 text-center animate-fade-rise"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-[3px] border-[var(--color-line)]" />
        <span
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[var(--color-accent)] animate-spin"
          style={{ animationDuration: "1s" }}
        />
        <IconSteeringWheel className="h-7 w-7 text-[var(--color-charcoal)]" />
      </div>

      <div>
        <p className="font-display text-[17px] font-bold text-[var(--color-charcoal)]">
          Creating your review&hellip;
        </p>
        <p className="mt-1.5 text-[14px] text-[var(--color-ink-muted)]">
          Turning your experience into your own words.
        </p>
      </div>

      <div className="w-full max-w-[280px] space-y-2.5">
        <div className="h-3 w-full animate-pulse rounded-full bg-[var(--color-line)]" />
        <div className="h-3 w-11/12 animate-pulse rounded-full bg-[var(--color-line)]" />
        <div className="mx-auto h-3 w-4/5 animate-pulse rounded-full bg-[var(--color-line)]" />
      </div>
    </div>
  );
}
