"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  GripVertical,
  Info,
  Loader2,
  RotateCcw,
  Trophy,
  Users,
} from "lucide-react";

type Row = {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  iconKey: string | null;
  accent: string;
  sortOrder: number;
  active: boolean;
};

const ICON_OPTIONS = [
  { key: "jobs", label: "Active Jobs", icon: BriefcaseBusiness, swatch: "bg-blue-50 text-blue-600" },
  { key: "building", label: "Companies", icon: Building2, swatch: "bg-emerald-50 text-emerald-600" },
  { key: "users", label: "Candidates", icon: Users, swatch: "bg-violet-50 text-violet-600" },
  { key: "trophy", label: "Placements", icon: Trophy, swatch: "bg-orange-50 text-orange-500" },
];

function normalizeIconKey(stat: Row) {
  const key = stat.iconKey?.toLowerCase();
  const label = stat.label.toLowerCase();
  if (key && ICON_OPTIONS.some((item) => item.key === key)) return key;
  if (label.includes("job")) return "jobs";
  if (label.includes("compan")) return "building";
  if (label.includes("candidate") || label.includes("user")) return "users";
  if (label.includes("placement") || label.includes("hire")) return "trophy";
  return "users";
}

function formatValue(value: string, suffix: string | null) {
  const trimmed = value.trim();
  const ending = suffix ?? "";
  return `${trimmed}${ending}`;
}

export function StatsEditor({ stats }: { stats: Row[] }) {
  const router = useRouter();
  const initialRows = useMemo(
    () =>
      stats
        .map((stat, index) => ({
          ...stat,
          sortOrder: stat.sortOrder ?? index,
          iconKey: normalizeIconKey(stat),
          suffix: stat.suffix ?? "+",
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [stats],
  );

  const [rows, setRows] = useState<Row[]>(initialRows);
  const [busy, setBusy] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const visibleRows = rows.filter((row) => row.active);

  function updateRow(id: string, field: keyof Row, value: string | boolean | number | null) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  function moveRow(sourceId: string, targetId: string) {
    setRows((current) => {
      const sourceIndex = current.findIndex((row) => row.id === sourceId);
      const targetIndex = current.findIndex((row) => row.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return current;

      const next = [...current];
      const [source] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, source);
      return next.map((row, index) => ({ ...row, sortOrder: index }));
    });
  }

  function resetOrder() {
    setRows(initialRows.map((row, index) => ({ ...row, sortOrder: index })));
  }

  async function save() {
    setBusy(true);
    await Promise.all(
      rows.map((row, index) =>
        fetch(`/api/admin/stats/${row.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: row.label,
            value: row.value,
            suffix: row.suffix ?? "",
            iconKey: row.iconKey ?? "users",
            accent: row.accent,
            sortOrder: index,
            active: row.active,
          }),
        }),
      ),
    );
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-black text-zinc-900">Update Statistics</h2>
            <p className="mt-2 text-sm text-zinc-500">Edit the numbers shown on the homepage.</p>
          </div>

          <div className="mt-6 divide-y divide-zinc-100">
            {rows.map((stat) => {
              const iconOption = ICON_OPTIONS.find((item) => item.key === stat.iconKey) ?? ICON_OPTIONS[2];
              const Icon = iconOption.icon;

              return (
                <div key={stat.id} className="grid gap-4 py-4 md:grid-cols-[56px_minmax(150px,1fr)_minmax(220px,330px)] md:items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconOption.swatch}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_150px] md:block">
                    <label className="block">
                      <span className="sr-only">Statistic label</span>
                      <input
                        value={stat.label}
                        onChange={(event) => updateRow(stat.id, "label", event.target.value)}
                        className="h-11 w-full rounded-xl border border-transparent bg-white px-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-blue-200 focus:bg-blue-50/30"
                      />
                    </label>
                    <label className="block md:mt-2">
                      <span className="sr-only">Statistic icon</span>
                      <select
                        value={stat.iconKey ?? "users"}
                        onChange={(event) => updateRow(stat.id, "iconKey", event.target.value)}
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-600 outline-none"
                      >
                        {ICON_OPTIONS.map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_96px_80px]">
                    <label className="block">
                      <span className="sr-only">Statistic value</span>
                      <input
                        value={stat.value}
                        onChange={(event) => updateRow(stat.id, "value", event.target.value)}
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Statistic suffix</span>
                      <input
                        value={stat.suffix ?? ""}
                        onChange={(event) => updateRow(stat.id, "suffix", event.target.value)}
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                        placeholder="+"
                      />
                    </label>
                    <label className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-xs font-semibold text-zinc-600">
                      <input
                        type="checkbox"
                        checked={stat.active}
                        onChange={(event) => updateRow(stat.id, "active", event.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300"
                      />
                      Show
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-black text-zinc-900">Display Order</h2>
            <p className="mt-2 text-sm text-zinc-500">Drag and drop to reorder how statistics appear on the homepage.</p>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-zinc-100">
            {rows.map((stat) => (
              <div
                key={stat.id}
                draggable
                onDragStart={() => setDraggedId(stat.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggedId) moveRow(draggedId, stat.id);
                  setDraggedId(null);
                }}
                className="flex cursor-grab items-center gap-3 border-b border-zinc-100 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 last:border-b-0 active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-zinc-400" />
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={resetOrder}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Order
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>

      <aside className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm xl:sticky xl:top-8 xl:self-start">
        <div>
          <h2 className="text-base font-black text-zinc-900">Homepage Preview</h2>
          <p className="mt-3 text-sm text-zinc-500">This is how the statistics will appear on the homepage.</p>
        </div>

        <div className="mt-7 space-y-5">
          {visibleRows.map((stat) => {
            const iconOption = ICON_OPTIONS.find((item) => item.key === stat.iconKey) ?? ICON_OPTIONS[2];
            const Icon = iconOption.icon;

            return (
              <div key={stat.id} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${iconOption.swatch}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-black text-zinc-950">{formatValue(stat.value, stat.suffix)}</div>
                    <div className="mt-1 text-sm font-medium text-zinc-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {!visibleRows.length && (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-sm font-medium text-zinc-500">
              No visible statistics selected.
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center gap-2 text-xs font-medium text-zinc-500">
          <Info className="h-4 w-4" />
          The preview reflects your current edits.
        </div>
      </aside>
    </div>
  );
}
