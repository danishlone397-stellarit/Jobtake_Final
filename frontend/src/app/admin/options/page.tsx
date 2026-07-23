import { redirect } from "next/navigation";
import { Database } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { groupManagedOptions } from "@/lib/job-options";
import { OptionsEditor } from "./OptionsEditor";

export default async function AdminOptionsPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") redirect("/login");

  const options = await prisma.jobOption.findMany({
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { label: "asc" }],
  });

  return (
    <DashboardShell role="ADMIN" current="/admin/options">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900">Master Data</h1>
          <p className="mt-2 text-[15px] font-medium text-zinc-800">Manage all dropdowns and values used across the Jobtake platform.</p>
        </div>
        <div className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm">
          <Database className="h-4 w-4" />
          Admin Controlled
        </div>
      </div>

      <OptionsEditor options={groupManagedOptions(options, false)} />
    </DashboardShell>
  );
}
