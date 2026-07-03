import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CompanyEditForm } from "./CompanyEditForm";

export default async function CompanyEditPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "EMPLOYER") redirect("/login");

  const company = await prisma.company.findFirst({
    where: { ownerId: me.id },
    include: { benefits: true },
  });

  return (
    <DashboardShell role="EMPLOYER" current="/employer/company">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400 font-semibold">Company Profile</p>
        <h1 className="text-2xl font-black text-zinc-900 mt-1">Edit Company Details</h1>
        <p className="text-sm text-zinc-500 mt-1">Update your company information to attract better candidates.</p>
      </div>
      <CompanyEditForm company={company} />
    </DashboardShell>
  );
}
