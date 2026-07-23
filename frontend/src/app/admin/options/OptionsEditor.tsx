"use client";

import { ComponentType, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  IndianRupee,
  Info,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  UserRound,
  Wand2,
} from "lucide-react";
import { ManagedOption, ManagedOptions, ManagedOptionType, OPTION_TYPE_LABELS } from "@/lib/job-option-types";

type OptionMeta = {
  type: ManagedOptionType;
  singular: string;
  hint: string;
  placeholder: string;
  valuePlaceholder: string;
  swatch: string;
  icon: ComponentType<{ className?: string }>;
};

const TYPES: OptionMeta[] = [
  {
    type: "LOCATION",
    singular: "Location",
    hint: "Used in job location fields and job filters.",
    placeholder: "e.g. Mumbai, India",
    valuePlaceholder: "Mumbai, India",
    swatch: "bg-blue-50 text-blue-600",
    icon: MapPin,
  },
  {
    type: "INDUSTRY",
    singular: "Industry",
    hint: "Used in employer company forms and job categories.",
    placeholder: "e.g. IT & Software",
    valuePlaceholder: "IT & Software",
    swatch: "bg-emerald-50 text-emerald-600",
    icon: BriefcaseBusiness,
  },
  {
    type: "ROLE",
    singular: "Role",
    hint: "Used as job title suggestions while posting jobs.",
    placeholder: "e.g. Sales Executive",
    valuePlaceholder: "Sales Executive",
    swatch: "bg-violet-50 text-violet-600",
    icon: UserRound,
  },
  {
    type: "CTC",
    singular: "CTC Band",
    hint: "Use stored values like 3-6 or 10- for LPA bands.",
    placeholder: "e.g. 3 - 6 LPA",
    valuePlaceholder: "3-6",
    swatch: "bg-orange-50 text-orange-500",
    icon: IndianRupee,
  },
  {
    type: "EXPERIENCE",
    singular: "Experience Band",
    hint: "Use stored values like 1-3 or 10- for years.",
    placeholder: "e.g. 1 - 3 years",
    valuePlaceholder: "1-3",
    swatch: "bg-cyan-50 text-cyan-600",
    icon: Wand2,
  },
];

type Drafts = Record<ManagedOptionType, { label: string; value: string }>;

function blankDrafts(): Drafts {
  return {
    LOCATION: { label: "", value: "" },
    INDUSTRY: { label: "", value: "" },
    ROLE: { label: "", value: "" },
    CTC: { label: "3 - 6 LPA", value: "3-6" },
    EXPERIENCE: { label: "1 - 3 years", value: "1-3" },
  };
}

function sortRows(rows: ManagedOption[]) {
  return [...rows].sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
}

