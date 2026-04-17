import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  CreditCard,
  GraduationCap,
  Car,
  BookOpen,
  Clock,
  FileText,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InsightCard } from "@/components/shared/InsightCard";
import { NextActionCard } from "@/components/shared/NextActionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { DateNavigator } from "@/components/shared/DateNavigator";
import { computeStudentFields } from "@/lib/compute";
import { getInitials, getCasablancaDate, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

function parseDateParam(raw: string | undefined): Date {
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(raw + "T12:00:00");
    if (!isNaN(d.getTime())) return d;
  }
  return getCasablancaDate();
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { date: dateParam } = await searchParams;
  const selectedDate = parseDateParam(dateParam);
  const dateStr = selectedDate.toISOString().slice(0, 10);

  const dayStart = new Date(dateStr + "T00:00:00.000Z");
  const dayEnd = new Date(dateStr + "T23:59:59.999Z");

  const [
    todaySessions,
    overdueStudents,
    examReadyStudents,
    allStudentsForDossier,
  ] = await Promise.all([
    prisma.session.findMany({
      where: {
        school_id: schoolId,
        date: { gte: dayStart, lte: dayEnd },
      },
      include: {
        student: { select: { id: true, full_name: true, phone: true } },
        instructor: { select: { id: true, full_name: true } },
      },
      orderBy: { start_time: "asc" },
    }),
    prisma.student.findMany({
      where: { school_id: schoolId },
      select: {
        id: true,
        full_name: true,
        last_payment_at: true,
        total_price: true,
        payments: { select: { amount: true, deleted_at: true } },
      },
    }),
    prisma.student.findMany({
      where: { school_id: schoolId, status: "exam_ready" },
      select: {
        id: true,
        full_name: true,
        phone: true,
        status: true,
        code_exam_passed: true,
      },
    }),
    prisma.student.findMany({
      where: { school_id: schoolId },
      select: {
        id: true,
        full_name: true,
        documents: { select: { type: true, deleted_at: true } },
      },
    }),
  ]);

  // Compute overdue
  const overdueCount = overdueStudents.filter((s) => {
    const paid = s.payments
      .filter((p) => !p.deleted_at)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const remaining = Number(s.total_price) - paid;
    if (remaining <= 0) return false;
    if (paid === 0) return true;
    const days =
      s.last_payment_at
        ? Math.floor(
            (Date.now() - new Date(s.last_payment_at).getTime()) /
              86400000,
          )
        : Infinity;
    return days > 14;
  }).length;

  // Compute incomplete dossiers
  const { getMissingRequiredDocs } = await import("@/lib/workflow");
  const incompleteDossierCount = allStudentsForDossier.filter(
    (s) => getMissingRequiredDocs(s.documents).length > 0,
  ).length;

  // Most urgent student for NextActionCard
  let urgentStudentAction: { name: string; label: string; cta?: string } | null = null;
  if (examReadyStudents.length > 0) {
    const s = examReadyStudents[0];
    urgentStudentAction = {
      name: s.full_name,
      label: s.code_exam_passed
        ? "Programmer l'examen de conduite"
        : "Passer l'examen code en premier",
      cta: "Programmer",
    };
  }

  const completedToday = todaySessions.filter((s) => s.status === "completed").length;
  const scheduledToday = todaySessions.filter((s) => s.status === "scheduled").length;
  const missedToday = todaySessions.filter((s) => s.status === "missed").length;

  const dateLabel = format(selectedDate, "EEEE d MMMM yyyy", { locale: fr });

  // À traiter list: overdue + incomplete + exam_ready
  const aTraiter: Array<{
    id: string;
    name: string;
    issue: string;
    urgent: boolean;
  }> = [];

  // Add exam_ready
  for (const s of examReadyStudents.slice(0, 3)) {
    aTraiter.push({
      id: s.id,
      name: s.full_name,
      issue: "Prêt pour l'examen de conduite",
      urgent: true,
    });
  }

  // Add dossier incomplete
  for (const s of allStudentsForDossier) {
    if (aTraiter.length >= 6) break;
    const missing = getMissingRequiredDocs(s.documents);
    if (missing.length > 0) {
      aTraiter.push({
        id: s.id,
        name: s.full_name,
        issue: `Dossier incomplet — ${missing[0]} manquant`,
        urgent: false,
      });
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Tableau de bord
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Bonjour, {session.schoolName ?? ""}
        </h1>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard
          label="Séances aujourd'hui"
          value={todaySessions.length}
          subtitle={`${completedToday} terminées · ${scheduledToday} à venir`}
          icon={<Calendar className="h-4 w-4" />}
          accentColor="green"
          href="/sessions"
        />
        <InsightCard
          label="Alertes paiements"
          value={overdueCount}
          subtitle="Élèves en retard > 14 jours"
          icon={<CreditCard className="h-4 w-4" />}
          accentColor="red"
          href="/payments?filter=overdue"
        />
        <InsightCard
          label="Prêts pour examen"
          value={examReadyStudents.length}
          subtitle="Examen à planifier"
          icon={<GraduationCap className="h-4 w-4" />}
          accentColor="amber"
          href="/students?filter=exam_ready"
        />
        <InsightCard
          label="Dossiers incomplets"
          value={incompleteDossierCount}
          subtitle="Documents manquants"
          icon={<FileText className="h-4 w-4" />}
          accentColor="blue"
          href="/students?filter=incomplete"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Séances
            </h2>
            <Link
              href="/sessions"
              className="text-xs text-accent-text font-semibold hover:underline"
            >
              Voir tout
            </Link>
          </div>

          <DateNavigator dateStr={dateStr} label={dateLabel} />

          {todaySessions.length === 0 ? (
            <div className="bg-white rounded-xl border border-default p-10 text-center">
              <Calendar className="h-8 w-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">Aucune séance ce jour</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
                <div className="col-span-2 table-header-cell">Heure</div>
                <div className="col-span-4 table-header-cell">Élève</div>
                <div className="col-span-2 table-header-cell">Moniteur</div>
                <div className="col-span-2 table-header-cell">Type</div>
                <div className="col-span-2 table-header-cell">Statut</div>
              </div>
              <div className="divide-y divide-default">
                {todaySessions.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted" />
                      <span className="text-sm font-semibold text-text-primary">
                        {s.start_time}
                      </span>
                    </div>
                    <div className="col-span-4 flex items-center gap-3">
                      <StudentAvatar
                        initials={getInitials(s.student.full_name)}
                        size="sm"
                      />
                      <div>
                        <div className="text-sm font-semibold text-text-primary">
                          {s.student.full_name}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-xs text-muted">
                      {s.instructor.full_name.split(" ")[0]}
                    </div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                        {s.type === "conduite" ? (
                          <Car className="h-3 w-3" />
                        ) : (
                          <BookOpen className="h-3 w-3" />
                        )}
                        {s.type}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <StatusBadge status={s.status} variant="session" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* End of day summary */}
          <div className="bg-white rounded-xl border border-default p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              Résumé du jour
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-text">
                  {completedToday}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                  Terminées
                </div>
              </div>
              <div className="text-center border-x border-default">
                <div className="text-2xl font-bold text-info-text">
                  {scheduledToday}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                  À venir
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error-text">
                  {missedToday}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                  Manquées
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* À traiter */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">À traiter</h2>

          {urgentStudentAction && (
            <NextActionCard
              action={`${urgentStudentAction.name} — ${urgentStudentAction.label}`}
              cta={urgentStudentAction.cta}
              urgent
            />
          )}

          {aTraiter.length === 0 ? (
            <div className="bg-white rounded-xl border border-default p-6 text-center">
              <p className="text-sm text-muted">Aucune action requise 🎉</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-default overflow-hidden">
              <div className="divide-y divide-default">
                {aTraiter.map((item) => (
                  <Link
                    key={item.id}
                    href={`/students/${item.id}`}
                    className="px-4 py-3 hover:bg-bg-hover transition-all flex items-start gap-3 block"
                  >
                    <div className="mt-1 shrink-0">
                      {item.urgent ? (
                        <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-warning" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text-primary">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {item.issue}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-default">
                <Link
                  href="/students"
                  className="text-xs text-accent-text font-semibold hover:underline"
                >
                  Voir tous les élèves →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
