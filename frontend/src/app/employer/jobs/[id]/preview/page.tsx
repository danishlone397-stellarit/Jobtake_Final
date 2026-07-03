import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { formatSalary, timeAgo } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft, Pencil, Send, MapPin, Briefcase, BadgeDollarSign,
  TrendingUp, BadgeCheck, Users, GraduationCap, Lightbulb,
  CheckCircle2, Building2,
} from "lucide-react";

export default async function JobPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== "EMPLOYER") redirect("/login");

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      category: true,
      jobSkills: { include: { skill: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!job || job.company.ownerId !== me.id) notFound();

  const companyInitial = job.company.name[0].toUpperCase();
  const salaryLabel = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod);

  const SENIORITY_YRS: Record<string, string> = {
    INTERN: "0-1 yrs", ENTRY: "1-2 yrs", MID: "2-5 yrs", SENIOR: "5-8 yrs",
    STAFF: "8-12 yrs", PRINCIPAL: "12-15 yrs", DIRECTOR: "15-20 yrs", EXECUTIVE: "20+ yrs",
  };

  return (
    <DashboardShell role="EMPLOYER" current="/employer/jobs">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link href="/employer/jobs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition mb-1">
            <ArrowLeft className="h-4 w-4" /> Back to My Jobs
          </Link>
          <h1 className="text-2xl font-black text-zinc-900">Preview Your Job</h1>
          <p className="text-sm text-zinc-500 mt-0.5">This is how your job post will appear to candidates.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/employer/jobs/${id}/edit`}
            className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Pencil className="h-4 w-4" /> Edit Job
          </Link>
          {job.status !== "PUBLISHED" && (
            <form action={`/api/employer/jobs/${id}/publish`} method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <Send className="h-4 w-4" /> Publish Job
              </button>
            </form>
          )}
          {job.status === "PUBLISHED" && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold px-4 py-2.5 rounded-xl">
              <CheckCircle2 className="h-4 w-4" /> Published
            </span>
          )}
        </div>
      </div>

      {/* Preview layout */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">

        {/* ── LEFT ── */}
        <div className="space-y-5">

          {/* Header card */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {job.employmentType && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  {job.employmentType === "FULL_TIME" ? "Full-time" : job.employmentType === "PART_TIME" ? "Part-time" : job.employmentType.charAt(0) + job.employmentType.slice(1).toLowerCase()}
                </span>
              )}
              {job.status === "PUBLISHED" && job.publishedAt && (
                <span className="text-xs text-zinc-400">Posted {timeAgo(job.publishedAt)}</span>
              )}
            </div>
            <h2 className="text-2xl font-black text-zinc-900">{job.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              {job.company.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="h-7 w-7 rounded-lg object-contain border border-zinc-100" />
              ) : (
                <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-black shrink-0">{companyInitial}</div>
              )}
              <span className="font-semibold text-zinc-800 text-sm">{job.company.name}</span>
              <BadgeCheck className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.workMode.charAt(0) + job.workMode.slice(1).toLowerCase()}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {job._count.applications} applicants</span>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-50 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Experience</div>
                <div className="text-sm font-bold text-zinc-900">{SENIORITY_YRS[job.seniority] ?? job.seniority}</div>
              </div>
              <div className="bg-zinc-50 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><Briefcase className="h-3 w-3" /> Employment</div>
                <div className="text-sm font-bold text-zinc-900">{job.employmentType === "FULL_TIME" ? "Full-time" : job.employmentType}</div>
              </div>
              <div className="bg-zinc-50 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Work Mode</div>
                <div className="text-sm font-bold text-zinc-900">{job.workMode.charAt(0) + job.workMode.slice(1).toLowerCase()}</div>
              </div>
              <div className="bg-zinc-50 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><BadgeDollarSign className="h-3 w-3" /> Salary</div>
                <div className="text-sm font-bold text-zinc-900">{salaryLabel || "Not specified"}</div>
              </div>
            </div>
          </div>

          {/* About the Role */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-6">

            <section>
              <h3 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /> About the Role</h3>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>

            {(job.responsibilities || job.requirements) && (
              <section>
                <h3 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Roles &amp; Responsibilities</h3>
                {job.responsibilities && <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{job.responsibilities}</div>}
                {job.requirements && <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap mt-3">{job.requirements}</div>}
              </section>
            )}

            {/* Job details block */}
            <section className="rounded-xl bg-zinc-50 border border-zinc-100 p-5 space-y-3">
              {[
                { label: "Job Category",    value: job.category?.name },
                { label: "Work Mode",       value: job.workMode.charAt(0) + job.workMode.slice(1).toLowerCase() },
                { label: "Job Location",    value: job.location },
                { label: "Employment Type", value: job.employmentType === "FULL_TIME" ? "Full Time, Permanent" : job.employmentType },
                { label: "Salary Range",    value: salaryLabel || "—" },
                { label: "Additional Benefits", value: job.benefits || "—" },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex gap-2 text-sm">
                  <span className="font-semibold text-zinc-900 w-44 shrink-0">{label}</span>
                  <span className="text-zinc-700">{value}</span>
                </div>
              ) : null)}
            </section>

            {/* Education */}
            <section>
              <h3 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-blue-600" /> Education</h3>
              <div className="flex flex-wrap gap-2">
                {(job.seniority === "INTERN" || job.seniority === "ENTRY" || job.seniority === "MID") ? (
                  <>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-zinc-50 text-zinc-700 border border-zinc-200 font-medium">Bachelor&apos;s degree or equivalent</span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-zinc-50 text-zinc-700 border border-zinc-200 font-medium">Any discipline</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-zinc-50 text-zinc-700 border border-zinc-200 font-medium">Bachelor&apos;s / Master&apos;s degree</span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-zinc-50 text-zinc-700 border border-zinc-200 font-medium">MBA or equivalent preferred</span>
                  </>
                )}
              </div>
            </section>

            {/* Skills */}
            {job.jobSkills.length > 0 && (
              <section>
                <h3 className="text-base font-bold text-zinc-900 mb-2">Skills</h3>
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
        <div className="space-y-5">

          {/* Job Summary */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Job Summary</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Job Title",        value: job.title },
                { label: "Job Category",     value: job.category?.name },
                { label: "Location",         value: job.location },
                { label: "Employment Type",  value: job.employmentType === "FULL_TIME" ? "Full-time" : job.employmentType },
                { label: "Experience Level", value: SENIORITY_YRS[job.seniority] ?? job.seniority },
                { label: "Work Mode",        value: job.workMode.charAt(0) + job.workMode.slice(1).toLowerCase() },
                { label: "Salary",           value: salaryLabel || "Not specified" },
              ].map(({ label, value }) => value ? (
                <div key={label}>
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{label}</div>
                  <div className="text-zinc-900 font-medium mt-0.5">{value}</div>
                </div>
              ) : null)}
            </div>
            {job.status === "PUBLISHED" && (
              <Link
                href={`/jobs/${job.slug}`}
                target="_blank"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 text-blue-600 text-sm font-semibold hover:underline"
              >
                View Full Details →
              </Link>
            )}
          </div>

          {/* Posting Tips */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Posting Tips</h3>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              {[
                "Use a clear and specific job title.",
                "Highlight key responsibilities in detail.",
                "Add must-have skills and qualifications.",
                "Include salary range to attract relevant candidates.",
                "Review before publishing to ensure accuracy.",
              ].map(tip => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
