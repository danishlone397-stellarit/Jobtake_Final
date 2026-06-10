"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2 } from "lucide-react";

type Row = { id: string; name: string; slug: string; iconUrl: string | null; accent: string | null; sortOrder: number; active: boolean };

const ACCENT_OPTIONS = [
  "from-violet-500/30 to-blue-500/30",
  "from-fuchsia-500/30 to-rose-500/30",
  "from-orange-400/30 to-amber-400/30",
  "from-cyan-400/30 to-blue-500/30",
  "from-emerald-500/30 to-teal-500/30",
  "from-rose-400/30 to-pink-500/30",
  "from-yellow-400/30 to-orange-500/30",
];

export function CategoriesEditor({ categories }: { categories: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");

  async function patch(id: string, body: object) {
    setBusy(id);
    await fetch(`/api/admin/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(null); router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete category?")) return;
    setBusy(id);
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setBusy(null); router.refresh();
  }
  async function create() {
    if (!newName.trim()) return;
    setBusy("new");
    await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName, iconUrl: newIcon || undefined, sortOrder: categories.length }) });
    setBusy(null); setNewName(""); setNewIcon(""); router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="glass-strong rounded-3xl p-5 flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="label">New category name</label>
          <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Engineering" data-testid="new-cat-name" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="label">Icon URL (optional)</label>
          <input className="input" value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="https://…/icon.png" data-testid="new-cat-icon" />
        </div>
        <button onClick={create} disabled={busy === "new"} className="btn-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2" data-testid="new-cat-btn">
          {busy === "new" && <Loader2 className="h-4 w-4 animate-spin" />} <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="glass rounded-3xl p-2 overflow-x-auto" data-testid="categories-table">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Accent</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t border-zinc-200/60">
                <td className="px-4 py-3 font-medium text-zinc-950">
                  <input defaultValue={c.name} onBlur={(e) => e.target.value !== c.name && patch(c.id, { name: e.target.value })} className="bg-transparent outline-none w-full" />
                </td>
                <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3">
                  <select defaultValue={c.accent || ACCENT_OPTIONS[0]} onChange={(e) => patch(c.id, { accent: e.target.value })} className="input py-1.5 text-xs">
                    {ACCENT_OPTIONS.map(a => <option key={a} value={a}>{a.replace("from-", "").replace("/30", "")}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input type="number" defaultValue={c.sortOrder} onBlur={(e) => parseInt(e.target.value) !== c.sortOrder && patch(c.id, { sortOrder: parseInt(e.target.value) })} className="input py-1.5 w-20" />
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => patch(c.id, { active: !c.active })} className={`text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                    {c.active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {busy === c.id && <Loader2 className="h-4 w-4 animate-spin inline text-zinc-400" />}
                  <button onClick={() => remove(c.id)} className="btn-glass rounded-full text-xs px-3 py-1.5 inline-flex items-center gap-1 ml-1.5 text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
