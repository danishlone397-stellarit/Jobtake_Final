"use client";
import { DashboardShell } from "@/components/DashboardShell";
import { useState } from "react";
import { Bookmark, Search, SlidersHorizontal, Briefcase, MapPin, Clock, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";

type SavedJob = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  employmentType: string;
  location: string;
  postedAgo: string;
  savedAgo: string;
  slug: string;
};

const DEMO_SAVED: SavedJob[] = [
  { id: "1", title: "Product Designer",    company: "Acme Corp",  companyInitials: "AC", companyColor: "bg-teal-700",    employmentType: "Full-time", location: "Bengaluru, India",  postedAgo: "Posted 2 days ago",  savedAgo: "Saved 2 days ago",  slug: "#" },
  { id: "2", title: "UI/UX Designer",      company: "InnovateX",  companyInitials: "IX", companyColor: "bg-emerald-700", employmentType: "Full-time", location: "Remote",             postedAgo: "Posted 3 days ago",  savedAgo: "Saved 3 days ago",  slug: "#" },
  { id: "3", title: "Senior Visual Designer", company: "Microsoft", companyInitials: "MS", companyColor: "bg-blue-600",  employmentType: "Full-time", location: "Hyderabad, India",  postedAgo: "Posted 5 days ago",  savedAgo: "Saved 5 days ago",  slug: "#" },
  { id: "4", title: "Interaction Designer", company: "InVision",  companyInitials: "IN", companyColor: "bg-rose-600",    employmentType: "Full-time", location: "Remote",             postedAgo: "Posted 1 week ago",  savedAgo: "Saved 1 week ago",  slug: "#" },
  { id: "5", title: "Product Designer",    company: "Spotify",    companyInitials: "SP", companyColor: "bg-emerald-600", employmentType: "Full-time", location: "Mumbai, India",     postedAgo: "Posted 1 week ago",  savedAgo: "Saved 1 week ago",  slug: "#" },
];

export default function SavedJobsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recently Saved");

  const filtered = DEMO_SAVED.filter(j =>
    !search ||
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell role="SEEKER" current="/dashboard/saved">

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

      {/* Demo notice */}
      <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
        <span>👋</span> Demo preview — these are sample saved jobs. Save real jobs while browsing to see them here.
      </div>

      {/* Top bar — count card + search + filter + sort */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">

        {/* Count card */}
        <div className="bg-white border border-zinc-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-4 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bookmark className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-black text-zinc-900">{DEMO_SAVED.length}</div>
            <div className="text-xs font-semibold text-zinc-500">Saved Jobs</div>
            <div className="text-[11px] text-zinc-400">Jobs you&apos;ve bookmarked</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search saved jobs..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
          />
        </div>

        {/* Filter */}
        <button className="flex items-center gap-2 text-sm font-semibold text-zinc-600 border border-zinc-200 bg-white px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition shrink-0">
          <SlidersHorizontal className="h-4 w-4" /> Filter
        </button>

        {/* Sort */}
        <div className="relative shrink-0">
          <button className="flex items-center gap-2 text-sm font-semibold text-zinc-600 border border-zinc-200 bg-white px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition">
            <SlidersHorizontal className="h-3.5 w-3.5" /> {sort} <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Job list */}
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden" data-testid="saved-jobs-list">
        <div className="divide-y divide-zinc-50">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Bookmark className="h-8 w-8 mx-auto text-zinc-200 mb-3" />
              <p className="text-sm text-zinc-400">No saved jobs found.</p>
            </div>
          ) : filtered.map(j => (
            <div key={j.id} className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-50 transition-colors" data-testid={`saved-${j.id}`}>

              {/* Logo */}
              <div className={`h-14 w-14 rounded-xl ${j.companyColor} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                {j.companyInitials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-zinc-900 text-base">{j.title}</div>
                <div className="text-sm font-semibold text-blue-600 mt-0.5">{j.company}</div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-zinc-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-400" /> {j.employmentType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" /> {j.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" /> {j.postedAgo}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <button className="h-9 w-9 rounded-xl border border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition">
                    <Bookmark className="h-4 w-4 text-blue-600 fill-blue-600" />
                  </button>
                  <a href={j.slug}
                    className="flex items-center gap-1.5 bg-white border border-zinc-200 text-zinc-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition">
                    View Job
                  </a>
                </div>
                <div className="text-xs text-zinc-400">{j.savedAgo}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Showing 1 to {filtered.length} of {DEMO_SAVED.length} saved jobs</span>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
            </button>
            {[1, 2].map(n => (
              <button key={n} className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${n === 1 ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>{n}</button>
            ))}
            <button className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 flex items-center justify-center">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

    </DashboardShell>
  );
}
