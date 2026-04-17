import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const GET = withAuth(async (req: NextRequest, { session }) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const students = await prisma.student.findMany({
    where: {
      school_id: session.schoolId ?? undefined,
      OR: [
        { full_name: { contains: q, mode: "insensitive" } },
        { full_name_arabic: { contains: q, mode: "insensitive" } },
        { cin: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      full_name: true,
      cin: true,
      status: true,
    },
    take: 10,
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ results: serialize(students) });
});
