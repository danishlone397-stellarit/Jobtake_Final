"use client";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";
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
  WHITE: {
    label: "White-Collar Jobs",
    desc: "Office-based desk roles",
    emoji: "🏢",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  BLUE: {
    label: "Blue-Collar Jobs",
    desc: "Manual labor jobs",
    emoji: "🔧",
    color: "from-sky-500 to-blue-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    btn: "bg-sky-600 hover:bg-sky-700",
  },
  PINK: {
    label: "Pink-Collar Jobs",
    desc: "Service industry positions",
    emoji: "🌸",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    btn: "bg-pink-500 hover:bg-pink-600",
  },
  GREY: {
    label: "Grey-Collar Jobs",
    desc: "Technical and supervisory roles",
    emoji: "⚙️",
    color: "from-zinc-500 to-slate-700",
    bg: "bg-zinc-50",
    border: "border-zinc-300",
    badge: "bg-zinc-200 text-zinc-700",
    btn: "bg-zinc-600 hover:bg-zinc-700",
  },
  MSME: {
    label: "MSME Jobs",
    desc: "Micro, Small & Medium Enterprises",
    emoji: "🏭",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    btn: "bg-orange-500 hover:bg-orange-600",
  },
};

function JobCard({ job, meta }: { job: CollarJob; meta: typeof COLLAR_META["WHITE"] }) {
  return (
    <Link href={`/jobs/${job.slug}`}>
      <div className={`rounded-2xl border ${meta.border} bg-white p-4 hover:shadow-md transition-shadow cursor-pointer`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${meta.color} grid place-items-center text-white font-bold text-sm`}>
            {job.company.initial}
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-medium">{job.company.name}</div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400"><Clock className="h-2.5 w-2.5" /> {job.postedAgo}</div>
          </div>
        </div>
        <h4 className="font-semibold text-zinc-900 text-sm leading-tight">{job.title}</h4>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500"><MapPin className="h-3 w-3" /> {job.location}</div>
        <div className="mt-2 text-xs font-medium text-zinc-700">{job.salaryLabel}</div>
      </div>
    </Link>
  );
}

export function CollarSections({ sections }: { sections: CollarSection[] }) {
  const order: Array<"WHITE" | "BLUE" | "PINK" | "GREY" | "MSME"> = ["WHITE", "BLUE", "PINK", "GREY", "MSME"];

  return (
    <div className="py-16 mx-auto max-w-7xl px-6 md:px-12 space-y-14">
      {order.map((type, si) => {
        const section = sections.find(s => s.type === type);
        const meta = COLLAR_META[type];
        const jobs = section?.jobs ?? [];

        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: si * 0.05 }}
          >
            <div className={`rounded-3xl border ${meta.border} ${meta.bg} p-6 md:p-8`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${meta.color} grid place-items-center text-2xl shadow`}>
                    {meta.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">{meta.label}</h3>
                    <p className="text-sm text-zinc-500">{meta.desc}</p>
                  </div>
                </div>
                <Link
                  href={`/jobs?collarType=${type}`}
                  className={`hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-white ${meta.btn} px-4 py-2 rounded-full transition`}
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-sm">No {meta.label} posted yet.</div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {jobs.map(job => (
                    <JobCard key={job.id} job={job} meta={meta} />
                  ))}
                </div>
              )}

              <Link href={`/jobs?collarType=${type}`} className={`sm:hidden mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white ${meta.btn} px-4 py-2 rounded-full transition`}>
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
