import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Role } from "@prisma/client";
import { LogOut, LayoutDashboard, Briefcase, Bookmark, User as UserIcon, FileText, ShieldCheck, Building2, Users as UsersIcon, ListChecks, Sparkles, Quote, Tag } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV: Record<Role, { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  SEEKER: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My applications", href: "/dashboard/applications", icon: Briefcase },
    { label: "Saved jobs", href: "/dashboard/saved", icon: Bookmark },
    { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ],
  EMPLOYER: [
    { label: "Overview", href: "/employer", icon: LayoutDashboard },
    { label: "My jobs", href: "/employer/jobs", icon: Briefcase },
    { label: "Post a job", href: "/employer/post-job", icon: FileText },
    { label: "Company", href: "/employer/company", icon: Building2 },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin", icon: ShieldCheck },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Categories", href: "/admin/categories", icon: Tag },
    { label: "Users", href: "/admin/users", icon: UsersIcon },
    { label: "Homepage stats", href: "/admin/stats", icon: ListChecks },
    { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
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

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 mesh-bg -z-10 opacity-50" />
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-[260px_1fr] gap-6 px-4 md:px-8 py-6">
        <aside className="glass-strong rounded-3xl p-5 lg:sticky lg:top-6 h-fit" data-testid="dashboard-sidebar">
          <Logo size={28} />
          <nav className="mt-6 space-y-1">
            {items.map((it) => {
              const active = current === it.href || (current?.startsWith(it.href + "/") && it.href !== `/${role.toLowerCase()}`);
              return (
                <Link key={it.href} href={it.href}
                  className={`flex items-center gap-2.5 text-sm rounded-2xl px-3 py-2.5 transition-colors ${active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-white/70"}`}
                  data-testid={`side-${it.href.split("/").pop()}`}
                >
                  <it.icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 glass rounded-2xl p-4">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">Signed in</div>
            <div className="font-display font-medium text-zinc-950 mt-1 text-sm truncate">{user.name}</div>
            <div className="text-xs text-zinc-500 truncate">{user.email}</div>
            <div className="mt-3 flex items-center gap-2">
              <Link href="/" className="btn-glass rounded-full text-xs px-3 py-1.5 flex-1 text-center">Home</Link>
              <LogoutButton />
            </div>
          </div>
        </aside>

        <main className="space-y-6 pb-12">{children}</main>
      </div>
    </div>
  );
}
