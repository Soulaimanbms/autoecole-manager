import Link from "next/link";
import { Building2, Users, TrendingUp, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MOCK_SCHOOLS = [
  { id: "s1", name: "Atlas Auto-École", city: "Casablanca", plan: "Pro", status: "active", students: 42, instructors: 2, trial_ends_at: null, created_at: "2023-06-15" },
  { id: "s2", name: "Étoile Auto-École", city: "Rabat", plan: "Starter", status: "trial", students: 18, instructors: 1, trial_ends_at: "2024-04-22", created_at: "2024-04-17" },
  { id: "s3", name: "Sahara Auto-École", city: "Marrakech", plan: "Starter", status: "expired", students: 31, instructors: 2, trial_ends_at: null, created_at: "2022-11-30" },
];

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

export default function AdminPage() {
  const totalStudents = MOCK_SCHOOLS.reduce((a, s) => a + s.students, 0);
  const activeSchools = MOCK_SCHOOLS.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Administration</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Vue d&apos;ensemble</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-text-primary">{MOCK_SCHOOLS.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">Auto-écoles</div>
        </div>
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-success-text">{activeSchools}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">Actives</div>
        </div>
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-text-primary">{totalStudents}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">Élèves total</div>
        </div>
        <div className="bg-white rounded-xl border border-default p-5 text-center">
          <div className="text-3xl font-bold text-accent">{MOCK_SCHOOLS.filter((s) => s.plan === "Pro").length}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted mt-1">Plan Pro</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Auto-écoles</h2>
          <div className="flex gap-2 text-xs">
            <Link href="/admin/users" className="btn-secondary inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />Utilisateurs
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-default overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
            <div className="col-span-3 table-header-cell">Auto-école</div>
            <div className="col-span-2 table-header-cell">Ville</div>
            <div className="col-span-2 table-header-cell">Plan</div>
            <div className="col-span-2 table-header-cell">Statut</div>
            <div className="col-span-1 table-header-cell">Élèves</div>
            <div className="col-span-1 table-header-cell">Inscription</div>
            <div className="col-span-1 table-header-cell">Actions</div>
          </div>
          <div className="divide-y divide-default">
            {MOCK_SCHOOLS.map((s) => (
              <div key={s.id} className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-accent-text" />
                  </div>
                  <span className="text-sm font-semibold text-text-primary">{s.name}</span>
                </div>
                <div className="col-span-2 text-sm text-text-body">{s.city}</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.plan === "Pro" ? "bg-accent-dim text-accent-text" : "bg-bg-hover text-muted"}`}>
                    <TrendingUp className="h-3 w-3" />{s.plan}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[s.status]}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                </div>
                <div className="col-span-1 text-sm text-text-body">{s.students}</div>
                <div className="col-span-1 text-[10px] text-muted">{formatDate(s.created_at)}</div>
                <div className="col-span-1 opacity-0 group-hover:opacity-100 transition-all">
                  <Link href={`/admin/schools/${s.id}`} className="p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary inline-flex">
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
