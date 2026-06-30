"use client";
import { motion } from "framer-motion";
import { MapPin, Laptop2, ArrowRight, Bookmark, BadgeCheck, IndianRupee, GraduationCap } from "lucide-react";
import Link from "next/link";

export type FeaturedJob = {
  id: string;
  slug: string;
  title: string;
  location: string;
  workMode: string;
  experienceLabel: string;
  salaryLabel: string;
  postedAgo: string;
  tags: string[];
  company: { name: string; logoUrl: string | null; initial: string; category: string; employees: string };
  logoColor: string;
};

function JobCard({ job, i }: { job: FeaturedJob; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.6 }}
    >
      <Link
        href={`/jobs/${job.slug}`}
        className="rounded-2xl border border-zinc-200 bg-white p-5 block hover:shadow-md hover:border-zinc-300 transition-all"
        data-testid={`featured-job-${job.id}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${job.logoColor} grid place-items-center text-white font-bold text-sm shrink-0`}>
              {job.company.initial}
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold text-zinc-900">
                {job.company.name} <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">{job.company.category} · {job.company.employees}</div>
            </div>
          </div>
          <Bookmark className="h-4 w-4 text-zinc-400 shrink-0" />
        </div>

        <h3 className="font-display font-semibold text-zinc-950 text-base mt-4 leading-tight">{job.title}</h3>

        <div className="mt-2.5 flex items-center gap-4 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
          <span className="inline-flex items-center gap-1"><Laptop2 className="h-3.5 w-3.5" /> {job.workMode}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">{t}</span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-5 text-xs font-medium text-zinc-700">
          <span className="inline-flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {job.salaryLabel} PA</span>
          <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {job.experienceLabel}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">View details <ArrowRight className="h-3.5 w-3.5" /></span>
        </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {jobs.map((j, i) => <JobCard key={j.id} job={j} i={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
