import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Pencil, Download } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeStudentFields } from "@/lib/compute";
import { UrlFilterPills } from "@/components/shared/UrlFilterPills";
import { SearchInput } from "@/components/shared/SearchInput";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatMAD, getInitials } from "@/lib/utils";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

const FILTER_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "En retard", value: "overdue", dot: "error" as const },
  { label: "Dossier incomplet", value: "incomplete", dot: "warning" as const },
  { label: "Prêt examen", value: "exam_ready", dot: "success" as const },
];

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { filter = "all", q = "" } = await searchParams;

  const whereStatus =
    filter === "exam_ready" ? { status: "exam_ready" as const } : {};

  const rawStudents = await prisma.student.findMany({
    where: {
      school_id: schoolId,
      ...(q
        ? {
            OR: [
              { full_name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { cin: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...whereStatus,
    },
    include: {
      payments: { select: { amount: true, deleted_at: true } },
      documents: { select: { type: true, deleted_at: true } },
    },
    orderBy: { created_at: "desc" },
  });

  const students = rawStudents.map(computeStudentFields);

  const filtered =
    filter === "overdue"
      ? students.filter((s) => s.payment_status === "overdue" || s.payment_status === "never_paid")
      : filter === "incomplete"
        ? students.filter((s) => s.missing_docs.length > 0)
        : students;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Gestion
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Élèves
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Importer
          </button>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel élève
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <UrlFilterPills options={FILTER_OPTIONS} paramName="filter" defaultValue="all" />
        <SearchInput placeholder="Rechercher un élève..." paramName="q" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Aucun élève"
          description={
            q
              ? `Aucun résultat pour "${q}"`
              : filter !== "all"
                ? "Aucun élève dans cette catégorie."
                : "Ajoutez votre premier élève."
          }
          action={
            !q && filter === "all"
              ? { label: "Ajouter un élève", onClick: () => {} }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-default overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
            <div className="col-span-3 table-header-cell">Élève</div>
            <div className="col-span-2 table-header-cell">Statut</div>
            <div className="col-span-2 table-header-cell">Progression</div>
            <div className="col-span-2 table-header-cell">Paiement</div>
            <div className="col-span-2 table-header-cell">Dossier</div>
            <div className="col-span-1 table-header-cell"></div>
          </div>
          <div className="divide-y divide-default">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <StudentAvatar
                    initials={getInitials(s.full_name)}
                    photoUrl={s.photo_url}
                    size="md"
                  />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {s.full_name}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
                      {s.phone} · {s.permis_type}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <StatusBadge status={s.status} variant="student" />
                </div>
                <div className="col-span-2 pr-4">
                  <ProgressBar
                    value={s.progress_pct}
                    label={`${s.completed_sessions}/${s.total_sessions_required}`}
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-semibold text-text-primary">
                    {formatMAD(s.amount_paid)}
                  </div>
                  <StatusBadge status={s.payment_status} variant="payment" />
                </div>
                <div className="col-span-2">
                  {s.missing_docs.length === 0 ? (
                    <span className="text-[10px] font-bold text-success-text">
                      ✓ Complet
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-warning-text">
                      {s.missing_docs.length} manquant
                      {s.missing_docs.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="col-span-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    href={`/students/${s.id}`}
                    className="p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button className="p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted">
        {filtered.length} élève{filtered.length !== 1 ? "s" : ""}
        {q ? ` · "${q}"` : ""}
        {filter !== "all" ? ` · ${filter}` : ""}
      </div>
    </div>
  );
}
