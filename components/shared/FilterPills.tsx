"use client";

import { cn } from "@/lib/utils";

interface PillOption {
  label: string;
  value: string;
  dot?: "success" | "warning" | "error";
}

interface FilterPillsProps {
  options: PillOption[];
  selected: string;
  onSelect: (value: string) => void;
}

const DOT_CLASSES = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export function FilterPills({ options, selected, onSelect }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all",
              isActive
                ? "bg-accent text-white"
                : "bg-white border border-default text-muted hover:border-border-strong hover:text-text-body",
            )}
          >
            {opt.dot && (
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  DOT_CLASSES[opt.dot],
                )}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
