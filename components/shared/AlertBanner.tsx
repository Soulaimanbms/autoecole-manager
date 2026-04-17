"use client";

import { AlertTriangle } from "lucide-react";

interface AlertBannerProps {
  count: number;
  message: string;
  ctaLabel: string;
  onCta: () => void;
}

export function AlertBanner({
  count,
  message,
  ctaLabel,
  onCta,
}: AlertBannerProps) {
  return (
    <div className="bg-error-bg border border-error/20 rounded-xl p-4 flex items-center gap-4">
      <div className="w-9 h-9 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-error-text text-sm">
          {count} {message}
        </div>
      </div>
      <button
        onClick={onCta}
        className="shrink-0 bg-white border border-error/20 text-error-text text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-error-bg transition-all"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
