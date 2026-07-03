"use client";
import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Briefcase, X, Check } from "lucide-react";

type Cat = { id: string; name: string };

const COLLAR_OPTIONS = [
  { value: "WHITE", label: "White-Collar", emoji: "🏢", desc: "Corporate · Professional · Desk Jobs", iconBg: "bg-blue-600",   activeBorder: "border-blue-500",   activeBg: "bg-blue-50",   activeText: "text-blue-700" },
  { value: "BLUE",  label: "Blue-Collar",  emoji: "🔧", desc: "Skilled · Technical · Hands-on",      iconBg: "bg-teal-600",   activeBorder: "border-teal-500",   activeBg: "bg-teal-50",   activeText: "text-teal-700" },
  { value: "PINK",  label: "Pink-Collar",  emoji: "🌸", desc: "Care · Service · Support",            iconBg: "bg-pink-500",   activeBorder: "border-pink-500",   activeBg: "bg-pink-50",   activeText: "text-pink-700" },
  { value: "GREY",  label: "Grey-Collar",  emoji: "⚙️", desc: "Technical · Supervisory · Hybrid",   iconBg: "bg-zinc-600",   activeBorder: "border-zinc-500",   activeBg: "bg-zinc-100",  activeText: "text-zinc-700" },
  { value: "MSME",  label: "MSME",         emoji: "🏭", desc: "Local · Enterprise · Growth",         iconBg: "bg-orange-500", activeBorder: "border-orange-500", activeBg: "bg-orange-50", activeText: "text-orange-700" },
];

export function PostJobForm({ categories: _categories, isAdmin }: { categories: Cat[]; isAdmin: boolean }) {
  const router = useRouter();

  // multi-select collar types
  const [collarTypes, setCollarTypes] = useState<string[]>(["WHITE"]);

  const [form, setForm] = useState({
    title: "", description: "", roleDetails: "", benefits: "",
    location: "", industry: "", categoryName: "",
    workMode: "REMOTE", employmentType: "FULL_TIME", seniority: "MID",
    salaryMin: "", salaryMax: "", salaryCurrency: "INR", salaryPeriod: "month",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const skillRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roleDetailsWordCount = form.roleDetails.trim() === "" ? 0 : form.roleDetails.trim().split(/\s+/).length;
  const WORD_LIMIT = 500;

  function toggleCollar(val: string) {
    setCollarTypes(prev =>
      prev.includes(val)
        ? prev.length === 1 ? prev          // at least one must stay selected
          : prev.filter(v => v !== val)
        : [...prev, val]
    );
  }

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function addSkill(val: string) {
    const trimmed = val.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills(s => [...s, trimmed]);
    setSkillInput("");
  }

  function removeSkill(s: string) {
    setSkills(prev => prev.filter(x => x !== s));
  }

  function onSkillKey(e: KeyboardEvent<HTMLInputElement>) {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === "Backspace" && !skillInput && skills.length) {
      setSkills(s => s.slice(0, -1));
    }
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
      categoryName: form.categoryName.trim() || undefined,
      skills,
      collarType: collarTypes[0] ?? "WHITE", // Prisma stores single enum; send first selected
    };
    const res = await fetch("/api/employer/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Failed to post"); return; }
    router.push(isAdmin ? "/admin/jobs" : "/employer/jobs"); router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto" data-testid="post-job-form">
      <form onSubmit={onSubmit} className="space-y-5">

        {/* Job Category Type — multi-select */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-900">Job Category Type</h3>
            <span className="text-xs text-zinc-400">{collarTypes.length} selected · click to toggle</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {COLLAR_OPTIONS.map(opt => {
              const active = collarTypes.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleCollar(opt.value)}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                    active
                      ? `${opt.activeBg} ${opt.activeBorder} shadow-sm`
                      : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {/* checkmark badge */}
                  {active && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <div className={`h-10 w-10 rounded-xl ${opt.iconBg} grid place-items-center text-xl shadow`}>
                    {opt.emoji}
                  </div>
                  <span className={`text-xs font-semibold leading-tight ${active ? opt.activeText : "text-zinc-700"}`}>
                    {opt.label}
                  </span>
                  <span className={`text-[10px] leading-tight ${active ? opt.activeText : "text-zinc-400"}`}>
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
          {collarTypes.length > 1 && (
            <p className="text-xs text-zinc-400 mt-3">
              Primary collar type: <span className="font-semibold text-zinc-600">{COLLAR_OPTIONS.find(o => o.value === collarTypes[0])?.label}</span>
            </p>
          )}
        </div>

        {/* Job Information */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-zinc-900 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-blue-600" /> Job Information
          </h3>

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
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Skills <span className="text-xs font-normal text-zinc-400">(type &amp; press Enter or comma)</span>
            </label>
            <div
              className="min-h-[48px] w-full px-3 py-2 border border-zinc-200 rounded-lg focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition flex flex-wrap gap-2 cursor-text bg-white"
              onClick={() => skillRef.current?.focus()}
            >
              {skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                ref={skillRef}
                className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder:text-zinc-400"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={onSkillKey}
                onBlur={() => skillInput.trim() && addSkill(skillInput)}
                placeholder={skills.length === 0 ? "React, TypeScript, Node.js..." : "Add more..."}
              />
            </div>
            {skills.length > 0 && (
              <p className="text-xs text-zinc-400 mt-1">{skills.length} skill{skills.length > 1 ? "s" : ""} added</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Benefits</label>
            <textarea className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              value={form.benefits} onChange={e => set("benefits", e.target.value)} placeholder="Health insurance, flexible hours..." />
          </div>
        </div>

        {/* Location & Work Details */}
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

{error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

        <div className="flex items-center justify-end pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition" data-testid="submit-job">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isAdmin ? "Publish Role" : "Submit for Review"}
          </button>
        </div>

      </form>
    </div>
  );
}
