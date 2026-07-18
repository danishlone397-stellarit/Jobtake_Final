import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsEditor } from "./StatsEditor";

export default async function AdminStats() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") redirect("/login");

  const stats = await prisma.homepageStat.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <DashboardShell role="ADMIN" current="/admin/stats">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900">Homepage Statistics</h1>
          <p className="mt-2 text-sm text-zinc-500">Manage the numbers displayed on the Jobtake homepage.</p>
        </div>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
        >
          <Eye className="h-4 w-4" />
          Preview on Homepage
        </Link>
      </div>

      <StatsEditor
        stats={stats.map((s) => ({
          id: s.id,
          label: s.label,
          value: s.value,
          suffix: s.suffix,
          iconKey: s.iconKey,
          accent: s.accent,
          sortOrder: s.sortOrder,
          active: s.active,
        }))}
      />
    </DashboardShell>
  );
}
