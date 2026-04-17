import { redirect } from "next/navigation";
import { Plus, Phone, Car, CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { getInitials, getCasablancaDate } from "@/lib/utils";
import { startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function parseAvailability(raw: unknown): string[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  return DAYS_SHORT.filter((d) => obj[d] === true || obj[d] === 1);
}

export default async function InstructorsPage() {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const now = getCasablancaDate();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const instructors = await prisma.instructor.findMany({
    where: { school_id: schoolId },
    include: {
      sessions: {
        where: {
          date: { gte: monthStart, lte: monthEnd },
        },
        select: { id: true, status: true },
      },
    },
    orderBy: { created_at: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Gestion
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Moniteurs
          </h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter moniteur
        </button>
      </div>

      {instructors.length === 0 ? (
        <div className="bg-white rounded-xl border border-default p-10 text-center text-sm text-muted">
          Aucun moniteur enregistré
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {instructors.map((inst) => {
            const totalSessions = inst.sessions.length;
            const completedSessions = inst.sessions.filter(
              (s) => s.status === "completed",
            ).length;
            const completionRate =
              totalSessions > 0
                ? Math.round((completedSessions / totalSessions) * 100)
                : 0;
            const availability = parseAvailability(inst.availability);

            return (
              <div
                key={inst.id}
                className="bg-white rounded-xl border border-default p-6 space-y-4 hover:border-border-strong hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <StudentAvatar
                    initials={getInitials(inst.full_name)}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-text-primary">
                          {inst.full_name}
                        </h3>
                        <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                          {inst.license_number ?? "—"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${inst.status === "active" ? "bg-success animate-pulse" : "bg-muted"}`}
                        />
                        <span
                          className={`text-[10px] font-bold ${inst.status === "active" ? "text-success-text" : "text-muted"}`}
                        >
                          {inst.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-text-body">
                      <Phone className="h-3.5 w-3.5 text-muted" />
                      {inst.phone}
                    </div>
                  </div>
                </div>

                {inst.authorized_permis.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inst.authorized_permis.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text"
                      >
                        <Car className="h-3 w-3" />
                        Permis {p}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-default">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
                      Séances ce mois
                    </div>
                    <div className="text-2xl font-bold text-text-primary">
                      {totalSessions}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
                      Taux complétion
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-success-text">
                        {completionRate}%
                      </div>
                      {completionRate >= 80 && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                    </div>
                  </div>
                </div>

                {availability.length > 0 && (
                  <div className="pt-4 border-t border-default">
                    <div className="text-[10px] uppercase tracking-wider text-muted mb-2">
                      Disponibilités
                    </div>
                    <div className="flex gap-1.5">
                      {DAYS_SHORT.map((day) => (
                        <div
                          key={day}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold ${availability.includes(day) ? "bg-accent-dim text-accent-text" : "bg-bg-hover text-faint"}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-muted">
        {instructors.length} moniteur{instructors.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
