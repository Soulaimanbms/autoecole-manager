"use client";

import { Plus, Phone, Car, CheckCircle2 } from "lucide-react";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { getInitials } from "@/lib/utils";

const MOCK_INSTRUCTORS = [
  {
    id: "i1", full_name: "Karim Benali", phone: "0661234567", cin: "BE789012",
    license_number: "MON-2019-001", permis: ["B", "C"], sessions_this_month: 28, completion_rate: 92,
    availability: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
    active: true,
  },
  {
    id: "i2", full_name: "Hassan Moussaoui", phone: "0672345678", cin: "CD890123",
    license_number: "MON-2020-015", permis: ["B"], sessions_this_month: 22, completion_rate: 88,
    availability: ["Lun", "Mer", "Ven", "Sam"],
    active: true,
  },
];

const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function InstructorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Gestion</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Moniteurs</h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />Ajouter moniteur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_INSTRUCTORS.map((inst) => (
          <div key={inst.id} className="bg-white rounded-xl border border-default p-6 space-y-4 hover:border-border-strong hover:shadow-sm transition-all">
            <div className="flex items-start gap-4">
              <StudentAvatar initials={getInitials(inst.full_name)} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">{inst.full_name}</h3>
                    <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">{inst.license_number}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-bold text-success-text">Actif</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-text-body">
                  <Phone className="h-3.5 w-3.5 text-muted" />
                  {inst.phone}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {inst.permis.map((p) => (
                <span key={p} className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                  <Car className="h-3 w-3" />Permis {p}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-default">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Séances ce mois</div>
                <div className="text-2xl font-bold text-text-primary">{inst.sessions_this_month}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Taux complétion</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-success-text">{inst.completion_rate}%</div>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-default">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-2">Disponibilités</div>
              <div className="flex gap-1.5">
                {DAYS_SHORT.map((day) => (
                  <div key={day} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold ${inst.availability.includes(day) ? "bg-accent-dim text-accent-text" : "bg-bg-hover text-faint"}`}>
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
