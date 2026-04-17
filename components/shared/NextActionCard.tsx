"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface NextActionCardProps {
  action: string;
  cta?: string;
  urgent?: boolean;
  onCtaClick?: () => void;
  className?: string;
}

export function NextActionCard({
  action,
  cta,
  urgent,
  onCtaClick,
  className,
}: NextActionCardProps) {
  return (
    <div
      className={cn(
        "bg-[#0f172a] text-white rounded-xl p-5 hover:-translate-y-0.5 transition-all",
        className,
      )}
    >
      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        Prochaine action
      </div>
      <div className="text-sm font-semibold text-white mb-3 flex items-start gap-2">
        {urgent && (
          <span className="shrink-0 mt-0.5 bg-accent/10 text-accent text-[9px] font-bold rounded px-2 py-0.5">
            Urgent
          </span>
        )}
        {action}
      </div>
      {cta && (
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 transition-all"
        >
          {cta}
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
