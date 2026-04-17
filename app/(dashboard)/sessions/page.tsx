import { redirect } from "next/navigation";
import { Plus, Car, BookOpen } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCasablancaDate, getInitials, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { WeekNavigator } from "@/components/shared/WeekNavigator";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { UrlFilterPills } from "@/components/shared/UrlFilterPills";
import { startOfWeek, endOfWeek, addWeeks, getDay, format } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

// Monday = 0, ..., Sunday = 6
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function dayIndex(date: Date): number {
  const d = getDay(date); // 0=Sun, 1=Mon, ..., 6=Sat
  return d === 0 ? 6 : d - 1; // convert to Mon=0
}

function getWeekRange(weekOffset: number) {
  const now = getCasablancaDate();
  const baseMonday = startOfWeek(now, { weekStartsOn: 1 });
  const monday = addWeeks(baseMonday, weekOffset);
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });
  return { monday, sunday };
}

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Conduite", value: "conduite" },
  { label: "Code", value: "code" },
  { label: "Planifiées", value: "scheduled" },
  { label: "Terminées", value: "completed" },
  { label: "Manquées", value: "missed", dot: "error" as const },
];

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; view?: string; filter?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { week = "0", view = "calendar", filter = "all" } = await searchParams;
  const weekOffset = parseInt(week, 10) || 0;
  const { monday, sunday } = getWeekRange(weekOffset);

  const whereType =
    filter === "conduite"
      ? { type: "conduite" as const }
      : filter === "code"
        ? { type: "code" as const }
        : {};
  const whereStatus =
    filter === "scheduled"
      ? { status: "scheduled" as const }
      : filter === "completed"
        ? { status: "completed" as const }
        : filter === "missed"
          ? { status: "missed" as const }
          : {};

  const sessions = await prisma.session.findMany({
    where: {
      school_id: schoolId,
      date: { gte: monday, lte: sunday },
      ...whereType,
      ...whereStatus,
    },
    include: {
      student: { select: { id: true, full_name: true } },
      instructor: { select: { id: true, full_name: true } },
    },
    orderBy: [{ date: "asc" }, { start_time: "asc" }],
  });

  const weekLabel =
    weekOffset === 0
      ? "Cette semaine"
      : weekOffset === -1
        ? "Semaine dernière"
        : weekOffset === 1
          ? "Semaine prochaine"
          : `${format(monday, "d MMM", { locale: fr })} – ${format(sunday, "d MMM yyyy", { locale: fr })}`;

  const sessionsByDay = DAYS.map((_, idx) =>
    sessions.filter((s) => dayIndex(new Date(s.date)) === idx),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Planning
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Séances
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view as "calendar" | "list"} />
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle séance
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <WeekNavigator weekOffset={weekOffset} label={weekLabel} />
        <UrlFilterPills options={FILTER_OPTIONS} paramName="filter" defaultValue="all" />
      </div>

      {view === "calendar" ? (
        <div className="grid grid-cols-7 gap-3">
          {DAYS.map((day, idx) => {
            const daySessions = sessionsByDay[idx];
            const dayDate = addWeeks(
              startOfWeek(getCasablancaDate(), { weekStartsOn: 1 }),
              weekOffset,
            );
            dayDate.setDate(dayDate.getDate() + idx);
            const dayLabel = format(dayDate, "d", { locale: fr });
            return (
              <div key={day} className="space-y-2">
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    {day}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{dayLabel}</div>
                </div>
                <div className="min-h-[200px] bg-white rounded-xl border border-default p-2 space-y-2">
                  {daySessions.length === 0 ? (
                    <div className="flex items-center justify-center h-full py-8">
                      <span className="text-[10px] text-faint">—</span>
                    </div>
                  ) : (
                    daySessions.map((s) => (
                      <div
                        key={s.id}
                        className={`p-2 rounded-lg border text-[10px] cursor-pointer hover:shadow-sm transition-all ${
                          s.status === "completed"
                            ? "bg-success-bg border-success/20"
                            : s.status === "missed"
                              ? "bg-error-bg border-error/20"
                              : "bg-info-bg border-info/20"
                        }`}
                      >
                        <div className="font-bold text-text-primary">
                          {s.start_time}
                        </div>
                        <div className="text-muted truncate mt-0.5">
                          {s.student.full_name}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {s.type === "conduite" ? (
                            <Car className="h-3 w-3 text-muted" />
                          ) : (
                            <BookOpen className="h-3 w-3 text-muted" />
                          )}
                          <span className="text-muted">{s.type}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-default overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
            <div className="col-span-2 table-header-cell">Date & Heure</div>
            <div className="col-span-3 table-header-cell">Élève</div>
            <div className="col-span-2 table-header-cell">Moniteur</div>
            <div className="col-span-2 table-header-cell">Type</div>
            <div className="col-span-2 table-header-cell">Durée</div>
            <div className="col-span-1 table-header-cell">Statut</div>
          </div>
          {sessions.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted">
              Aucune séance cette semaine
            </div>
          ) : (
            <div className="divide-y divide-default">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
                >
                  <div className="col-span-2">
                    <div className="text-sm font-semibold text-text-primary">
                      {formatDate(s.date)}
                    </div>
                    <div className="text-[10px] text-muted">{s.start_time}</div>
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <StudentAvatar
                      initials={getInitials(s.student.full_name)}
                      size="sm"
                    />
                    <span className="text-sm font-semibold text-text-primary">
                      {s.student.full_name}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-text-body">
                    {s.instructor.full_name}
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
                  <div className="col-span-2 text-sm text-text-body">
                    {s.duration_minutes} min
                  </div>
                  <div className="col-span-1">
                    <StatusBadge status={s.status} variant="session" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-muted">
        {sessions.length} séance{sessions.length !== 1 ? "s" : ""} ·{" "}
        {weekLabel}
      </div>
    </div>
  );
}
