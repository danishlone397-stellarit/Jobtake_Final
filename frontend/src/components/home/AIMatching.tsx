"use client";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Target, Check } from "lucide-react";
import Link from "next/link";

export function AIMatching() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" data-testid="ai-matching-section">
      <div className="orb bg-violet-400/25 h-[400px] w-[400px] top-20 left-10" />
      <div className="orb bg-brand-orange/20 h-[420px] w-[420px] bottom-0 right-0" style={{ animationDelay: "-8s" }} />
      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold">AI-native matching</div>
            <h2 className="font-display mt-3 text-4xl md:text-5xl tracking-tight font-medium text-zinc-950 leading-[1.05]">
              A recruiter that reads <span className="text-black">between the lines.</span>
            </h2>
            <p className="text-zinc-600 mt-6 text-lg leading-relaxed max-w-lg">
              Jobtake's calibrated AI evaluates trajectory, taste, and context — not just keywords — so the matches actually feel like a fit, not a flood.
            </p>
            <ul className="mt-8 space-y-3 max-w-md">
              {["Signal-graded shortlists in under 4 minutes", "Skill, taste & trajectory weighted independently", "Private — stays opt-in, never indexed externally"].map(line => (
                <li key={line} className="flex items-start gap-3 text-zinc-700">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-brand-blue to-violet-500 grid place-items-center shadow-md shadow-brand-blue/30">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Get matched
              </Link>
              <Link href="/jobs" className="btn-glass rounded-full px-5 py-3 text-sm font-medium">Browse jobs</Link>
            </div>
          </div>
          <div className="relative h-[520px]">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="absolute inset-0 grid place-items-center">
              <div className="absolute h-[440px] w-[440px] rounded-full border border-zinc-200/70 spin-slow" />
              <div className="absolute h-[340px] w-[340px] rounded-full border border-zinc-300/60" />
              <div className="absolute h-[240px] w-[240px] rounded-full border border-zinc-400/40" />
              <div className="relative h-44 w-44 rounded-full ai-pulse bg-gradient-to-br from-brand-blue via-violet-500 to-brand-orange shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_30px_60px_-10px_rgba(31,61,187,0.5)]">
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <BrainCircuit className="h-10 w-10 text-white drop-shadow" strokeWidth={1.6} />
                </div>
              </div>
              {[
                { label: "Senior PM · 96% match", top: "8%", left: "8%", accent: "from-violet-500 to-brand-blue" },
                { label: "Trajectory: Director-ready", top: "20%", right: "6%", accent: "from-brand-blue to-cyan-500" },
                { label: "Taste · A+", bottom: "16%", left: "4%", accent: "from-brand-orange to-amber-500" },
                { label: "Culture: Linear, Vercel", bottom: "8%", right: "8%", accent: "from-fuchsia-500 to-rose-500" },
              ].map((c, i) => (
                <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.12 }} className="absolute glass rounded-full px-3 py-1.5 text-xs font-medium text-zinc-800 flex items-center gap-2" style={c as React.CSSProperties}>
                  <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${c.accent}`} />{c.label}
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <Target className="h-4 w-4 text-brand-blue" />
                <div className="text-xs">
                  <div className="font-display font-medium text-zinc-950">3,418 matches refined</div>
                  <div className="text-zinc-500">in 11.4 seconds</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
