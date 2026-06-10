import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export default async function EmployerJobsPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "EMPLOYER") redirect("/login");
  const jobs = await prisma.job.findMany({
    where: { postedById: me.id }, orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } }, company: { select: { name: true } } },
  });

  return (
    <DashboardShell role="EMPLOYER" current="/employer/jobs">
      <div className="glass-strong rounded-3xl p-7">
        <div className="flex justify-between items-end flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">My jobs</div>
            <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">{jobs.length} posting{jobs.length === 1 ? "" : "s"}</h1>
          </div>
          <Link href="/employer/post-job" className="btn-primary rounded-full px-5 py-3 text-sm font-medium">+ Post a job</Link>
        </div>
      </div>

      <div className="glass rounded-3xl p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Applicants</th>
              <th className="px-4 py-3">Posted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} className="border-t border-zinc-200/60 hover:bg-white/70">
                <td className="px-4 py-3 font-medium text-zinc-950">{j.title}</td>
                <td className="px-4 py-3 text-zinc-700">{j.location}</td>
                <td className="px-4 py-3"><span className="text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">{j.status.toLowerCase()}</span></td>
                <td className="px-4 py-3">{j._count.applications}</td>
                <td className="px-4 py-3 text-zinc-500">{timeAgo(j.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/employer/jobs/${j.id}/applicants`} className="btn-glass rounded-full text-xs px-3 py-1.5">Manage</Link>
                </td>
              </tr>
            ))}
            {!jobs.length && <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500 text-sm">No jobs yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
