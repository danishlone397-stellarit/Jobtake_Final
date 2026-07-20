import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostJobForm } from "./PostJobForm";

export default async function PostJobPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/employers/login");
  if (me.role !== "EMPLOYER" && me.role !== "ADMIN") redirect("/dashboard");
  const cats = await prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  return (
    <DashboardShell role={me.role === "ADMIN" ? "ADMIN" : "EMPLOYER"} current="/employer/post-job">
      <div className="mb-6">
        <a href="/employer/jobs" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition mb-1">← Back to My Jobs</a>
        <h1 className="text-2xl font-black text-zinc-900">Post a New Job</h1>
        <p className="text-sm text-zinc-500 mt-1">Fill in the details below to create your job post. Fields marked with <span className="text-red-500">*</span> are required.</p>
      </div>
      <PostJobForm categories={cats.map(c => ({ id: c.id, name: c.name }))} isAdmin={me.role === "ADMIN"} />
    </DashboardShell>
  );
}
