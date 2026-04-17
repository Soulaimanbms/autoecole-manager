import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <PagePlaceholder
      label="Administration"
      title="Utilisateurs"
      description="Gestion des comptes administrateurs."
    />
  );
}
