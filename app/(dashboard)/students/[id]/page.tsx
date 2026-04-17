"use client";

import * as React from "react";
import { use } from "react";
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
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NextActionCard } from "@/components/shared/NextActionCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { PaymentSummary } from "@/components/shared/PaymentSummary";
import { ExamReadinessChecklist } from "@/components/shared/ExamReadinessChecklist";
import { DocumentSlot } from "@/components/shared/DocumentSlot";
import { WhatsAppLink } from "@/components/shared/WhatsAppLink";
import { formatMAD, formatDate, getInitials } from "@/lib/utils";

const MOCK_STUDENT = {
  id: "1",
  full_name: "Mohamed Alami",
  full_name_arabic: "محمد العلمي",
  phone: "0612345678",
  cin: "BE123456",
  address: "12 Rue des Orangers, Casablanca",
  date_of_birth: "1998-05-14",
  enrollment_date: "2024-01-15",
  permis_type: "B",
  status: "in_training" as const,
  completed_sessions: 13,
  total_sessions_required: 20,
  total_price: 3000,
  amount_paid: 1500,
  remaining_balance: 1500,
  payment_status: "partial" as const,
  code_exam_passed: false,
  narsa_number: "NARSA-2024-0451",
  notes: "Élève sérieux, bonne progression.",
  missing_docs: ["CIN", "Médical"],
};

const MOCK_SESSIONS = [
  {
    id: "s1",
    date: "2024-04-10",
    time: "09:00",
    type: "conduite",
    status: "completed",
    instructor: "Karim B.",
    duration: 60,
  },
  {
    id: "s2",
    date: "2024-04-08",
    time: "10:30",
    type: "code",
    status: "completed",
    instructor: "Karim B.",
    duration: 45,
  },
  {
    id: "s3",
    date: "2024-04-05",
    time: "14:00",
    type: "conduite",
    status: "missed",
    instructor: "Hassan M.",
    duration: 60,
  },
  {
    id: "s4",
    date: "2024-04-15",
    time: "08:30",
    type: "conduite",
    status: "scheduled",
    instructor: "Karim B.",
    duration: 60,
  },
];

const MOCK_PAYMENTS = [
  {
    id: "p1",
    date: "2024-01-15",
    amount: 1000,
    method: "cash",
    receipt: "REC-2024-001",
  },
  {
    id: "p2",
    date: "2024-02-20",
    amount: 500,
    method: "bank_transfer",
    receipt: "REC-2024-015",
  },
];

const MOCK_EXAMS = [
  {
    id: "e1",
    type: "code",
    date: "2024-03-10",
    result: "failed",
    attempt: 1,
    narsa: "NARSA-CODE-001",
  },
];

const MOCK_DOCS = [
  {
    id: "d1",
    type: "photo" as const,
    label: "Photo",
    hasDoc: true,
    file_url: "#",
  },
  { id: "d2", type: "cin" as const, label: "CIN", hasDoc: false, file_url: "" },
  {
    id: "d3",
    type: "medical" as const,
    label: "Certificat médical",
    hasDoc: false,
    file_url: "",
  },
  {
    id: "d4",
    type: "form_demande" as const,
    label: "Formulaire demande",
    hasDoc: true,
    file_url: "#",
  },
];

