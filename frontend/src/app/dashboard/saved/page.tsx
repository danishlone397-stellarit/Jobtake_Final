import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SavedPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "SEEKER") redirect("/login");

  const saved = await prisma.savedJob.findMany({
    where: { userId: me.id }, include: { job: { include: { company: { select: { name: true, slug: true } } } } }, orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell role="SEEKER" current="/dashboard/saved">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Saved roles</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">{saved.length} bookmarked</h1>
      </div>
      <div className="glass rounded-3xl p-6">
        {saved.length === 0 ? (
          <p className="text-zinc-500 text-sm">Bookmarks help you save jobs to come back to. Visit <Link href="/jobs" className="underline">all roles</Link> to start saving.</p>
        ) : (
          <ul className="divide-y divide-zinc-200/60">
            {saved.map(s => (
              <li key={s.id} className="py-3">
                <Link href={`/jobs/${s.job.slug}`} className="font-medium text-zinc-950 hover:text-brand-blue">{s.job.title}</Link>
                <div className="text-xs text-zinc-500 mt-0.5">{s.job.company.name} · {s.job.location}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardShell>
  );
}
