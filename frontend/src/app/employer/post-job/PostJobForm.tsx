"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

type Cat = { id: string; name: string };

export function PostJobForm({ categories, isAdmin }: { categories: Cat[]; isAdmin: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", responsibilities: "", requirements: "", benefits: "",
    location: "", workMode: "REMOTE", employmentType: "FULL_TIME", seniority: "MID",
    salaryMin: "", salaryMax: "", salaryCurrency: "USD", categoryId: "", skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const body = {
      ...form,
      salaryMin: form.salaryMin ? parseInt(form.salaryMin, 10) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax, 10) : undefined,
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
      categoryId: form.categoryId || undefined,
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
        <label className="label">About the role *</label>
        <textarea className="input min-h-[140px]" required value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What's the mission? Who is the team?" data-testid="job-description" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Responsibilities</label>
          <textarea className="input" value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} />
        </div>
        <div>
          <label className="label">Requirements</label>
          <textarea className="input" value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Benefits</label>
        <textarea className="input" value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label">Location *</label>
          <input className="input" required value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Remote · Europe" />
        </div>
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
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Salary min</label>
          <input type="number" className="input" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="80000" />
        </div>
        <div>
          <label className="label">Salary max</label>
          <input type="number" className="input" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="160000" />
        </div>
      </div>
      <div>
        <label className="label">Skills (comma separated)</label>
        <input className="input" value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, TypeScript, GraphQL" />
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
