"use client";
import { useState } from "react";
import Link from "next/link";
import { Bookmark, Search, SlidersHorizontal, Briefcase, MapPin, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  company: string;
  logoUrl: string | null;
  slug: string;
  employmentType: string;
  location: string;
  savedAt: string;
  postedAt: string;
};

const LOGO_COLORS = [
  "bg-teal-700", "bg-emerald-700", "bg-blue-600", "bg-rose-600",
  "bg-violet-600", "bg-orange-600", "bg-indigo-600", "bg-pink-600",
];

const DEMO_JOBS: Job[] = [
  { id: "d1", title: "Product Designer",       company: "Acme Corp",  logoUrl: null, slug: "#", employmentType: "Full-time", location: "Bengaluru, India",  savedAt: new Date(Date.now() - 2*86400000).toISOString(), postedAt: new Date(Date.now() - 2*86400000).toISOString() },
  { id: "d2", title: "UI/UX Designer",         company: "InnovateX",  logoUrl: null, slug: "#", employmentType: "Full-time", location: "Remote",            savedAt: new Date(Date.now() - 3*86400000).toISOString(), postedAt: new Date(Date.now() - 3*86400000).toISOString() },
  { id: "d3", title: "Senior Visual Designer", company: "Microsoft",  logoUrl: null, slug: "#", employmentType: "Full-time", location: "Hyderabad, India",  savedAt: new Date(Date.now() - 5*86400000).toISOString(), postedAt: new Date(Date.now() - 5*86400000).toISOString() },
  { id: "d4", title: "Interaction Designer",   company: "InVision",   logoUrl: null, slug: "#", employmentType: "Full-time", location: "Remote",            savedAt: new Date(Date.now() - 7*86400000).toISOString(), postedAt: new Date(Date.now() - 7*86400000).toISOString() },
  { id: "d5", title: "Product Designer",       company: "Spotify",    logoUrl: null, slug: "#", employmentType: "Full-time", location: "Mumbai, India",     savedAt: new Date(Date.now() - 7*86400000).toISOString(), postedAt: new Date(Date.now() - 7*86400000).toISOString() },
];

export function SavedJobsClient({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const isDemo = jobs.length === 0;
  const list = isDemo ? DEMO_JOBS : jobs;

  const filtered = list.filter(j =>
    !search ||
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
          <Bookmark className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400 font-semibold">Saved Jobs</p>
          <h1 className="text-2xl font-black text-zinc-900">Jobs you&apos;ve saved</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Keep track of opportunities you&apos;re interested in and apply when you&apos;re ready.</p>
        </div>
      </div>

      {isDemo && (
        <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
          <span>👋</span> Demo preview — these are sample saved jobs. Save real jobs while browsing to see them here.
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        {/* Count card */}
        <div className="bg-white border border-zinc-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-4 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bookmark className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-black text-zinc-900">{list.length}</div>
            <div className="text-xs font-semibold text-zinc-500">Saved Jobs</div>
            <div className="text-[11px] text-zinc-400">Jobs you&apos;ve bookmarked</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search saved jobs..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
          />
        </div>

        <button className="flex items-center gap-2 text-sm font-semibold text-zinc-600 border border-zinc-200 bg-white px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition shrink-0">
          <SlidersHorizontal className="h-4 w-4" /> Filter
        </button>

        <button className="flex items-center gap-2 text-sm font-semibold text-zinc-600 border border-zinc-200 bg-white px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition shrink-0">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Recently Saved ▾
        </button>
      </div>

      {/* Job list */}
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden" data-testid="saved-jobs-list">
        <div className="divide-y divide-zinc-50">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Bookmark className="h-8 w-8 mx-auto text-zinc-200 mb-3" />
              <p className="text-sm text-zinc-400">No saved jobs found.</p>
            </div>
          ) : filtered.map((j, i) => {
            const initials = j.company.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
            const color = LOGO_COLORS[i % LOGO_COLORS.length];
            return (
              <div key={j.id} className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-50 transition-colors" data-testid={`saved-${j.id}`}>
                {j.logoUrl ? (
                  <img src={j.logoUrl} alt="" className="h-14 w-14 rounded-xl object-contain border border-zinc-100 shrink-0" />
                ) : (
                  <div className={`h-14 w-14 rounded-xl ${color} flex items-center justify-center text-white font-bold text-base shrink-0`}>{initials}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-zinc-900 text-base">{j.title}</div>
                  <div className="text-sm font-semibold text-blue-600 mt-0.5">{j.company}</div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-zinc-500 flex-wrap">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-zinc-400" />{j.employmentType}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-zinc-400" />{j.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-zinc-400" />Posted {timeAgo(j.postedAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <button className="h-9 w-9 rounded-xl border border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition">
                      <Bookmark className="h-4 w-4 text-blue-600 fill-blue-600" />
                    </button>
                    <Link href={`/jobs/${j.slug}`}
                      className="flex items-center gap-1.5 bg-white border border-zinc-200 text-zinc-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition">
                      View Job
                    </Link>
                  </div>
                  <div className="text-xs text-zinc-400">Saved {timeAgo(j.savedAt)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Showing 1 to {filtered.length} of {list.length} saved jobs</span>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></button>
            {[1, 2].map(n => (
              <button key={n} className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${n === 1 ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>{n}</button>
            ))}
            <button className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 flex items-center justify-center"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </>
  );
}
