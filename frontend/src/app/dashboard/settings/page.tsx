import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Bell, Lock, User, Trash2, Mail, Shield, Eye, Smartphone } from "lucide-react";

export default async function SeekerSettingsPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "SEEKER") redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user) redirect("/login");

  return (
    <DashboardShell role="SEEKER" current="/dashboard/settings">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400 font-semibold">Account</p>
        <h1 className="text-2xl font-black text-zinc-900 mt-1">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="max-w-2xl space-y-5">

        {/* Profile Info */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <h2 className="font-bold text-zinc-900 text-sm">Profile Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shrink-0">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <div className="font-bold text-zinc-900">{user.name}</div>
                <div className="text-sm text-zinc-500">{user.email}</div>
                <div className="text-xs text-zinc-400 mt-0.5">Job Seeker Account</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input defaultValue={user.name ?? ""} readOnly
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm outline-none bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input defaultValue={user.email} readOnly
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm outline-none bg-zinc-50" />
              </div>
            </div>
            <p className="text-xs text-zinc-400">To update your name or email, please contact support.</p>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" />
            <h2 className="font-bold text-zinc-900 text-sm">Security</h2>
          </div>
          <div className="p-6 space-y-1">
            {[
              { icon: <Lock className="h-4 w-4 text-zinc-500" />,       label: "Password",                  sub: "Last changed: never",            action: "Change" },
              { icon: <Smartphone className="h-4 w-4 text-zinc-500" />, label: "Two-Factor Authentication", sub: "Add extra layer of security",     action: null, badge: "Not enabled" },
              { icon: <Eye className="h-4 w-4 text-zinc-500" />,        label: "Active Sessions",           sub: "Manage where you're logged in",   action: "View" },
            ].map(({ icon, label, sub, action, badge }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">{icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">{label}</div>
                    <div className="text-xs text-zinc-400">{sub}</div>
                  </div>
                </div>
                {action && <button className="text-sm font-semibold text-blue-600 hover:underline">{action}</button>}
                {badge && <span className="text-xs bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full font-semibold">{badge}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-600" />
            <h2 className="font-bold text-zinc-900 text-sm">Notifications</h2>
          </div>
          <div className="p-6 space-y-1">
            {[
              { icon: <Mail className="h-4 w-4 text-zinc-500" />,    label: "Application status updates", desc: "When employer changes your application stage", on: true },
              { icon: <Bell className="h-4 w-4 text-zinc-500" />,    label: "Job alerts",                 desc: "New jobs matching your profile & preferences",  on: true },
              { icon: <Shield className="h-4 w-4 text-zinc-500" />,  label: "Profile views",              desc: "When an employer views your profile",            on: false },
              { icon: <Mail className="h-4 w-4 text-zinc-500" />,    label: "Weekly digest",              desc: "Summary of new jobs and opportunities",          on: false },
            ].map(({ icon, label, desc, on }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">{icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">{label}</div>
                    <div className="text-xs text-zinc-400">{desc}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={on} className="sr-only peer" />
                  <div className="w-10 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <h2 className="font-bold text-zinc-900 text-sm">Privacy</h2>
          </div>
          <div className="p-6 space-y-1">
            {[
              { label: "Profile visibility",     desc: "Allow employers to find your profile",        on: true },
              { label: "Resume visibility",       desc: "Let employers view your resume",              on: true },
              { label: "Activity status",         desc: "Show when you were last active",              on: false },
            ].map(({ label, desc, on }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                <div>
                  <div className="text-sm font-semibold text-zinc-800">{label}</div>
                  <div className="text-xs text-zinc-400">{desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={on} className="sr-only peer" />
                  <div className="w-10 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border border-red-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            <h2 className="font-bold text-red-600 text-sm">Danger Zone</h2>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-800">Delete Account</div>
              <div className="text-xs text-zinc-400 mt-0.5">Permanently delete your account and all data. This cannot be undone.</div>
            </div>
            <button className="text-sm font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition">
              Delete
            </button>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
