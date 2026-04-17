"use client";

import { Plus, Phone, UserPlus, Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

const MOCK_WAITING = [
  { id: "w1", full_name: "Rachid Lamrani", phone: "0678901234", permis_type: "B", notes: "Disponible à partir de mai", added_at: "2024-04-10", priority: "high" },
  { id: "w2", full_name: "Houda Mrabti", phone: "0689012345", permis_type: "B", notes: "Recommandée par M. Alami", added_at: "2024-04-08", priority: "normal" },
  { id: "w3", full_name: "Amine Sekkat", phone: "0690123456", permis_type: "C", notes: "Permis poids lourd", added_at: "2024-04-05", priority: "normal" },
];

export default function WaitingListPage() {
  if (MOCK_WAITING.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Gestion</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Liste d&apos;attente</h1>
        </div>
        <EmptyState icon={<Clock className="h-6 w-6" />} title="Liste d&apos;attente vide" description="Aucun candidat en attente d'inscription." action={{ label: "Ajouter un candidat", onClick: () => {} }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Gestion</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Liste d&apos;attente</h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />Ajouter candidat
        </button>
      </div>

      <div className="bg-white rounded-xl border border-default overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
          <div className="col-span-3 table-header-cell">Candidat</div>
          <div className="col-span-2 table-header-cell">Téléphone</div>
          <div className="col-span-2 table-header-cell">Permis</div>
          <div className="col-span-3 table-header-cell">Notes</div>
          <div className="col-span-1 table-header-cell">Date</div>
          <div className="col-span-1 table-header-cell">Actions</div>
        </div>
        <div className="divide-y divide-default">
          {MOCK_WAITING.map((w) => (
            <div key={w.id} className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group">
              <div className="col-span-3 text-sm font-semibold text-text-primary">{w.full_name}</div>
              <div className="col-span-2 flex items-center gap-2 text-sm text-text-body">
                <Phone className="h-3.5 w-3.5 text-muted" />{w.phone}
              </div>
              <div className="col-span-2">
                <span className="inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                  Permis {w.permis_type}
                </span>
              </div>
              <div className="col-span-3 text-sm text-text-body truncate">{w.notes || "—"}</div>
              <div className="col-span-1 text-[10px] text-muted">{formatDate(w.added_at)}</div>
              <div className="col-span-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button title="Inscrire" className="p-2 rounded-lg text-accent hover:bg-accent-dim transition-all">
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted">{MOCK_WAITING.length} candidat{MOCK_WAITING.length > 1 ? "s" : ""} en attente</div>
    </div>
  );
}