export function OptionsEditor({ options }: { options: ManagedOptions }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Drafts>(() => blankDrafts());

  const totalOptions = useMemo(
    () => TYPES.reduce((count, item) => count + (options[item.type]?.length ?? 0), 0),
    [options],
  );
  const activeOptions = useMemo(
    () => TYPES.reduce((count, item) => count + (options[item.type]?.filter((row) => row.active).length ?? 0), 0),
    [options],
  );

  function updateDraft(type: ManagedOptionType, field: "label" | "value", value: string) {
    setDrafts((current) => ({ ...current, [type]: { ...current[type], [field]: value } }));
  }

  async function patch(id: string, body: object) {
    setBusy(id);
    const res = await fetch(`/api/admin/options/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(null);
    if (res.ok) router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this option?")) return;
    setBusy(id);
    const res = await fetch(`/api/admin/options/${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) router.refresh();
  }

  async function create(type: ManagedOptionType) {
    const label = drafts[type].label.trim();
    const value = (drafts[type].value.trim() || label).trim();
    if (!label || !value) return;

    const rows = options[type] ?? [];
    setBusy(`new-${type}`);
    const res = await fetch("/api/admin/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label, value, sortOrder: rows.length }),
    });
    setBusy(null);
    if (!res.ok) return;

    setDrafts((current) => ({ ...current, [type]: blankDrafts()[type] }));
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-base font-black text-zinc-900">Manage Job Master Data</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Add, edit, hide, reorder, or delete the values used across job forms.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-zinc-100 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Total</div>
                <div className="mt-1 text-xl font-black text-zinc-900">{totalOptions}</div>
              </div>
              <div className="rounded-xl border border-zinc-100 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Active</div>
                <div className="mt-1 text-xl font-black text-blue-600">{activeOptions}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {TYPES.map(({ type, icon: Icon, swatch }) => (
              <a
                key={type}
                href={`#${type.toLowerCase()}-options`}
                className="flex min-h-[72px] items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-3 transition hover:border-blue-100 hover:bg-blue-50/40"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${swatch}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-zinc-900">{OPTION_TYPE_LABELS[type]}</span>
                  <span className="block text-xs font-medium text-zinc-400">{options[type]?.length ?? 0} options</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {TYPES.map((meta) => {
          const rows = sortRows(options[meta.type] ?? []);
          const Icon = meta.icon;

          return (
            <section
              key={meta.type}
              id={`${meta.type.toLowerCase()}-options`}
              className="scroll-mt-6 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${meta.swatch}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-black text-zinc-900">{OPTION_TYPE_LABELS[meta.type]}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{meta.hint}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-[minmax(160px,1fr)_minmax(140px,220px)_auto] md:items-end">
                <label className="block">
                  <span className="label">{meta.singular} label</span>
                  <input
                    className="input"
                    value={drafts[meta.type].label}
                    onChange={(event) => updateDraft(meta.type, "label", event.target.value)}
                    placeholder={meta.placeholder}
                  />
                </label>
                <label className="block">
                  <span className="label">Stored value</span>
                  <input
                    className="input"
                    value={drafts[meta.type].value}
                    onChange={(event) => updateDraft(meta.type, "value", event.target.value)}
                    placeholder={meta.valuePlaceholder}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => create(meta.type)}
                  disabled={busy === `new-${meta.type}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy === `new-${meta.type}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add
                </button>
              </div>

              <div className="mt-6 divide-y divide-zinc-100">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-3 py-4 md:grid-cols-[minmax(160px,1fr)_minmax(140px,220px)_80px_96px_44px] md:items-center"
                  >
                    <label className="block">
                      <span className="sr-only">{meta.singular} label</span>
                      <input
                        defaultValue={row.label}
                        onBlur={(event) => {
                          const value = event.target.value.trim();
                          if (value && value !== row.label) patch(row.id, { label: value });
                        }}
                        className="h-11 w-full rounded-xl border border-transparent bg-white px-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-blue-200 focus:bg-blue-50/30"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">{meta.singular} value</span>
                      <input
                        defaultValue={row.value}
                        onBlur={(event) => {
                          const value = event.target.value.trim();
                          if (value && value !== row.value) patch(row.id, { value });
                        }}
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 font-mono text-xs text-zinc-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">{meta.singular} order</span>
                      <input
                        type="number"
                        defaultValue={row.sortOrder}
                        onBlur={(event) => {
                          const value = Number(event.target.value);
                          if (Number.isInteger(value) && value !== row.sortOrder) patch(row.id, { sortOrder: value });
                        }}
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>
                    <label className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-xs font-semibold text-zinc-600">
                      <input
                        type="checkbox"
                        checked={row.active}
                        onChange={(event) => patch(row.id, { active: event.target.checked })}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      Show
                    </label>
                    <div className="flex items-center justify-end gap-2">
                      {busy === row.id && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
                      <button
                        type="button"
                        onClick={() => remove(row.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-red-600 transition hover:bg-red-50"
                        aria-label={`Delete ${row.label}`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {!rows.length && (
                  <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-8 text-center text-sm font-medium text-zinc-400">
                    No {OPTION_TYPE_LABELS[meta.type].toLowerCase()} added yet.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm xl:sticky xl:top-8 xl:self-start">
        <div>
          <h2 className="text-base font-black text-zinc-900">Website Preview</h2>
          <p className="mt-3 text-sm text-zinc-500">Active options will appear in posting forms and suggestions.</p>
        </div>

        <div className="mt-7 space-y-6">
          {TYPES.map((meta) => {
            const rows = sortRows(options[meta.type] ?? []).filter((row) => row.active);
            const Icon = meta.icon;

            return (
              <div key={meta.type} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.swatch}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900">{OPTION_TYPE_LABELS[meta.type]}</h3>
                    <p className="mt-0.5 text-xs font-medium text-zinc-400">{rows.length} active</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {rows.slice(0, 10).map((row) => (
                    <span key={row.id} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      {row.label}
                    </span>
                  ))}
                  {rows.length > 10 && (
                    <span className="rounded-full border border-zinc-100 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-500">
                      +{rows.length - 10} more
                    </span>
                  )}
                  {!rows.length && <p className="text-sm font-medium text-zinc-400">No active options.</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex items-start gap-2 text-xs font-medium text-zinc-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Changes save when you add, delete, toggle, or leave an edited field.
        </div>
      </aside>
    </div>
  );
}
