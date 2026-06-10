import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    take: 60,
    include: { _count: { select: { jobs: { where: { status: "PUBLISHED" } } } } },
  });

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="pt-32 pb-20 mx-auto max-w-7xl px-6 md:px-12">
        <div className="absolute inset-x-0 top-0 h-[420px] mesh-bg -z-10 opacity-60" />
        <div className="text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold">Hiring teams</div>
        <h1 className="font-display mt-3 text-4xl md:text-5xl tracking-tight font-medium text-zinc-950">
          Companies <span className="text-gradient italic">defining</span> the next decade
        </h1>
        <p className="text-zinc-600 mt-3 max-w-2xl">Verified high-trust teams hiring senior, principal and leadership talent.</p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map(c => (
            <Link key={c.id} href={`/jobs?q=${encodeURIComponent(c.name)}`} className="glass rounded-3xl p-6 hover:-translate-y-1 transition-transform block">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange grid place-items-center text-white font-semibold">{c.name[0]}</div>
                <div className="flex-1">
                  <div className="font-display font-medium text-zinc-950">{c.name}</div>
                  {c.tagline && <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{c.tagline}</div>}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span>{c._count.jobs} open role{c._count.jobs === 1 ? "" : "s"}</span>
                {c.industry && <span className="text-zinc-400">{c.industry}</span>}
              </div>
            </Link>
          ))}
          {!companies.length && (
            <div className="md:col-span-3 glass rounded-3xl p-12 text-center text-zinc-500">
              <Building2 className="h-8 w-8 mx-auto" />
              <div className="mt-4 font-display text-xl font-medium">No verified companies yet</div>
            </div>
          )}
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
