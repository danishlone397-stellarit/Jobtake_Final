"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export type CollarJob = {
  id: string;
  slug: string;
  title: string;
  location: string;
  salaryLabel: string;
  postedAgo: string;
  company: { name: string; initial: string };
};

export type CollarSection = {
  type: "WHITE" | "BLUE" | "PINK" | "GREY" | "MSME";
  jobs: CollarJob[];
};

const COLLAR_META = {
  WHITE: { label: "White-Collar Jobs", desc: "Office-based desk roles", emoji: "🏢", accent: "from-blue-500/30 to-indigo-500/30" },
  BLUE:  { label: "Blue-Collar Jobs",  desc: "Manual labor jobs",        emoji: "🔧", accent: "from-sky-500/30 to-blue-500/30" },
  PINK:  { label: "Pink-Collar Jobs",  desc: "Service industry positions", emoji: "🌸", accent: "from-pink-500/30 to-rose-500/30" },
  GREY:  { label: "Grey-Collar Jobs",  desc: "Technical and supervisory roles", emoji: "⚙️", accent: "from-zinc-500/30 to-slate-500/30" },
  MSME:  { label: "MSME Jobs",         desc: "Micro, Small & Medium Enterprises", emoji: "🏭", accent: "from-orange-500/30 to-amber-500/30" },
};

export function CollarSections({ sections }: { sections: CollarSection[] }) {
  const order: Array<"WHITE" | "BLUE" | "PINK" | "MSME"> = ["WHITE", "BLUE", "PINK", "MSME"];

  return (
    <section className="relative py-24 md:py-32" data-testid="collar-sections">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold">Explore by job type</div>
            <h2 className="font-display mt-3 text-4xl md:text-5xl tracking-tight font-medium text-zinc-950 leading-[1.05] max-w-xl">
              Find your <span className="text-black">category.</span>
            </h2>
          </div>
          <p className="text-zinc-600 max-w-md text-base">Browse roles across every job type, from desk jobs to skilled trades.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {order.map((type, i) => {
            const meta = COLLAR_META[type];
            const count = sections.find(s => s.type === type)?.jobs.length ?? 0;
            return (
              <motion.div key={type}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05, duration: 0.7 }}
                whileHover={{ y: -6 }}
              >
                <Link href={`/jobs?collarType=${type}`} className="glass relative rounded-3xl p-5 md:p-6 overflow-hidden group block">
                  <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${meta.accent} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`} />
                  <div className="relative h-20 md:h-24 flex items-center justify-center text-5xl">
                    {meta.emoji}
                  </div>
                  <div className="relative mt-4 flex items-end justify-between">
                    <div>
                      <div className="font-display font-medium text-zinc-950 text-[15px]">{meta.label}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{count.toLocaleString()} open roles</div>
                    </div>
                    <div className="h-8 w-8 rounded-full glass grid place-items-center group-hover:rotate-[-12deg] transition-transform">
                      <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
