"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Clock, ArrowRight, Bookmark } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export type FeaturedJob = {
  id: string;
  slug: string;
  title: string;
  location: string;
  salaryLabel: string;
  postedAgo: string;
  matchScore: number;
  tags: string[];
  company: { name: string; logoUrl: string | null; initial: string };
  logoColor: string;
};

function Tilt({ job, i }: { job: FeaturedJob; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(sy, [-50, 50], [6, -6]);
  const rotateY = useTransform(sx, [-50, 50], [-6, 6]);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.06, duration: 0.7 }}
    >
      <Link
        href={`/jobs/${job.slug}`}
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="glass rounded-3xl p-6 md:p-7 relative overflow-hidden group block cursor-pointer"
        data-testid={`featured-job-${job.id}`}
      >
        <motion.div style={{ rotateX, rotateY, transformPerspective: 1000 }}>
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${job.logoColor} grid place-items-center text-white font-bold text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_24px_-8px_rgba(99,71,250,0.45)]`}>
                {job.company.initial}
              </div>
              <div>
                <div className="text-xs text-zinc-500 font-medium">{job.company.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5"><Clock className="h-3 w-3" /> {job.postedAgo}</div>
              </div>
            </div>
            <span className="h-9 w-9 grid place-items-center rounded-full bg-white/60"><Bookmark className="h-4 w-4 text-zinc-600" /></span>
          </div>
          <h3 className="font-display font-medium text-zinc-950 text-xl md:text-[22px] mt-5 leading-tight tracking-tight">{job.title}</h3>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-zinc-500"><MapPin className="h-3.5 w-3.5" /> {job.location}</div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100/80 text-zinc-700 border border-zinc-200/60">{t}</span>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">Compensation</div>
            <div className="font-display font-medium text-zinc-950 mt-0.5 text-lg">{job.salaryLabel}</div>
          </div>
          <div className="mt-6 pt-5 border-t border-zinc-200/60 flex items-center justify-between">
            <div className="text-xs text-zinc-500">Apply via 1-click profile</div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 group-hover:gap-2 transition-all">View role <ArrowRight className="h-3.5 w-3.5" /></span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function FeaturedJobs({ jobs }: { jobs: FeaturedJob[] }) {
  return (
    <section className="relative py-24 md:py-32" data-testid="featured-jobs-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight font-medium text-zinc-950 leading-[1.05] max-w-2xl">
              🔥 Hot Jobs
            </h2>
          </div>
          <Link href="/jobs" className="btn-glass rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2 w-fit" data-testid="view-all-jobs">
            View all roles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {jobs.length === 0 ? (
          <div className="text-center text-zinc-500 py-12">No featured jobs yet. Admin can mark jobs as featured from the admin panel.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {jobs.map((j, i) => <Tilt key={j.id} job={j} i={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
