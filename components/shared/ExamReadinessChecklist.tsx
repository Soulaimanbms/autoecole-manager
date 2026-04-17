import { CheckCircle2, XCircle } from "lucide-react";
import type { StudentWithComputedFields } from "@/types";

interface ExamReadinessChecklistProps {
  student: Pick<
    StudentWithComputedFields,
    | "completed_sessions"
    | "total_sessions_required"
    | "missing_docs"
    | "remaining_balance"
    | "code_exam_passed"
  >;
}

export function ExamReadinessChecklist({
  student,
}: ExamReadinessChecklistProps) {
  const checks = [
    {
      label: "Séances complétées",
      ok:
        student.completed_sessions >= student.total_sessions_required,
      detail: `${student.completed_sessions}/${student.total_sessions_required}`,
    },
    {
      label: "Dossier complet",
      ok: student.missing_docs.length === 0,
      detail:
        student.missing_docs.length > 0
          ? `${student.missing_docs[0]} manquant`
          : "Complet",
    },
    {
      label: "Paiement soldé",
      ok: student.remaining_balance <= 0,
      detail:
        student.remaining_balance > 0
          ? `${student.remaining_balance} MAD restant`
          : "Soldé",
    },
    {
      label: "Examen code réussi",
      ok: student.code_exam_passed,
      detail: student.code_exam_passed ? "Réussi" : "En attente",
    },
  ];

  return (
    <div className="space-y-2">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-3">
          {c.ok ? (
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-error shrink-0" />
          )}
          <span className="text-sm text-text-body flex-1">{c.label}</span>
          <span
            className={`text-[10px] font-bold ${c.ok ? "text-success-text" : "text-error-text"}`}
          >
            {c.detail}
          </span>
        </div>
      ))}
    </div>
  );
}
