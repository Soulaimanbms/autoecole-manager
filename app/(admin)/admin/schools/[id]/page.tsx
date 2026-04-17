import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const dynamic = "force-dynamic";

export default async function AdminSchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PagePlaceholder
      label="Auto-écoles"
      title="Détail auto-école"
      description={`Fiche de l'auto-école #${id}`}
    />
  );
}
