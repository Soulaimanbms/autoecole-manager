import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Car, BookOpen, GraduationCap } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { UrlFilterPills } from "@/components/shared/UrlFilterPills";
import { formatDate, getInitials } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Code", value: "code" },
  { label: "Conduite", value: "driving" },
  { label: "En attente", value: "pending" },
  { label: "Réussi", value: "passed", dot: "success" as const },
  { label: "Échoué", value: "failed", dot: "error" as const },
];

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { filter = "all" } = await searchParams;

  const whereType =
    filter === "code"
      ? { type: "code" as const }
      : filter === "driving"
        ? { type: "driving" as const }
        : {};
  const whereResult =
    filter === "pending"
      ? { result: "pending" as const }
      : filter === "passed"
        ? { result: "passed" as const }
        : filter === "failed"
          ? { result: "failed" as const }
          : {};

  const exams = await prisma.exam.findMany({
    where: {
      school_id: schoolId,
      ...whereType,
      ...whereResult,
    },
    include: {
      student: {
        select: { id: true, full_name: true, code_exam_passed: true },
      },
    },
    orderBy: { scheduled_date: "desc" },
  });

  const pendingCount = exams.filter((e) => e.result === "pending").length;
  const passedCount = exams.filter((e) => e.result === "passed").length;
  const failedCount = exams.filter((e) => e.result === "failed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Formation
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Examens
          </h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Programmer examen
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-default p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">
            {pendingCount}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
            À venir
          </div>
        </div>
        <div className="bg-white rounded-xl border border-default p-4 text-center">
          <div className="text-2xl font-bold text-success-text">
            {passedCount}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
            Réussis
          </div>
        </div>
        <div className="bg-white rounded-xl border border-default p-4 text-center">
          <div className="text-2xl font-bold text-error-text">
            {failedCount}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
            Échoués
          </div>
        </div>
      </div>

      <UrlFilterPills options={FILTER_OPTIONS} paramName="filter" defaultValue="all" />

      {exams.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="Aucun examen"
          description="Programmez le premier examen."
          action={{ label: "Programmer", onClick: () => {} }}
        />
      ) : (
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
            {exams.map((e) => (
              <div
                key={e.id}
                className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <StudentAvatar
                    initials={getInitials(e.student.full_name)}
                    size="sm"
                  />
                  <Link
                    href={`/students/${e.student.id}?tab=examens`}
                    className="text-sm font-semibold text-text-primary hover:text-accent transition-all"
                  >
                    {e.student.full_name}
                  </Link>
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                    {e.type === "driving" ? (
                      <Car className="h-3 w-3" />
                    ) : (
                      <BookOpen className="h-3 w-3" />
                    )}
                    {e.type === "driving" ? "Conduite" : "Code"}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-text-body">
                  {formatDate(e.scheduled_date)}
                </div>
                <div className="col-span-2 text-sm text-text-body">
                  {e.attempt_number}
                </div>
                <div className="col-span-2 text-[10px] font-mono text-muted">
                  {e.narsa_number ?? "—"}
                </div>
                <div className="col-span-1">
                  <StatusBadge status={e.result} variant="exam" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted">
        {exams.length} examen{exams.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
