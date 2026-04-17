"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PillOption {
  label: string;
  value: string;
  dot?: "success" | "warning" | "error";
}

const DOT_CLASSES = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

interface UrlFilterPillsProps {
  options: PillOption[];
  paramName?: string;
  defaultValue?: string;
}

export function UrlFilterPills({
  options,
  paramName = "filter",
  defaultValue = "all",
}: UrlFilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) ?? defaultValue;

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = current === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
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
