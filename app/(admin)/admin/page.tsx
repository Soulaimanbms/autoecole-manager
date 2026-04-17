import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, Users, TrendingUp, Eye } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-success-bg text-success-text",
  trial: "bg-warning-bg text-warning-text",
  expired: "bg-error-bg text-error-text",
  suspended: "bg-bg-hover text-muted",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  trial: "Essai",
  expired: "Expiré",
  suspended: "Suspendu",
};

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "super_admin") redirect("/login");

  const schools = await prisma.school.findMany({
    include: {
      _count: {
        select: {
          students: { where: { deleted_at: null } },
          instructors: { where: { deleted_at: null } },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const totalStudents = schools.reduce(
    (acc, s) => acc + s._count.students,
    0,
  );
  const activeSchools = schools.filter(
    (s) => s.subscription_status === "active",
  ).length;
  const proSchools = schools.filter(
    (s) => s.plan_name === "Pro",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Administration
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Vue d&apos;ensemble
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-text-primary">
            {schools.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">
            Auto-écoles
          </div>
        </div>
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-success-text">
            {activeSchools}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">
            Actives
          </div>
        </div>
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-text-primary">
            {totalStudents}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">
            Élèves total
          </div>
        </div>
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-accent">{proSchools}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">
            Plan Pro
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            Auto-écoles
          </h2>
          <Link
            href="/admin/users"
            className="btn-secondary inline-flex items-center gap-1.5 text-xs"
          >
            <Users className="h-3.5 w-3.5" />
            Utilisateurs
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-default overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
            <div className="col-span-3 table-header-cell">Auto-école</div>
            <div className="col-span-2 table-header-cell">Ville</div>
            <div className="col-span-2 table-header-cell">Plan</div>
            <div className="col-span-2 table-header-cell">Statut</div>
            <div className="col-span-1 table-header-cell">Élèves</div>
            <div className="col-span-1 table-header-cell">Moniteurs</div>
            <div className="col-span-1 table-header-cell">Créée</div>
          </div>
          <div className="divide-y divide-default">
            {schools.map((s) => (
              <Link
                key={s.id}
                href={`/admin/schools/${s.id}`}
                className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-accent-text" />
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    {s.name}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-text-body">
                  {s.city}
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.plan_name === "Pro" ? "bg-accent-dim text-accent-text" : "bg-bg-hover text-muted"}`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {s.plan_name}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[s.subscription_status]}`}
                  >
                    {STATUS_LABELS[s.subscription_status]}
                  </span>
                </div>
                <div className="col-span-1 text-sm text-text-body">
                  {s._count.students}
                </div>
                <div className="col-span-1 text-sm text-text-body">
                  {s._count.instructors}
                </div>
                <div className="col-span-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted">
                    {formatDate(s.created_at)}
                  </span>
                  <Eye className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition-all ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-muted">
        {schools.length} auto-école{schools.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
