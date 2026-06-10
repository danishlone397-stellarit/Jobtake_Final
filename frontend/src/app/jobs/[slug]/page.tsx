import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { ApplyPanel } from "./ApplyPanel";
import { getCurrentUser } from "@/lib/auth";
import { formatSalary, timeAgo } from "@/lib/utils";
import { MapPin, Briefcase, BadgeDollarSign, Building2 } from "lucide-react";

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [job, me] = await Promise.all([
    prisma.job.findUnique({
      where: { slug },
      include: {
        company: true,
        category: true,
        jobSkills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
    }),
    getCurrentUser(),
  ]);

  if (!job || job.status !== "PUBLISHED") notFound();

  let hasApplied = false;
  if (me) {
    const dup = await prisma.application.findUnique({ where: { jobId_userId: { jobId: job.id, userId: me.id } } });
    hasApplied = !!dup;
  }

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="pt-32 pb-20 mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <article className="glass rounded-3xl p-8 md:p-10" data-testid="job-detail">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">{job.category?.name || "Uncategorized"}</span>
              {job.featured && <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 font-medium">Featured</span>}
              {job.publishedAt && <span className="text-zinc-500">Posted {timeAgo(job.publishedAt)}</span>}
            </div>
            <h1 className="font-display mt-4 text-4xl md:text-5xl tracking-tight font-medium leading-[1.05] text-zinc-950" data-testid="job-title">{job.title}</h1>
            <div className="mt-3 flex items-center gap-2 text-zinc-700">
              <Building2 className="h-4 w-4" /> <span className="font-medium">{job.company.name}</span>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              <div className="glass-strong rounded-2xl p-4"><div className="text-[10.5px] uppercase tracking-[0.18em] text-zinc-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</div><div className="font-medium mt-1 text-sm">{job.location}</div></div>
              <div className="glass-strong rounded-2xl p-4"><div className="text-[10.5px] uppercase tracking-[0.18em] text-zinc-500 flex items-center gap-1"><Briefcase className="h-3 w-3" /> Mode</div><div className="font-medium mt-1 text-sm">{job.workMode.toLowerCase()}</div></div>
              <div className="glass-strong rounded-2xl p-4"><div className="text-[10.5px] uppercase tracking-[0.18em] text-zinc-500 flex items-center gap-1"><BadgeDollarSign className="h-3 w-3" /> Salary</div><div className="font-medium mt-1 text-sm">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</div></div>
            </div>

            <div className="mt-8 space-y-8 text-zinc-700 leading-relaxed">
              <section>
                <h2 className="font-display text-xl font-medium text-zinc-950 mb-3">About the role</h2>
                <p className="whitespace-pre-wrap">{job.description}</p>
              </section>
              {job.responsibilities && (
                <section>
                  <h2 className="font-display text-xl font-medium text-zinc-950 mb-3">Responsibilities</h2>
                  <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                </section>
              )}
              {job.requirements && (
                <section>
                  <h2 className="font-display text-xl font-medium text-zinc-950 mb-3">What we're looking for</h2>
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </section>
              )}
              {job.benefits && (
                <section>
                  <h2 className="font-display text-xl font-medium text-zinc-950 mb-3">Benefits</h2>
                  <p className="whitespace-pre-wrap">{job.benefits}</p>
                </section>
              )}
              {job.jobSkills.length > 0 && (
                <section>
                  <h2 className="font-display text-xl font-medium text-zinc-950 mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.jobSkills.map(s => <span key={s.skill.id} className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700">{s.skill.name}</span>)}
                  </div>
                </section>
              )}
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 h-fit space-y-4">
            <ApplyPanel jobId={job.id} jobTitle={job.title} userRole={me?.role || null} hasApplied={hasApplied} />
            <div className="glass rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">About the company</div>
              <div className="mt-3 font-display text-xl font-medium text-zinc-950">{job.company.name}</div>
              {job.company.tagline && <p className="text-sm text-zinc-600 mt-1">{job.company.tagline}</p>}
              {job.company.industry && <div className="text-xs text-zinc-500 mt-3">{job.company.industry}{job.company.size ? ` · ${job.company.size}` : ""}</div>}
            </div>
          </aside>
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
