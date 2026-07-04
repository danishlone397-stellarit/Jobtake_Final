"use client";
import { DashboardShell } from "@/components/DashboardShell";
import { useState } from "react";
import Link from "next/link";
import {
  Briefcase, Bookmark, Eye, Send, Search, SlidersHorizontal,
  Building2, MapPin, Calendar, Clock, ChevronRight, ArrowRight,
} from "lucide-react";

type AppStage = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED" | "WITHDRAWN";

type DemoApp = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  companyLogoUrl?: string;
  employmentType: string;
  location: string;
  appliedDate: string;
  appliedAgo: string;
  stage: AppStage;
  stageLabel: string;
  stageDesc: string;
  nextStep: string | null;
  nextStepDate: string | null;
};

const DEMO_APPS: DemoApp[] = [
  {
    id: "1", title: "Product Designer", company: "Acme Corp", companyInitials: "AC",
    companyColor: "bg-teal-700", employmentType: "Full-time", location: "Bengaluru, India",
    appliedDate: "01 Jul, 2025", appliedAgo: "2 days ago",
    stage: "SCREENING", stageLabel: "In Review", stageDesc: "Resume under review",
    nextStep: "Assessment", nextStepDate: "Expected by 08 Jul, 2025",
  },
  {
    id: "2", title: "UI/UX Designer", company: "InnovateX", companyInitials: "IX",
    companyColor: "bg-emerald-700", employmentType: "Full-time", location: "Remote",
    appliedDate: "28 Jun, 2025", appliedAgo: "6 days ago",
    stage: "APPLIED", stageLabel: "No Reply Yet", stageDesc: "Awaiting response",
    nextStep: null, nextStepDate: null,
  },
  {
    id: "3", title: "Senior Visual Designer", company: "Microsoft", companyInitials: "MS",
    companyColor: "bg-blue-600", employmentType: "Full-time", location: "Hyderabad, India",
    appliedDate: "20 Jun, 2025", appliedAgo: "14 days ago",
    stage: "INTERVIEW", stageLabel: "In Review", stageDesc: "HR review in progress",
    nextStep: "Interview", nextStepDate: "Expected by 10 Jul, 2025",
  },
  {
    id: "4", title: "Interaction Designer", company: "InVision", companyInitials: "IN",
    companyColor: "bg-rose-600", employmentType: "Full-time", location: "Remote",
    appliedDate: "15 Jun, 2025", appliedAgo: "19 days ago",
    stage: "APPLIED", stageLabel: "No Reply Yet", stageDesc: "Awaiting response",
    nextStep: null, nextStepDate: null,
  },
  {
    id: "5", title: "Product Designer", company: "Spotify", companyInitials: "SP",
    companyColor: "bg-emerald-600", employmentType: "Full-time", location: "Mumbai, India",
    appliedDate: "10 Jun, 2025", appliedAgo: "24 days ago",
    stage: "SCREENING", stageLabel: "In Review", stageDesc: "Screening in progress",
    nextStep: "Interview", nextStepDate: "Expected by 12 Jul, 2025",
  },
];

const STAGE_BADGE: Record<string, string> = {
  "In Review":    "bg-blue-50 text-blue-700",
  "No Reply Yet": "bg-amber-50 text-amber-700",
  "Interview":    "bg-violet-50 text-violet-700",
  "Offer":        "bg-emerald-50 text-emerald-700",
  "Hired":        "bg-emerald-100 text-emerald-800",
  "Rejected":     "bg-red-50 text-red-600",
};

type Tab = "All Applications" | "In Review" | "No Reply Yet" | "Archived";

