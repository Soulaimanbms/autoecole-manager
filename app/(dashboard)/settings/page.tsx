import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  if (!session?.schoolId) redirect("/login");
  const schoolId = session.schoolId;

  const { tab = "general" } = await searchParams;

  const school = await prisma.school.findFirst({
    where: { id: schoolId },
    select: {
      id: true,
      name: true,
      city: true,
      wilaya: true,
      address: true,
      email: true,
      phone: true,
      owner_name: true,
      agrement_number: true,
      logo_url: true,
      plan_name: true,
      subscription_status: true,
    },
  });

  if (!school) redirect("/login");

  return (
    <SettingsClient school={serialize(school)} initialTab={tab} />
  );
}
