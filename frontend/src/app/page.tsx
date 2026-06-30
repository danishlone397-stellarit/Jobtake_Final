import { prisma } from "@/lib/prisma";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import Hero from "@/components/home/Hero";
import { LogoWall } from "@/components/home/LogoWall";
import { Categories } from "@/components/home/Categories";
import { FeaturedJobs, type FeaturedJob } from "@/components/home/FeaturedJobs";
import { AIMatching } from "@/components/home/AIMatching";
import { CTA } from "@/components/home/CTA";
import { CollarSections, type CollarSection } from "@/components/home/CollarSections";
import { formatSalary, timeAgo } from "@/lib/utils";

const LOGO_PALETTE = [
  "from-violet-500 to-fuchsia-500",
  "from-brand-orange to-amber-600",
  "from-indigo-500 to-brand-blue",
  "from-zinc-800 to-zinc-950",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
];

export default async function Home() {
  const [categoriesRaw, featuredRaw, totalJobs, collarJobsRaw] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { jobs: { where: { status: "PUBLISHED" } } } } },
    }),
    prisma.job.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { publishedAt: "desc" },
      take: 10,
      include: { company: { select: { name: true, logoUrl: true } }, jobSkills: { include: { skill: true } } },
    }),
    prisma.job.count({ where: { status: "PUBLISHED" } }),
    prisma.job.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { company: { select: { name: true } } },
    }),
  ]);

  const categories = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    iconUrl: c.iconUrl,
    accent: c.accent,
    count: c._count.jobs,
  }));

  const COLLAR_TYPES = ["WHITE", "BLUE", "PINK", "GREY", "MSME"] as const;
  const collarSections: CollarSection[] = COLLAR_TYPES.map(type => {
    const typeJobs = (collarJobsRaw as any[]).filter((j: any) => j.collarType === type);
    return {
      type,
      activeJobs: typeJobs.length,
      companies: new Set(typeJobs.map((j: any) => j.company.name)).size,
      jobs: typeJobs.slice(0, 8).map(j => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        location: j.location,
        salaryLabel: formatSalary(j.salaryMin, j.salaryMax, j.salaryCurrency, j.salaryPeriod),
        postedAgo: j.publishedAt ? timeAgo(j.publishedAt) : "recent",
        company: { name: j.company.name, initial: j.company.name[0].toUpperCase() },
      })),
    };
  });

  const featured: FeaturedJob[] = featuredRaw.map((j, i) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    location: j.location,
    salaryLabel: formatSalary(j.salaryMin, j.salaryMax, j.salaryCurrency, j.salaryPeriod),
    postedAgo: j.publishedAt ? timeAgo(j.publishedAt) : "recent",
    matchScore: 80 + ((j.title.length + j.id.length) % 18),
    tags: j.jobSkills.map((js) => js.skill.name).slice(0, 3),
    company: {
      name: j.company.name,
      logoUrl: j.company.logoUrl,
      initial: j.company.name[0].toUpperCase(),
    },
    logoColor: LOGO_PALETTE[i % LOGO_PALETTE.length],
  }));

  return (
    <main data-testid="home-page">
      <PublicNav />
      <Hero totalJobs={totalJobs} />
      <LogoWall />
      <Categories categories={categories} />
      <FeaturedJobs jobs={featured} />
      <CollarSections sections={collarSections} />
      <AIMatching />
      <CTA />
      <PublicFooter />
    </main>
  );
}
