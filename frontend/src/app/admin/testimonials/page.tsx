import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TestimonialsEditor } from "./TestimonialsEditor";

export default async function AdminTestimonialsPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") redirect("/login");
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <DashboardShell role="ADMIN" current="/admin/testimonials">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Testimonials</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">Success stories</h1>
      </div>
      <TestimonialsEditor items={items.map(t => ({ id: t.id, name: t.name, role: t.role, quote: t.quote, avatarUrl: t.avatarUrl, accent: t.accent, sortOrder: t.sortOrder, active: t.active }))} />
    </DashboardShell>
  );
}
