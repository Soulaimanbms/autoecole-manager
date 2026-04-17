"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
  destructive?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  trigger,
  destructive = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </span>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-xl border border-default shadow-xl p-6 w-full max-w-sm mx-4 z-10">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:bg-bg-hover transition-all"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-semibold text-text-primary mb-2">
              {title}
            </h3>
            <p className="text-sm text-text-body mb-6">{description}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="bg-white hover:bg-bg-hover text-text-body border border-default px-4 py-2 rounded-lg text-xs font-medium transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95",
                  destructive
                    ? "bg-error hover:bg-red-600 text-white"
                    : "bg-accent hover:bg-accent-dark text-white",
                )}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
