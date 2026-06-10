import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug },
    include: {
      company: true,
      category: true,
      jobSkills: { include: { skill: true } },
      _count: { select: { applications: true } },
    },
  });
  if (!job || job.status !== "PUBLISHED") return NextResponse.json({ error: "Not found" }, { status: 404 });
  // increment view count in background
  prisma.job.update({ where: { id: job.id }, data: { viewsCount: { increment: 1 } } }).catch(() => null);
  return NextResponse.json({ job });
}
