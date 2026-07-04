import { DashboardShell } from "@/components/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Clock, Pencil, LayoutDashboard, User,
  Zap, Plus, FileText, Settings, Upload, ExternalLink,
  CheckCircle2, GraduationCap, Briefcase,
} from "lucide-react";

const DEMO_SKILLS = ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "UI/UX Design"];
const DEMO_EXPERIENCE = [
  { title: "Staff Frontend Engineer",  company: "Acme Corp",    type: "Full-time", from: "Jan 2022", to: "Present",   duration: "2 yrs 6 mos", current: true },
  { title: "Senior Frontend Developer",company: "InnovateX",    type: "Full-time", from: "May 2019", to: "Dec 2021",  duration: "2 yrs 7 mos", current: false },
  { title: "Frontend Developer",       company: "Dev Solutions", type: "Full-time", from: "Jun 2017", to: "Apr 2019",  duration: "1 yr 10 mos", current: false },
];
const DEMO_EDUCATION = [
  { degree: "Master of Computer Science",  school: "University of Cambridge", from: "2015", to: "2017" },
  { degree: "Bachelor of Computer Science",school: "University of London",    from: "2011", to: "2015" },
];

const TABS = [
  { label: "Overview",      icon: LayoutDashboard },
  { label: "Personal Info", icon: User },
  { label: "Skills",        icon: Zap },
  { label: "Experience",    icon: Briefcase },
  { label: "Education",     icon: GraduationCap },
  { label: "Resume",        icon: FileText },
  { label: "Settings",      icon: Settings },
];

export default async function ProfilePage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "SEEKER") redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user) redirect("/login");

  const initials = user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <DashboardShell role="SEEKER" current="/dashboard/profile">

      {/* ── Profile Hero ── */}
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden mb-5">
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">

            {/* Left — avatar + info */}
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black ring-4 ring-blue-100">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white border border-zinc-200 shadow flex items-center justify-center hover:bg-zinc-50 transition">
                  <Pencil className="h-3.5 w-3.5 text-zinc-500" />
                </button>
              </div>

              {/* Name + meta */}
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-1">My Profile</p>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-900">{user.name}</h1>
                  <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-100" />
                </div>

                {/* Profile strength */}
                <div className="flex items-center gap-1.5 mt-1 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600">Profile strength: Great</span>
                </div>

                <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
                  {user.headline || "Staff Frontend Engineer with 5+ years of experience building scalable web applications and modern user interfaces."}
                </p>

                {/* View Public Profile */}
                <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline mt-3">
                  View Public Profile <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right — contact info + edit button */}
            <div className="flex flex-col items-end gap-3">
              <Link href="/dashboard/profile/edit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition">
                <Pencil className="h-3.5 w-3.5" /> Edit Profile
              </Link>
              <div className="space-y-1.5 text-sm text-zinc-500">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-zinc-400" />{user.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-zinc-400" />{user.phone || "+1 (123) 456-7890"}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-zinc-400" />{user.location || "Remote • India"}</div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-zinc-400" />Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-t border-zinc-100 overflow-x-auto">
          {TABS.map((t, i) => (
            <button key={t.label}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-3.5 border-b-2 whitespace-nowrap transition ${i === 0 ? "text-blue-600 border-blue-600" : "text-zinc-400 border-transparent hover:text-zinc-700"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview Grid ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── About Me ── */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-zinc-500" />
            <h3 className="font-bold text-zinc-900 text-sm">About Me</h3>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {user.bio || "Passionate frontend engineer who loves creating intuitive and accessible user experiences. Skilled in React, TypeScript, and modern UI technologies."}
          </p>
          <button className="mt-3 text-sm font-semibold text-blue-600 hover:underline">Edit About Me</button>
        </div>

        {/* ── Top Skills ── */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-amber-500" />
            <h3 className="font-bold text-zinc-900 text-sm">Top Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_SKILLS.map(s => (
              <span key={s} className="text-xs font-semibold bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-full">{s}</span>
            ))}
          </div>
          <button className="mt-3 text-sm font-semibold text-blue-600 hover:underline">Manage Skills</button>
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="h-4 w-4 text-blue-500" />
            <h3 className="font-bold text-zinc-900 text-sm">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {[
              { icon: FileText,  label: "Edit Resume",      href: "#" },
              { icon: User,      label: "Update Profile",   href: "#" },
              { icon: Zap,       label: "Manage Skills",    href: "#" },
              { icon: Settings,  label: "Privacy Settings", href: "/dashboard/settings" },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href}
                className="flex items-center gap-3 text-sm text-zinc-600 font-medium hover:text-blue-600 py-1.5 transition-colors">
                <Icon className="h-4 w-4 text-zinc-400" /> {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Experience Summary ── */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-4 w-4 text-zinc-500" />
            <h3 className="font-bold text-zinc-900 text-sm">Experience Summary</h3>
          </div>
          <div className="space-y-4">
            {DEMO_EXPERIENCE.map((e, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${e.current ? "bg-blue-600" : "bg-zinc-300"}`} />
                <div>
                  <div className="text-sm font-bold text-zinc-900">{e.title}</div>
                  <div className="text-xs text-zinc-500">{e.company} • {e.type}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{e.from} – {e.to} • {e.duration}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-semibold text-blue-600 hover:underline">View Full Experience</button>
        </div>

        {/* ── Education ── */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-4 w-4 text-zinc-500" />
            <h3 className="font-bold text-zinc-900 text-sm">Education</h3>
          </div>
          <div className="space-y-4">
            {DEMO_EDUCATION.map((e, i) => (
              <div key={i}>
                <div className="text-sm font-bold text-zinc-900">{e.degree}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{e.school}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{e.from} – {e.to}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-semibold text-blue-600 hover:underline">View All Education</button>
        </div>

        {/* ── Resume ── */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-zinc-500" />
            <h3 className="font-bold text-zinc-900 text-sm">Resume</h3>
          </div>
          <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <FileText className="h-6 w-6 text-zinc-400" />
            </div>
            <div className="text-sm font-semibold text-zinc-700">{user.name.replace(" ", "_")}_Resume.pdf</div>
            <div className="text-xs text-zinc-400">Updated on Jun 20, 2024</div>
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 border border-zinc-200 text-zinc-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-zinc-50 transition">
            <Upload className="h-4 w-4" /> Update Resume
          </button>
        </div>

      </div>
    </DashboardShell>
  );
}
