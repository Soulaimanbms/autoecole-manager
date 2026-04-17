import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Administration
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Super admin
        </h1>
        <p className="text-sm text-muted mt-1">
          Connecté en tant que {session?.email}
        </p>
      </header>

      <section className="bg-white rounded-xl border border-default p-6 text-sm text-muted">
        Console admin prête. Les modules de gestion des écoles seront ajoutés dans les prochaines phases.
      </section>
    </div>
  );
}
