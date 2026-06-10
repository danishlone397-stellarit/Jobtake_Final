import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "SEEKER") redirect("/login");

  return (
    <DashboardShell role="SEEKER" current="/dashboard/profile">
      <div className="glass-strong rounded-3xl p-8">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">My profile</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl font-medium tracking-tight">{me.name}</h1>
        <p className="text-zinc-600 mt-2">{me.email}</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="glass rounded-2xl p-4"><div className="label">Headline</div><div className="mt-1 text-zinc-900">{me.headline || "—"}</div></div>
          <div className="glass rounded-2xl p-4"><div className="label">Location</div><div className="mt-1 text-zinc-900">{me.location || "—"}</div></div>
        </div>
        <p className="text-sm text-zinc-500 mt-6">Full profile editor is enabled via the Profile API — extend the UI here to update headline, bio, skills, experience and resume.</p>
      </div>
    </DashboardShell>
  );
}
