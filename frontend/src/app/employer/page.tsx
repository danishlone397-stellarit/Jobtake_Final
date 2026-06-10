import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, Users, Eye, ArrowRight } from "lucide-react";

export default async function EmployerHome() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== "EMPLOYER") redirect(me.role === "ADMIN" ? "/admin" : "/dashboard");

  const [jobs, applicationsCount, totalViews] = await Promise.all([
    prisma.job.findMany({ where: { postedById: me.id }, orderBy: { createdAt: "desc" }, take: 8, include: { _count: { select: { applications: true } }, company: { select: { name: true } } } }),
    prisma.application.count({ where: { job: { postedById: me.id } } }),
    prisma.job.aggregate({ where: { postedById: me.id }, _sum: { viewsCount: true } }),
  ]);
  const jobsCount = await prisma.job.count({ where: { postedById: me.id } });

  return (
    <DashboardShell role="EMPLOYER" current="/employer">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Employer dashboard</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mt-2">
          <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight">Welcome, {me.name.split(" ")[0]}.</h1>
          <Link href="/employer/post-job" className="btn-primary rounded-full px-5 py-3 text-sm font-medium w-fit" data-testid="post-job-btn">+ Post a new job</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <KPI label="Active job posts" value={jobsCount} icon={Briefcase} accent="from-brand-blue to-violet-500" />
        <KPI label="Total applicants" value={applicationsCount} icon={Users} accent="from-violet-500 to-fuchsia-500" />
        <KPI label="Total views" value={totalViews._sum.viewsCount || 0} icon={Eye} accent="from-brand-orange to-amber-500" />
      </div>

      <section className="glass rounded-3xl p-6 md:p-8">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Recent jobs</div>
            <h2 className="font-display mt-2 text-2xl font-medium">Your postings</h2>
          </div>
          <Link href="/employer/jobs" className="text-sm text-zinc-700 inline-flex items-center gap-1 hover:text-zinc-950">Manage all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <ul className="mt-5 divide-y divide-zinc-200/60">
          {jobs.length === 0 && <li className="py-10 text-center text-zinc-500 text-sm">No jobs yet — post your first role to get started.</li>}
          {jobs.map(j => (
            <li key={j.id} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <Link href={`/employer/jobs/${j.id}/applicants`} className="font-medium text-zinc-950 hover:text-brand-blue">{j.title}</Link>
                <div className="text-xs text-zinc-500">{j.location} · {j.workMode.toLowerCase()}</div>
              </div>
              <span className="text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">{j.status.toLowerCase()}</span>
              <span className="text-sm font-medium text-zinc-900">{j._count.applications} applicants</span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}

function KPI({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; accent: string }) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-25 blur-2xl`} />
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accent} grid place-items-center text-white`}><Icon className="h-4 w-4" strokeWidth={2.25} /></div>
      <div className="font-display text-3xl font-medium mt-4">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
