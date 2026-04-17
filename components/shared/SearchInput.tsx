"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import * as React from "react";

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
}

export function SearchInput({
  placeholder = "Rechercher...",
  paramName = "q",
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) ?? "";
  const [value, setValue] = React.useState(current);

  React.useEffect(() => {
    setValue(current);
  }, [current]);

  const commit = React.useCallback(
    (v: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (v) {
        params.set(paramName, v);
      } else {
        params.delete(paramName);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, paramName],
  );

  React.useEffect(() => {
    const t = setTimeout(() => commit(value), 350);
    return () => clearTimeout(t);
  }, [value, commit]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input-base pl-9 pr-8 w-64"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted hover:text-text-primary"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
