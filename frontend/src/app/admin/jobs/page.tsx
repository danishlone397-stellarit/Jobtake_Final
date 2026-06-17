import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminJobsTable } from "./AdminJobsTable";

export default async function AdminJobs() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") redirect("/login");
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: { select: { name: true } }, _count: { select: { applications: true } } },
    take: 300,
  });
  return (
    <DashboardShell role="ADMIN" current="/admin/jobs">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">All jobs</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">Moderation & featured</h1>
      </div>
      <AdminJobsTable jobs={jobs.map(j => ({
        id: j.id, title: j.title, status: j.status, featured: j.featured, location: j.location,
        company: j.company.name, applicants: j._count.applications, createdAt: j.createdAt.toISOString(),
        collarType: (j as any).collarType ?? "WHITE",
      }))} />
    </DashboardShell>
  );
}
