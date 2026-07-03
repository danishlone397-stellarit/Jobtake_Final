import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Role } from "@prisma/client";
import {
  LayoutDashboard, Briefcase, Bookmark, User as UserIcon,
  FileText, ShieldCheck, Building2, Users as UsersIcon,
  ListChecks, Quote, Tag, Settings, ExternalLink, Plus,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { prisma } from "@/lib/prisma";

const NAV: Record<Role, { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  SEEKER: [
    { label: "Overview",        href: "/dashboard",              icon: LayoutDashboard },
    { label: "My Applications", href: "/dashboard/applications", icon: Briefcase },
    { label: "Saved Jobs",      href: "/dashboard/saved",        icon: Bookmark },
    { label: "Profile",         href: "/dashboard/profile",      icon: UserIcon },
    { label: "Settings",        href: "/dashboard/settings",     icon: Settings },
  ],
  EMPLOYER: [
    { label: "Overview",        href: "/employer",               icon: LayoutDashboard },
    { label: "My Jobs",         href: "/employer/jobs",          icon: Briefcase },
    { label: "Post a Job",      href: "/employer/post-job",      icon: FileText },
    { label: "Company Profile", href: "/employer/company",       icon: Building2 },
    { label: "Settings",        href: "/employer/settings",      icon: Settings },
  ],
  ADMIN: [
    { label: "Overview",        href: "/admin",                  icon: ShieldCheck },
    { label: "Jobs",            href: "/admin/jobs",             icon: Briefcase },
    { label: "Categories",      href: "/admin/categories",       icon: Tag },
    { label: "Users",           href: "/admin/users",            icon: UsersIcon },
    { label: "Homepage Stats",  href: "/admin/stats",            icon: ListChecks },
    { label: "Testimonials",    href: "/admin/testimonials",     icon: Quote },
  ],
};

export async function DashboardShell({ children, role, current }: { children: React.ReactNode; role: Role; current?: string }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== role) {
    const dest = user.role === "ADMIN" ? "/admin" : user.role === "EMPLOYER" ? "/employer" : "/dashboard";
    redirect(dest);
  }

  const items = NAV[role];
  const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  // Get company slug for employer
  let companySlug: string | null = null;
  if (role === "EMPLOYER") {
    const company = await prisma.company.findFirst({ where: { ownerId: user.id }, select: { slug: true } });
    companySlug = company?.slug ?? null;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-[220px_1fr] gap-0">

        {/* ── SIDEBAR ── */}
        <aside
          className="bg-white border-r border-zinc-100 min-h-screen lg:sticky lg:top-0 flex flex-col"
          data-testid="dashboard-sidebar"
          style={{ height: "100vh", position: "sticky", top: 0, overflowY: "auto" }}
        >
          {/* Logo */}
          <div className="px-5 pt-6 pb-4">
            <Logo size={32} />
          </div>

          {/* Post a New Job button — employer only */}
          {role === "EMPLOYER" && (
            <div className="px-4 pb-4">
              <Link
                href="/employer/post-job"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
              >
                <Plus className="h-4 w-4" /> Post a New Job
              </Link>
            </div>
          )}

          {/* Nav items */}
          <nav className="flex-1 px-3 space-y-0.5">
            {items.map((it) => {
              const active = current === it.href || (current?.startsWith(it.href + "/") && it.href !== `/${role === "EMPLOYER" ? "employer" : role === "ADMIN" ? "admin" : "dashboard"}`);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition-colors font-medium ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                  data-testid={`side-${it.href.split("/").pop()}`}
                >
                  <it.icon className="h-4 w-4 shrink-0" />
                  {it.label}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade to Premium — employer only */}
          {role === "EMPLOYER" && (
            <div className="mx-4 my-4 bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">👑</span>
                <span className="font-bold text-zinc-900 text-sm">Upgrade to Premium</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                Unlock advanced features and hire better, faster.
              </p>
              <button className="w-full border border-blue-500 text-blue-600 font-semibold text-sm py-2 rounded-xl hover:bg-blue-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          )}

          {/* User info at bottom */}
          <div className="border-t border-zinc-100 px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-zinc-900 text-sm truncate">{user.name}</div>
                <div className="text-xs text-zinc-400 truncate">{user.email}</div>
              </div>
            </div>

            {/* View Company Profile — employer only */}
            {role === "EMPLOYER" && companySlug && (
              <Link
                href={`/jobs?q=${encodeURIComponent(user.name)}`}
                className="flex items-center justify-center gap-2 w-full border border-zinc-200 text-zinc-700 font-semibold text-sm py-2 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                View Company Profile <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}

            {/* Sign Out */}
            <LogoutButton />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="p-6 md:p-8 space-y-6 pb-16 min-h-screen bg-zinc-50">
          {children}
        </main>
      </div>
    </div>
  );
}
