import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/shared/AppShell";
import { getInitials, serialize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "super_admin") redirect("/admin");
  if (!session.schoolId) redirect("/login");

  const [user, school] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, full_name: true, email: true, status: true },
    }),
    prisma.school.findUnique({
      where: { id: session.schoolId },
      select: {
        id: true,
        name: true,
        subscription_status: true,
        trial_ends_at: true,
      },
    }),
  ]);

  if (!user || !school) redirect("/login");

  if (school.subscription_status === "expired") redirect("/expired");
  if (school.subscription_status === "suspended") redirect("/suspended");

  const safeSchool = serialize(school);
  const initials = getInitials(user.full_name ?? user.email);

  return (
    <AppShell
      schoolName={safeSchool.name}
      userInitials={initials}
      subscriptionStatus={safeSchool.subscription_status}
      trialEndsAt={safeSchool.trial_ends_at ?? null}
    >
      {children}
    </AppShell>
  );
}
