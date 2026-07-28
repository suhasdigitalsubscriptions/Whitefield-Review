import BrandHeader from "./BrandHeader";
import type { DealershipConfig } from "@/lib/types";

export default function ComingSoon({ dealership }: { dealership: DealershipConfig }) {
  return (
    <div className="min-h-dvh w-full bg-[var(--color-mist)] sm:flex sm:items-center sm:justify-center sm:py-10">
      <div className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col items-center justify-center gap-6 bg-[var(--color-surface)] px-6 text-center sm:min-h-0 sm:rounded-[32px] sm:border sm:border-[var(--color-line)] sm:py-16 sm:shadow-[var(--shadow-lifted)]">
        <BrandHeader />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-deep)]">
            {dealership.location}
          </p>
          <h1 className="mt-3 font-display text-[22px] font-bold text-[var(--color-charcoal)]">
            This review portal is coming soon
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            {dealership.name} isn&apos;t live yet. Please check back shortly, or
            ask the showroom team for the correct QR code.
          </p>
        </div>
      </div>
    </div>
  );
}