export default function ApplicationsPage() {
  const [tab, setTab] = useState<Tab>("All Applications");
  const [search, setSearch] = useState("");

  const inReviewCount   = DEMO_APPS.filter(a => a.stageLabel === "In Review").length;
  const noReplyCount    = DEMO_APPS.filter(a => a.stageLabel === "No Reply Yet").length;

  const filtered = DEMO_APPS.filter(a => {
    if (tab === "In Review"    && a.stageLabel !== "In Review")    return false;
    if (tab === "No Reply Yet" && a.stageLabel !== "No Reply Yet") return false;
    if (tab === "Archived"     && a.stage !== "REJECTED" && a.stage !== "WITHDRAWN") return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) &&
        !a.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs: { label: Tab; count: number }[] = [
    { label: "All Applications", count: DEMO_APPS.length },
    { label: "In Review",        count: inReviewCount },
    { label: "No Reply Yet",     count: noReplyCount },
    { label: "Archived",         count: 0 },
  ];

  return (
    <DashboardShell role="SEEKER" current="/dashboard/applications">

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400 font-semibold">My Applications</p>
        <h1 className="text-3xl font-black text-zinc-900 mt-1">Track your applications in one place</h1>
        <p className="text-sm text-zinc-500 mt-1">Stay updated on every opportunity you&apos;ve applied to.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: <Briefcase className="h-5 w-5 text-blue-600" />,  bg: "bg-blue-50",    value: DEMO_APPS.length, label: "Jobs Applied",   sub: "View all applications →" },
          { icon: <Bookmark className="h-5 w-5 text-teal-600" />,   bg: "bg-teal-50",    value: 7,                label: "Saved Jobs",     sub: "Jobs you've saved" },
          { icon: <Eye className="h-5 w-5 text-violet-600" />,      bg: "bg-violet-50",  value: inReviewCount,    label: "In Review",      sub: "Applications under review" },
          { icon: <Send className="h-5 w-5 text-orange-500" />,     bg: "bg-orange-50",  value: noReplyCount,     label: "No Reply Yet",   sub: "Awaiting response" },
        ].map(({ icon, bg, value, label, sub }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>{icon}</div>
            <div className="text-2xl font-black text-zinc-900">{value}</div>
            <div className="text-xs font-semibold text-zinc-600 mt-0.5">{label}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Demo notice */}
      <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
        <span>👋</span> Demo preview — these are sample applications. Real applications will appear here once you apply to jobs.
      </div>

      {/* Table card */}
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden" data-testid="applications-table">

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 pt-5 pb-0">
          <div className="flex gap-0 border-b border-zinc-100 -mb-px">
            {tabs.map(t => (
              <button
                key={t.label}
                onClick={() => setTab(t.label)}
                className={`text-sm font-semibold pb-3 pr-6 border-b-2 transition-colors whitespace-nowrap ${tab === t.label ? "text-blue-600 border-blue-600" : "text-zinc-400 border-transparent hover:text-zinc-600"}`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === t.label ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search applications..."
                className="pl-8 pr-4 py-2 text-sm border border-zinc-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 w-52"
              />
            </div>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 border border-zinc-200 px-3 py-2 rounded-xl hover:bg-zinc-50 transition">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </button>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-zinc-100 bg-zinc-50">
          {["Role / Company", "Applied On", "Status", "Next Step"].map(h => (
            <div key={h} className="text-[11px] uppercase tracking-[0.14em] text-zinc-400 font-semibold">{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="h-8 w-8 mx-auto text-zinc-200 mb-3" />
              <p className="text-sm text-zinc-400">No applications match.</p>
            </div>
          ) : filtered.map(a => (
            <div key={a.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors items-center" data-testid={`app-${a.id}`}>

              {/* Role / Company */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-11 w-11 rounded-xl ${a.companyColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {a.companyInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-900 text-sm truncate">{a.title}</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{a.company}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{a.employmentType}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.location}</span>
                  </div>
                </div>
              </div>

              {/* Applied On */}
              <div>
                <div className="text-sm text-zinc-700 font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />{a.appliedDate}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">{a.appliedAgo}</div>
              </div>

              {/* Status */}
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_BADGE[a.stageLabel] ?? "bg-zinc-100 text-zinc-600"}`}>
                  {a.stageLabel}
                </span>
                <div className="text-xs text-zinc-400 mt-1">{a.stageDesc}</div>
              </div>

              {/* Next Step */}
              <div className="flex items-center justify-between">
                {a.nextStep ? (
                  <div>
                    <div className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />{a.nextStep}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">{a.nextStepDate}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />No update yet
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">We&apos;ll notify you</div>
                  </div>
                )}
                <ChevronRight className="h-4 w-4 text-zinc-300 shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Showing 1 to {filtered.length} of {DEMO_APPS.length} applications</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(n => (
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
