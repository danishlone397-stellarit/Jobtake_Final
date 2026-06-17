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
    {/* 3D Illustration */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute right-3 top-3 pointer-events-none"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="60" cy="108" rx="28" ry="6" fill="#10b98133" />
        {/* Laptop base */}
        <rect x="22" y="72" width="76" height="6" rx="3" fill="#1e40af" />
        <rect x="26" y="36" width="68" height="40" rx="6" fill="#3b82f6" />
        <rect x="30" y="40" width="60" height="32" rx="4" fill="#eff6ff" />
        {/* Screen content lines */}
        <rect x="35" y="45" width="30" height="3" rx="1.5" fill="#93c5fd" />
        <rect x="35" y="51" width="20" height="2" rx="1" fill="#bfdbfe" />
        <rect x="35" y="56" width="25" height="2" rx="1" fill="#bfdbfe" />
        <rect x="72" y="44" width="14" height="14" rx="3" fill="#10b981" />
        <text x="76" y="55" fontSize="10" fill="white" fontWeight="bold">✓</text>
        {/* Person */}
        <circle cx="60" cy="22" r="12" fill="#fbbf24" />
        <ellipse cx="60" cy="50" rx="10" ry="12" fill="#6366f1" />
        {/* Arms */}
        <path d="M50 42 Q40 50 42 60" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" />
        <path d="M70 42 Q80 50 78 60" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" />
        {/* Checkmark badge */}
        <circle cx="92" cy="28" r="12" fill="#10b981" />
        <path d="M86 28 L90 32 L98 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>

    <div className="relative max-w-[240px]">
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
    {/* 3D Illustration */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="absolute right-3 top-3 pointer-events-none"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="60" cy="110" rx="30" ry="5" fill="#1e40af22" />
        {/* Building */}
        <rect x="20" y="40" width="80" height="65" rx="4" fill="#1e40af" />
        <rect x="24" y="44" width="72" height="57" rx="3" fill="#3b82f6" />
        {/* Windows */}
        <rect x="30" y="52" width="14" height="12" rx="2" fill="#bfdbfe" />
        <rect x="50" y="52" width="14" height="12" rx="2" fill="#bfdbfe" />
        <rect x="70" y="52" width="14" height="12" rx="2" fill="#93c5fd" />
        <rect x="30" y="70" width="14" height="12" rx="2" fill="#93c5fd" />
        <rect x="50" y="70" width="14" height="12" rx="2" fill="#bfdbfe" />
        <rect x="70" y="70" width="14" height="12" rx="2" fill="#bfdbfe" />
        {/* Door */}
        <rect x="48" y="88" width="18" height="17" rx="2" fill="#1e3a8a" />
        {/* Roof accent */}
        <rect x="14" y="36" width="92" height="8" rx="4" fill="#1e3a8a" />
        {/* Flag */}
        <line x1="60" y1="10" x2="60" y2="36" stroke="#f59e0b" strokeWidth="2" />
        <path d="M60 10 L78 18 L60 26 Z" fill="#f59e0b" />
        {/* Star badge */}
        <circle cx="96" cy="38" r="13" fill="#f59e0b" />
        <text x="89" y="43" fontSize="13" fill="white">★</text>
      </svg>
    </motion.div>

    <div className="relative max-w-[240px]">
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
