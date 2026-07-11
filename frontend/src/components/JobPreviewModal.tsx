"use client";
import Link from "next/link";
import { X, Building2, MapPin, Briefcase, ExternalLink } from "lucide-react";

export type PreviewJob = {
  title: string;
  company: string;
  logoUrl: string | null;
  employmentType: string;
  location: string;
  slug?: string;
  extra?: string;
};

export function JobPreviewModal({ job, onClose }: { job: PreviewJob | null; onClose: () => void }) {
  if (!job) return null;
  const initials = job.company.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const href = job.slug && job.slug !== "#" ? `/jobs/${job.slug}` : `/jobs?q=${encodeURIComponent(job.title)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          {job.logoUrl ? (
            <img src={job.logoUrl} alt="" className="h-14 w-14 rounded-xl object-contain border border-zinc-100" />
          ) : (
            <div className="h-14 w-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">{initials}</div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-zinc-900 text-lg truncate">{job.title}</div>
            <div className="text-sm font-semibold text-blue-600 truncate">{job.company}</div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 text-sm text-zinc-600">
          <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-zinc-400" /> {job.company}</div>
          <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-zinc-400" /> {job.employmentType}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-zinc-400" /> {job.location}</div>
          {job.extra && <div className="text-xs text-zinc-400 pt-1">{job.extra}</div>}
        </div>

        <Link
          href={href}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
        >
          View Full Listing <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
