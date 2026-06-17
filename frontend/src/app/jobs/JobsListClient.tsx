"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Briefcase, BadgeDollarSign, Sparkles, Search } from "lucide-react";
import { formatSalary, timeAgo } from "@/lib/utils";

type Job = {
  id: string; slug: string; title: string; location: string;
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  seniority: string; salaryMin: number | null; salaryMax: number | null;
  salaryCurrency: string; salaryPeriod: string;
  collarType: string | null;
  featured: boolean; publishedAt: string | null;
  company: { name: string; slug: string; logoUrl: string | null };
  category: { name: string; slug: string } | null;
  skills: string[];
};

const COLLAR_BADGE: Record<string, { label: string; className: string }> = {
  WHITE: { label: "🏢 White-Collar", className: "bg-blue-100 text-blue-700" },
  BLUE:  { label: "🔧 Blue-Collar",  className: "bg-sky-100 text-sky-700" },
  PINK:  { label: "🌸 Pink-Collar",  className: "bg-pink-100 text-pink-700" },
  GREY:  { label: "⚙️ Grey-Collar",  className: "bg-zinc-200 text-zinc-700" },
  MSME:  { label: "🏭 MSME",         className: "bg-orange-100 text-orange-700" },
};

type Cat = { id: string; name: string; slug: string };

const PALETTE = [
  "from-brand-blue to-violet-500", "from-violet-500 to-fuchsia-500",
  "from-brand-orange to-amber-500", "from-emerald-500 to-teal-500",
  "from-indigo-500 to-blue-500", "from-rose-500 to-pink-500",
];

export function JobsListClient({
  initialFilters, jobs, total, page, perPage, categories,
}: {
  initialFilters: { q: string; location: string; category: string; workMode: string; seniority: string; collarType: string };
  jobs: Job[]; total: number; page: number; perPage: number; categories: Cat[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startT] = useTransition();
  const [filters, setFilters] = useState(initialFilters);

  function apply() {
    const p = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(filters)) {
      if (v) p.set(k, v); else p.delete(k);
    }
    p.delete("page");
    startT(() => router.push(`/jobs?${p.toString()}`));
  }

  function clear() {
    setFilters({ q: "", location: "", category: "", workMode: "", seniority: "", collarType: "" });
    startT(() => router.push("/jobs"));
  }

  const pages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="mt-10 grid lg:grid-cols-[280px_1fr] gap-8">
      <aside className="glass rounded-3xl p-6 h-fit sticky top-28 hidden lg:block" data-testid="filters-sidebar">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-4">Filters</div>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="f-q">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input id="f-q" className="input pl-9" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="role, company, skill" data-testid="filter-q" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="f-loc">Location</label>
            <input id="f-loc" className="input" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="Remote, Berlin…" data-testid="filter-location" />
          </div>
          <div>
            <label className="label" htmlFor="f-cat">Category</label>
            <select id="f-cat" className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} data-testid="filter-category">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-mode">Work mode</label>
            <select id="f-mode" className="input" value={filters.workMode} onChange={(e) => setFilters({ ...filters, workMode: e.target.value })} data-testid="filter-mode">
              <option value="">Any</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-sen">Seniority</label>
            <select id="f-sen" className="input" value={filters.seniority} onChange={(e) => setFilters({ ...filters, seniority: e.target.value })} data-testid="filter-seniority">
              <option value="">Any level</option>
              {["INTERN", "ENTRY", "MID", "SENIOR", "STAFF", "PRINCIPAL", "DIRECTOR", "EXECUTIVE"].map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-collar">Job Type</label>
            <select id="f-collar" className="input" value={filters.collarType} onChange={(e) => setFilters({ ...filters, collarType: e.target.value })}>
              <option value="">All types</option>
              <option value="WHITE">🏢 White-Collar</option>
              <option value="BLUE">🔧 Blue-Collar</option>
              <option value="PINK">🌸 Pink-Collar</option>
              <option value="GREY">⚙️ Grey-Collar</option>
              <option value="MSME">🏭 MSME</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={apply} className="btn-primary rounded-full px-4 py-2 text-sm font-medium flex-1" data-testid="filter-apply">Apply</button>
            <button onClick={clear} className="btn-glass rounded-full px-4 py-2 text-sm font-medium" data-testid="filter-clear">Reset</button>
          </div>
        </div>
      </aside>

      <div>
        {jobs.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Sparkles className="h-8 w-8 mx-auto text-zinc-400" />
            <h3 className="font-display mt-4 text-xl font-medium">No roles match those filters yet</h3>
            <p className="text-zinc-500 mt-2 text-sm">Try widening your search or clearing filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((j, i) => (
              <motion.div key={j.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                whileHover={{ y: -2 }}
              >
                <Link href={`/jobs/${j.slug}`} className="glass block rounded-3xl p-6 md:p-7 group" data-testid={`job-card-${j.id}`}>
                  <div className="flex items-start gap-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${PALETTE[i % PALETTE.length]} grid place-items-center text-white font-bold text-xl shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_24px_-8px_rgba(99,71,250,0.45)]`}>
                      {j.company.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-xs text-zinc-500 font-medium">{j.company.name}</div>
                        {j.featured && <span className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-orange/15 to-amber-500/15 text-amber-700 border border-amber-200/60">Featured</span>}
                        {j.collarType && COLLAR_BADGE[j.collarType] && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${COLLAR_BADGE[j.collarType].className}`}>{COLLAR_BADGE[j.collarType].label}</span>
                        )}
                        {j.publishedAt && <span className="text-[11px] text-zinc-400">· {timeAgo(j.publishedAt)}</span>}
                      </div>
                      <h3 className="font-display font-medium text-zinc-950 text-xl mt-1 leading-tight tracking-tight group-hover:text-brand-blue transition-colors">{j.title}</h3>
                      <div className="mt-3 flex items-center gap-4 text-sm text-zinc-600 flex-wrap">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>
                        <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {j.workMode.toLowerCase()}</span>
                        <span className="inline-flex items-center gap-1.5"><BadgeDollarSign className="h-3.5 w-3.5" /> {formatSalary(j.salaryMin, j.salaryMax, j.salaryCurrency, j.salaryPeriod)}</span>
                        <span className="text-zinc-400">·</span>
                        <span className="text-zinc-500">{j.seniority.charAt(0) + j.seniority.slice(1).toLowerCase()}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {j.skills.map(s => <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100/80 text-zinc-700 border border-zinc-200/60">{s}</span>)}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 10).map((p) => {
              const params = new URLSearchParams(sp);
              params.set("page", String(p));
              return (
                <Link key={p} href={`/jobs?${params.toString()}`} className={`h-9 min-w-9 px-3 rounded-full grid place-items-center text-sm ${p === page ? "btn-primary text-white" : "glass text-zinc-700"}`} data-testid={`page-${p}`}>
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
