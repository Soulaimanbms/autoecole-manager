"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle({ view }: { view: "calendar" | "list" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setView = (v: "calendar" | "list") => {
    const params = new URLSearchParams(searchParams.toString());
    if (v === "calendar") {
      params.delete("view");
    } else {
      params.set("view", v);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-white border border-default rounded-lg p-1">
      <button
        onClick={() => setView("calendar")}
        className={cn(
          "p-2 rounded-lg transition-all",
          view === "calendar"
            ? "bg-accent-dim text-accent-text"
            : "text-muted hover:bg-bg-hover",
        )}
      >
        <Calendar className="h-4 w-4" />
      </button>
      <button
        onClick={() => setView("list")}
        className={cn(
          "p-2 rounded-lg transition-all",
          view === "list"
            ? "bg-accent-dim text-accent-text"
            : "text-muted hover:bg-bg-hover",
        )}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
