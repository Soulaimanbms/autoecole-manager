import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const dynamic = "force-dynamic";

export default function StudentsPage() {
  return (
    <PagePlaceholder
      label="Gestion"
      title="Élèves"
      description="Liste et gestion des élèves inscrits."
    />
  );
}
