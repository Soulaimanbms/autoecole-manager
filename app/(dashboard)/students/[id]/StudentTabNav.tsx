"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface StudentTabNavProps {
  tabs: Tab[];
  activeTab: string;
  studentId: string;
}

export function StudentTabNav({ tabs, activeTab }: StudentTabNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === "apercu") {
      params.delete("tab");
    } else {
      params.set("tab", tabId);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="flex gap-1 bg-white rounded-xl border border-default p-1 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => navigate(t.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === t.id
              ? "bg-accent-dim text-accent-text"
              : "text-muted hover:bg-bg-hover hover:text-text-body",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
