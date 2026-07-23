"use client";
import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, X, Check, Eye } from "lucide-react";
import { ManagedOptions, parseRange } from "@/lib/job-option-types";

type Cat = { id: string; name: string };

const COLLAR_OPTIONS = [
  { value: "WHITE", label: "White-Collar", emoji: "🏢", desc: "Corporate · Professional · Desk Jobs",  iconBg: "bg-blue-600",   activeBorder: "border-blue-500",   activeBg: "bg-blue-50",   activeText: "text-blue-700" },
  { value: "BLUE",  label: "Blue-Collar",  emoji: "🔧", desc: "Skilled · Technical · Hands-on",        iconBg: "bg-teal-600",   activeBorder: "border-teal-500",   activeBg: "bg-teal-50",   activeText: "text-teal-700" },
  { value: "MSME",  label: "MSME Job",     emoji: "🏭", desc: "Local · Enterprise · Growth",           iconBg: "bg-orange-500", activeBorder: "border-orange-500", activeBg: "bg-orange-50", activeText: "text-orange-700" },
  { value: "PINK",  label: "Diversity Job",emoji: "🌸", desc: "Inclusive · Equal Opportunity",         iconBg: "bg-pink-500",   activeBorder: "border-pink-500",   activeBg: "bg-pink-50",   activeText: "text-pink-700" },
  { value: "GREY",  label: "Others",       emoji: "⚙️", desc: "Other Job Categories",                  iconBg: "bg-zinc-500",   activeBorder: "border-zinc-500",   activeBg: "bg-zinc-100",  activeText: "text-zinc-700" },
];

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT",  label: "Contract" },
  { value: "INTERNSHIP",label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

const MIN_EDU_OPTIONS = ["Any", "10th Pass", "12th Pass", "Diploma", "Graduate", "Post Graduate", "Doctorate"];
const DEGREE_OPTIONS  = ["Any", "B.Tech / B.E.", "B.Sc", "B.Com", "BA", "BBA / BBM", "MBA / PGDM", "M.Tech", "M.Sc", "MCA", "B.C.A", "B.Ed", "Other"];

const SectionHeader = ({ num, title }: { num: number; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{num}</div>
    <h2 className="text-base font-bold text-zinc-900">{title}</h2>
  </div>
);

const inputCls = "w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white";
const selectCls = inputCls;

function formatExperienceRange(min: string, max: string) {
  if (!min && !max) return undefined;
  if (min && max) return `${min}-${max} yrs`;
  if (min) return `${min}+ yrs`;
  return `Up to ${max} yrs`;
}

function getSeniorityFromExperience(min: string, max: string) {
  const n = parseInt(min || max || "", 10);
  if (Number.isNaN(n) || n <= 0) return "INTERN";
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

export function PostJobForm({ categories, options, isAdmin }: { categories: Cat[]; options: ManagedOptions; isAdmin: boolean }) {
  const router = useRouter();

  const [collarTypes, setCollarTypes]     = useState<string[]>(["WHITE"]);
  const collarType = collarTypes[0] ?? "WHITE"; // primary for API
  const [title, setTitle]                 = useState("");
  const [categoryName, setCategoryName]   = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceMin, setExperienceMin] = useState("");
  const [experienceMax, setExperienceMax] = useState("");
  const [experienceBand, setExperienceBand] = useState("");
  const [workMode, setWorkMode]           = useState("ONSITE");
  const [location, setLocation]           = useState("");
  const [remoteJob, setRemoteJob]         = useState(false);
  const [jobType, setJobType]             = useState("FULL_TIME");
  const [minEdu, setMinEdu]               = useState("");
  const [degree, setDegree]               = useState("");
  const [passingYear, setPassingYear]     = useState("");
  const [description, setDescription]     = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements]   = useState("");
  const [salaryMin, setSalaryMin]         = useState("");
  const [salaryMax, setSalaryMax]         = useState("");
  const [salaryMinDisplay, setSalaryMinDisplay] = useState("");
  const [salaryMaxDisplay, setSalaryMaxDisplay] = useState("");
  const [ctcBand, setCtcBand] = useState("");

  const locationOptions = options.LOCATION;
  const industryOptions = options.INDUSTRY;
  const roleOptions = options.ROLE;
  const ctcOptions = options.CTC;
  const experienceOptions = options.EXPERIENCE;

  function formatLPA(val: string): string {
    const n = parseFloat(val);
    if (isNaN(n)) return val;
    return `${n} LPA`;
  }
  function handleSalaryMin(val: string) {
    setSalaryMinDisplay(val);
    const n = parseFloat(val);
    setSalaryMin(isNaN(n) ? "" : String(Math.round(n * 100000)));
  }
  function handleSalaryMax(val: string) {
    setSalaryMaxDisplay(val);
    const n = parseFloat(val);
    setSalaryMax(isNaN(n) ? "" : String(Math.round(n * 100000)));
  }
  function applyExperienceBand(value: string) {
    setExperienceBand(value);
    const range = parseRange(value);
    setExperienceMin(range.min === null ? "" : String(range.min));
    setExperienceMax(range.max === null ? "" : String(range.max));
  }
  function applyCtcBand(value: string) {
    setCtcBand(value);
    const range = parseRange(value);
    const min = range.min === null ? "" : String(range.min);
    const max = range.max === null ? "" : String(range.max);
    setSalaryMinDisplay(min);
    setSalaryMaxDisplay(max);
    setSalaryMin(range.min === null ? "" : String(Math.round(range.min * 100000)));
    setSalaryMax(range.max === null ? "" : String(Math.round(range.max * 100000)));
  }
  const [benefits, setBenefits]           = useState("");
  const [skills, setSkills]               = useState<string[]>([]);
  const [skillInput, setSkillInput]       = useState("");
  const skillRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  function addSkill(val: string) {
    const t = val.trim();
    if (t && !skills.includes(t)) setSkills(s => [...s, t]);
    setSkillInput("");
  }
  function onSkillKey(e: KeyboardEvent<HTMLInputElement>) {
    if (["Enter", ",", "Tab"].includes(e.key)) { e.preventDefault(); addSkill(skillInput); }
    else if (e.key === "Backspace" && !skillInput && skills.length) setSkills(s => s.slice(0, -1));
  }

  async function submit(status: "DRAFT" | "PENDING") {
    setError(null);

    // Client-side validation
    if (!title.trim() || title.trim().length < 3) {
      setError("Job title is required (minimum 3 characters)."); return;
    }
    if (!remoteJob && !location.trim()) {
      setError("Location is required. Or check 'Remote Job'."); return;
    }
    if (experienceMin && experienceMax && parseInt(experienceMin, 10) > parseInt(experienceMax, 10)) {
      setError("Minimum experience cannot be greater than maximum experience."); return;
    }

    setLoading(true);
    const seniority = getSeniorityFromExperience(experienceMin, experienceMax);
    const body = {
      title, description, responsibilities, requirements, benefits,
      location: remoteJob ? "Remote" : location,
      industry: categoryName,
      workMode: remoteJob ? "REMOTE" : workMode,
      employmentType: employmentType || jobType || "FULL_TIME",
      seniority,
      experienceMin: experienceMin ? parseInt(experienceMin, 10) : undefined,
      experienceMax: experienceMax ? parseInt(experienceMax, 10) : undefined,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      salaryCurrency: "INR",
      salaryPeriod: "year",
      categoryName: categoryName.trim() || undefined,
      skills,
      collarType: collarType || "WHITE",
    };
    const res = await fetch("/api/employer/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Failed to post"); return; }
    if (status === "DRAFT") {
      router.push(isAdmin ? "/admin/jobs" : "/employer/jobs");
    } else {
      router.push(`/employer/jobs/${data.job.id}/preview`);
    }
    router.refresh();
  }

  const summaryFields = [
    { label: "Job Title",       value: title },
    { label: "Category",        value: categoryName },
    { label: "Location",        value: remoteJob ? "Remote" : location },
    { label: "Employment Type", value: EMPLOYMENT_TYPES.find(e => e.value === (employmentType || jobType))?.label },
    { label: "Experience",      value: formatExperienceRange(experienceMin, experienceMax) },
    { label: "Work Mode",       value: remoteJob ? "Remote" : workMode.charAt(0) + workMode.slice(1).toLowerCase() },
    { label: "Education",       value: minEdu || undefined },
    { label: "CTC Range", value: salaryMinDisplay || salaryMaxDisplay ? `${salaryMinDisplay || "?"} – ${salaryMaxDisplay || "?"}` : undefined },
  ];

  return (
    <div className="flex gap-6 items-start">

      {/* ── MAIN FORM ── */}
      <div className="flex-1 min-w-0 space-y-5 pb-24">

        {/* 1. Job Type */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={1} title="Job Type / Category (Select One) *" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {COLLAR_OPTIONS.map(opt => {
              const active = collarTypes.includes(opt.value);
              return (
                <button key={opt.value} type="button" onClick={() => setCollarTypes(prev =>
                  prev.includes(opt.value)
                    ? prev.length === 1 ? prev : prev.filter(v => v !== opt.value)
                    : [...prev, opt.value]
                )}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${active ? `${opt.activeBg} ${opt.activeBorder} shadow-sm` : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"}`}>
                  {active && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <div className={`h-10 w-10 rounded-xl ${opt.iconBg} grid place-items-center text-xl shadow`}>{opt.emoji}</div>
                  <span className={`text-xs font-semibold leading-tight ${active ? opt.activeText : "text-zinc-700"}`}>{opt.label}</span>
                  <span className={`text-[10px] leading-tight ${active ? opt.activeText : "text-zinc-400"}`}>{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Job Information */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={2} title="Job Information" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
              <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" data-testid="job-title" list="role-list" />
              <datalist id="role-list">
                {roleOptions.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Job Category <span className="text-red-500">*</span></label>
              <input className={inputCls} value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Engineering, Finance, Marketing" list="cat-list" />
              <datalist id="cat-list">
                {categories.map(c => <option key={c.id} value={c.name} />)}
                {industryOptions.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
              </datalist>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Employment Type <span className="text-red-500">*</span></label>
                <select className={selectCls} value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
                  <option value="">Select type</option>
                  {EMPLOYMENT_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Experience <span className="text-red-500">*</span></label>
                <select className={selectCls + " mb-2"} value={experienceBand} onChange={e => applyExperienceBand(e.target.value)}>
                  <option value="">Select experience band</option>
                  {experienceOptions.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
                </select>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    className={inputCls}
                    value={experienceMin}
                    onChange={e => { setExperienceBand(""); setExperienceMin(normalizeExperienceInput(e.target.value)); }}
                    placeholder="Min"
                  />
                  <span className="text-xs font-semibold text-zinc-400">to</span>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    className={inputCls}
                    value={experienceMax}
                    onChange={e => { setExperienceBand(""); setExperienceMax(normalizeExperienceInput(e.target.value)); }}
                    placeholder="Max"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-400">Enter years, e.g. 2 to 5.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Work Mode <span className="text-red-500">*</span></label>
                <select className={selectCls} value={workMode} onChange={e => setWorkMode(e.target.value)}>
                  <option value="">Select work mode</option>
                  <option value="ONSITE">On-site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Location & Job Type */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={3} title="Location & Job Type" />
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Job Location <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input className={inputCls} value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India" disabled={remoteJob} list="location-list" />
                  <datalist id="location-list">
                    {locationOptions.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
                  </datalist>
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 whitespace-nowrap cursor-pointer">
                  <input type="checkbox" checked={remoteJob} onChange={e => setRemoteJob(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  Remote Job
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Work Mode <span className="text-red-500">*</span></label>
              <div className="flex gap-5">
                {[{v:"ONSITE",l:"On-site"},{v:"REMOTE",l:"Remote"},{v:"HYBRID",l:"Hybrid"}].map(o => (
                  <label key={o.v} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="workMode" value={o.v} checked={workMode === o.v} onChange={() => setWorkMode(o.v)}
                      className="h-4 w-4 text-blue-600 border-zinc-300 focus:ring-blue-500" />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Job Type <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-5">
                {EMPLOYMENT_TYPES.map(o => (
                  <label key={o.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="jobType" value={o.value} checked={jobType === o.value} onChange={() => setJobType(o.value)}
                      className="h-4 w-4 text-blue-600 border-zinc-300 focus:ring-blue-500" />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Education Details */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={4} title="Education Details" />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Minimum Education <span className="text-red-500">*</span></label>
              <select className={selectCls} value={minEdu} onChange={e => setMinEdu(e.target.value)}>
                <option value="">Select minimum education</option>
                {MIN_EDU_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Degree / Diploma <span className="text-red-500">*</span></label>
              <select className={selectCls} value={degree} onChange={e => setDegree(e.target.value)}>
                <option value="">Select degree or diploma</option>
                {DEGREE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Passing Year <span className="text-xs font-normal text-zinc-400">(Optional)</span></label>
              <input className={inputCls} value={passingYear} onChange={e => setPassingYear(e.target.value)} placeholder="e.g. 2020 or Later" />
            </div>
          </div>
        </div>

        {/* 5. Job Description */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={5} title="Job Description" />
          <div className="space-y-5">
            {[
              { label: "About the Role", value: description, set: setDescription, placeholder: "Describe the role, key responsibilities and expectations..." },
              { label: "Roles & Responsibilities", value: responsibilities, set: setResponsibilities, placeholder: "Add key tasks and responsibilities..." },
              { label: "Job Requirements", value: requirements, set: setRequirements, placeholder: "Skills, experience and qualifications required..." },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">{label} <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition min-h-[120px] resize-none"
                  value={value} onChange={e => set(e.target.value)} placeholder={placeholder} maxLength={5000} />
                <div className="text-xs text-right text-zinc-400 mt-1">{value.length} / 5000</div>
              </div>
            ))}

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Skills <span className="text-xs font-normal text-zinc-400">(type &amp; press Enter or comma)</span></label>
              <div
                className="min-h-[48px] w-full px-3 py-2 border border-zinc-200 rounded-lg focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition flex flex-wrap gap-2 cursor-text bg-white"
                onClick={() => skillRef.current?.focus()}
              >
                {skills.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                    {s}
                    <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))} className="hover:text-red-500 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={skillRef}
                  className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder:text-zinc-400"
                  value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={onSkillKey}
                  onBlur={() => skillInput.trim() && addSkill(skillInput)}
                  placeholder={skills.length === 0 ? "React, TypeScript, Node.js..." : "Add more..."}
                />
              </div>
              {skills.length > 0 && <p className="text-xs text-zinc-400 mt-1">{skills.length} skill{skills.length > 1 ? "s" : ""} added</p>}
            </div>
          </div>
        </div>

        {/* 6. Compensation */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={6} title="Compensation" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                CTC Range <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-zinc-400">Enter in LPA (e.g. 5.5 = 5.5 LPA)</span>
              </label>
              <select className={selectCls + " mb-3"} value={ctcBand} onChange={e => applyCtcBand(e.target.value)}>
                <option value="">Select CTC band</option>
                {ctcOptions.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number" step="0.1" min="0"
                    className={inputCls + " pr-14"}
                    value={salaryMinDisplay}
                    onChange={e => { setCtcBand(""); handleSalaryMin(e.target.value); }}
                    onBlur={e => { if (e.target.value) setSalaryMinDisplay(formatLPA(e.target.value)); }}
                    onFocus={e => { const raw = parseFloat(salaryMin) / 100000; setSalaryMinDisplay(isNaN(raw) ? "" : String(raw)); }}
                    placeholder="Min CTC"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">LPA</span>
                </div>
                <span className="text-zinc-400 text-sm font-medium shrink-0">to</span>
                <div className="relative flex-1">
                  <input
                    type="number" step="0.1" min="0"
                    className={inputCls + " pr-14"}
                    value={salaryMaxDisplay}
                    onChange={e => { setCtcBand(""); handleSalaryMax(e.target.value); }}
                    onBlur={e => { if (e.target.value) setSalaryMaxDisplay(formatLPA(e.target.value)); }}
                    onFocus={e => { const raw = parseFloat(salaryMax) / 100000; setSalaryMaxDisplay(isNaN(raw) ? "" : String(raw)); }}
                    placeholder="Max CTC"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">LPA</span>
                </div>
              </div>
              {(salaryMinDisplay || salaryMaxDisplay) && (
                <p className="text-xs text-emerald-600 mt-1.5 font-medium">
                  ✓ CTC: {salaryMinDisplay ? formatLPA(salaryMinDisplay.replace(" LPA","")) : "?"} – {salaryMaxDisplay ? formatLPA(salaryMaxDisplay.replace(" LPA","")) : "?"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Additional Benefits</label>
              <textarea
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
                value={benefits} onChange={e => setBenefits(e.target.value)}
                placeholder="e.g. Health Insurance, Flexible Hours, Bonus, etc."
                maxLength={200} rows={2} />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-zinc-400">Enter up to 5 benefits (comma separated)</p>
                <p className="text-xs text-zinc-400">{benefits.length} / 200</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="w-72 shrink-0 sticky top-6 space-y-5 hidden lg:block">

        {/* Job Summary */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">Job Summary</h3>
          <div className="space-y-3">
            {summaryFields.map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-2 text-sm">
                <span className="text-zinc-500 shrink-0">{label}</span>
                <span className={`font-medium text-right ${value ? "text-zinc-900" : "text-zinc-300"}`}>{value || "Not added"}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => submit("PENDING")}
            disabled={loading}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 text-blue-600 text-sm font-semibold hover:underline"
          >
            <Eye className="h-4 w-4" /> Preview Full Job
          </button>
        </div>

        {/* Posting Tips */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-3">Posting Tips</h3>
          <ul className="space-y-2.5 text-sm text-zinc-600">
            {[
              "Write a clear and specific job title.",
              "Describe responsibilities in detail.",
              "Add must-have skills and qualifications.",
              "Include salary range to attract relevant candidates.",
              "Review before publishing to ensure accuracy.",
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── BOTTOM ACTION BAR (fixed) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 px-6 py-4 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-400">Review your job before publishing — you can edit anytime from My Jobs.</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => submit("DRAFT")}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => submit("PENDING")}
            data-testid="submit-job"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Preview Job
          </button>
        </div>
      </div>
    </div>
  );
}
