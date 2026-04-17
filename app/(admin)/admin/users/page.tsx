import { Building2, Clock } from "lucide-react";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { getInitials, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MOCK_USERS = [
  { id: "u1", name: "Atlas Admin", email: "atlas@autoecole.ma", school: "Atlas Auto-École", role: "admin", last_login: "2024-04-17T09:32:00", status: "active" },
  { id: "u2", name: "Étoile Admin", email: "etoile@autoecole.ma", school: "Étoile Auto-École", role: "admin", last_login: "2024-04-16T14:20:00", status: "active" },
  { id: "u3", name: "Sahara Admin", email: "sahara@autoecole.ma", school: "Sahara Auto-École", role: "admin", last_login: "2024-02-28T11:45:00", status: "inactive" },
  { id: "u4", name: "Super Admin", email: "admin@autoecole.ma", school: "—", role: "super_admin", last_login: "2024-04-17T08:00:00", status: "active" },
];

function isRecent(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Administration</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Utilisateurs</h1>
      </div>

      <div className="bg-white rounded-xl border border-default overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
          <div className="col-span-3 table-header-cell">Utilisateur</div>
          <div className="col-span-3 table-header-cell">Email</div>
          <div className="col-span-2 table-header-cell">Auto-école</div>
          <div className="col-span-2 table-header-cell">Rôle</div>
          <div className="col-span-2 table-header-cell">Dernière connexion</div>
        </div>
        <div className="divide-y divide-default">
          {MOCK_USERS.map((u) => {
            const active = isRecent(u.last_login);
            return (
              <div key={u.id} className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="relative">
                    <StudentAvatar initials={getInitials(u.name)} size="sm" />
                    {active && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-white" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-text-primary">{u.name}</span>
                </div>
                <div className="col-span-3 text-sm text-text-body">{u.email}</div>
                <div className="col-span-2 flex items-center gap-1.5 text-sm text-text-body">
                  <Building2 className="h-3.5 w-3.5 text-muted" />{u.school}
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${u.role === "super_admin" ? "bg-accent-dim text-accent-text" : "bg-info-bg text-info-text"}`}>
                    {u.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted" />
                  <div>
                    <div className="text-[10px] font-medium text-text-body">{formatDate(u.last_login)}</div>
                    {active && (
                      <div className="text-[9px] font-bold text-success-text">En ligne</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-muted">{MOCK_USERS.length} utilisateurs</div>
    </div>
  );
}
