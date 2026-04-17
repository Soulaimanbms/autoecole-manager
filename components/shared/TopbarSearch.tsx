"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, getInitials } from "@/lib/utils";
import type { StudentStatus } from "@/types";

interface StudentResult {
  id: string;
  full_name: string;
  phone: string;
  status: StudentStatus;
  photo_url: string | null;
}

interface TopbarSearchProps {
  className?: string;
  placeholder?: string;
}

export function TopbarSearch({
  className,
  placeholder = "Rechercher un élève…",
}: TopbarSearchProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<StudentResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as { results: StudentResult[] };
        setResults(data.results ?? []);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const showDropdown =
    open && query.trim().length >= 2 && (loading || results.length > 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) {
        e.preventDefault();
        window.location.href = `/students/${target.id}`;
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={wrapRef} className={cn("relative", className)} role="search">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Rechercher un élève"
        className={cn(
          "rounded-full bg-bg-input border border-default text-xs pl-9 pr-9 py-2 w-64",
          "placeholder:text-faint text-text-primary",
          "focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none transition-all",
        )}
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setResults([]);
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
          aria-label="Effacer la recherche"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      {loading && query && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted animate-spin" />
      )}

      {showDropdown && (
        <div
          role="listbox"
          className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-default shadow-lg overflow-hidden z-50"
        >
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Recherche…
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <div className="text-sm text-text-body">Aucun élève trouvé</div>
              <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">
                Essayez un autre nom ou numéro
              </div>
            </div>
          )}
          {!loading && results.length > 0 && (
            <ul className="divide-y divide-default max-h-96 overflow-y-auto">
              {results.map((r, idx) => (
                <li key={r.id}>
                  <Link
                    role="option"
                    aria-selected={idx === activeIndex}
                    href={`/students/${r.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-colors",
                      idx === activeIndex ? "bg-bg-hover" : "hover:bg-bg-hover",
                    )}
                  >
                    <StudentAvatar
                      initials={getInitials(r.full_name)}
                      photoUrl={r.photo_url}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-text-primary truncate">
                        {r.full_name}
                      </div>
                      <div className="text-[10px] font-medium text-muted uppercase tracking-wider">
                        {r.phone}
                      </div>
                    </div>
                    <StatusBadge status={r.status} variant="student" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
