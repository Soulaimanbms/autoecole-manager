import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const dynamic = "force-dynamic";

export default function ExpensesPage() {
  return (
    <PagePlaceholder
      label="Gestion"
      title="Dépenses"
      description="Suivi des dépenses et charges de l'auto-école."
    />
  );
}
