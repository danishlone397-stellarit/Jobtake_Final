import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { ApplyPanel } from "./ApplyPanel";
import { getCurrentUser } from "@/lib/auth";
import { formatSalary, timeAgo } from "@/lib/utils";
import {
  MapPin, Briefcase, BadgeDollarSign, Building2,
  BadgeCheck, ArrowLeft, Bookmark, Share2,
  Star, Users, TrendingUp, ShieldCheck,
} from "lucide-react";
import Link from "next/link";

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

  const companyInitial = job.company.name[0].toUpperCase();

  return (
    <main className="min-h-screen bg-white">
      <PublicNav />
      <div className="pt-28 pb-20 mx-auto max-w-6xl px-6 md:px-12">

        {/* Back link */}
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-800 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* ── LEFT ── */}
          <div className="space-y-6">

            {/* Header card */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {job.category?.name && (
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                    {job.category.name}
                  </span>
                )}
                {job.featured && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                    Featured
                  </span>
                )}
                {job.publishedAt && (
                  <span className="text-xs text-zinc-400">Posted {timeAgo(job.publishedAt)}</span>
                )}
              </div>

              {/* Title + actions */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight flex items-center gap-3">
                  {job.title}
                  <BadgeCheck className="h-7 w-7 text-blue-500 shrink-0" />
                </h1>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
                    <Bookmark className="h-4 w-4 text-zinc-700" />
                  </button>
                  <button className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
                    <Share2 className="h-4 w-4 text-zinc-700" />
                  </button>
                </div>
              </div>

              {/* Company row */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {companyInitial}
                </div>
                <span className="font-semibold text-zinc-800 text-sm">{job.company.name}</span>
                <BadgeCheck className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-zinc-400">★ 4.8 (323 reviews)</span>
              </div>

              {/* Stats row */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1">
                    <MapPin className="h-3 w-3" /> Location
                  </div>
                  <div className="text-sm font-bold text-zinc-900">{job.location} · {job.workMode.charAt(0) + job.workMode.slice(1).toLowerCase()}</div>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1">
                    <Briefcase className="h-3 w-3" /> Work Mode
                  </div>
                  <div className="text-sm font-bold text-zinc-900">{job.workMode.charAt(0) + job.workMode.slice(1).toLowerCase()}</div>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1">
                    <BadgeDollarSign className="h-3 w-3" /> Salary
                  </div>
                  <div className="text-sm font-bold text-zinc-900">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</div>
                </div>
                {job.seniority && (
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1">
                      <TrendingUp className="h-3 w-3" /> Experience
                    </div>
                    <div className="text-sm font-bold text-zinc-900">{job.seniority}</div>
                  </div>
                )}
              </div>
            </div>

            {/* About the role */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-6" data-testid="job-detail">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-zinc-900">About the role</h2>
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </section>

              {job.responsibilities && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-zinc-900">What you&apos;ll do</h2>
                  </div>
                  <div className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">{job.responsibilities}</div>
                </section>
              )}

              {job.requirements && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-zinc-900">What we&apos;re looking for</h2>
                  </div>
                  <div className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">{job.requirements}</div>
                </section>
              )}

              {job.benefits && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-zinc-900">Benefits</h2>
                  </div>
                  <div className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">{job.benefits}</div>
                </section>
              )}

              {job.jobSkills.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-zinc-900 mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.jobSkills.map(s => (
                      <span key={s.skill.id} className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <aside className="lg:sticky lg:top-28 h-fit space-y-4">

            {/* Apply panel */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 mb-1">Apply for this role</h3>
              <p className="text-sm text-zinc-700 mb-4">
                Sign in or create an account to apply for <span className="font-semibold text-zinc-900">{job.title}</span>
              </p>
              <ApplyPanel jobId={job.id} jobTitle={job.title} userRole={me?.role || null} hasApplied={hasApplied} />
              <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 justify-center">
                <ShieldCheck className="h-3.5 w-3.5" /> Your data is safe and secure with us.
              </div>
            </div>

            {/* About the company */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 mb-4">About the company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black text-lg shrink-0">
                  {companyInitial}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 text-sm">{job.company.name}</span>
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                  </div>
                  {job.company.tagline && <p className="text-xs text-zinc-700 mt-0.5">{job.company.tagline}</p>}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {job.company.industry && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-700 flex items-center gap-2"><Briefcase className="h-3.5 w-3.5" /> Industry</span>
                    <span className="font-semibold text-zinc-900">{job.company.industry}</span>
                  </div>
                )}
                {job.company.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-700 flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Company size</span>
                    <span className="font-semibold text-zinc-900">{job.company.size} employees</span>
                  </div>
                )}
              </div>

              <Link
                href={`/jobs?q=${encodeURIComponent(job.company.name)}`}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 border border-zinc-200 rounded-xl py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                View company profile →
              </Link>
            </div>

            {/* Similar roles */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 mb-4">Similar roles</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-black shrink-0">
                    {companyInitial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Similar Position</div>
                    <div className="text-xs text-zinc-700">{job.company.name} · {job.location}</div>
                  </div>
                </div>
              </div>
              <Link href="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                View more similar roles →
              </Link>
            </div>

          </aside>
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
