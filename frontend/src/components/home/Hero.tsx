"use client";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Sparkles,
  Briefcase,
  Building2,
  Zap,
  ChevronDown,
  UserRound,
  ClipboardList,
  Bell,
  CirclePlus,
  UsersRound,
  Star,
  ArrowUpRight,
  CheckCircle2,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const suggestions = ["Staff PM Berlin", "Remote ML Europe", "Founding designer seed", "Quant NYC"];

const candidateActions = [
  { icon: Search, label: "Search verified jobs" },
  { icon: Sparkles, label: "AI Match for suitable roles" },
  { icon: UserRound, label: "Create candidate profile" },
  { icon: ClipboardList, label: "Track applications" },
  { icon: Bell, label: "Get job alerts" },
];

const employerActions = [
  { icon: CirclePlus, label: "Post job openings" },
  { icon: UsersRound, label: "Manage applicants" },
  { icon: Star, label: "Shortlist candidates" },
  { icon: Sparkles, label: "Use AI-assisted matching" },
  { icon: Building, label: "Build employer profile" },
];

export default function Hero({ totalJobs }: { totalJobs: number }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");

  function search(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (loc) p.set("location", loc);
    router.push(`/jobs?${p.toString()}`);
  }

  return (
    <section
      className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden bg-white"
      data-testid="hero-section"
    >

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-6 md:px-12" style={{ zIndex: 2 }}>

        <div className="max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-fit"
          >
            <div className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#12866f]">
              India's #1 Job Platform
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] text-black sm:text-5xl md:text-6xl"
          >
            Your job search ends here
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-zinc-800 sm:text-2xl"
          >
            Discover 50 lakh+ career opportunities
          </motion.p>

          {/* Search Form */}
          <motion.form
            onSubmit={search}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-10 max-w-5xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          >
            <div className="grid md:grid-cols-[1.08fr_0.92fr_1fr_auto]">
              <label className="flex min-h-[62px] items-center gap-3 border-b border-zinc-200 px-4 transition-colors hover:bg-zinc-50 md:border-b-0 md:border-r">
                <Search className="h-5 w-5 shrink-0 text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search jobs by title..."
                  className="w-full bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-slate-500"
                  data-testid="hero-search-input"
                />
              </label>
              <label className="flex min-h-[62px] items-center gap-3 border-b border-zinc-200 px-4 transition-colors hover:bg-zinc-50 md:border-b-0 md:border-r">
                <Briefcase className="h-5 w-5 shrink-0 text-slate-500" />
                <select className="w-full appearance-none bg-transparent text-[15px] text-slate-600 outline-none">
                  <option>Your experience</option>
                  <option>Fresher</option>
                  <option>1-3 years</option>
                  <option>3-6 years</option>
                  <option>6+ years</option>
                </select>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
              </label>
              <label className="flex min-h-[62px] items-center gap-3 border-b border-zinc-200 px-4 transition-colors hover:bg-zinc-50 md:border-b-0 md:border-r">
                <MapPin className="h-5 w-5 shrink-0 text-slate-500" />
                <input
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  placeholder="Search for an area..."
                  className="w-full bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-slate-500"
                  data-testid="hero-location-input"
                />
              </label>
              <div className="p-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#14866f] px-7 text-sm font-bold text-white transition-colors hover:bg-[#0f725f] md:w-[160px]"
                  data-testid="hero-search-btn"
                >
                  Search jobs
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Suggestion chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-bold uppercase tracking-[0.18em] text-[#12866f]">Try</span>
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => { setQ(s); router.push(`/jobs?q=${encodeURIComponent(s)}`); }}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm transition-colors hover:border-[#14866f]/30 hover:text-[#14866f]"
                data-testid={`hero-chip-${i}`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
        {/* Candidate and employer panels */}
        {/* Candidate and employer panels */}
<div className="mt-10 grid gap-5 lg:grid-cols-2">

  {/* FOR CANDIDATES */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.1, delay: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
    className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(16,77,77,0.15)]"
  >
    {/* Round photo top-right */}
    <div className="absolute right-5 top-5">
      <div className="h-[110px] w-[110px] rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=220&h=220&fit=crop&crop=face"
          alt="Candidate"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute -bottom-1 -right-1 h-7 w-7 grid place-items-center rounded-full bg-teal-500 text-white shadow">
        <CheckCircle2 className="h-4 w-4" />
      </div>
    </div>

    <div className="relative max-w-[260px]">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow">
        <UserRound className="h-5 w-5" />
      </div>
      <h2 className="mt-3 text-xl font-semibold leading-tight text-emerald-900">For Candidates</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
        Find roles that match your skills, goals and experience.
      </p>
    </div>

    <div className="relative mt-4 rounded-xl bg-white/80 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.07)]">
      <div className="grid gap-x-6 md:grid-cols-2">
        {candidateActions.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex min-h-[34px] items-center gap-2.5 border-b border-slate-100 py-2 text-[13px] font-medium text-slate-800 ${
                index === 2 || index === 4 ? "border-b-0" : ""
              } ${index > 2 ? "md:border-b-0" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/jobs")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-700"
        >
          Find Jobs <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => router.push("/signup?role=candidate")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600"
        >
          Candidate Registration
        </button>
      </div>
    </div>
  </motion.div>

  {/* FOR EMPLOYERS */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.1, delay: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
    className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(28,64,140,0.15)]"
  >
    {/* Round photo top-right */}
    <div className="absolute right-5 top-5">
      <div className="h-[110px] w-[110px] rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=220&h=220&fit=crop&crop=face"
          alt="Employer"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute -bottom-1 -right-1 h-7 w-7 grid place-items-center rounded-full bg-blue-600 text-white shadow">
        <CheckCircle2 className="h-4 w-4" />
      </div>
    </div>

    <div className="relative max-w-[260px]">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow">
        <Briefcase className="h-5 w-5" />
      </div>
      <h2 className="mt-3 text-xl font-semibold leading-tight text-blue-900">For Employers</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
        Hire better candidates faster with AI-supported recruitment tools.
      </p>
    </div>

    <div className="relative mt-4 rounded-xl bg-white/80 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.07)]">
      <div className="grid gap-x-6 md:grid-cols-2">
        {employerActions.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex min-h-[34px] items-center gap-2.5 border-b border-slate-100 py-2 text-[13px] font-medium text-slate-800 ${
                index === 2 || index === 4 ? "border-b-0" : ""
              } ${index > 2 ? "md:border-b-0" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0 text-blue-600" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/employers/post-job")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-700"
        >
          Post a Job <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => router.push("/employers")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600"
        >
          Explore Employer Tools
        </button>
      </div>
    </div>
  </motion.div>

</div>
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 sm:mt-8 flex items-center justify-center gap-6 flex-wrap"
          style={{ color: "rgba(39,39,42,0.72)", fontSize: "12px" }}
        >
          {[
            { icon: <Briefcase className="h-3.5 w-3.5" />, label: `${totalJobs.toLocaleString()}+ active roles` },
            { icon: <Building2 className="h-3.5 w-3.5" />, label: "Verified hiring teams" },
            { icon: <Zap className="h-3.5 w-3.5" />, label: "14-day average time-to-offer" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, color: "#14866f" }}
              className="flex items-center gap-2 cursor-default transition-colors"
            >
              {item.icon} {item.label}
              {i < 2 && (
                <span className="h-1 w-1 rounded-full ml-4" style={{ background: "rgba(20,134,111,0.32)" }} />
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
