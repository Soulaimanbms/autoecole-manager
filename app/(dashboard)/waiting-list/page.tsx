import { redirect } from "next/navigation";
import { Plus, Phone, UserPlus, Clock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

export default async function WaitingListPage() {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const entries = await prisma.waitingList.findMany({
    where: { school_id: schoolId },
    orderBy: { created_at: "desc" },
  });

  if (entries.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Gestion
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Liste d&apos;attente
          </h1>
        </div>
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title="Liste d'attente vide"
          description="Aucun candidat en attente d'inscription."
          action={{ label: "Ajouter un candidat", onClick: () => {} }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Gestion
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Liste d&apos;attente
          </h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter candidat
        </button>
      </div>

      <div className="bg-white rounded-xl border border-default overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
          <div className="col-span-3 table-header-cell">Candidat</div>
          <div className="col-span-2 table-header-cell">Téléphone</div>
          <div className="col-span-2 table-header-cell">Permis</div>
          <div className="col-span-4 table-header-cell">Notes</div>
          <div className="col-span-1 table-header-cell">Actions</div>
        </div>
        <div className="divide-y divide-default">
          {entries.map((w) => (
            <div
              key={w.id}
              className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group"
            >
              <div className="col-span-3">
                <div className="text-sm font-semibold text-text-primary">
                  {w.full_name}
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  Ajouté le {formatDate(w.created_at)}
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-sm text-text-body">
                <Phone className="h-3.5 w-3.5 text-muted" />
                {w.phone}
              </div>
              <div className="col-span-2">
                <span className="inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                  Permis {w.permis_type}
                </span>
              </div>
              <div className="col-span-4 text-sm text-text-body truncate">
                {w.notes ?? "—"}
              </div>
              <div className="col-span-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  title="Inscrire"
                  className="p-2 rounded-lg text-accent hover:bg-accent-dim transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted">
        {entries.length} candidat{entries.length !== 1 ? "s" : ""} en attente
      </div>
    </div>
  );
}
