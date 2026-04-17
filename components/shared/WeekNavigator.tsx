"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavigatorProps {
  weekOffset: number;
  label: string;
}

export function WeekNavigator({ weekOffset, label }: WeekNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (delta: number) => {
    const next = weekOffset + delta;
    const params = new URLSearchParams(searchParams.toString());
    if (next === 0) {
      params.delete("week");
    } else {
      params.set("week", String(next));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-lg text-muted hover:bg-bg-hover border border-default transition-all"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm font-semibold text-text-primary min-w-[160px] text-center">
        {label}
      </span>
      <button
        onClick={() => navigate(1)}
        className="p-2 rounded-lg text-muted hover:bg-bg-hover border border-default transition-all"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
