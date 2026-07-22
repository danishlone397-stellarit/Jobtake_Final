"use client";
import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

type Cat = { id: string; name: string };

const COLLAR_OPTIONS = [
  { value: "WHITE", label: "White-Collar", emoji: "🏢", iconBg: "bg-blue-600",   activeBorder: "border-blue-500",   activeBg: "bg-blue-50",   activeText: "text-blue-700" },
  { value: "BLUE",  label: "Blue-Collar",  emoji: "🔧", iconBg: "bg-teal-600",   activeBorder: "border-teal-500",   activeBg: "bg-teal-50",   activeText: "text-teal-700" },
  { value: "MSME",  label: "MSME Job",     emoji: "🏭", iconBg: "bg-orange-500", activeBorder: "border-orange-500", activeBg: "bg-orange-50", activeText: "text-orange-700" },
  { value: "PINK",  label: "Diversity Job",emoji: "🌸", iconBg: "bg-pink-500",   activeBorder: "border-pink-500",   activeBg: "bg-pink-50",   activeText: "text-pink-700" },
  { value: "GREY",  label: "Others",       emoji: "⚙️", iconBg: "bg-zinc-500",   activeBorder: "border-zinc-500",   activeBg: "bg-zinc-100",  activeText: "text-zinc-700" },
];

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" }, { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT",  label: "Contract" },  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

const inputCls = "w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white";

function formatExperienceRange(min: string, max: string) {
  if (!min && !max) return undefined;
  if (min && max) return `${min}-${max} yrs`;
  if (min) return `${min}+ yrs`;
  return `Up to ${max} yrs`;
}

function getSeniorityFromExperience(min: string, max: string, fallback: string) {
  const n = parseInt(min || max || "", 10);
  if (Number.isNaN(n)) return fallback || "MID";
  if (n <= 0) return "INTERN";
  if (n <= 2) return "ENTRY";
  if (n <= 5) return "MID";
  if (n <= 8) return "SENIOR";
  if (n <= 12) return "STAFF";
  if (n <= 15) return "PRINCIPAL";
  if (n <= 20) return "DIRECTOR";
  return "EXECUTIVE";
}

function normalizeExperienceInput(value: string) {
  if (value === "") return "";
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return "";
  return String(Math.min(n, 60));
}

type JobData = {
  id: string; title: string; description: string; responsibilities: string;
  requirements: string; benefits: string; location: string; workMode: string;
  employmentType: string; seniority: string; collarType: string;
  experienceMin: number | null; experienceMax: number | null;
  salaryMin: number | null; salaryMax: number | null; skills: string[]; categoryName: string;
};

