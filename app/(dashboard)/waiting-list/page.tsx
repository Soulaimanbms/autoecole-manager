import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const dynamic = "force-dynamic";

export default function WaitingListPage() {
  return (
    <PagePlaceholder
      label="Gestion"
      title="Liste d'attente"
      description="Gestion des candidats en attente d'inscription."
    />
  );
}
