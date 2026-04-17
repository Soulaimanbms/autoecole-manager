"use client";

import * as React from "react";
import { CreditCard, TrendingDown, CheckCircle2, Eye } from "lucide-react";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { InsightCard } from "@/components/shared/InsightCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { FilterPills } from "@/components/shared/FilterPills";
import { formatMAD, formatDate, getInitials } from "@/lib/utils";

const MOCK_PAYMENTS = [
  { id: "p1", student: "Mohamed Alami", date: "2024-04-10", amount: 500, method: "cash", receipt: "REC-2024-041", status: "partial" },
  { id: "p2", student: "Fatima Zahra Benali", date: "2024-04-08", amount: 2800, method: "bank_transfer", receipt: "REC-2024-040", status: "paid" },
  { id: "p3", student: "Sara Bennani", date: "2024-02-15", amount: 1000, method: "cash", receipt: "REC-2024-022", status: "overdue" },
  { id: "p4", student: "Youssef Tazi", date: "2024-04-01", amount: 0, method: "cash", receipt: "—", status: "never_paid" },
  { id: "p5", student: "Aicha Ouali", date: "2024-03-20", amount: 2400, method: "check", receipt: "REC-2024-031", status: "overdue" },
  { id: "p6", student: "Omar Chraibi", date: "2024-04-12", amount: 2900, method: "bank_transfer", receipt: "REC-2024-042", status: "paid" },
];

const MONTHLY = [
  { month: "Janvier", collected: 12400, target: 18000 },
  { month: "Février", collected: 15600, target: 18000 },
  { month: "Mars", collected: 9800, target: 18000 },
  { month: "Avril", collected: 6200, target: 18000 },
];

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Payé", value: "paid" },
  { label: "Partiel", value: "partial" },
  { label: "En retard", value: "overdue", dot: "error" as const },
  { label: "Non payé", value: "never_paid", dot: "error" as const },
];

export default function PaymentsPage() {
  const [filter, setFilter] = React.useState("all");

  const filtered = filter === "all" ? MOCK_PAYMENTS : MOCK_PAYMENTS.filter((p) => p.status === filter);
  const overdueCount = MOCK_PAYMENTS.filter((p) => p.status === "overdue" || p.status === "never_paid").length;
  const totalCollected = MOCK_PAYMENTS.reduce((acc, p) => acc + p.amount, 0);
  const totalDue = 42 * 3000;
  const remaining = totalDue - totalCollected;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Finance</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Paiements</h1>
        </div>
      </div>

      {overdueCount > 0 && (
        <AlertBanner count={overdueCount} message="élèves en retard de paiement" ctaLabel="Voir les impayés" onCta={() => setFilter("overdue")} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InsightCard label="Total dû" value={formatMAD(totalDue)} icon={<CreditCard className="h-4 w-4" />} accentColor="blue" />
        <InsightCard label="Encaissé" value={formatMAD(totalCollected)} icon={<CheckCircle2 className="h-4 w-4" />} accentColor="green" trend={{ value: 12, positive: true }} />
        <InsightCard label="Reste à recouvrer" value={formatMAD(remaining)} icon={<TrendingDown className="h-4 w-4" />} accentColor="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <FilterPills options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />
          <div className="bg-white rounded-xl border border-default overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
              <div className="col-span-3 table-header-cell">Élève</div>
              <div className="col-span-2 table-header-cell">Date</div>
              <div className="col-span-2 table-header-cell">Montant</div>
              <div className="col-span-2 table-header-cell">Méthode</div>
              <div className="col-span-2 table-header-cell">Reçu</div>
              <div className="col-span-1 table-header-cell">Statut</div>
            </div>
            <div className="divide-y divide-default">
              {filtered.map((p) => (
                <div key={p.id} className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group">
                  <div className="col-span-3 flex items-center gap-3">
                    <StudentAvatar initials={getInitials(p.student)} size="sm" />
                    <span className="text-sm font-semibold text-text-primary">{p.student}</span>
                  </div>
                  <div className="col-span-2 text-sm text-text-body">{p.amount > 0 ? formatDate(p.date) : "—"}</div>
                  <div className="col-span-2 text-sm font-semibold text-text-primary">{p.amount > 0 ? formatMAD(p.amount) : "—"}</div>
                  <div className="col-span-2 text-[10px] uppercase tracking-wider text-muted">{p.method !== "cash" ? p.method.replace("_", " ") : "Espèces"}</div>
                  <div className="col-span-2 text-[10px] font-mono text-muted">{p.receipt}</div>
                  <div className="col-span-1 flex items-center gap-2">
                    <StatusBadge status={p.status} variant="payment" />
                    <button className="p-1.5 rounded-lg text-muted hover:bg-bg-hover opacity-0 group-hover:opacity-100 transition-all">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Résumé mensuel</h2>
          <div className="bg-white rounded-xl border border-default p-5 space-y-4">
            {MONTHLY.map((m) => {
              const pct = Math.round((m.collected / m.target) * 100);
              return (
                <div key={m.month}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-text-primary">{m.month}</span>
                    <span className="text-muted">{formatMAD(m.collected)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-hover rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">{pct}% de l&apos;objectif</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
