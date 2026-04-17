import type { Decimal } from "@prisma/client/runtime/library";
import type { DocumentType, StudentStatus, PermisType } from "@prisma/client";
import type { StudentWithComputedFields, PaymentStatus } from "@/types";
import {
  getMissingRequiredDocs,
  computePaymentStatus,
  computeNextAction,
} from "@/lib/workflow";
import { daysSince } from "@/lib/utils";

interface RawPayment {
  amount: Decimal | number;
  deleted_at: Date | null;
}

interface RawDocument {
  type: DocumentType;
  deleted_at: Date | null;
}

interface RawStudentBase {
  id: string;
  school_id: string;
  full_name: string;
  full_name_arabic: string | null;
  phone: string;
  cin: string | null;
  address: string | null;
  date_of_birth: Date | null;
  enrollment_date: Date;
  permis_type: PermisType;
  status: StudentStatus;
  total_sessions_required: number;
  completed_sessions: number;
  total_price: Decimal | number;
  photo_url: string | null;
  notes: string | null;
  last_session_at: Date | null;
  last_payment_at: Date | null;
  code_exam_passed: boolean;
  narsa_number: string | null;
  deleted_at: Date | null;
  created_at: Date;
  payments: RawPayment[];
  documents: RawDocument[];
}

export function computeStudentFields(
  student: RawStudentBase,
): StudentWithComputedFields {
  const activePay = student.payments.filter((p) => !p.deleted_at);
  const amountPaid = activePay.reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );
  const totalPrice = Number(student.total_price);
  const remainingBalance = Math.max(0, totalPrice - amountPaid);
  const remainingSessions = Math.max(
    0,
    student.total_sessions_required - student.completed_sessions,
  );
  const progressPct =
    student.total_sessions_required > 0
      ? Math.round(
          (student.completed_sessions / student.total_sessions_required) * 100,
        )
      : 0;

  const missingDocs = getMissingRequiredDocs(student.documents);
  const paymentStatus: PaymentStatus = computePaymentStatus(
    remainingBalance,
    amountPaid,
    student.last_payment_at,
  );
  const daysSincePayment = daysSince(student.last_payment_at);
  const nextAction = computeNextAction({
    status: student.status,
    completed_sessions: student.completed_sessions,
    total_sessions_required: student.total_sessions_required,
    missing_docs: missingDocs,
    remaining_balance: remainingBalance,
    payment_status: paymentStatus,
    code_exam_passed: student.code_exam_passed,
  });

  return {
    id: student.id,
    school_id: student.school_id,
    full_name: student.full_name,
    full_name_arabic: student.full_name_arabic,
    phone: student.phone,
    cin: student.cin,
    address: student.address,
    date_of_birth: student.date_of_birth
      ? student.date_of_birth.toISOString()
      : null,
    enrollment_date: student.enrollment_date.toISOString(),
    permis_type: student.permis_type,
    status: student.status,
    total_sessions_required: student.total_sessions_required,
    completed_sessions: student.completed_sessions,
    total_price: totalPrice,
    photo_url: student.photo_url,
    notes: student.notes,
    last_session_at: student.last_session_at
      ? student.last_session_at.toISOString()
      : null,
    last_payment_at: student.last_payment_at
      ? student.last_payment_at.toISOString()
      : null,
    code_exam_passed: student.code_exam_passed,
    narsa_number: student.narsa_number,
    deleted_at: student.deleted_at ? student.deleted_at.toISOString() : null,
    created_at: student.created_at.toISOString(),
    amount_paid: amountPaid,
    remaining_balance: remainingBalance,
    remaining_sessions: remainingSessions,
    progress_pct: progressPct,
    payment_status: paymentStatus,
    missing_docs: missingDocs,
    next_action: nextAction,
    days_since_payment: daysSincePayment,
  };
}
