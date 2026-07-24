"use client";
import { useMemo, useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, GraduationCap, Info, Loader2, MapPin, Wrench, X, Check, Eye } from "lucide-react";
import { ManagedOptions } from "@/lib/job-option-types";
import { JobDescriptionEditor } from "@/components/JobDescriptionEditor";

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

const EDUCATION_OPTIONS = [
  {
    value: "Post Graduate (PG)",
    title: "Post Graduate (PG)",
    desc: "e.g. M.Tech, MBA, MCA, MSc, etc.",
    icon: GraduationCap,
  },
  {
    value: "Under Graduate (UG)",
    title: "Under Graduate (UG)",
    desc: "e.g. B.Tech, B.Sc, B.Com, BA, etc.",
    icon: GraduationCap,
  },
  {
    value: "Diploma",
    title: "Diploma",
    desc: "e.g. Diploma in Mechanical, Electrical, etc.",
    icon: FileText,
  },
  {
    value: "12th Pass",
    title: "12th Pass",
    desc: "HSC / Intermediate / 12th Pass",
    badge: "12",
  },
  {
    value: "10th Pass",
    title: "10th Pass",
    desc: "SSC / Matriculation / 10th Pass",
    badge: "10",
  },
  {
    value: "ITI Pass",
    title: "ITI Pass",
    desc: "Industrial Training Institute (ITI)",
    icon: Wrench,
  },
] as const;

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
  const [workMode, setWorkMode]           = useState("ONSITE");
  const [location, setLocation]           = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [remoteJob, setRemoteJob]         = useState(false);
  const [jobType, setJobType]             = useState("FULL_TIME");
  const [minEdu, setMinEdu]               = useState("");
  const [description, setDescription]     = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements]   = useState("");
  const [salaryMin, setSalaryMin]         = useState("");
  const [salaryMax, setSalaryMax]         = useState("");
  const [salaryMinDisplay, setSalaryMinDisplay] = useState("");
  const [salaryMaxDisplay, setSalaryMaxDisplay] = useState("");

  const locationOptions = options.LOCATION;
  const industryOptions = options.INDUSTRY;
  const roleOptions = options.ROLE;
  const visibleLocationOptions = useMemo(() => {
    const query = location.trim().toLowerCase();
    const rows = query
      ? locationOptions.filter((option) => `${option.label} ${option.value}`.toLowerCase().includes(query))
      : locationOptions;
    return rows.slice(0, 30);
  }, [location, locationOptions]);

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
              <select className={selectCls} value={categoryName} onChange={e => setCategoryName(e.target.value)}>
                <option value="">Select job category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                {industryOptions.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
              </select>
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
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    className={inputCls}
                    value={experienceMin}
                    onChange={e => setExperienceMin(normalizeExperienceInput(e.target.value))}
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
                    onChange={e => setExperienceMax(normalizeExperienceInput(e.target.value))}
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
                  <input
                    className={inputCls}
                    value={location}
                    onChange={e => { setLocation(e.target.value); setShowLocationDropdown(true); }}
                    onFocus={() => !remoteJob && setShowLocationDropdown(true)}
                    onBlur={() => window.setTimeout(() => setShowLocationDropdown(false), 120)}
                    placeholder="e.g. Mumbai, India"
                    disabled={remoteJob}
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  {showLocationDropdown && !remoteJob && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-2 shadow-xl">
                      {visibleLocationOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setLocation(option.value);
                            setShowLocationDropdown(false);
                          }}
                          className="block w-full px-4 py-2.5 text-left transition hover:bg-blue-50"
                        >
                          <span className="block text-sm font-bold text-zinc-950">{option.value}</span>
                          {option.label !== option.value && <span className="mt-0.5 block text-xs font-medium text-zinc-600">{option.label}</span>}
                        </button>
                      ))}
                      {!visibleLocationOptions.length && (
                        <div className="px-4 py-3 text-sm font-medium text-zinc-500">No matching location. You can type a custom city.</div>
                      )}
                    </div>
                  )}
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
          <h2 className="text-xl font-bold text-zinc-950">Education Details</h2>
          <p className="mt-3 text-sm font-medium text-zinc-500">
            Set the minimum education required for candidates.
          </p>

          <div className="mt-8 flex items-center gap-3 rounded-sm bg-blue-50 px-4 py-4 text-sm font-medium text-blue-700">
            <Info className="h-5 w-5 shrink-0" />
            <p>You can select academic qualifications such as 10th, 12th, ITI, Diploma, UG &amp; PG as minimum requirements.</p>
          </div>

          <div className="mt-8">
            <p className="text-base font-bold text-zinc-950">
              Minimum Education <span className="font-medium text-zinc-900">(Select any one level)</span>
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {EDUCATION_OPTIONS.map((option) => {
                const Icon = "icon" in option ? option.icon : null;
                const badge = "badge" in option ? option.badge : null;
                const selected = minEdu === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMinEdu(option.value)}
                    className={`flex min-h-[88px] w-full items-center gap-5 rounded-xl border bg-white px-5 py-4 text-left transition hover:border-blue-200 hover:bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      selected ? "border-blue-400 ring-2 ring-blue-100" : "border-zinc-200"
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      {Icon ? <Icon className="h-6 w-6" /> : <span className="text-lg font-bold leading-none">{badge}</span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-zinc-950">{option.title}</span>
                      <span className="mt-1 block text-sm font-medium leading-5 text-zinc-500">{option.desc}</span>
                    </span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? "border-blue-600" : "border-zinc-400"
                      }`}
                      aria-hidden="true"
                    >
                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Job Description */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <SectionHeader num={5} title="Job Description" />
          <p className="mb-8 text-sm font-medium text-zinc-500">
            Provide a clear and complete job description to attract the right candidates.
          </p>
          <div className="space-y-5">
            {[
              {
                number: 1,
                label: "About the Role",
                helper: "Share an overview of the role, key responsibilities and expectations.",
                value: description,
                set: setDescription,
                placeholder: "Write a complete description about the role, responsibilities and expectations...",
              },
              {
                number: 2,
                label: "Roles & Responsibilities",
                helper: "Provide a detailed explanation of the key tasks and responsibilities for this position.",
                value: responsibilities,
                set: setResponsibilities,
                placeholder: "Describe the key tasks, daily activities, responsibilities and deliverables...",
              },
              {
                number: 3,
                label: "Job Requirements",
                helper: "Describe the skills, experience, knowledge and other requirements for candidates.",
                value: requirements,
                set: setRequirements,
                placeholder: "Mention the required skills, experience, knowledge, qualifications and any other criteria...",
              },
            ].map(({ number, label, helper, value, set, placeholder }) => (
              <JobDescriptionEditor
                key={label}
                number={number}
                title={label}
                helper={helper}
                value={value}
                onChange={set}
                placeholder={placeholder}
              />
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
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    className={inputCls}
                    value={salaryMinDisplay}
                    onChange={e => handleSalaryMin(e.target.value)}
                    onBlur={e => { if (e.target.value) setSalaryMinDisplay(formatLPA(e.target.value)); }}
                    onFocus={e => { const raw = parseFloat(salaryMin) / 100000; setSalaryMinDisplay(isNaN(raw) ? "" : String(raw)); }}
                    placeholder="Min CTC"
                  />
                </div>
                <span className="text-zinc-400 text-sm font-medium shrink-0">to</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    className={inputCls}
                    value={salaryMaxDisplay}
                    onChange={e => handleSalaryMax(e.target.value)}
                    onBlur={e => { if (e.target.value) setSalaryMaxDisplay(formatLPA(e.target.value)); }}
                    onFocus={e => { const raw = parseFloat(salaryMax) / 100000; setSalaryMaxDisplay(isNaN(raw) ? "" : String(raw)); }}
                    placeholder="Max CTC"
                  />
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
                rows={2} />
              <p className="mt-1 text-xs text-zinc-400">Separate benefits with commas.</p>
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
