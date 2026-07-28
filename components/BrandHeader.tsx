"use client";

import { useState } from "react";

interface BrandHeaderProps {
  /** Show the full lockup (both logos + wordmarks) or a compact version */
  variant?: "full" | "compact";
}

/**
 * Renders the Epitome + Kia logo lockup. If /public/epitome-logo.png or
 * /public/kia-logo.png are not present (V1 placeholder), falls back to a
 * clean text wordmark so the app never shows a broken-image icon.
 * See README.md "Adding the logo files" for where to drop the real assets.
 */
export default function BrandHeader({ variant = "full" }: BrandHeaderProps) {
  const [epitomeFailed, setEpitomeFailed] = useState(false);
  const [kiaFailed, setKiaFailed] = useState(false);

  const logoHeight = variant === "full" ? 34 : 26;

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex items-center" style={{ height: logoHeight }}>
        {epitomeFailed ? (
          <span
            className="font-display font-extrabold tracking-tight text-[var(--color-charcoal)]"
            style={{ fontSize: logoHeight * 0.62 }}
          >
            EPITOME
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/epitome-logo.png"
            alt="Epitome Automobiles"
            height={logoHeight}
            style={{ height: logoHeight, width: "auto" }}
            onError={() => setEpitomeFailed(true)}
          />
        )}
      </div>

      <span aria-hidden="true" className="h-6 w-px bg-[var(--color-line)]" />

      <div className="flex items-center" style={{ height: logoHeight }}>
        {kiaFailed ? (
          <span
            className="font-display font-extrabold tracking-tight text-[var(--color-charcoal)]"
            style={{ fontSize: logoHeight * 0.62 }}
          >
            KIA
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/kia-logo.png"
            alt="Kia"
            height={logoHeight}
            style={{ height: logoHeight, width: "auto" }}
            onError={() => setKiaFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
