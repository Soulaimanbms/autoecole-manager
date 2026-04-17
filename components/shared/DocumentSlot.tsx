"use client";

import { FileText, Upload, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import type { DocumentType } from "@prisma/client";

interface StudentDoc {
  id: string;
  type: DocumentType;
  file_url: string;
  deleted_at: Date | string | null;
}

interface DocumentSlotProps {
  type: DocumentType;
  label: string;
  document?: StudentDoc | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
  canUpload: boolean;
}

export function DocumentSlot({
  label,
  document,
  onUpload,
  onDelete,
  canUpload,
}: DocumentSlotProps) {
  const hasDoc = document && !document.deleted_at;

  if (hasDoc) {
    return (
      <div className="flex items-center gap-4 p-4 bg-success-bg/30 rounded-xl border border-success/20">
        <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-primary">{label}</div>
          <div className="text-[10px] font-bold uppercase text-muted mt-0.5">
            Disponible
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={document.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary transition-all"
          >
            <FileText className="h-4 w-4" />
          </a>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-muted hover:bg-error-bg hover:text-error transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-error-bg/30 rounded-xl border-dashed border border-error/30">
      <div className="w-10 h-10 rounded-lg bg-error-bg flex items-center justify-center shrink-0">
        <AlertCircle className="h-5 w-5 text-error" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-text-primary">{label}</div>
        <div className="text-[10px] font-bold uppercase text-muted mt-0.5">
          Manquant
        </div>
      </div>
      {canUpload ? (
        <label className="cursor-pointer p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary transition-all">
          <Upload className="h-4 w-4" />
          <input
            type="file"
            className="sr-only"
            accept="image/*,.pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
        </label>
      ) : (
        <span className="text-[10px] text-muted">Plan Pro requis</span>
      )}
    </div>
  );
}
