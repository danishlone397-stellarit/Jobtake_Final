import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoriesEditor } from "./CategoriesEditor";

export default async function AdminCategories() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") redirect("/login");
  const cats = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <DashboardShell role="ADMIN" current="/admin/categories">
      <div className="glass-strong rounded-3xl p-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Homepage CMS</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">Categories</h1>
        <p className="text-zinc-600 mt-2 text-sm">Categories appear in the homepage bento grid and power filtering. Order, accent and icon URL are fully editable.</p>
      </div>
      <CategoriesEditor categories={cats.map(c => ({ id: c.id, name: c.name, slug: c.slug, iconUrl: c.iconUrl, accent: c.accent, sortOrder: c.sortOrder, active: c.active }))} />
    </DashboardShell>
  );
}
