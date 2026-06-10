import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export default async function ApplicationsPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "SEEKER") redirect("/login");
  const apps = await prisma.application.findMany({
    where: { userId: me.id },
    orderBy: { createdAt: "desc" },
    include: { job: { include: { company: { select: { name: true, slug: true } } } } },
  });

  return (
    <DashboardShell role="SEEKER" current="/dashboard/applications">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">My applications</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">Tracking {apps.length} role{apps.length === 1 ? "" : "s"}</h1>
      </div>

      <div className="glass rounded-3xl p-2 overflow-x-auto" data-testid="applications-table">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3">Match</th>
              <th className="px-4 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} className="border-t border-zinc-200/60 hover:bg-white/70" data-testid={`app-${a.id}`}>
                <td className="px-4 py-3">
                  <Link href={`/jobs/${a.job.slug}`} className="font-medium text-zinc-950 hover:text-brand-blue">{a.job.title}</Link>
                </td>
                <td className="px-4 py-3 text-zinc-700">{a.job.company.name}</td>
                <td className="px-4 py-3 text-zinc-500">{timeAgo(a.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{a.matchScore || "—"}%</span>
                    {a.matchScore && <div className="h-1.5 w-16 rounded-full bg-zinc-200 overflow-hidden"><div className="h-full bg-gradient-to-r from-brand-blue to-brand-orange" style={{ width: `${a.matchScore}%` }} /></div>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">{a.stage.replace("_", " ").toLowerCase()}</span>
                </td>
              </tr>
            ))}
            {!apps.length && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-500 text-sm">No applications yet. <Link href="/jobs" className="text-zinc-900 underline">Browse jobs</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
