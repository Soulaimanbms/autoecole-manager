"use client";

import * as React from "react";
import { Building2, Lock, Bell, Palette, Save } from "lucide-react";
import { LoadingButton } from "@/components/shared/LoadingButton";

const TABS = [
  { id: "general", label: "Général", icon: <Building2 className="h-4 w-4" /> },
  { id: "security", label: "Sécurité", icon: <Lock className="h-4 w-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { id: "appearance", label: "Apparence", icon: <Palette className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const [tab, setTab] = React.useState("general");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Compte</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Paramètres</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl border border-default overflow-hidden">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-l-2 ${tab === t.id ? "bg-accent-dim text-accent-text border-accent" : "text-text-body hover:bg-bg-hover border-transparent"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-9">
          {tab === "general" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Informations de l&apos;auto-école</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Nom de l&apos;auto-école</label>
                  <input type="text" defaultValue="Atlas Auto-École" className="input-base" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Ville</label>
                  <input type="text" defaultValue="Casablanca" className="input-base" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Email</label>
                  <input type="email" defaultValue="atlas@autoecole.ma" className="input-base" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Téléphone</label>
                  <input type="tel" defaultValue="0522123456" className="input-base" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Adresse</label>
                  <input type="text" defaultValue="123 Bd Mohamed V, Casablanca" className="input-base" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">N° Agrément</label>
                  <input type="text" defaultValue="AGR-CASA-2019-042" className="input-base" disabled />
                  <p className="text-[10px] text-muted mt-1">Non modifiable — contactez le support.</p>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-default">
                <LoadingButton loading={saving} onClick={handleSave}>
                  <Save className="h-3.5 w-3.5 mr-2" />
                  Enregistrer
                </LoadingButton>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Sécurité</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Mot de passe actuel</label>
                  <input type="password" placeholder="••••••••" className="input-base" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" className="input-base" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Confirmer mot de passe</label>
                  <input type="password" placeholder="••••••••" className="input-base" />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-default">
                <LoadingButton loading={saving} onClick={handleSave}>
                  Modifier mot de passe
                </LoadingButton>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
              <div className="space-y-4">
                {[
                  { label: "Paiements en retard", sub: "Alerter quand un paiement dépasse 30 jours", checked: true },
                  { label: "Élève prêt pour examen", sub: "Notification quand tous les critères sont remplis", checked: true },
                  { label: "Séance manquée", sub: "Alerte après chaque séance non effectuée", checked: false },
                  { label: "Dossier incomplet", sub: "Rappel hebdomadaire pour les dossiers incomplets", checked: true },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between py-3 border-b border-default last:border-0">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{n.label}</div>
                      <div className="text-[10px] text-muted mt-0.5">{n.sub}</div>
                    </div>
                    <button className={`w-10 h-6 rounded-full transition-all relative ${n.checked ? "bg-accent" : "bg-bg-hover"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${n.checked ? "left-5" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Apparence</h2>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-3">Thème</div>
                <div className="flex gap-3">
                  {[{ id: "light", label: "Clair" }, { id: "dark", label: "Sombre" }].map((t) => (
                    <button key={t.id} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${t.id === "light" ? "border-accent bg-accent-dim text-accent-text" : "border-default text-muted hover:border-border-strong"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-3">Langue</div>
                <select className="input-base w-48">
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
