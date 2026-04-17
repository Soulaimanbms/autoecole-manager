"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
  variant?: "secondary" | "ghost";
  children?: React.ReactNode;
  withIcon?: boolean;
}

export function SignOutButton({
  className,
  variant = "secondary",
  children = "Se déconnecter",
  withIcon,
}: SignOutButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      window.location.replace("/login");
    }
  };

  const base =
    variant === "ghost"
      ? "bg-transparent hover:bg-bg-hover text-text-body"
      : "bg-white hover:bg-bg-hover text-text-body border border-default";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-60",
        base,
        className,
      )}
    >
      {withIcon && <LogOut className="h-4 w-4" aria-hidden />}
      {children}
    </button>
  );
}
