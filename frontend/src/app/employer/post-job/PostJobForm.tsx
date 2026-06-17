"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

type Cat = { id: string; name: string };

export function PostJobForm({ categories, isAdmin }: { categories: Cat[]; isAdmin: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", roleDetails: "", benefits: "",
    location: "", industry: "", ctc: "",
    workMode: "REMOTE", employmentType: "FULL_TIME", seniority: "MID",
    salaryMin: "", salaryMax: "", salaryCurrency: "INR", salaryPeriod: "month",
    categoryId: "", skills: "",
  });
  const roleDetailsWordCount = form.roleDetails.trim() === "" ? 0 : form.roleDetails.trim().split(/\s+/).length;
  const WORD_LIMIT = 500;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const body = {
      title: form.title,
      description: form.description,
      responsibilities: form.roleDetails,
      requirements: form.roleDetails,
      benefits: form.benefits,
      location: form.location,
      industry: form.industry,
      workMode: form.workMode,
      employmentType: form.employmentType,
      seniority: form.seniority,
      salaryMin: form.salaryMin ? parseInt(form.salaryMin, 10) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax, 10) : undefined,
      salaryCurrency: form.salaryCurrency,
      salaryPeriod: form.salaryPeriod,
      categoryId: form.categoryId || undefined,
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
    };
    const res = await fetch("/api/employer/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Failed to post"); return; }
    router.push(isAdmin ? "/admin/jobs" : "/employer/jobs"); router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-6 md:p-8 space-y-5" data-testid="post-job-form">
      <div>
        <label className="label">Title *</label>
        <input className="input" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Staff Frontend Engineer" data-testid="job-title" />
      </div>
      <div>
        <label className="label">About the Role *</label>
        <textarea className="input min-h-[120px]" required value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What's the mission? Who is the team?" data-testid="job-description" />
      </div>
      <div>
        <label className="label">Roles, Responsibilities & Requirements</label>
        <textarea
          className={`input min-h-[160px] ${roleDetailsWordCount > WORD_LIMIT ? "border-red-400" : ""}`}
          value={form.roleDetails}
          onChange={(e) => set("roleDetails", e.target.value)}
          placeholder="Describe the roles, responsibilities, and requirements for this position..."
        />
        <div className={`text-xs mt-1 text-right ${roleDetailsWordCount > WORD_LIMIT ? "text-red-500 font-semibold" : "text-zinc-400"}`}>
          {roleDetailsWordCount} / {WORD_LIMIT} words
        </div>
      </div>
      <div>
        <label className="label">Skills (comma separated)</label>
        <input className="input" value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, TypeScript, GraphQL" />
      </div>
      <div>
        <label className="label">Benefits</label>
        <textarea className="input" value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label">Location *</label>
          <input className="input" required value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Mumbai, India" />
        </div>
        <div>
          <label className="label">Industry</label>
          <input className="input" value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="IT, Finance, Healthcare..." />
        </div>
        <div>
          <label className="label">CTC (e.g. 12 LPA)</label>
          <input className="input" value={form.ctc} onChange={(e) => set("ctc", e.target.value)} placeholder="12 LPA" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label">Work mode</label>
          <select className="input" value={form.workMode} onChange={(e) => set("workMode", e.target.value)}>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>
        <div>
          <label className="label">Employment</label>
          <select className="input" value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="TEMPORARY">Temporary</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label">Seniority</label>
          <select className="input" value={form.seniority} onChange={(e) => set("seniority", e.target.value)}>
            {["INTERN","ENTRY","MID","SENIOR","STAFF","PRINCIPAL","DIRECTOR","EXECUTIVE"].map(s => <option key={s} value={s}>{s.charAt(0)+s.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            <option value="">Uncategorized</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Currency</label>
          <select className="input" value={form.salaryCurrency} onChange={(e) => set("salaryCurrency", e.target.value)}>
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="INR">INR</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label">Salary min</label>
          <input type="number" className="input" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="30000" />
        </div>
        <div>
          <label className="label">Salary max</label>
          <input type="number" className="input" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="80000" />
        </div>
        <div>
          <label className="label">Salary Period</label>
          <select className="input" value={form.salaryPeriod} onChange={(e) => set("salaryPeriod", e.target.value)}>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</div>}
      <div className="pt-2 flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2" data-testid="submit-job">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} <Sparkles className="h-4 w-4" /> {isAdmin ? "Publish role" : "Submit for review"}
        </button>
      </div>
    </form>
  );
}
