import BrandHeader from "./BrandHeader";
import { IconChevronRight } from "./icons";
import type { DealershipConfig } from "@/lib/types";

interface WelcomeScreenProps {
  dealership: DealershipConfig;
  onStart: () => void;
}

export default function WelcomeScreen({ dealership, onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center animate-fade-rise">
      <BrandHeader />

      <div className="relative w-full overflow-hidden rounded-[28px] bg-[var(--color-charcoal)] px-7 py-12 shadow-[var(--shadow-lifted)]">
        <div
          aria-hidden="true"
          className="animate-sheen pointer-events-none absolute -inset-y-10 -left-1/2 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245,166,35,0.16), transparent)",
          }}
        />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          {dealership.name}
        </p>
        <h1 className="relative mt-4 font-display text-[32px] font-extrabold leading-[1.15] text-white">
          Thank You for
          <br />
          Choosing Us
        </h1>
        <p className="relative mt-4 text-[15px] leading-relaxed text-white/70">
          We&apos;d love to hear about your experience.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-4 text-[15px] font-semibold text-[var(--color-charcoal)] shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98] hover:bg-[var(--color-accent-deep)] hover:text-white"
      >
        Share Your Experience
        <IconChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
