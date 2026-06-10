"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Row = { id: string; label: string; value: string; suffix: string | null; iconKey: string | null; accent: string; sortOrder: number; active: boolean };

const ICONS = ["users", "jobs", "building", "trophy"];
const ACCENTS = [
  "from-violet-500 to-blue-500", "from-blue-500 to-cyan-500",
  "from-orange-500 to-amber-500", "from-amber-500 to-yellow-500",
  "from-emerald-500 to-teal-500", "from-rose-500 to-pink-500",
];

export function StatsEditor({ stats }: { stats: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [n, setN] = useState({ label: "", value: "", suffix: "", iconKey: "users", accent: ACCENTS[0] });

  async function patch(id: string, body: object) {
    setBusy(id);
    await fetch(`/api/admin/stats/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(null); router.refresh();
  }
  async function remove(id: string) {
    setBusy(id); await fetch(`/api/admin/stats/${id}`, { method: "DELETE" }); setBusy(null); router.refresh();
  }
  async function create() {
    if (!n.label || !n.value) return;
    setBusy("new");
    await fetch("/api/admin/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...n, sortOrder: stats.length }) });
    setBusy(null); setN({ label: "", value: "", suffix: "", iconKey: "users", accent: ACCENTS[0] }); router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="glass-strong rounded-3xl p-5 grid md:grid-cols-5 gap-3 items-end">
        <div><label className="label">Label</label><input className="input" value={n.label} onChange={(e) => setN({ ...n, label: e.target.value })} placeholder="Active candidates" data-testid="new-stat-label" /></div>
        <div><label className="label">Value</label><input className="input" value={n.value} onChange={(e) => setN({ ...n, value: e.target.value })} placeholder="2.4M" data-testid="new-stat-value" /></div>
        <div><label className="label">Suffix</label><input className="input" value={n.suffix} onChange={(e) => setN({ ...n, suffix: e.target.value })} placeholder="" /></div>
        <div><label className="label">Icon</label><select className="input" value={n.iconKey} onChange={(e) => setN({ ...n, iconKey: e.target.value })}>{ICONS.map(i => <option key={i} value={i}>{i}</option>)}</select></div>
        <button onClick={create} disabled={busy === "new"} className="btn-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center justify-center gap-2" data-testid="new-stat-btn">
          {busy === "new" && <Loader2 className="h-4 w-4 animate-spin" />} <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="glass rounded-3xl p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <th className="px-4 py-3">Label</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Suffix</th><th className="px-4 py-3">Icon</th><th className="px-4 py-3">Accent</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Active</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.id} className="border-t border-zinc-200/60">
                <td className="px-4 py-3"><input defaultValue={s.label} onBlur={(e) => e.target.value !== s.label && patch(s.id, { label: e.target.value })} className="bg-transparent outline-none w-full font-medium" /></td>
                <td className="px-4 py-3"><input defaultValue={s.value} onBlur={(e) => e.target.value !== s.value && patch(s.id, { value: e.target.value })} className="bg-transparent outline-none w-24" /></td>
                <td className="px-4 py-3"><input defaultValue={s.suffix || ""} onBlur={(e) => patch(s.id, { suffix: e.target.value })} className="bg-transparent outline-none w-20" /></td>
                <td className="px-4 py-3"><select defaultValue={s.iconKey || "users"} onChange={(e) => patch(s.id, { iconKey: e.target.value })} className="input py-1.5 text-xs">{ICONS.map(i => <option key={i} value={i}>{i}</option>)}</select></td>
                <td className="px-4 py-3"><select defaultValue={s.accent} onChange={(e) => patch(s.id, { accent: e.target.value })} className="input py-1.5 text-xs">{ACCENTS.map(a => <option key={a} value={a}>{a.replace("from-", "")}</option>)}</select></td>
                <td className="px-4 py-3"><input type="number" defaultValue={s.sortOrder} onBlur={(e) => patch(s.id, { sortOrder: parseInt(e.target.value) })} className="input py-1.5 w-20" /></td>
                <td className="px-4 py-3"><button onClick={() => patch(s.id, { active: !s.active })} className={`text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{s.active ? "Active" : "Hidden"}</button></td>
                <td className="px-4 py-3 text-right">{busy === s.id && <Loader2 className="h-4 w-4 animate-spin inline text-zinc-400" />}<button onClick={() => remove(s.id)} className="btn-glass rounded-full text-xs px-3 py-1.5 ml-1.5 text-red-600"><Trash2 className="h-3 w-3" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