const TABS = [
  { id: "apercu", label: "Aperçu", icon: <FileText className="h-4 w-4" /> },
  { id: "seances", label: "Séances", icon: <Car className="h-4 w-4" /> },
  {
    id: "paiements",
    label: "Paiements",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "examens",
    label: "Examens",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
  },
];

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = React.useState("apercu");

  const student = { ...MOCK_STUDENT, id };
  const pct = Math.round(
    (student.completed_sessions / student.total_sessions_required) * 100,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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
        {/* Left: Profile card */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-default p-6 space-y-5">
            <div className="flex items-start gap-4">
              <StudentAvatar
                initials={getInitials(student.full_name)}
                size="xl"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-text-primary">
                  {student.full_name}
                </h2>
                {student.full_name_arabic && (
                  <div
                    className="text-sm text-muted mt-0.5"
                    dir="rtl"
                  >
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
                Progression séances
              </div>
              <ProgressBar
                value={pct}
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
            action="Planifier la prochaine séance de conduite"
            cta="Planifier"
          />
        </div>

        {/* Right: Tabs */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Tab nav */}
          <div className="flex gap-1 bg-white rounded-xl border border-default p-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-accent-dim text-accent-text"
                    : "text-muted hover:bg-bg-hover hover:text-text-body"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "apercu" && (
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
                    <div>
                      <StatusBadge
                        status={
                          student.code_exam_passed ? "passed" : "pending"
                        }
                        variant="exam"
                      />
                    </div>
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
                <ExamReadinessChecklist
                  student={{
                    completed_sessions: student.completed_sessions,
                    total_sessions_required: student.total_sessions_required,
                    missing_docs: student.missing_docs,
                    remaining_balance: student.remaining_balance,
                    code_exam_passed: student.code_exam_passed,
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "seances" && (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="px-6 py-4 border-b border-default flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  Séances ({MOCK_SESSIONS.length})
                </h3>
                <button className="btn-primary inline-flex items-center gap-2 text-[10px]">
                  <Plus className="h-3.5 w-3.5" />
                  Planifier
                </button>
              </div>
              <div className="divide-y divide-default">
                {MOCK_SESSIONS.map((s) => (
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
                        {formatDate(s.date)} à {s.time}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                        {s.type} · {s.duration} min · {s.instructor}
                      </div>
                    </div>
                    <StatusBadge status={s.status} variant="session" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "paiements" && (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="px-6 py-4 border-b border-default flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  Paiements
                </h3>
                <button className="btn-primary inline-flex items-center gap-2 text-[10px]">
                  <Plus className="h-3.5 w-3.5" />
                  Enregistrer
                </button>
              </div>
              <div className="divide-y divide-default">
                {MOCK_PAYMENTS.map((p) => (
                  <div
                    key={p.id}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-bg-hover transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center shrink-0">
                      <CreditCard className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text-primary">
                        {formatMAD(p.amount)}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                        {formatDate(p.date)} · {p.method} · {p.receipt}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-success-bg text-success-text">
                      Payé
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "examens" && (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="px-6 py-4 border-b border-default flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  Examens
                </h3>
                <button className="btn-primary inline-flex items-center gap-2 text-[10px]">
                  <Plus className="h-3.5 w-3.5" />
                  Programmer
                </button>
              </div>
              <div className="divide-y divide-default">
                {MOCK_EXAMS.map((e) => (
                  <div
                    key={e.id}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-bg-hover transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-info-bg flex items-center justify-center shrink-0">
                      <GraduationCap className="h-4 w-4 text-info" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text-primary capitalize">
                        Examen {e.type} — Tentative {e.attempt}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                        {formatDate(e.date)} · {e.narsa}
                      </div>
                    </div>
                    <StatusBadge status={e.result} variant="exam" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-white rounded-xl border border-default p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">
                  Documents
                </h3>
                <span className="text-xs text-muted">
                  {MOCK_DOCS.filter((d) => d.hasDoc).length}/{MOCK_DOCS.length}{" "}
                  documents
                </span>
              </div>
              <div className="space-y-3">
                {MOCK_DOCS.map((doc) => (
                  <DocumentSlot
                    key={doc.id}
                    type={doc.type}
                    label={doc.label}
                    document={
                      doc.hasDoc
                        ? {
                            id: doc.id,
                            type: doc.type,
                            file_url: doc.file_url,
                            deleted_at: null,
                          }
                        : null
                    }
                    onUpload={() => {}}
                    onDelete={() => {}}
                    canUpload={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
