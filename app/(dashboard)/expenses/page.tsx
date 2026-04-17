import { redirect } from "next/navigation";
import { Plus, TrendingDown } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UrlFilterPills } from "@/components/shared/UrlFilterPills";
import { formatMAD, formatDate, getCasablancaDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ExpenseCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  fuel: "Carburant",
  maintenance: "Entretien",
  salary: "Salaires",
  rent: "Loyer",
  other: "Autre",
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
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

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { filter = "all" } = await searchParams;
  const now = getCasablancaDate();

  const whereCategory =
    filter !== "all" ? { category: filter as ExpenseCategory } : {};

  const [expenses, allExpenses] = await Promise.all([
    prisma.expense.findMany({
      where: { school_id: schoolId, ...whereCategory },
      orderBy: { expense_date: "desc" },
    }),
    prisma.expense.findMany({
      where: { school_id: schoolId },
      select: { amount: true, expense_date: true },
    }),
  ]);

  // Monthly summary — last 4 months
  const monthlySummary = Array.from({ length: 4 }, (_, i) => {
    const d = subMonths(now, 3 - i);
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    const total = allExpenses
      .filter((e) => {
        const ed = new Date(e.expense_date);
        return ed >= start && ed <= end;
      })
      .reduce((acc, e) => acc + Number(e.amount), 0);
    return { month: format(d, "MMMM", { locale: fr }), total };
  });

  const totalThisMonth = monthlySummary[monthlySummary.length - 1].total;
  const totalFiltered = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Finance
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Dépenses
          </h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter dépense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <UrlFilterPills options={FILTER_OPTIONS} paramName="filter" defaultValue="all" />

          {expenses.length === 0 ? (
            <EmptyState
              icon={<TrendingDown className="h-6 w-6" />}
              title="Aucune dépense"
              description="Enregistrez votre première dépense."
              action={{ label: "Ajouter", onClick: () => {} }}
            />
          ) : (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
                <div className="col-span-3 table-header-cell">Catégorie</div>
                <div className="col-span-5 table-header-cell">Description</div>
                <div className="col-span-2 table-header-cell">Date</div>
                <div className="col-span-2 table-header-cell">Montant</div>
              </div>
              <div className="divide-y divide-default">
                {expenses.map((e) => (
                  <div
                    key={e.id}
                    className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
                  >
                    <div className="col-span-3">
                      <span
                        className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${CATEGORY_COLORS[e.category]}`}
                      >
                        {CATEGORY_LABELS[e.category]}
                      </span>
                    </div>
                    <div className="col-span-5 text-sm text-text-body">
                      {e.description ?? "—"}
                    </div>
                    <div className="col-span-2 text-sm text-text-body">
                      {formatDate(e.expense_date)}
                    </div>
                    <div className="col-span-2 text-sm font-semibold text-text-primary flex items-center gap-2">
                      <TrendingDown className="h-3.5 w-3.5 text-error opacity-0 group-hover:opacity-100 transition-all" />
                      {formatMAD(Number(e.amount))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-default bg-bg-page flex justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Total {filter !== "all" ? `(${CATEGORY_LABELS[filter as ExpenseCategory]})` : ""}
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {formatMAD(totalFiltered)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Résumé mensuel
          </h2>
          <div className="bg-white rounded-xl border border-default p-5 space-y-4">
            <div className="text-center pb-4 border-b border-default">
              <div className="text-3xl font-bold text-error-text">
                {formatMAD(totalThisMonth)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                Ce mois ({format(now, "MMMM", { locale: fr })})
              </div>
            </div>
            {monthlySummary.map((m) => (
              <div key={m.month} className="flex items-center justify-between text-sm">
                <span className="text-text-body capitalize">{m.month}</span>
                <span className="font-semibold text-text-primary">
                  {formatMAD(m.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
