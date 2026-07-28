import type { ExperienceCategory } from "@/lib/types";
import { categoryIcons, IconCheck, IconChevronRight } from "./icons";

interface ExperienceSelectorProps {
  categories: ExperienceCategory[];
  selected: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
}

export default function ExperienceSelector({
  categories,
  selected,
  onToggle,
  onContinue,
}: ExperienceSelectorProps) {
  const canContinue = selected.length > 0;

  return (
    <div className="flex flex-1 flex-col animate-fade-rise">
      <h1 className="font-display text-[22px] font-bold leading-snug text-[var(--color-charcoal)]">
        What did you appreciate about your experience?
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
        Select everything that genuinely made your experience special.
      </p>

      <div
        className="mt-6 grid grid-cols-2 gap-3"
        role="group"
        aria-label="Experience categories"
      >
        {categories.map((category) => {
          const Icon = categoryIcons[category.id];
          const isSelected = selected.includes(category.id);
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(category.id)}
              className={`relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[rgba(245,166,35,0.08)] shadow-[var(--shadow-soft)]"
                  : "border-[var(--color-line)] bg-white hover:border-[var(--color-charcoal-soft)]/30"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  isSelected
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-mist)] text-[var(--color-charcoal-soft)]"
                }`}
              >
                {Icon && <Icon className="h-5 w-5" />}
              </span>
              <span className="text-[13.5px] font-semibold leading-snug text-[var(--color-charcoal)]">
                {category.label}
              </span>

              {isSelected && (
                <span className="animate-check-pop absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                  <IconCheck className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <p
          className="mb-3 text-center text-[13px] text-[var(--color-ink-muted)]"
          aria-live="polite"
        >
          {selected.length === 0
            ? "Select at least one to continue"
            : `${selected.length} selected`}
        </p>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold shadow-[var(--shadow-soft)] transition-all disabled:cursor-not-allowed disabled:bg-[var(--color-line)] disabled:text-[var(--color-ink-muted)] disabled:shadow-none enabled:bg-[var(--color-accent)] enabled:text-[var(--color-charcoal)] enabled:hover:bg-[var(--color-accent-deep)] enabled:hover:text-white enabled:active:scale-[0.98]"
        >
          Continue
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
