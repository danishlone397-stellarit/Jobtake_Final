"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, FileDown } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type Stage = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED" | "WITHDRAWN";
type App = {
  id: string; stage: Stage; rating: number | null; matchScore: number | null;
  user: { id: string; name: string; email: string; headline: string | null; location: string | null };
  resumeUrl: string | null; coverLetter: string | null; createdAt: string;
};

const STAGES: Stage[] = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];
const STAGE_COLORS: Record<Stage, string> = {
  APPLIED: "from-zinc-400 to-zinc-500",
  SCREENING: "from-brand-blue to-violet-500",
  INTERVIEW: "from-violet-500 to-fuchsia-500",
  OFFER: "from-brand-orange to-amber-500",
  HIRED: "from-emerald-500 to-teal-500",
  REJECTED: "from-rose-500 to-red-600",
  WITHDRAWN: "from-zinc-500 to-zinc-600",
};

export function ApplicantsBoard({ applications }: { applications: App[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<App | null>(null);
  const [busy, setBusy] = useState(false);

  async function updateStage(id: string, stage: Stage) {
    setBusy(true);
    await fetch(`/api/employer/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) });
    setBusy(false);
    router.refresh();
    if (selected?.id === id) setSelected({ ...selected, stage });
  }

  async function setRating(id: string, rating: number) {
    setBusy(true);
    await fetch(`/api/employer/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating }) });
    setBusy(false);
    router.refresh();
    if (selected?.id === id) setSelected({ ...selected, rating });
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-3" data-testid="applicants-list">
        {applications.length === 0 && <div className="glass rounded-3xl p-10 text-center text-zinc-500 text-sm">No applicants yet — share the role to attract candidates.</div>}
        {applications.map(a => (
          <button key={a.id} onClick={() => setSelected(a)} className={`w-full text-left glass rounded-3xl p-5 hover:-translate-y-0.5 transition ${selected?.id === a.id ? "ring-2 ring-brand-blue/30" : ""}`} data-testid={`applicant-${a.id}`}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange grid place-items-center text-white font-semibold">{a.user.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="font-display font-medium text-zinc-950 text-base truncate">{a.user.name}</div>
                  <span className={`text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-gradient-to-r ${STAGE_COLORS[a.stage]} text-white font-medium`}>{a.stage.toLowerCase()}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">{a.user.headline || a.user.email}{a.user.location ? ` · ${a.user.location}` : ""}</div>
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  <span>{a.matchScore || "—"}% match</span>
                  <span>·</span>
                  <span>applied {timeAgo(a.createdAt)}</span>
                  {a.rating && <><span>·</span><span className="inline-flex items-center gap-0.5 text-amber-600">{Array.from({ length: a.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</span></>}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <aside className="lg:sticky lg:top-6 h-fit">
        {!selected ? (
          <div className="glass rounded-3xl p-6 text-sm text-zinc-500" data-testid="applicant-detail-empty">Select an applicant to manage their stage, rating and notes.</div>
        ) : (
          <div className="glass-strong rounded-3xl p-6 space-y-4" data-testid="applicant-detail">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">Candidate</div>
              <div className="font-display text-xl font-medium text-zinc-950 mt-1">{selected.user.name}</div>
              <div className="text-sm text-zinc-600">{selected.user.email}</div>
              {selected.user.headline && <div className="text-xs text-zinc-500 mt-1">{selected.user.headline}</div>}
            </div>
            <div>
              <div className="label">Pipeline stage</div>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {STAGES.map(s => (
                  <button key={s} disabled={busy} onClick={() => updateStage(selected.id, s)}
                    className={`text-[11px] rounded-full px-2 py-2 transition-all ${selected.stage === s ? `btn-primary text-white` : "glass text-zinc-700 hover:bg-white/90"}`}
                    data-testid={`stage-${s}`}
                  >
                    {s.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="label">Rating</div>
              <div className="mt-1 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} disabled={busy} onClick={() => setRating(selected.id, n)} data-testid={`rate-${n}`}>
                    <Star className={`h-5 w-5 transition-colors ${(selected.rating || 0) >= n ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            {selected.resumeUrl && (
              <a href={selected.resumeUrl} target="_blank" rel="noreferrer" className="btn-glass rounded-full px-4 py-2 text-sm font-medium inline-flex items-center gap-2 w-fit" data-testid="download-resume">
                <FileDown className="h-4 w-4" /> View resume
              </a>
            )}
            {selected.coverLetter && (
              <div>
                <div className="label">Cover letter</div>
                <p className="mt-1 text-sm text-zinc-700 whitespace-pre-wrap bg-white/60 rounded-2xl p-3 border border-zinc-200/60">{selected.coverLetter}</p>
              </div>
            )}
            {busy && <div className="text-xs text-zinc-500 flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" /> Saving…</div>}
          </div>
        )}
      </aside>
    </div>
  );
}
