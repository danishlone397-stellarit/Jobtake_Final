"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Briefcase, ChevronRight, ChevronLeft } from "lucide-react";

type Cat = { id: string; name: string };

const COLLAR_OPTIONS = [
  {
    value: "WHITE",
    label: "White-Collar Jobs",
    desc: "Office-based professional roles in corporate environments.",
    tags: "Corporate · Professional · Desk Jobs",
    emoji: "🏢",
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    border: "border-blue-300",
    iconBg: "bg-blue-600",
    text: "text-blue-700",
    activeBg: "bg-blue-600",
  },
  {
    value: "BLUE",
    label: "Blue-Collar Jobs",
    desc: "Skilled and manual labor roles that build and power our world.",
    tags: "Skilled · Technical · Hands-on",
    emoji: "🔧",
    bg: "bg-gradient-to-r from-teal-50 to-cyan-50",
    border: "border-teal-300",
    iconBg: "bg-teal-600",
    text: "text-teal-700",
    activeBg: "bg-teal-600",
  },
  {
    value: "PINK",
    label: "Pink-Collar Jobs",
    desc: "Service and care-oriented roles that make a real difference.",
    tags: "Care · Service · Support",
    emoji: "🌸",
    bg: "bg-gradient-to-r from-pink-50 to-rose-50",
    border: "border-pink-300",
    iconBg: "bg-pink-500",
    text: "text-pink-700",
    activeBg: "bg-pink-500",
  },
  {
    value: "GREY",
    label: "Grey-Collar Jobs",
    desc: "Technical and supervisory roles bridging skilled trades and management.",
    tags: "Technical · Supervisory · Hybrid",
    emoji: "⚙️",
    bg: "bg-gradient-to-r from-zinc-100 to-slate-100",
    border: "border-zinc-300",
    iconBg: "bg-zinc-600",
    text: "text-zinc-700",
    activeBg: "bg-zinc-600",
  },
  {
    value: "MSME",
    label: "MSME Jobs",
    desc: "Roles at micro, small & medium enterprises driving local economies.",
    tags: "Local · Enterprise · Growth",
    emoji: "🏭",
    bg: "bg-gradient-to-r from-orange-50 to-amber-50",
    border: "border-orange-300",
    iconBg: "bg-orange-500",
    text: "text-orange-700",
    activeBg: "bg-orange-500",
  },
];

