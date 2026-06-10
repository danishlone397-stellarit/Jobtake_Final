import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CompanyPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "EMPLOYER") redirect("/login");
  return (
    <DashboardShell role="EMPLOYER" current="/employer/company">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Company profile</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">Manage your brand</h1>
        <p className="text-zinc-600 mt-3 text-sm">Company branding (logo, banner, description, benefits, team) is fully modeled in Postgres and exposed via the Prisma <code>Company</code> model. The editor UI can be plugged in here and will write through the same schema.</p>
      </div>
    </DashboardShell>
  );
}
