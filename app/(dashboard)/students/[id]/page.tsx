import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PagePlaceholder
      label="Élèves"
      title={`Dossier élève`}
      description={`Fiche détaillée de l'élève #${id}`}
    />
  );
}
