import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Tableau de bord
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Bonjour{session?.schoolName ? `, ${session.schoolName}` : ""}
        </h1>
        <p className="text-sm text-muted mt-1">
          {session?.email ?? ""}
        </p>
      </header>

      <section className="bg-white rounded-xl border border-default p-6 text-sm text-muted">
        Tableau de bord prêt. Les modules seront ajoutés dans les prochaines phases.
      </section>
    </div>
  );
}
