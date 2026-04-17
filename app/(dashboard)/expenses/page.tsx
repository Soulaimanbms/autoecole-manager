"use client";

import * as React from "react";
import { Plus, TrendingDown } from "lucide-react";
import { FilterPills } from "@/components/shared/FilterPills";
import { formatMAD, formatDate } from "@/lib/utils";

const MOCK_EXPENSES = [
  { id: "ex1", category: "fuel", description: "Carburant véhicules", date: "2024-04-10", amount: 800 },
  { id: "ex2", category: "salary", description: "Salaire Karim Benali", date: "2024-04-01", amount: 5000 },
  { id: "ex3", category: "salary", description: "Salaire Hassan Moussaoui", date: "2024-04-01", amount: 4500 },
  { id: "ex4", category: "maintenance", description: "Révision Toyota Yaris", date: "2024-03-25", amount: 1200 },
  { id: "ex5", category: "rent", description: "Loyer local", date: "2024-04-01", amount: 3500 },
  { id: "ex6", category: "other", description: "Fournitures bureau", date: "2024-04-05", amount: 350 },
];

const MONTHLY_SUMMARY = [
  { month: "Janvier", total: 14200 },
  { month: "Février", total: 13800 },
  { month: "Mars", total: 15200 },
  { month: "Avril", total: 15350 },
];

const CATEGORY_LABELS: Record<string, string> = {
  fuel: "Carburant",
  maintenance: "Entretien",
  salary: "Salaires",
  rent: "Loyer",
  other: "Autre",
};

const CATEGORY_COLORS: Record<string, string> = {
  fuel: "bg-warning-bg text-warning-text",
  maintenance: "bg-info-bg text-info-text",
  salary: "bg-accent-dim text-accent-text",
  rent: "bg-error-bg text-error-text",
  other: "bg-bg-hover text-muted",
};

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Carburant", value: "fuel" },
  { label: "Salaires", value: "salary" },
  { label: "Entretien", value: "maintenance" },
  { label: "Loyer", value: "rent" },
  { label: "Autre", value: "other" },
];

export default function ExpensesPage() {
  const [filter, setFilter] = React.useState("all");
  const filtered = filter === "all" ? MOCK_EXPENSES : MOCK_EXPENSES.filter((e) => e.category === filter);
  const totalThisMonth = MOCK_EXPENSES.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Finance</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Dépenses</h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />Ajouter dépense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <FilterPills options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />
          </div>
          <div className="bg-white rounded-xl border border-default overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
              <div className="col-span-3 table-header-cell">Catégorie</div>
              <div className="col-span-5 table-header-cell">Description</div>
              <div className="col-span-2 table-header-cell">Date</div>
              <div className="col-span-2 table-header-cell">Montant</div>
            </div>
            <div className="divide-y divide-default">
              {filtered.map((e) => (
                <div key={e.id} className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group">
                  <div className="col-span-3">
                    <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${CATEGORY_COLORS[e.category]}`}>
                      {CATEGORY_LABELS[e.category]}
                    </span>
                  </div>
                  <div className="col-span-5 text-sm text-text-body">{e.description}</div>
                  <div className="col-span-2 text-sm text-text-body">{formatDate(e.date)}</div>
                  <div className="col-span-2 text-sm font-semibold text-text-primary flex items-center gap-2">
                    <TrendingDown className="h-3.5 w-3.5 text-error opacity-0 group-hover:opacity-100 transition-all" />
                    {formatMAD(e.amount)}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-default bg-bg-page flex justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total</span>
              <span className="text-sm font-bold text-text-primary">{formatMAD(filtered.reduce((a, e) => a + e.amount, 0))}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Résumé mensuel</h2>
          <div className="bg-white rounded-xl border border-default p-5 space-y-4">
            <div className="text-center pb-4 border-b border-default">
              <div className="text-3xl font-bold text-error-text">{formatMAD(totalThisMonth)}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Ce mois (Avril)</div>
            </div>
            {MONTHLY_SUMMARY.map((m) => (
              <div key={m.month} className="flex items-center justify-between text-sm">
                <span className="text-text-body">{m.month}</span>
                <span className="font-semibold text-text-primary">{formatMAD(m.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
