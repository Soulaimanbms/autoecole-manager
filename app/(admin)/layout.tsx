import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/shared/AdminShell";
import { getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "super_admin") redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, full_name: true, email: true },
  });
  if (!user) redirect("/login");

  const initials = getInitials(user.full_name ?? user.email);

  return (
    <AdminShell userInitials={initials} userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
