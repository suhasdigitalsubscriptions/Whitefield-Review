import BrandHeader from "@/components/BrandHeader";

export default function NotFound() {
  return (
    <div className="min-h-dvh w-full bg-[var(--color-mist)] sm:flex sm:items-center sm:justify-center sm:py-10">
      <div className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col items-center justify-center gap-6 bg-[var(--color-surface)] px-6 text-center sm:min-h-0 sm:rounded-[32px] sm:border sm:border-[var(--color-line)] sm:py-16 sm:shadow-[var(--shadow-lifted)]">
        <BrandHeader />
        <div>
          <h1 className="font-display text-[22px] font-bold text-[var(--color-charcoal)]">
            Page not found
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            Please re-scan the QR code at the showroom, or check the link you
            were given.
          </p>
        </div>
      </div>
    </div>
  );
}
