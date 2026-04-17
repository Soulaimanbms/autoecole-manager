import { getMissingRequiredDocs } from "@/lib/workflow";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { DocumentType } from "@prisma/client";

interface DossierStatusProps {
  docs: Array<{ type: DocumentType; deleted_at: Date | string | null }>;
}

const REQUIRED_COUNT = 4;

export function DossierStatus({ docs = [] }: DossierStatusProps) {
  const missing = getMissingRequiredDocs(docs);
  const presentCount = REQUIRED_COUNT - missing.length;
  const complete = missing.length === 0;

  if (complete) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success-text">
        <CheckCircle2 className="h-3 w-3" />
        {REQUIRED_COUNT}/{REQUIRED_COUNT} ✓
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning-text">
      <AlertCircle className="h-3 w-3" />
      {presentCount}/{REQUIRED_COUNT} — {missing[0]} manquant
    </span>
  );
}
