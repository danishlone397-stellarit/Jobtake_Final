import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { JobsListClient } from "./JobsListClient";

export const dynamic = "force-dynamic";

type SP = Promise<{ q?: string; location?: string; category?: string; workMode?: string; seniority?: string; collarType?: string; page?: string }>;

export default async function JobsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = sp.q || "";
  const location = sp.location || "";
  const categorySlug = sp.category || "";
  const workMode = sp.workMode || "";
  const seniority = sp.seniority || "";
  const collarType = sp.collarType || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const perPage = 12;

  const where: Prisma.JobWhereInput = { status: "PUBLISHED" };
  if (q) where.OR = [
    { title: { contains: q, mode: "insensitive" } },
    { description: { contains: q, mode: "insensitive" } },
    { company: { name: { contains: q, mode: "insensitive" } } },
  ];
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (categorySlug) where.category = { slug: categorySlug };
  if (workMode) where.workMode = workMode as Prisma.JobWhereInput["workMode"];
  if (seniority) where.seniority = seniority as Prisma.JobWhereInput["seniority"];
  if (collarType) (where as any).collarType = { equals: collarType };

  const [jobs, total, categories] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: perPage,
      skip: (page - 1) * perPage,
      include: {
        company: { select: { name: true, logoUrl: true, slug: true } },
        category: { select: { name: true, slug: true } },
        jobSkills: { include: { skill: true } },
      },
    }),
    prisma.job.count({ where }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="pt-32 pb-20 mx-auto max-w-7xl px-6 md:px-12">
        <div className="absolute inset-x-0 top-0 h-[420px] -z-10" />
        <div className="text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold">All roles</div>
        <h1 className="font-display mt-3 text-4xl md:text-5xl tracking-tight font-medium text-zinc-950" data-testid="jobs-heading">
          {total.toLocaleString()} opportunities
        </h1>
        <p className="text-zinc-600 mt-3 max-w-2xl">Refine by craft, location, seniority and work mode. Press enter to AI-search by intent.</p>

        <JobsListClient
          initialFilters={{ q, location, category: categorySlug, workMode, seniority, collarType }}
          jobs={jobs.map(j => ({
            id: j.id,
            slug: j.slug,
            title: j.title,
            location: j.location,
            workMode: j.workMode,
            seniority: j.seniority,
            salaryMin: j.salaryMin,
            salaryMax: j.salaryMax,
            salaryCurrency: j.salaryCurrency,
            salaryPeriod: j.salaryPeriod,
            collarType: (j as any).collarType || null,
            featured: j.featured,
            publishedAt: j.publishedAt?.toISOString() || null,
            company: j.company,
            category: j.category,
            skills: j.jobSkills.map(js => js.skill.name).slice(0, 4),
          }))}
          total={total}
          page={page}
          perPage={perPage}
          categories={categories}
        />
      </div>
      <PublicFooter />
    </main>
  );
}
