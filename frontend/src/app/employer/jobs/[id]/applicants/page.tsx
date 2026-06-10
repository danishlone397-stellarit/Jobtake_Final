import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ApplicantsBoard } from "./ApplicantsBoard";

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { applications: { include: { user: { select: { id: true, name: true, email: true, headline: true, location: true } }, resume: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!job) notFound();
  if (me.role !== "ADMIN" && job.postedById !== me.id) redirect("/employer");

  return (
    <DashboardShell role={me.role === "ADMIN" ? "ADMIN" : "EMPLOYER"} current="/employer/jobs">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Applicant pipeline</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">{job.title}</h1>
        <p className="text-zinc-600 mt-1 text-sm">{job.applications.length} candidate{job.applications.length === 1 ? "" : "s"} · {job.location} · {job.workMode.toLowerCase()}</p>
      </div>

      <ApplicantsBoard
        applications={job.applications.map(a => ({
          id: a.id,
          stage: a.stage,
          rating: a.rating,
          matchScore: a.matchScore,
          user: a.user,
          resumeUrl: a.resume?.fileUrl || null,
          coverLetter: a.coverLetter,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </DashboardShell>
  );
}
