"use client";

import * as React from "react";
import { Plus, GraduationCap, Car, BookOpen } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { FilterPills } from "@/components/shared/FilterPills";
import { formatDate, getInitials } from "@/lib/utils";

const MOCK_EXAMS = [
  { id: "e1", student: "Fatima Zahra Benali", type: "driving", date: "2024-04-20", result: "pending", attempt: 1, narsa: "NARSA-D-001" },
  { id: "e2", student: "Mohamed Alami", type: "code", date: "2024-03-10", result: "failed", attempt: 1, narsa: "NARSA-C-045" },
  { id: "e3", student: "Omar Chraibi", type: "driving", date: "2024-04-05", result: "passed", attempt: 2, narsa: "NARSA-D-089" },
  { id: "e4", student: "Nadia Chraibi", type: "code", date: "2024-04-12", result: "passed", attempt: 1, narsa: "NARSA-C-078" },
  { id: "e5", student: "Youssef Tazi", type: "code", date: "2024-04-25", result: "pending", attempt: 1, narsa: "NARSA-C-091" },
];

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Code", value: "code" },
  { label: "Conduite", value: "driving" },
  { label: "En attente", value: "pending" },
  { label: "Réussi", value: "passed", dot: "success" as const },
  { label: "Échoué", value: "failed", dot: "error" as const },
];

export default function ExamsPage() {
  const [filter, setFilter] = React.useState("all");

  const filtered = filter === "all" ? MOCK_EXAMS : MOCK_EXAMS.filter((e) =>
    e.type === filter || e.result === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Formation</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Examens</h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />Programmer examen
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-default p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">{MOCK_EXAMS.filter(e => e.result === "pending").length}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">À venir</div>
        </div>
        <div className="bg-white rounded-xl border border-default p-4 text-center">
          <div className="text-2xl font-bold text-success-text">{MOCK_EXAMS.filter(e => e.result === "passed").length}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Réussis</div>
        </div>
        <div className="bg-white rounded-xl border border-default p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{MOCK_EXAMS.filter(e => e.result === "failed").length}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Échoués</div>
        </div>
      </div>

      <FilterPills options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />

      <div className="bg-white rounded-xl border border-default overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
          <div className="col-span-3 table-header-cell">Élève</div>
          <div className="col-span-2 table-header-cell">Type</div>
          <div className="col-span-2 table-header-cell">Date</div>
          <div className="col-span-2 table-header-cell">Tentative</div>
          <div className="col-span-2 table-header-cell">N° NARSA</div>
          <div className="col-span-1 table-header-cell">Résultat</div>
        </div>
        <div className="divide-y divide-default">
          {filtered.map((e) => (
            <div key={e.id} className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group">
              <div className="col-span-3 flex items-center gap-3">
                <StudentAvatar initials={getInitials(e.student)} size="sm" />
                <span className="text-sm font-semibold text-text-primary">{e.student}</span>
              </div>
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                  {e.type === "driving" ? <Car className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                  {e.type === "driving" ? "Conduite" : "Code"}
                </span>
              </div>
              <div className="col-span-2 text-sm text-text-body">{formatDate(e.date)}</div>
              <div className="col-span-2 text-sm text-text-body">{e.attempt}</div>
              <div className="col-span-2 text-[10px] font-mono text-muted">{e.narsa}</div>
              <div className="col-span-1">
                <StatusBadge status={e.result} variant="exam" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted">{filtered.length} examen{filtered.length > 1 ? "s" : ""}</div>
    </div>
  );
}
