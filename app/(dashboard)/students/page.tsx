"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Download, Eye, Pencil } from "lucide-react";
import { FilterPills } from "@/components/shared/FilterPills";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { DossierStatus } from "@/components/shared/DossierStatus";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatMAD, getInitials } from "@/lib/utils";
import { Users } from "lucide-react";

const MOCK_STUDENTS = [
  {
    id: "1",
    full_name: "Mohamed Alami",
    phone: "0612345678",
    cin: "BE123456",
    permis_type: "B",
    status: "in_training",
    completed_sessions: 13,
    total_sessions_required: 20,
    total_price: 3000,
    amount_paid: 1500,
    remaining_balance: 1500,
    payment_status: "partial",
    enrollment_date: "2024-01-15",
    missing_docs: [],
  },
  {
    id: "2",
    full_name: "Fatima Zahra Benali",
    phone: "0623456789",
    cin: "CD234567",
    permis_type: "B",
    status: "exam_ready",
    completed_sessions: 20,
    total_sessions_required: 20,
    total_price: 2800,
    amount_paid: 2800,
    remaining_balance: 0,
    payment_status: "paid",
    enrollment_date: "2023-11-10",
    missing_docs: [],
  },
  {
    id: "3",
    full_name: "Youssef Tazi",
    phone: "0634567890",
    cin: "EF345678",
    permis_type: "B",
    status: "enrolled",
    completed_sessions: 3,
    total_sessions_required: 20,
    total_price: 3200,
    amount_paid: 0,
    remaining_balance: 3200,
    payment_status: "never_paid",
    enrollment_date: "2024-03-01",
    missing_docs: ["CIN", "Photo"],
  },
  {
    id: "4",
    full_name: "Aicha Ouali",
    phone: "0645678901",
    cin: "GH456789",
    permis_type: "B",
    status: "in_training",
    completed_sessions: 8,
    total_sessions_required: 20,
    total_price: 3000,
    amount_paid: 2400,
    remaining_balance: 600,
    payment_status: "overdue",
    enrollment_date: "2023-12-05",
    missing_docs: ["Médical"],
  },
  {
    id: "5",
    full_name: "Omar Chraibi",
    phone: "0656789012",
    cin: "IJ567890",
    permis_type: "B",
    status: "passed",
    completed_sessions: 20,
    total_sessions_required: 20,
    total_price: 2900,
    amount_paid: 2900,
    remaining_balance: 0,
    payment_status: "paid",
    enrollment_date: "2023-09-20",
    missing_docs: [],
  },
  {
    id: "6",
    full_name: "Sara Bennani",
    phone: "0667890123",
    cin: "KL678901",
    permis_type: "B",
    status: "in_training",
    completed_sessions: 16,
    total_sessions_required: 20,
    total_price: 3100,
    amount_paid: 1000,
    remaining_balance: 2100,
    payment_status: "overdue",
    enrollment_date: "2023-10-14",
    missing_docs: ["CIN"],
  },
];

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "En retard", value: "overdue", dot: "error" as const },
  { label: "Dossier incomplet", value: "incomplete", dot: "warning" as const },
  { label: "Prêt examen", value: "exam_ready", dot: "success" as const },
];

export default function StudentsPage() {
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchesSearch =
      !search ||
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchesFilter =
      filter === "all" ||
      (filter === "overdue" && s.payment_status === "overdue") ||
      (filter === "incomplete" && s.missing_docs.length > 0) ||
      (filter === "exam_ready" && s.status === "exam_ready");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Gestion
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Élèves
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Importer
          </button>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel élève
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <FilterPills
          options={FILTER_OPTIONS}
          selected={filter}
          onSelect={setFilter}
        />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Aucun élève"
          description="Aucun élève ne correspond à votre recherche."
          action={{ label: "Ajouter un élève", onClick: () => {} }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-default overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
            <div className="col-span-3 table-header-cell">Élève</div>
            <div className="col-span-2 table-header-cell">Statut</div>
            <div className="col-span-2 table-header-cell">Progression</div>
            <div className="col-span-2 table-header-cell">Paiement</div>
            <div className="col-span-2 table-header-cell">Dossier</div>
            <div className="col-span-1 table-header-cell">Actions</div>
          </div>
          <div className="divide-y divide-default">
            {filtered.map((s) => {
              const pct = Math.round(
                (s.completed_sessions / s.total_sessions_required) * 100,
              );
              return (
                <div
                  key={s.id}
                  className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group cursor-pointer"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <StudentAvatar
                      initials={getInitials(s.full_name)}
                      size="md"
                    />
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {s.full_name}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                        {s.phone} · {s.permis_type}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge
                      status={s.status}
                      variant="student"
                    />
                  </div>
                  <div className="col-span-2 pr-4">
                    <ProgressBar
                      value={pct}
                      label={`${s.completed_sessions}/${s.total_sessions_required}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-semibold text-text-primary">
                      {formatMAD(s.amount_paid)}
                    </div>
                    <StatusBadge
                      status={s.payment_status}
                      variant="payment"
                    />
                  </div>
                  <div className="col-span-2">
                    <DossierStatus
                      docs={s.missing_docs.map((d) => ({
                        type: "cin" as const,
                        deleted_at: d ? null : null,
                      }))}
                    />
                    {s.missing_docs.length > 0 ? (
                      <span className="text-[10px] font-bold text-warning-text">
                        {s.missing_docs.length} manquant
                        {s.missing_docs.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-success-text">
                        Complet
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Link
                      href={`/students/${s.id}`}
                      className="p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button className="p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-xs text-muted">
        {filtered.length} élève{filtered.length > 1 ? "s" : ""}
        {filter !== "all" ? ` · filtre: ${filter}` : ""}
      </div>
    </div>
  );
}
