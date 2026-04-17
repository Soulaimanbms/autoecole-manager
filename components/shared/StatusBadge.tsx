import { cn } from "@/lib/utils";
import {
  STATUS_BADGE_CLASSES,
  STUDENT_STATUS_LABELS,
  SESSION_BADGE_CLASSES,
  SESSION_STATUS_LABELS,
  PAYMENT_STATUS_BADGE_CLASSES,
  PAYMENT_STATUS_LABELS,
  EXAM_RESULT_BADGE_CLASSES,
  EXAM_RESULT_LABELS,
  type StudentStatus,
  type SessionStatus,
  type PaymentStatus,
  type ExamResult,
} from "@/types";

export type StatusVariant = "student" | "session" | "payment" | "exam";

interface StatusBadgeProps {
  status: string;
  variant: StatusVariant;
  className?: string;
}

const BASE_CLASSES =
  "inline-flex items-center rounded-full text-[9px] font-bold uppercase tracking-wider px-2.5 py-1";

function resolve(
  status: string,
  variant: StatusVariant,
): { cls: string; label: string } {
  switch (variant) {
    case "student": {
      const key = status as StudentStatus;
      return {
        cls: STATUS_BADGE_CLASSES[key] ?? "bg-bg-hover text-muted",
        label: STUDENT_STATUS_LABELS[key] ?? status,
      };
    }
    case "session": {
      const key = status as SessionStatus;
      return {
        cls: SESSION_BADGE_CLASSES[key] ?? "bg-bg-hover text-muted",
        label: SESSION_STATUS_LABELS[key] ?? status,
      };
    }
    case "payment": {
      const key = status as PaymentStatus;
      return {
        cls: PAYMENT_STATUS_BADGE_CLASSES[key] ?? "bg-bg-hover text-muted",
        label: PAYMENT_STATUS_LABELS[key] ?? status,
      };
    }
    case "exam": {
      const key = status as ExamResult;
      return {
        cls: EXAM_RESULT_BADGE_CLASSES[key] ?? "bg-bg-hover text-muted",
        label: EXAM_RESULT_LABELS[key] ?? status,
      };
    }
    default:
      return { cls: "bg-bg-hover text-muted", label: status };
  }
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const { cls, label } = resolve(status, variant);
  return <span className={cn(BASE_CLASSES, cls, className)}>{label}</span>;
}
