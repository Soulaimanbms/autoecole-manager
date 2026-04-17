"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Building2, Lock, Bell, Palette, Save } from "lucide-react";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { cn } from "@/lib/utils";

interface School {
  id: string;
  name: string;
  city: string;
  wilaya: string | null;
  address: string | null;
  email: string | null;
  phone: string;
  owner_name: string;
  agrement_number: string | null;
  logo_url: string | null;
  plan_name: string;
  subscription_status: string;
}

const TABS = [
  { id: "general", label: "Général", icon: Building2 },
  { id: "security", label: "Sécurité", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Apparence", icon: Palette },
];

export function SettingsClient({
  school,
  initialTab,
}: {
  school: School;
  initialTab: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [saving, setSaving] = React.useState(false);

  const activeTab = searchParams.get("tab") ?? initialTab;

  const setTab = (t: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (t === "general") {
      params.delete("tab");
    } else {
      params.set("tab", t);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Compte
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Paramètres
        </h1>
        <div className="text-xs text-muted mt-1">
          Plan{" "}
          <span className="font-semibold text-accent-text">{school.plan_name}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl border border-default overflow-hidden">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-l-2",
                    isActive
                      ? "bg-accent-dim text-accent-text border-accent"
                      : "text-text-body hover:bg-bg-hover border-transparent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 md:col-span-9">
          {activeTab === "general" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Informations de l&apos;auto-école
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Nom
                  </label>
                  <input
                    type="text"
                    defaultValue={school.name}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Ville
                  </label>
                  <input
                    type="text"
                    defaultValue={school.city}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={school.email ?? ""}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    defaultValue={school.phone}
                    className="input-base"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    defaultValue={school.address ?? ""}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Propriétaire
                  </label>
                  <input
                    type="text"
                    defaultValue={school.owner_name}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    N° Agrément
                  </label>
                  <input
                    type="text"
                    defaultValue={school.agrement_number ?? ""}
                    className="input-base bg-bg-hover"
                    disabled
                  />
                  <p className="text-[10px] text-muted mt-1">
                    Non modifiable — contactez le support.
                  </p>
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

          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Sécurité
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Confirmer
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-base"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-default">
                <LoadingButton loading={saving} onClick={handleSave}>
                  Modifier mot de passe
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Notifications
              </h2>
              <div className="space-y-1">
                {[
                  {
                    label: "Paiements en retard",
                    sub: "Alerter quand un paiement dépasse 14 jours",
                    checked: true,
                  },
                  {
                    label: "Élève prêt pour examen",
                    sub: "Notification quand tous les critères sont remplis",
                    checked: true,
                  },
                  {
                    label: "Séance manquée",
                    sub: "Alerte après chaque séance non effectuée",
                    checked: false,
                  },
                  {
                    label: "Dossier incomplet",
                    sub: "Rappel hebdomadaire pour les dossiers incomplets",
                    checked: true,
                  },
                ].map((n) => (
                  <div
                    key={n.label}
                    className="flex items-center justify-between py-4 border-b border-default last:border-0"
                  >
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {n.label}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {n.sub}
                      </div>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full transition-all relative cursor-pointer ${n.checked ? "bg-accent" : "bg-bg-hover"}`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${n.checked ? "left-5" : "left-1"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-white rounded-xl border border-default p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Apparence
              </h2>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-3">
                  Thème
                </div>
                <div className="flex gap-3">
                  {[
                    { id: "light", label: "Clair" },
                    { id: "dark", label: "Sombre (bientôt)" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      disabled={t.id === "dark"}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                        t.id === "light"
                          ? "border-accent bg-accent-dim text-accent-text"
                          : "border-default text-faint cursor-not-allowed",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-3">
                  Langue
                </div>
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
