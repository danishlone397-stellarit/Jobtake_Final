import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const workMode = searchParams.get("workMode") || "";
  const seniority = searchParams.get("seniority") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(50, parseInt(searchParams.get("perPage") || "20", 10));

  const where: Prisma.JobWhereInput = { status: "PUBLISHED" };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { company: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (category) where.category = { slug: category };
  if (workMode) where.workMode = workMode as Prisma.JobWhereInput["workMode"];
  if (seniority) where.seniority = seniority as Prisma.JobWhereInput["seniority"];

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: perPage,
      skip: (page - 1) * perPage,
      include: {
        company: { select: { name: true, slug: true, logoUrl: true } },
        category: { select: { name: true, slug: true } },
        jobSkills: { include: { skill: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, perPage, pages: Math.ceil(total / perPage) });
}
