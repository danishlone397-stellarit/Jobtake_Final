"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, FileDown, Users } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type Stage = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED" | "WITHDRAWN";
type App = {
  id: string; stage: Stage; rating: number | null; matchScore: number | null;
  user: { id: string; name: string; email: string; headline: string | null; location: string | null };
  resumeUrl: string | null; coverLetter: string | null; createdAt: string;
};

const STAGES: Stage[] = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];

const STAGE_STYLE: Record<Stage, string> = {
  APPLIED:   "bg-zinc-100 text-zinc-600",
  SCREENING: "bg-blue-50 text-blue-700",
  INTERVIEW: "bg-violet-50 text-violet-700",
  OFFER:     "bg-amber-50 text-amber-700",
  HIRED:     "bg-emerald-50 text-emerald-700",
  REJECTED:  "bg-red-50 text-red-600",
  WITHDRAWN: "bg-zinc-100 text-zinc-500",
};

const STAGE_ACTIVE: Record<Stage, string> = {
  APPLIED:   "bg-zinc-600 text-white",
  SCREENING: "bg-blue-600 text-white",
  INTERVIEW: "bg-violet-600 text-white",
  OFFER:     "bg-amber-500 text-white",
  HIRED:     "bg-emerald-600 text-white",
  REJECTED:  "bg-red-600 text-white",
  WITHDRAWN: "bg-zinc-500 text-white",
};

const DEMO_APPLICANTS: App[] = [
  { id: "demo-1", stage: "APPLIED",   rating: null, matchScore: 87, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), resumeUrl: null, coverLetter: "I am very interested in this role and believe my background in digital marketing aligns well with your requirements.", user: { id: "d1", name: "Priya Sharma",  email: "priya.sharma@gmail.com",  headline: "Digital Marketing Executive · 3 yrs exp", location: "Mumbai, India" } },
  { id: "demo-2", stage: "SCREENING", rating: 4,    matchScore: 92, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), resumeUrl: null, coverLetter: null,                   user: { id: "d2", name: "Rahul Verma",   email: "rahul.v@outlook.com",     headline: "SEO & SEM Specialist · 5 yrs exp",      location: "Bangalore, India" } },
  { id: "demo-3", stage: "INTERVIEW", rating: 5,    matchScore: 95, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), resumeUrl: null, coverLetter: null,                   user: { id: "d3", name: "Ananya Patel",  email: "ananya.p@yahoo.com",      headline: "Growth Marketer · 4 yrs exp",           location: "Pune, India" } },
  { id: "demo-4", stage: "OFFER",     rating: 4,    matchScore: 89, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), resumeUrl: null, coverLetter: null,                   user: { id: "d4", name: "Karan Mehta",   email: "karan.m@gmail.com",       headline: "Brand & Campaign Manager · 6 yrs exp",  location: "Delhi, India" } },
  { id: "demo-5", stage: "REJECTED",  rating: 2,    matchScore: 61, createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), resumeUrl: null, coverLetter: null,                   user: { id: "d5", name: "Sneha Joshi",   email: "sneha.joshi@gmail.com",   headline: "Social Media Executive · 1 yr exp",     location: "Ahmedabad, India" } },
];

export function ApplicantsBoard({ applications }: { applications: App[] }) {
  const router = useRouter();
  const isDemo = applications.length === 0;
  const list = isDemo ? DEMO_APPLICANTS : applications;
  const [selected, setSelected] = useState<App | null>(isDemo ? DEMO_APPLICANTS[0] : null);
  const [busy, setBusy] = useState(false);

  async function updateStage(id: string, stage: Stage) {
    setBusy(true);
    await fetch(`/api/employer/applications/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }),
    });
    setBusy(false);
    router.refresh();
    if (selected?.id === id) setSelected(s => s ? { ...s, stage } : s);
  }

  async function setRating(id: string, rating: number) {
    setBusy(true);
    await fetch(`/api/employer/applications/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating }),
    });
    setBusy(false);
    router.refresh();
    if (selected?.id === id) setSelected(s => s ? { ...s, rating } : s);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-5" data-testid="applicants-list">

      {/* Left — applicant list */}
      <div className="space-y-3">
        {isDemo && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
            <span>👋</span> Demo preview — these are sample applicants. Real applicants will appear here once candidates apply.
          </div>
        )}
        {list.map(a => {
            const initials = a.user.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`w-full text-left bg-white border rounded-2xl p-5 hover:shadow-md transition-all ${selected?.id === a.id ? "border-blue-400 shadow-sm ring-2 ring-blue-100" : "border-zinc-100 shadow-sm"}`}
                data-testid={`applicant-${a.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-zinc-900 text-sm truncate">{a.user.name}</span>
                      <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-semibold ${STAGE_STYLE[a.stage]}`}>
                        {a.stage.toLowerCase()}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 truncate">
                      {a.user.headline || a.user.email}{a.user.location ? ` · ${a.user.location}` : ""}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
                      <span>{a.matchScore ? `${a.matchScore}% match` : "—"}</span>
                      <span>·</span>
                      <span>Applied {timeAgo(a.createdAt)}</span>
                      {a.rating ? (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: a.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Right — detail panel */}
      <aside className="lg:sticky lg:top-6 h-fit">
        {!selected ? (
          <div className="bg-white border border-zinc-100 rounded-2xl p-8 text-center shadow-sm" data-testid="applicant-detail-empty">
            <p className="text-zinc-400 text-sm">Select an applicant to manage their stage, rating and notes.</p>
          </div>
        ) : (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-5" data-testid="applicant-detail">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold shrink-0">
                {selected.user.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-zinc-900 text-base">{selected.user.name}</div>
                <div className="text-xs text-zinc-500">{selected.user.email}</div>
                {selected.user.headline && <div className="text-xs text-zinc-400 mt-0.5">{selected.user.headline}</div>}
              </div>
            </div>

            {/* Pipeline Stage */}
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Pipeline Stage</div>
              <div className="grid grid-cols-3 gap-1.5">
                {STAGES.map(s => (
                  <button
                    key={s}
                    disabled={busy}
                    onClick={() => updateStage(selected.id, s)}
                    className={`text-[11px] rounded-lg px-2 py-2 font-semibold transition-all ${selected.stage === s ? STAGE_ACTIVE[s] : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
                    data-testid={`stage-${s}`}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Rating</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} disabled={busy} onClick={() => setRating(selected.id, n)} data-testid={`rate-${n}`}>
                    <Star className={`h-6 w-6 transition-colors ${(selected.rating || 0) >= n ? "text-amber-400 fill-amber-400" : "text-zinc-200 hover:text-amber-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Resume */}
            {selected.resumeUrl && (
              <a
                href={selected.resumeUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-zinc-50 transition"
                data-testid="download-resume"
              >
                <FileDown className="h-4 w-4" /> View Resume
              </a>
            )}

            {/* Cover letter */}
            {selected.coverLetter && (
              <div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Cover Letter</div>
                <p className="text-sm text-zinc-700 whitespace-pre-wrap bg-zinc-50 rounded-xl p-3 border border-zinc-100 leading-relaxed">
                  {selected.coverLetter}
                </p>
              </div>
            )}

            {busy && (
              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
