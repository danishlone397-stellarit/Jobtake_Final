import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Briefcase, Building2, FileCheck } from "lucide-react";

export default async function AdminHome() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== "ADMIN") redirect(me.role === "EMPLOYER" ? "/employer" : "/dashboard");

  const [usersCount, jobsCount, pendingJobs, companiesCount, appsCount] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.job.count({ where: { status: "PENDING" } }),
    prisma.company.count(),
    prisma.application.count(),
  ]);

  return (
    <DashboardShell role="ADMIN" current="/admin">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Admin console</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">Operations overview</h1>
        <p className="text-zinc-600 mt-2 text-sm">All platform writes are logged. Featured homepage content is managed below.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <KPI label="Users" value={usersCount} icon={Users} accent="from-brand-blue to-violet-500" />
        <KPI label="Jobs" value={jobsCount} icon={Briefcase} accent="from-violet-500 to-fuchsia-500" />
        <KPI label="Companies" value={companiesCount} icon={Building2} accent="from-brand-orange to-amber-500" />
        <KPI label="Applications" value={appsCount} icon={FileCheck} accent="from-emerald-500 to-teal-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/jobs" className="glass rounded-3xl p-6 hover:-translate-y-1 transition-transform block">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Moderation</div>
          <h3 className="font-display mt-2 text-xl font-medium">{pendingJobs} job{pendingJobs === 1 ? "" : "s"} pending review →</h3>
        </Link>
        <Link href="/admin/stats" className="glass rounded-3xl p-6 hover:-translate-y-1 transition-transform block">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Homepage CMS</div>
          <h3 className="font-display mt-2 text-xl font-medium">Edit hero stats, categories, testimonials →</h3>
        </Link>
      </div>
    </DashboardShell>
  );
}

function KPI({ label, value, icon: Icon, accent }: { label: string; value: number; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; accent: string }) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-25 blur-2xl`} />
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accent} grid place-items-center text-white`}><Icon className="h-4 w-4" strokeWidth={2.25} /></div>
      <div className="font-display text-3xl font-medium mt-4">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
