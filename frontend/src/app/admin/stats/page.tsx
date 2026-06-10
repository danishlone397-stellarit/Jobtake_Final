import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsEditor } from "./StatsEditor";

export default async function AdminStats() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") redirect("/login");
  const stats = await prisma.homepageStat.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <DashboardShell role="ADMIN" current="/admin/stats">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Homepage stats</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">CMS — Numbers</h1>
        <p className="text-zinc-600 mt-2 text-sm">These power the animated counters on the homepage. Add, edit, reorder freely.</p>
      </div>
      <StatsEditor stats={stats.map(s => ({ id: s.id, label: s.label, value: s.value, suffix: s.suffix, iconKey: s.iconKey, accent: s.accent, sortOrder: s.sortOrder, active: s.active }))} />
    </DashboardShell>
  );
}
