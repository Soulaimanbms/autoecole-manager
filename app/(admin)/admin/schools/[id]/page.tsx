import Link from "next/link";
import { ChevronLeft, Building2, Phone, Mail, MapPin, Clock, Monitor } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MOCK_SCHOOL = {
  id: "s1", name: "Atlas Auto-École", city: "Casablanca", wilaya: "Grand Casablanca",
  address: "123 Bd Mohamed V, Casablanca", email: "atlas@autoecole.ma", phone: "0522123456",
  agrement_number: "AGR-CASA-2019-042", plan: "Pro", status: "active",
  students: 42, instructors: 2, trial_ends_at: null, created_at: "2023-06-15",
};

const MOCK_LOGIN_HISTORY = [
  { id: "l1", user: "atlas@autoecole.ma", ip: "105.158.22.43", user_agent: "Chrome 123 / macOS", at: "2024-04-17T09:32:00" },
  { id: "l2", user: "atlas@autoecole.ma", ip: "105.158.22.43", user_agent: "Chrome 123 / macOS", at: "2024-04-16T14:20:00" },
  { id: "l3", user: "atlas@autoecole.ma", ip: "41.92.100.11", user_agent: "Safari / iPhone iOS 17", at: "2024-04-15T08:05:00" },
  { id: "l4", user: "atlas@autoecole.ma", ip: "105.158.22.43", user_agent: "Chrome 123 / macOS", at: "2024-04-14T10:45:00" },
  { id: "l5", user: "atlas@autoecole.ma", ip: "105.158.22.43", user_agent: "Chrome 123 / macOS", at: "2024-04-12T16:22:00" },
];

const PLAN_LIMITS = { Starter: { students: 50, instructors: 5 }, Pro: { students: "Illimité", instructors: "Illimité" } };

export default async function AdminSchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id;
  const school = MOCK_SCHOOL;
  const limits = PLAN_LIMITS[school.plan as keyof typeof PLAN_LIMITS];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="p-2 rounded-lg text-muted hover:bg-bg-hover transition-all">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Admin / Auto-écoles</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">{school.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-default p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-dim flex items-center justify-center">
                <Building2 className="h-6 w-6 text-accent-text" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">{school.name}</h2>
                <span className={`inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${school.status === "active" ? "bg-success-bg text-success-text" : "bg-error-bg text-error-text"}`}>
                  {school.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm pt-2 border-t border-default">
              <div className="flex items-center gap-2 text-text-body"><Mail className="h-3.5 w-3.5 text-muted" />{school.email}</div>
              <div className="flex items-center gap-2 text-text-body"><Phone className="h-3.5 w-3.5 text-muted" />{school.phone}</div>
              <div className="flex items-center gap-2 text-text-body"><MapPin className="h-3.5 w-3.5 text-muted" />{school.address}</div>
              <div className="flex items-center gap-2 text-text-body text-[10px] text-muted uppercase tracking-wider mt-2">
                Agrément: {school.agrement_number}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-default p-6 space-y-4">
            <h3 className="text-base font-semibold text-text-primary">Abonnement</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-body">Plan</span>
                <span className={`inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${school.plan === "Pro" ? "bg-accent-dim text-accent-text" : "bg-bg-hover text-muted"}`}>
                  {school.plan}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-body">Élèves max</span>
                <span className="text-sm font-semibold text-text-primary">{limits.students}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-body">Moniteurs max</span>
                <span className="text-sm font-semibold text-text-primary">{limits.instructors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-body">Inscrit le</span>
                <span className="text-sm text-text-body">{formatDate(school.created_at)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-default">
              <button className="btn-secondary text-xs">Changer plan</button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold bg-error-bg text-error-text hover:bg-error hover:text-white transition-all">Suspendre</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-default p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{school.students}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Élèves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{school.instructors}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Moniteurs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl border border-default overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <h3 className="text-base font-semibold text-text-primary">Historique des connexions</h3>
              <p className="text-[10px] text-muted mt-0.5">10 dernières connexions</p>
            </div>
            <div className="divide-y divide-default">
              {MOCK_LOGIN_HISTORY.map((log) => (
                <div key={log.id} className="px-6 py-4 flex items-center gap-4 hover:bg-bg-hover transition-all">
                  <div className="w-9 h-9 rounded-lg bg-bg-hover flex items-center justify-center shrink-0">
                    <Monitor className="h-4 w-4 text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary">{log.user}</div>
                    <div className="text-[10px] text-muted mt-0.5 truncate">{log.user_agent}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-body">{log.ip}</div>
                    <div className="flex items-center gap-1 text-[10px] text-muted justify-end mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatDate(log.at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
