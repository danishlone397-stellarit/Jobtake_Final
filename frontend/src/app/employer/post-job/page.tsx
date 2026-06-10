import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostJobForm } from "./PostJobForm";

export default async function PostJobPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login?redirect=/employer/post-job");
  if (me.role !== "EMPLOYER" && me.role !== "ADMIN") redirect("/dashboard");
  const cats = await prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  return (
    <DashboardShell role={me.role === "ADMIN" ? "ADMIN" : "EMPLOYER"} current="/employer/post-job">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">New role</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">Post a job</h1>
        <p className="text-zinc-600 mt-2 text-sm">Pending jobs are queued for admin review and published immediately after approval.</p>
      </div>
      <PostJobForm categories={cats.map(c => ({ id: c.id, name: c.name }))} isAdmin={me.role === "ADMIN"} />
    </DashboardShell>
  );
}
