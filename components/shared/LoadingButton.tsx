"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "destructive";
  children: ReactNode;
}

const VARIANT_CLASSES = {
  primary:
    "bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "bg-white hover:bg-bg-hover text-text-body border border-default px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed",
  destructive:
    "bg-error hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed",
};

export function LoadingButton({
  loading = false,
  variant = "primary",
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
      {children}
    </button>
  );
}
