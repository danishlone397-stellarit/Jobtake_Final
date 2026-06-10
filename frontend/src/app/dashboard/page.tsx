import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, Bookmark, Sparkles, ArrowRight } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default async function SeekerDashboard() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== "SEEKER") redirect(me.role === "EMPLOYER" ? "/employer" : "/admin");

  const [applications, saved, recommendations] = await Promise.all([
    prisma.application.findMany({
      where: { userId: me.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { job: { include: { company: { select: { name: true, logoUrl: true } } } } },
    }),
    prisma.savedJob.count({ where: { userId: me.id } }),
    prisma.job.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 4, include: { company: { select: { name: true } } } }),
  ]);

  return (
    <DashboardShell role="SEEKER" current="/dashboard">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Welcome back</div>
        <h1 className="font-display mt-2 text-4xl font-medium tracking-tight" data-testid="seeker-greeting">Hello, {me.name.split(" ")[0]}.</h1>
        <p className="text-zinc-600 mt-2">Here's where things stand today.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <KPI label="Applications" value={applications.length} icon={Briefcase} accent="#489696" />
        <KPI label="Saved jobs" value={saved} icon={Bookmark} accent="#489696" />
        <KPI label="AI matches" value="∞" icon={Sparkles} accent="#489696" />
      </div>

      <section className="glass rounded-3xl p-6 md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Recent applications</div>
            <h2 className="font-display mt-2 text-2xl font-medium">Pipeline</h2>
          </div>
          <Link href="/dashboard/applications" className="text-sm text-zinc-700 inline-flex items-center gap-1 hover:text-zinc-950">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        {applications.length === 0 ? (
          <p className="mt-6 text-zinc-500 text-sm">No applications yet. Browse <Link href="/jobs" className="underline">jobs</Link> to get started.</p>
        ) : (
          <ul className="mt-5 divide-y divide-zinc-200/60">
            {applications.map(a => (
              <li key={a.id} className="py-3 flex items-center gap-3" data-testid={`app-row-${a.id}`}>
                <div className="h-10 w-10 rounded-xl grid place-items-center text-white text-sm font-medium" style={{ backgroundColor: "#489696" }}>{a.job.company.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-950 text-sm truncate">{a.job.title}</div>
                  <div className="text-xs text-zinc-500">{a.job.company.name} · applied {timeAgo(a.createdAt)}</div>
                </div>
                <span className="text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">{a.stage.replace("_", " ").toLowerCase()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass rounded-3xl p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Recommended for you</div>
        <h2 className="font-display mt-2 text-2xl font-medium">Fresh roles, picked by Jobtake AI</h2>
        <div className="mt-5 grid md:grid-cols-2 gap-3">
          {recommendations.map(j => (
            <Link key={j.id} href={`/jobs/${j.slug}`} className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform block" data-testid={`rec-${j.id}`}>
              <div className="text-xs text-zinc-500">{j.company.name}</div>
              <div className="font-display font-medium text-zinc-950 text-base mt-1 truncate">{j.title}</div>
              <div className="text-xs text-zinc-500 mt-2">{j.location} · {j.workMode.toLowerCase()}</div>
            </Link>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function KPI({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; accent: string }) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-25 blur-2xl" style={{ backgroundColor: accent }} />
      <div className="h-10 w-10 rounded-xl grid place-items-center text-white" style={{ backgroundColor: accent }}><Icon className="h-4 w-4" strokeWidth={2.25} /></div>
      <div className="font-display text-3xl font-medium mt-4">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
