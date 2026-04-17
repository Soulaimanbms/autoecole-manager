"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateNavigatorProps {
  dateStr: string; // YYYY-MM-DD
  label: string;   // formatted display label
}

export function DateNavigator({ dateStr, label }: DateNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (direction: -1 | 1) => {
    const d = new Date(dateStr + "T12:00:00");
    d.setDate(d.getDate() + direction);
    const next = d.toISOString().slice(0, 10);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", next);
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToday = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("date");
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
      <button
        onClick={goToday}
        className="text-sm font-semibold text-text-primary min-w-[180px] text-center hover:text-accent transition-all capitalize"
      >
        {label}
      </button>
      <button
        onClick={() => navigate(1)}
        className="p-2 rounded-lg text-muted hover:bg-bg-hover border border-default transition-all"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
