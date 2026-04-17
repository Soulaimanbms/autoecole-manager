import type { DocumentType } from "@prisma/client";
import type { PaymentStatus, StudentWithComputedFields } from "@/types";
import { daysSince } from "@/lib/utils";

const REQUIRED_DOCS: DocumentType[] = ["cin", "medical", "contrat"];

const DOC_LABELS: Record<DocumentType, string> = {
  cin: "CIN",
  photo: "Photo",
  medical: "Certificat médical",
  form_demande: "Formulaire demande",
  acte_naissance: "Acte de naissance",
  contrat: "Contrat",
};

export function getMissingRequiredDocs(
  docs: Array<{ type: DocumentType; deleted_at: Date | string | null }>,
): string[] {
  const presentTypes = new Set(
    docs.filter((d) => !d.deleted_at).map((d) => d.type),
  );
  return REQUIRED_DOCS.filter((t) => !presentTypes.has(t)).map(
    (t) => DOC_LABELS[t],
  );
}

export function isDossierComplete(
  docs: Array<{ type: DocumentType; deleted_at: Date | string | null }>,
): boolean {
  return getMissingRequiredDocs(docs).length === 0;
}

export function computePaymentStatus(
  remaining: number,
  paid: number,
  lastPaymentAt: Date | string | null,
): PaymentStatus {
  if (remaining <= 0) return "paid";
  if (paid === 0) return "never_paid";
  const days = daysSince(lastPaymentAt);
  if (days > 14) return "overdue";
  return "partial";
}

export function isExamReady(
  student: Pick<
    StudentWithComputedFields,
    | "completed_sessions"
    | "total_sessions_required"
    | "missing_docs"
    | "remaining_balance"
    | "code_exam_passed"
  >,
): boolean {
  return (
    student.completed_sessions >= student.total_sessions_required &&
    student.missing_docs.length === 0 &&
    student.remaining_balance <= 0 &&
    student.code_exam_passed
  );
}

export function computeNextAction(
  student: Pick<
    StudentWithComputedFields,
    | "status"
    | "completed_sessions"
    | "total_sessions_required"
    | "missing_docs"
    | "remaining_balance"
    | "payment_status"
    | "code_exam_passed"
  >,
): { label: string; cta?: string; urgent?: boolean } {
  if (student.missing_docs.length > 0) {
    return {
      label: `Compléter le dossier — ${student.missing_docs[0]} manquant`,
      cta: "Compléter",
      urgent: true,
    };
  }
  if (student.payment_status === "overdue") {
    return {
      label: "Encaisser le solde — paiement en retard",
      cta: "Paiement",
      urgent: true,
    };
  }
  if (student.payment_status === "never_paid") {
    return {
      label: "Aucun paiement enregistré",
      cta: "Paiement",
      urgent: true,
    };
  }
  if (student.completed_sessions < student.total_sessions_required) {
    const remaining =
      student.total_sessions_required - student.completed_sessions;
    return {
      label: `Planifier une séance (${remaining} restante${remaining > 1 ? "s" : ""})`,
      cta: "Planifier",
    };
  }
  if (!student.code_exam_passed) {
    return {
      label: "Passer l'examen code en premier",
      cta: "Programmer",
      urgent: true,
    };
  }
  if (student.status === "exam_ready") {
    return {
      label: "Programmer l'examen de conduite",
      cta: "Programmer",
      urgent: true,
    };
  }
  if (student.status === "passed") {
    return { label: "Élève reçu — dossier terminé ✓" };
  }
  return { label: "Planifier la prochaine séance", cta: "Planifier" };
}
