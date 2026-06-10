import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UsersTable } from "./UsersTable";

export default async function AdminUsers() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") redirect("/login");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }, take: 500,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
  });
  return (
    <DashboardShell role="ADMIN" current="/admin/users">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">User management</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">{users.length} accounts</h1>
      </div>
      <UsersTable users={users.map(u => ({ ...u, createdAt: u.createdAt.toISOString(), lastLoginAt: u.lastLoginAt?.toISOString() || null }))} />
    </DashboardShell>
  );
}
