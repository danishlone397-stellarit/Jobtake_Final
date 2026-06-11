"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Search,
  MapPin,
  Sparkles,
  Briefcase,
  Building2,
  Zap,
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
import { useState, useEffect } from "react";
import bgImg from "@/assets/img/bgimg.jpeg";

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

function Counter({ to, delay = 0 }: { to: number; delay?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());
  useEffect(() => {
    const timer = setTimeout(() => animate(count, to, { duration: 2, ease: "easeOut" }), delay * 1000);
    return () => clearTimeout(timer);
  }, []);
  return <motion.span>{rounded}</motion.span>;
}

export default function Hero({ totalJobs }: { totalJobs: number }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [focused, setFocused] = useState<"q" | "loc" | null>(null);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (loc) p.set("location", loc);
    router.push(`/jobs?${p.toString()}`);
  }

  return (
    <section
      className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden"
      style={{
        backgroundColor: "#489696",
        backgroundImage: `url(${bgImg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      data-testid="hero-section"
    >
      {/* Readability overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0, 0, 0, 0.28)", zIndex: 0 }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        zIndex: 1,
      }} />

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-6 md:px-12" style={{ zIndex: 2 }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto w-fit"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            AI-powered hiring - live with <Counter to={totalJobs} delay={0.5} /> roles
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-center mt-6 text-xl sm:text-2xl md:text-3xl font-semibold leading-snug max-w-2xl mx-auto"
          style={{ color: "#fff" }}
        >
          The hiring layer for extraordinary careers.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9 }}
          className="mt-3 text-center text-[10px] sm:text-xs font-semibold max-w-lg mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          Jobtake pairs senior talent with the world's most ambitious teams - using a calibrated AI that reads context, not just keywords.
        </motion.p>

        {/* Search Form */}
        <motion.form
          onSubmit={search}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="relative mt-10 max-w-3xl mx-auto"
        >
          <motion.div
            className="absolute -inset-[2px] rounded-[30px]"
            animate={{ opacity: focused ? 1 : 0.5 }}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(252,198,167,0.4))",
            }}
          />
          <div
            className="relative rounded-[28px] p-2 flex flex-col md:flex-row md:items-center gap-2"
            style={{ background: "rgba(255,255,255,0.95)" }}
          >
            <label className="flex-1 flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-zinc-50/80 transition-colors cursor-text">
              <Search className="h-4 w-4 shrink-0" style={{ color: "#489696" }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocused("q")}
                onBlur={() => setFocused(null)}
                placeholder="Role, skill or keyword..."
                className="bg-transparent outline-none text-[15px] w-full text-zinc-900"
                data-testid="hero-search-input"
              />
            </label>
            <span className="hidden md:block h-7 w-px bg-zinc-200" />
            <label className="flex-1 flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-zinc-50/80 transition-colors cursor-text">
              <MapPin className="h-4 w-4 shrink-0" style={{ color: "#489696" }} />
              <input
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                onFocus={() => setFocused("loc")}
                onBlur={() => setFocused(null)}
                placeholder="Location - Remote - Worldwide"
                className="bg-transparent outline-none text-[15px] w-full text-zinc-900"
                data-testid="hero-location-input"
              />
            </label>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-2xl px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: "#fcc6a7", color: "#000000" }}
              data-testid="hero-search-btn"
            >
              <Sparkles className="h-4 w-4" /> AI Search
            </motion.button>
          </div>

          {/* Suggestion chips */}
          <div
            className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            <span className="uppercase tracking-[0.18em]">Try</span>
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                onClick={() => { setQ(s); router.push(`/jobs?q=${encodeURIComponent(s)}`); }}
                className="px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                }}
                data-testid={`hero-chip-${i}`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.form>
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
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-700"
        >
          Find Jobs <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-white px-4 py-2.5 text-[13px] font-semibold text-emerald-700 transition hover:bg-emerald-50"
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
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-[13px] font-semibold text-blue-700 transition hover:bg-blue-50"
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
          style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}
        >
          {[
            { icon: <Briefcase className="h-3.5 w-3.5" />, label: `${totalJobs.toLocaleString()}+ active roles` },
            { icon: <Building2 className="h-3.5 w-3.5" />, label: "Verified hiring teams" },
            { icon: <Zap className="h-3.5 w-3.5" />, label: "14-day average time-to-offer" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, color: "#fff" }}
              className="flex items-center gap-2 cursor-default transition-colors"
            >
              {item.icon} {item.label}
              {i < 2 && (
                <span className="h-1 w-1 rounded-full ml-4" style={{ background: "rgba(255,255,255,0.35)" }} />
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
