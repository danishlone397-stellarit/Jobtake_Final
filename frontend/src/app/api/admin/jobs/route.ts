import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: { select: { name: true } }, _count: { select: { applications: true } } },
    take: 200,
  });
  return NextResponse.json({ jobs });
}
