import type {
  Role,
  PermisType,
  SubscriptionStatus,
  PlanName,
  StudentStatus,
  SessionStatus,
  SessionType,
  ExamType,
  ExamResult,
  PaymentMethod,
  DocumentType,
  ExpenseCategory,
} from "@prisma/client";

export type {
  Role,
  PermisType,
  SubscriptionStatus,
  PlanName,
  StudentStatus,
  SessionStatus,
  SessionType,
  ExamType,
  ExamResult,
  PaymentMethod,
  DocumentType,
  ExpenseCategory,
};

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  enrolled: "Inscrit",
  in_training: "En formation",
  exam_ready: "Prêt pour examen",
  passed: "Reçu",
  failed: "Échoué",
  archived: "Archivé",
};

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  scheduled: "Planifiée",
  completed: "Terminée",
  cancelled: "Annulée",
  missed: "Manquée",
};

export const EXAM_RESULT_LABELS: Record<ExamResult, string> = {
  pending: "En attente",
  passed: "Réussi",
  failed: "Échoué",
};

export type PaymentStatus = "paid" | "partial" | "overdue" | "never_paid";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Payé",
  partial: "Partiel",
  overdue: "En retard",
  never_paid: "Non payé",
};

export const STATUS_BADGE_CLASSES: Record<StudentStatus, string> = {
  enrolled: "bg-info-bg text-info-text",
  in_training: "bg-bg-hover text-muted",
  exam_ready: "bg-accent-dim text-accent-text",
  passed: "bg-success-bg text-success-text",
  failed: "bg-error-bg text-error-text",
  archived: "bg-bg-hover text-faint",
};

export const SESSION_BADGE_CLASSES: Record<SessionStatus, string> = {
  scheduled: "bg-info-bg text-info-text",
  completed: "bg-success-bg text-success-text",
  cancelled: "bg-bg-hover text-muted",
  missed: "bg-error-bg text-error-text",
};

export const EXAM_RESULT_BADGE_CLASSES: Record<ExamResult, string> = {
  pending: "bg-warning-bg text-warning-text",
  passed: "bg-success-bg text-success-text",
  failed: "bg-error-bg text-error-text",
};

export const PAYMENT_STATUS_BADGE_CLASSES: Record<PaymentStatus, string> = {
  paid: "bg-success-bg text-success-text",
  partial: "bg-warning-bg text-warning-text",
  overdue: "bg-error-bg text-error-text",
  never_paid: "bg-error-bg text-error-text",
};
