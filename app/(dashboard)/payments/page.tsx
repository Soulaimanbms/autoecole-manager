import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, TrendingDown, CheckCircle2, Eye } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeStudentFields } from "@/lib/compute";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { InsightCard } from "@/components/shared/InsightCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { UrlFilterPills } from "@/components/shared/UrlFilterPills";
import { formatMAD, formatDate, getInitials, getCasablancaDate } from "@/lib/utils";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Payé", value: "paid" },
  { label: "Partiel", value: "partial" },
  { label: "En retard", value: "overdue", dot: "error" as const },
  { label: "Non payé", value: "never_paid", dot: "error" as const },
];

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { filter = "all" } = await searchParams;
  const now = getCasablancaDate();

  const [payments, students] = await Promise.all([
    prisma.payment.findMany({
      where: { school_id: schoolId },
      include: {
        student: { select: { id: true, full_name: true, phone: true } },
      },
      orderBy: { payment_date: "desc" },
    }),
    prisma.student.findMany({
      where: { school_id: schoolId },
      select: {
        id: true,
        total_price: true,
        last_payment_at: true,
        payments: { select: { amount: true, deleted_at: true } },
      },
    }),
  ]);

  // Compute payment statuses for alert
  const studentStatuses = students.map((s) => {
    const paid = s.payments.filter((p) => !p.deleted_at).reduce((acc, p) => acc + Number(p.amount), 0);
    const remaining = Math.max(0, Number(s.total_price) - paid);
    if (remaining <= 0) return "paid";
    if (paid === 0) return "never_paid";
    const days = s.last_payment_at
      ? Math.floor((Date.now() - new Date(s.last_payment_at).getTime()) / 86400000)
      : Infinity;
    return days > 14 ? "overdue" : "partial";
  });

  const overdueCount = studentStatuses.filter((s) => s === "overdue" || s === "never_paid").length;
  const totalDue = students.reduce((acc, s) => acc + Number(s.total_price), 0);
  const totalCollected = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const remaining = Math.max(0, totalDue - totalCollected);

  // Payments with payment_status for student
  const paymentsWithStatus = payments.map((p) => {
    const s = students.find((st) => st.id === p.student_id);
    let status = "paid";
    if (s) {
      const paid = s.payments.filter((pay) => !pay.deleted_at).reduce((acc, pay) => acc + Number(pay.amount), 0);
      const rem = Math.max(0, Number(s.total_price) - paid);
      if (rem <= 0) status = "paid";
      else if (paid === 0) status = "never_paid";
      else {
        const days = s.last_payment_at
          ? Math.floor((Date.now() - new Date(s.last_payment_at).getTime()) / 86400000)
          : Infinity;
        status = days > 14 ? "overdue" : "partial";
      }
    }
    return { ...p, computed_status: status };
  });

  const filteredPayments =
    filter === "all"
      ? paymentsWithStatus
      : paymentsWithStatus.filter((p) => p.computed_status === filter);

  // Monthly summary — last 4 months
  const monthlySummary = Array.from({ length: 4 }, (_, i) => {
    const d = subMonths(now, 3 - i);
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    const total = payments
      .filter((p) => {
        const pd = new Date(p.payment_date);
        return pd >= start && pd <= end;
      })
      .reduce((acc, p) => acc + Number(p.amount), 0);
    return { month: format(d, "MMMM", { locale: fr }), total };
  });

  const maxMonthly = Math.max(...monthlySummary.map((m) => m.total), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Finance
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Paiements
          </h1>
        </div>
      </div>

      {overdueCount > 0 && (
        <AlertBanner
          count={overdueCount}
          message="élèves en retard de paiement"
          ctaLabel="Voir les impayés"
          onCta={() => {}}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InsightCard
          label="Total dû"
          value={formatMAD(totalDue)}
          icon={<CreditCard className="h-4 w-4" />}
          accentColor="blue"
        />
        <InsightCard
          label="Encaissé"
          value={formatMAD(totalCollected)}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accentColor="green"
        />
        <InsightCard
          label="Reste à recouvrer"
          value={formatMAD(remaining)}
          icon={<TrendingDown className="h-4 w-4" />}
          accentColor="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <UrlFilterPills options={FILTER_OPTIONS} paramName="filter" defaultValue="all" />

          <div className="bg-white rounded-xl border border-default overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
              <div className="col-span-3 table-header-cell">Élève</div>
              <div className="col-span-2 table-header-cell">Date</div>
              <div className="col-span-2 table-header-cell">Montant</div>
              <div className="col-span-2 table-header-cell">Méthode</div>
              <div className="col-span-2 table-header-cell">Reçu</div>
              <div className="col-span-1 table-header-cell">Statut</div>
            </div>
            {filteredPayments.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted">
                Aucun paiement dans cette catégorie
              </div>
            ) : (
              <div className="divide-y divide-default">
                {filteredPayments.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <StudentAvatar
                        initials={getInitials(p.student.full_name)}
                        size="sm"
                      />
                      <Link
                        href={`/students/${p.student.id}`}
                        className="text-sm font-semibold text-text-primary hover:text-accent transition-all"
                      >
                        {p.student.full_name}
                      </Link>
                    </div>
                    <div className="col-span-2 text-sm text-text-body">
                      {formatDate(p.payment_date)}
                    </div>
                    <div className="col-span-2 text-sm font-semibold text-text-primary">
                      {formatMAD(Number(p.amount))}
                    </div>
                    <div className="col-span-2 text-[10px] uppercase tracking-wider text-muted">
                      {p.method === "cash"
                        ? "Espèces"
                        : p.method === "bank_transfer"
                          ? "Virement"
                          : p.method === "check"
                            ? "Chèque"
                            : p.method === "ccp"
                              ? "CCP"
                              : "Autre"}
                    </div>
                    <div className="col-span-2 text-[10px] font-mono text-muted">
                      {p.receipt_number ?? "—"}
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                      <StatusBadge status={p.computed_status} variant="payment" />
                      <button className="p-1.5 rounded-lg text-muted hover:bg-bg-hover opacity-0 group-hover:opacity-100 transition-all">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Résumé mensuel
          </h2>
          <div className="bg-white rounded-xl border border-default p-5 space-y-4">
            {monthlySummary.map((m) => {
              const pct = maxMonthly > 0 ? Math.round((m.total / maxMonthly) * 100) : 0;
              return (
                <div key={m.month}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-text-primary capitalize">
                      {m.month}
                    </span>
                    <span className="text-muted">{formatMAD(m.total)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-xs text-muted">
        {filteredPayments.length} paiement
        {filteredPayments.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
