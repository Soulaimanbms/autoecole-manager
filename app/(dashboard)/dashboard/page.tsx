import {
  Calendar,
  Users,
  CreditCard,
  GraduationCap,
  Car,
  BookOpen,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { InsightCard } from "@/components/shared/InsightCard";
import { NextActionCard } from "@/components/shared/NextActionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MOCK_SESSIONS_TODAY = [
  {
    id: "1",
    time: "08:30",
    duration: 60,
    type: "conduite" as const,
    status: "completed" as const,
    student: { name: "Mohamed Alami", phone: "0612345678" },
    instructor: "Karim B.",
  },
  {
    id: "2",
    time: "10:00",
    duration: 45,
    type: "code" as const,
    status: "completed" as const,
    student: { name: "Fatima Zahra", phone: "0623456789" },
    instructor: "Karim B.",
  },
  {
    id: "3",
    time: "14:00",
    duration: 60,
    type: "conduite" as const,
    status: "scheduled" as const,
    student: { name: "Youssef Benali", phone: "0634567890" },
    instructor: "Hassan M.",
  },
  {
    id: "4",
    time: "15:30",
    duration: 60,
    type: "conduite" as const,
    status: "scheduled" as const,
    student: { name: "Aicha Ouali", phone: "0645678901" },
    instructor: "Hassan M.",
  },
  {
    id: "5",
    time: "17:00",
    duration: 45,
    type: "conduite" as const,
    status: "missed" as const,
    student: { name: "Omar Tazi", phone: "0656789012" },
    instructor: "Karim B.",
  },
];

const MOCK_A_TRAITER = [
  {
    id: "1",
    name: "Sara Bennani",
    issue: "Paiement en retard — 45 jours",
    type: "payment" as const,
    urgent: true,
  },
  {
    id: "2",
    name: "Khalid Rafiq",
    issue: "Dossier incomplet — CIN manquant",
    type: "docs" as const,
    urgent: false,
  },
  {
    id: "3",
    name: "Nadia Chraibi",
    issue: "Prête pour examen conduite",
    type: "exam" as const,
    urgent: true,
  },
  {
    id: "4",
    name: "Tariq Lahrizi",
    issue: "Aucun paiement enregistré",
    type: "payment" as const,
    urgent: true,
  },
];

const TODAY_LABEL = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

export default function DashboardPage() {
  const completedToday = MOCK_SESSIONS_TODAY.filter(
    (s) => s.status === "completed",
  ).length;
  const scheduledToday = MOCK_SESSIONS_TODAY.filter(
    (s) => s.status === "scheduled",
  ).length;
  const missedToday = MOCK_SESSIONS_TODAY.filter(
    (s) => s.status === "missed",
  ).length;

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Tableau de bord
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Bonjour, Atlas Auto-École
        </h1>
        <p className="text-sm text-muted mt-1 capitalize">{TODAY_LABEL}</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard
          label="Élèves actifs"
          value={42}
          subtitle="3 nouveaux ce mois"
          icon={<Users className="h-4 w-4" />}
          accentColor="blue"
          href="/students"
          trend={{ value: 8, positive: true }}
        />
        <InsightCard
          label="Séances aujourd'hui"
          value={MOCK_SESSIONS_TODAY.length}
          subtitle={`${completedToday} terminées · ${scheduledToday} à venir`}
          icon={<Calendar className="h-4 w-4" />}
          accentColor="green"
          href="/sessions"
        />
        <InsightCard
          label="Impayés"
          value={4}
          subtitle="12 400 MAD en attente"
          icon={<CreditCard className="h-4 w-4" />}
          accentColor="red"
          href="/payments"
          trend={{ value: 2, positive: false }}
        />
        <InsightCard
          label="Prêts examen"
          value={3}
          subtitle="Examen conduite à planifier"
          icon={<GraduationCap className="h-4 w-4" />}
          accentColor="amber"
          href="/exams"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions today */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Séances du jour
            </h2>
            <a
              href="/sessions"
              className="text-xs text-accent-text font-semibold hover:underline"
            >
              Voir tout
            </a>
          </div>

          <div className="bg-white rounded-xl border border-default overflow-hidden">
            <div className="grid grid-cols-5 px-6 py-3 border-b border-default bg-bg-page">
              <div className="table-header-cell">Heure</div>
              <div className="table-header-cell col-span-2">Élève</div>
              <div className="table-header-cell">Type</div>
              <div className="table-header-cell">Statut</div>
            </div>
            <div className="divide-y divide-default">
              {MOCK_SESSIONS_TODAY.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-5 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    <span className="text-sm font-semibold text-text-primary">
                      {s.time}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <StudentAvatar
                      initials={getInitials(s.student.name)}
                      size="sm"
                    />
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {s.student.name}
                      </div>
                      <div className="text-[10px] text-muted uppercase tracking-wider">
                        {s.instructor}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                      {s.type === "conduite" ? (
                        <Car className="h-3 w-3" />
                      ) : (
                        <BookOpen className="h-3 w-3" />
                      )}
                      {s.type}
                    </span>
                  </div>
                  <div>
                    <StatusBadge status={s.status} variant="session" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* End of day summary */}
          <div className="bg-white rounded-xl border border-default p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              Résumé de la journée
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
          <h2 className="text-xl font-semibold text-text-primary">
            À traiter
          </h2>

          <NextActionCard
            action="Programmer l'examen de conduite pour Nadia Chraibi"
            cta="Programmer"
            urgent
          />

          <div className="bg-white rounded-xl border border-default overflow-hidden">
            <div className="divide-y divide-default">
              {MOCK_A_TRAITER.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-bg-hover transition-all flex items-start gap-3"
                >
                  <div className="mt-0.5">
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
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-default">
              <a
                href="/students"
                className="text-xs text-accent-text font-semibold hover:underline"
              >
                Voir tous les cas →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