export function PostJobForm({ categories, isAdmin }: { categories: Cat[]; isAdmin: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", description: "", roleDetails: "", benefits: "",
    location: "", industry: "", ctc: "",
    workMode: "REMOTE", employmentType: "FULL_TIME", seniority: "MID",
    salaryMin: "", salaryMax: "", salaryCurrency: "INR", salaryPeriod: "month",
    categoryId: "", skills: "", collarType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roleDetailsWordCount = form.roleDetails.trim() === "" ? 0 : form.roleDetails.trim().split(/\s+/).length;
  const WORD_LIMIT = 500;

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

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
      collarType: form.collarType || "WHITE",
    };
    const res = await fetch("/api/employer/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Failed to post"); return; }
    router.push(isAdmin ? "/admin/jobs" : "/employer/jobs"); router.refresh();
  }

  const selectedCollar = COLLAR_OPTIONS.find(c => c.value === form.collarType);

  return (
    <div className="max-w-3xl mx-auto" data-testid="post-job-form">

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-400"}`}>
              {s}
            </div>
            <span className={`text-sm font-medium ${step >= s ? "text-zinc-900" : "text-zinc-400"}`}>
              {s === 1 ? "Select Job Type" : "Job Details"}
            </span>
            {s < 2 && <ChevronRight className="h-4 w-4 text-zinc-300 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Collar Type Selection */}
      {step === 1 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-zinc-900">Select Job Category Type</h2>
            <p className="text-zinc-500 mt-1 text-sm">Choose the category that best describes this job opening.</p>
          </div>

          <div className="space-y-4">
            {COLLAR_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { set("collarType", opt.value); }}
                className={`w-full flex items-center gap-5 rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md ${
                  form.collarType === opt.value
                    ? `${opt.bg} ${opt.border} shadow-md`
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className={`h-14 w-14 shrink-0 rounded-2xl ${opt.iconBg} grid place-items-center text-2xl shadow`}>
                  {opt.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-zinc-900 text-base">{opt.label}</div>
                  <div className="text-sm text-zinc-500 mt-0.5">{opt.desc}</div>
                  <div className={`text-xs font-medium mt-1 ${opt.text}`}>{opt.tags}</div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                  form.collarType === opt.value ? `${opt.activeBg} border-transparent` : "border-zinc-300"
                }`}>
                  {form.collarType === opt.value && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={!form.collarType}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Job Details */}
      {step === 2 && (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Selected collar badge */}
          {selectedCollar && (
            <div className={`flex items-center gap-3 rounded-xl ${selectedCollar.bg} border ${selectedCollar.border} p-4`}>
              <div className={`h-10 w-10 rounded-xl ${selectedCollar.iconBg} grid place-items-center text-xl shrink-0`}>
                {selectedCollar.emoji}
              </div>
              <div>
                <div className="font-semibold text-zinc-900 text-sm">{selectedCollar.label}</div>
                <button type="button" onClick={() => setStep(1)} className={`text-xs ${selectedCollar.text} underline`}>Change category</button>
              </div>
            </div>
          )}

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Job Information</h3>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                required value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Senior Software Engineer" data-testid="job-title" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">About the Role <span className="text-red-500">*</span></label>
              <textarea className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition min-h-[100px]"
                required value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the role and team..." data-testid="job-description" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Roles, Responsibilities &amp; Requirements</label>
              <textarea
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 transition min-h-[140px] ${roleDetailsWordCount > WORD_LIMIT ? "border-red-400 focus:border-red-400" : "border-zinc-200 focus:border-blue-400"}`}
                value={form.roleDetails} onChange={e => set("roleDetails", e.target.value)}
                placeholder="List the responsibilities and requirements..." />
              <div className={`text-xs mt-1 text-right ${roleDetailsWordCount > WORD_LIMIT ? "text-red-500 font-semibold" : "text-zinc-400"}`}>
                {roleDetailsWordCount} / {WORD_LIMIT} words
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Skills <span className="text-xs font-normal text-zinc-400">(comma separated)</span></label>
              <input className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="React, TypeScript, Node.js" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Benefits</label>
              <textarea className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                value={form.benefits} onChange={e => set("benefits", e.target.value)} placeholder="Health insurance, flexible hours..." />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-zinc-900">Location &amp; Work Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                <input className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  required value={form.location} onChange={e => set("location", e.target.value)} placeholder="Mumbai, India" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Industry</label>
                <input className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={form.industry} onChange={e => set("industry", e.target.value)} placeholder="IT, Finance, Healthcare..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">CTC</label>
                <input className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={form.ctc} onChange={e => set("ctc", e.target.value)} placeholder="12 LPA" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Work Mode</label>
                <select className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  value={form.workMode} onChange={e => set("workMode", e.target.value)}>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-site</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Employment Type</label>
                <select className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  value={form.employmentType} onChange={e => set("employmentType", e.target.value)}>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="TEMPORARY">Temporary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Seniority</label>
                <select className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  value={form.seniority} onChange={e => set("seniority", e.target.value)}>
                  {["INTERN","ENTRY","MID","SENIOR","STAFF","PRINCIPAL","DIRECTOR","EXECUTIVE"].map(s => (
                    <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-zinc-900">Salary &amp; Category</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Salary Min (₹)</label>
                <input type="number" className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={form.salaryMin} onChange={e => set("salaryMin", e.target.value)} placeholder="30000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Salary Max (₹)</label>
                <input type="number" className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={form.salaryMax} onChange={e => set("salaryMax", e.target.value)} placeholder="80000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Salary Period</label>
                <select className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  value={form.salaryPeriod} onChange={e => set("salaryPeriod", e.target.value)}>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Category</label>
                <select className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  value={form.categoryId} onChange={e => set("categoryId", e.target.value)}>
                  <option value="">Uncategorized</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(1)}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-medium text-sm transition">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition" data-testid="submit-job">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isAdmin ? "Publish Role" : "Submit for Review"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
