import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Phone,
  Calendar,
  Car,
  BookOpen,
  CreditCard,
  GraduationCap,
  FileText,
  Plus,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeStudentFields } from "@/lib/compute";
import { serialize, getInitials, formatMAD, formatDate } from "@/lib/utils";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NextActionCard } from "@/components/shared/NextActionCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { PaymentSummary } from "@/components/shared/PaymentSummary";
import { ExamReadinessChecklist } from "@/components/shared/ExamReadinessChecklist";
import { DocumentSlot } from "@/components/shared/DocumentSlot";
import { WhatsAppLink } from "@/components/shared/WhatsAppLink";
import { StudentTabNav } from "./StudentTabNav";
import type { DocumentType } from "@prisma/client";

export const dynamic = "force-dynamic";

const ALL_DOC_TYPES: Array<{ type: DocumentType; label: string }> = [
  { type: "cin", label: "CIN" },
  { type: "photo", label: "Photo" },
  { type: "medical", label: "Certificat médical" },
  { type: "contrat", label: "Contrat" },
  { type: "form_demande", label: "Formulaire demande" },
  { type: "acte_naissance", label: "Acte de naissance" },
];

export default async function StudentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { id } = await params;
  const { tab = "apercu" } = await searchParams;

  const [rawStudent, school] = await Promise.all([
    prisma.student.findFirst({
      where: { id, school_id: schoolId },
      include: {
        payments: {
          where: { deleted_at: null },
          orderBy: { payment_date: "desc" },
        },
        documents: {
          where: { deleted_at: null },
        },
        sessions: {
          include: {
            instructor: { select: { id: true, full_name: true } },
          },
          orderBy: { date: "desc" },
        },
        exams: {
          where: { deleted_at: null },
          orderBy: { scheduled_date: "desc" },
        },
      },
    }),
    prisma.school.findFirst({
      where: { id: schoolId },
      select: { plan_name: true },
    }),
  ]);

  if (!rawStudent) notFound();

  const student = computeStudentFields({
    ...rawStudent,
    payments: rawStudent.payments.map((p) => ({
      amount: p.amount,
      deleted_at: p.deleted_at,
    })),
    documents: rawStudent.documents.map((d) => ({
      type: d.type,
      deleted_at: d.deleted_at,
    })),
  });

  const isPro = school?.plan_name === "Pro";

  const TABS = [
    { id: "apercu", label: "Aperçu" },
    { id: "seances", label: `Séances (${rawStudent.sessions.length})` },
    { id: "paiements", label: `Paiements (${rawStudent.payments.length})` },
    { id: "examens", label: `Examens (${rawStudent.exams.length})` },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/students"
          className="p-2 rounded-lg text-muted hover:bg-bg-hover transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Élèves / Dossier
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {student.full_name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-default p-6 space-y-5">
            <div className="flex items-start gap-4">
              <StudentAvatar
                initials={getInitials(student.full_name)}
                photoUrl={student.photo_url}
                size="xl"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-text-primary">
                  {student.full_name}
                </h2>
                {student.full_name_arabic && (
                  <div className="text-sm text-muted mt-0.5" dir="rtl">
                    {student.full_name_arabic}
                  </div>
                )}
                <div className="mt-2">
                  <StatusBadge status={student.status} variant="student" />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-body">
                <Phone className="h-3.5 w-3.5 text-muted" />
                <span>{student.phone}</span>
                <WhatsAppLink phone={student.phone} />
              </div>
              {student.cin && (
                <div className="flex items-center gap-2 text-text-body">
                  <FileText className="h-3.5 w-3.5 text-muted" />
                  <span>{student.cin}</span>
                </div>
              )}
              {student.date_of_birth && (
                <div className="flex items-center gap-2 text-text-body">
                  <Calendar className="h-3.5 w-3.5 text-muted" />
                  <span>{formatDate(student.date_of_birth)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-text-body">
                <BookOpen className="h-3.5 w-3.5 text-muted" />
                <span>Permis {student.permis_type}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-default">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">
                Progression
              </div>
              <ProgressBar
                value={student.progress_pct}
                label={`${student.completed_sessions} / ${student.total_sessions_required} séances`}
                showPct
              />
            </div>

            <div className="pt-4 border-t border-default">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-3">
                Paiements
              </div>
              <PaymentSummary
                totalPrice={student.total_price}
                amountPaid={student.amount_paid}
                remainingBalance={student.remaining_balance}
                paymentStatus={student.payment_status}
              />
            </div>
          </div>

          <NextActionCard
            action={student.next_action.label}
            cta={student.next_action.cta}
            urgent={student.next_action.urgent}
          />
        </div>

        {/* Right: tabs */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <StudentTabNav tabs={TABS} activeTab={tab} studentId={student.id} />

          {tab === "apercu" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-default p-6">
                <h3 className="text-base font-semibold text-text-primary mb-4">
                  Informations générales
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                      Date d&apos;inscription
                    </div>
                    <div className="text-text-primary font-medium">
                      {formatDate(student.enrollment_date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                      Numéro NARSA
                    </div>
                    <div className="text-text-primary font-medium">
                      {student.narsa_number ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                      Adresse
                    </div>
                    <div className="text-text-primary font-medium">
                      {student.address ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                      Examen code
                    </div>
                    <StatusBadge
                      status={student.code_exam_passed ? "passed" : "pending"}
                      variant="exam"
                    />
                  </div>
                </div>
                {student.notes && (
                  <div className="mt-4 pt-4 border-t border-default">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                      Notes
                    </div>
                    <p className="text-sm text-text-body">{student.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-default p-6">
                <h3 className="text-base font-semibold text-text-primary mb-4">
                  Checklist examen
                </h3>
                <ExamReadinessChecklist student={student} />
              </div>
            </div>
          )}

          {tab === "seances" && (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="px-6 py-4 border-b border-default flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  Séances
                </h3>
                <button className="btn-primary inline-flex items-center gap-2 text-[10px]">
                  <Plus className="h-3.5 w-3.5" />Planifier
                </button>
              </div>
              {rawStudent.sessions.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted">
                  Aucune séance enregistrée
                </div>
              ) : (
                <div className="divide-y divide-default">
                  {rawStudent.sessions.map((s) => (
                    <div
                      key={s.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-bg-hover transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-bg-hover flex items-center justify-center shrink-0">
                        {s.type === "conduite" ? (
                          <Car className="h-4 w-4 text-muted" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text-primary">
                          {formatDate(s.date)} à {s.start_time}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                          {s.type} · {s.duration_minutes} min ·{" "}
                          {s.instructor.full_name}
                        </div>
                      </div>
                      <StatusBadge status={s.status} variant="session" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "paiements" && (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="px-6 py-4 border-b border-default flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  Paiements
                </h3>
                <button className="btn-primary inline-flex items-center gap-2 text-[10px]">
                  <Plus className="h-3.5 w-3.5" />Enregistrer
                </button>
              </div>
              {rawStudent.payments.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted">
                  Aucun paiement enregistré
                </div>
              ) : (
                <div className="divide-y divide-default">
                  {rawStudent.payments.map((p) => (
                    <div
                      key={p.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-bg-hover transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center shrink-0">
                        <CreditCard className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text-primary">
                          {formatMAD(Number(p.amount))}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                          {formatDate(p.payment_date)} · {p.method}
                          {p.receipt_number ? ` · ${p.receipt_number}` : ""}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-success-bg text-success-text">
                        Payé
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "examens" && (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="px-6 py-4 border-b border-default flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  Examens
                </h3>
                <button className="btn-primary inline-flex items-center gap-2 text-[10px]">
                  <Plus className="h-3.5 w-3.5" />Programmer
                </button>
              </div>
              {rawStudent.exams.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted">
                  Aucun examen enregistré
                </div>
              ) : (
                <div className="divide-y divide-default">
                  {rawStudent.exams.map((e) => (
                    <div
                      key={e.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-bg-hover transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-info-bg flex items-center justify-center shrink-0">
                        <GraduationCap className="h-4 w-4 text-info" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text-primary capitalize">
                          Examen {e.type} — Tentative {e.attempt_number}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                          {formatDate(e.scheduled_date)}
                          {e.narsa_number ? ` · ${e.narsa_number}` : ""}
                        </div>
                      </div>
                      <StatusBadge status={e.result} variant="exam" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "documents" && (
            <div className="bg-white rounded-xl border border-default p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">
                  Documents
                </h3>
                <span className="text-xs text-muted">
                  {rawStudent.documents.length}/{ALL_DOC_TYPES.length}
                </span>
              </div>
              {!isPro && (
                <div className="mb-4 p-3 bg-warning-bg rounded-lg border border-warning/20">
                  <p className="text-xs text-warning-text font-medium">
                    Passez au plan Pro pour télécharger des documents.
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {ALL_DOC_TYPES.map(({ type, label }) => {
                  const doc =
                    rawStudent.documents.find((d) => d.type === type) ?? null;
                  return (
                    <DocumentSlot
                      key={type}
                      type={type}
                      label={label}
                      document={doc}
                      onUpload={() => {}}
                      onDelete={() => {}}
                      canUpload={isPro}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