const SectionHeader = ({ num, title }: { num: number; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{num}</div>
    <h2 className="text-base font-bold text-zinc-900">{title}</h2>
  </div>
);

export function EditJobClient({ job, categories }: { job: JobData; categories: Cat[] }) {
  const router = useRouter();

  const [collarType, setCollarType]         = useState(job.collarType);
  const [title, setTitle]                   = useState(job.title);
  const [categoryName, setCategoryName]     = useState(job.categoryName);
  const [employmentType, setEmploymentType] = useState(job.employmentType);
  const [seniority]                         = useState(job.seniority);
  const [experienceMin, setExperienceMin]   = useState(job.experienceMin !== null ? String(job.experienceMin) : "");
  const [experienceMax, setExperienceMax]   = useState(job.experienceMax !== null ? String(job.experienceMax) : "");
  const [workMode, setWorkMode]             = useState(job.workMode);
  const [location, setLocation]             = useState(job.location);
  const [description, setDescription]       = useState(job.description);
  const [responsibilities, setResponsibilities] = useState(job.responsibilities);
  const [requirements, setRequirements]     = useState(job.requirements);
  const [benefits, setBenefits]             = useState(job.benefits);
  const [salaryMinDisplay, setSalaryMinDisplay] = useState(job.salaryMin ? String(job.salaryMin / 100000) : "");
  const [salaryMaxDisplay, setSalaryMaxDisplay] = useState(job.salaryMax ? String(job.salaryMax / 100000) : "");
  const [salaryMin, setSalaryMin]           = useState(job.salaryMin ? String(job.salaryMin) : "");
  const [salaryMax, setSalaryMax]           = useState(job.salaryMax ? String(job.salaryMax) : "");
  const [skills, setSkills]                 = useState<string[]>(job.skills);
  const [skillInput, setSkillInput]         = useState("");
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const skillRef = useRef<HTMLInputElement>(null);

  function addSkill(val: string) {
    const t = val.trim();
    if (t && !skills.includes(t)) setSkills(s => [...s, t]);
    setSkillInput("");
  }
  function onSkillKey(e: KeyboardEvent<HTMLInputElement>) {
    if (["Enter", ",", "Tab"].includes(e.key)) { e.preventDefault(); addSkill(skillInput); }
    else if (e.key === "Backspace" && !skillInput && skills.length) setSkills(s => s.slice(0, -1));
  }

  function handleSalaryMin(val: string) { setSalaryMinDisplay(val); const n = parseFloat(val); setSalaryMin(isNaN(n) ? "" : String(Math.round(n * 100000))); }
  function handleSalaryMax(val: string) { setSalaryMaxDisplay(val); const n = parseFloat(val); setSalaryMax(isNaN(n) ? "" : String(Math.round(n * 100000))); }
  function formatLPA(val: string) { const n = parseFloat(val); return isNaN(n) ? val : `${n} LPA`; }

  async function save() {
    setError(null);
    if (!title.trim() || title.trim().length < 3) { setError("Job title is required (min 3 characters)."); return; }
    if (!location.trim()) { setError("Location is required."); return; }
    if (experienceMin && experienceMax && parseInt(experienceMin, 10) > parseInt(experienceMax, 10)) {
      setError("Minimum experience cannot be greater than maximum experience."); return;
    }

    setLoading(true);
    const nextSeniority = getSeniorityFromExperience(experienceMin, experienceMax, seniority);
    const res = await fetch(`/api/employer/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description, responsibilities, requirements, benefits,
        location, workMode, employmentType, seniority: nextSeniority, collarType,
        experienceMin: experienceMin ? parseInt(experienceMin, 10) : null,
        experienceMax: experienceMax ? parseInt(experienceMax, 10) : null,
        salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
        salaryCurrency: "INR", salaryPeriod: "year",
        categoryName: categoryName.trim() || undefined, skills,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Failed to save"); return; }
    router.push(`/employer/jobs/${job.id}/preview`);
    router.refresh();
  }

  return (
    <div className="flex gap-6 items-start">

      {/* ── MAIN FORM ── */}
      <div className="flex-1 min-w-0 space-y-5 pb-24">

        {/* Back */}
        <div>
          <Link href={`/employer/jobs/${job.id}/preview`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Preview
          </Link>
          <h1 className="text-2xl font-black text-zinc-900 mt-1">Edit Job</h1>
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

        {/* 1. Collar Type */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={1} title="Job Type" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {COLLAR_OPTIONS.map(opt => {
              const active = collarType === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => setCollarType(opt.value)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${active ? `${opt.activeBorder} ${opt.activeBg}` : "border-zinc-100 hover:border-zinc-200 bg-zinc-50"}`}>
                  {active && <span className="absolute top-2 right-2 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</span>}
                  <div className={`h-10 w-10 rounded-xl ${opt.iconBg} flex items-center justify-center text-lg`}>{opt.emoji}</div>
                  <span className={`text-xs font-bold text-center ${active ? opt.activeText : "text-zinc-600"}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Job Info */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={2} title="Job Information" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Senior Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Job Category</label>
              <input value={categoryName} onChange={e => setCategoryName(e.target.value)} list="cats" className={inputCls} placeholder="e.g. Engineering, Finance" />
              <datalist id="cats">{categories.map(c => <option key={c.id} value={c.name} />)}</datalist>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Employment Type <span className="text-red-500">*</span></label>
                <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} className={inputCls}>
                  {EMPLOYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Experience <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    value={experienceMin}
                    onChange={e => setExperienceMin(normalizeExperienceInput(e.target.value))}
                    className={inputCls}
                    placeholder="Min"
                  />
                  <span className="text-xs font-semibold text-zinc-400">to</span>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    value={experienceMax}
                    onChange={e => setExperienceMax(normalizeExperienceInput(e.target.value))}
                    className={inputCls}
                    placeholder="Max"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-400">Enter years, e.g. 2 to 5.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Work Mode <span className="text-red-500">*</span></label>
                <select value={workMode} onChange={e => setWorkMode(e.target.value)} className={inputCls}>
                  <option value="ONSITE">On-site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Location */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={3} title="Location" />
          <input value={location} onChange={e => setLocation(e.target.value)} className={inputCls} placeholder="e.g. Mumbai, Maharashtra" />
        </div>

        {/* 4. Job Description */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={4} title="Job Description" />
          <div className="space-y-4">
            {([
              { label: "About Role", value: description, set: setDescription, placeholder: "Describe the role and what the candidate will do..." },
              { label: "Roles & Responsibilities", value: responsibilities, set: setResponsibilities, placeholder: "List the key responsibilities..." },
              { label: "Job Requirements", value: requirements, set: setRequirements, placeholder: "List required skills, experience, qualifications..." },
            ] as const).map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">{label}</label>
                <textarea value={value} onChange={e => set(e.target.value)} rows={4} maxLength={5000}
                  className={inputCls + " resize-none"} placeholder={placeholder} />
                <div className="text-right text-xs text-zinc-400 mt-1">{value.length} / 5000</div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Skills */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={5} title="Required Skills" />
          <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                {s} <button onClick={() => setSkills(p => p.filter(x => x !== s))}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input ref={skillRef} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={onSkillKey}
              className={inputCls + " flex-1"} placeholder="Type a skill and press Enter" />
            <button onClick={() => addSkill(skillInput)} className="px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">Add</button>
          </div>
        </div>

        {/* 6. Compensation */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={6} title="Compensation" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                CTC Range <span className="text-xs font-normal text-zinc-400 ml-2">Enter in LPA (e.g. 5.5 = 5.5 LPA)</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input type="number" step="0.1" min="0" value={salaryMinDisplay}
                    onChange={e => handleSalaryMin(e.target.value)}
                    onBlur={e => { if (e.target.value) setSalaryMinDisplay(formatLPA(e.target.value)); }}
                    onFocus={e => { const raw = parseFloat(salaryMin) / 100000; setSalaryMinDisplay(isNaN(raw) ? "" : String(raw)); }}
                    className={inputCls + " pr-14"} placeholder="Min CTC" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">LPA</span>
                </div>
                <span className="text-zinc-400 text-sm font-medium shrink-0">to</span>
                <div className="relative flex-1">
                  <input type="number" step="0.1" min="0" value={salaryMaxDisplay}
                    onChange={e => handleSalaryMax(e.target.value)}
                    onBlur={e => { if (e.target.value) setSalaryMaxDisplay(formatLPA(e.target.value)); }}
                    onFocus={e => { const raw = parseFloat(salaryMax) / 100000; setSalaryMaxDisplay(isNaN(raw) ? "" : String(raw)); }}
                    className={inputCls + " pr-14"} placeholder="Max CTC" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">LPA</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Additional Benefits</label>
              <textarea value={benefits} onChange={e => setBenefits(e.target.value)} rows={2} maxLength={200}
                className={inputCls + " resize-none"} placeholder="e.g. Health Insurance, Flexible Hours, Bonus, etc." />
              <div className="text-right text-xs text-zinc-400 mt-1">{benefits.length} / 200</div>
            </div>
          </div>
        </div>

      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="hidden xl:block w-72 shrink-0 sticky top-6 space-y-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5">
          <h3 className="font-bold text-zinc-900 text-sm mb-4">Job Summary</h3>
          <div className="space-y-3">
            {[
              { label: "Job Title",       value: title },
              { label: "Location",        value: location },
              { label: "Employment Type", value: EMPLOYMENT_TYPES.find(e => e.value === employmentType)?.label },
              { label: "Experience",      value: formatExperienceRange(experienceMin, experienceMax) },
              { label: "Work Mode",       value: workMode.charAt(0) + workMode.slice(1).toLowerCase() },
              { label: "CTC Range",       value: salaryMinDisplay || salaryMaxDisplay ? `${salaryMinDisplay || "?"} – ${salaryMaxDisplay || "?"}` : undefined },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">{label}</span>
                <span className={`font-semibold ${value ? "text-zinc-900" : "text-zinc-300"}`}>{value || "Not added"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FIXED BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 px-6 py-4 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-400">Changes will go to preview before publishing.</p>
        <div className="flex items-center gap-3">
          <Link href={`/employer/jobs/${job.id}/preview`}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition">
            Cancel
          </Link>
          <button onClick={save} disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Save & Preview
          </button>
        </div>
      </div>
    </div>
  );
}
