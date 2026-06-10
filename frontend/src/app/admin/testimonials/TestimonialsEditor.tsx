"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Row = { id: string; name: string; role: string; quote: string; avatarUrl: string | null; accent: string; sortOrder: number; active: boolean };

const ACCENTS = ["from-violet-400 to-blue-500", "from-orange-400 to-amber-500", "from-emerald-400 to-teal-500", "from-rose-400 to-pink-500"];

export function TestimonialsEditor({ items }: { items: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [n, setN] = useState({ name: "", role: "", quote: "", avatarUrl: "", accent: ACCENTS[0] });

  async function patch(id: string, body: object) {
    setBusy(id); await fetch(`/api/admin/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); setBusy(null); router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete testimonial?")) return;
    setBusy(id); await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" }); setBusy(null); router.refresh();
  }
  async function create() {
    if (!n.name || !n.quote) return;
    setBusy("new");
    await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...n, sortOrder: items.length }) });
    setBusy(null); setN({ name: "", role: "", quote: "", avatarUrl: "", accent: ACCENTS[0] }); router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="glass-strong rounded-3xl p-5 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="label">Name</label><input className="input" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} data-testid="new-t-name" /></div>
          <div><label className="label">Role</label><input className="input" value={n.role} onChange={(e) => setN({ ...n, role: e.target.value })} placeholder="Principal Engineer · Linear" /></div>
        </div>
        <div><label className="label">Quote</label><textarea className="input" value={n.quote} onChange={(e) => setN({ ...n, quote: e.target.value })} data-testid="new-t-quote" /></div>
        <div className="flex items-end gap-3">
          <div className="flex-1"><label className="label">Avatar URL</label><input className="input" value={n.avatarUrl} onChange={(e) => setN({ ...n, avatarUrl: e.target.value })} /></div>
          <button onClick={create} disabled={busy === "new"} className="btn-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2" data-testid="new-t-btn">
            {busy === "new" && <Loader2 className="h-4 w-4 animate-spin" />} <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(t => (
          <div key={t.id} className="glass rounded-3xl p-5">
            <div className="flex items-start justify-between">
              <div><div className="font-medium text-zinc-950">{t.name}</div><div className="text-xs text-zinc-500">{t.role}</div></div>
              <button onClick={() => remove(t.id)} className="btn-glass rounded-full text-xs px-3 py-1.5 text-red-600"><Trash2 className="h-3 w-3" /></button>
            </div>
            <textarea defaultValue={t.quote} onBlur={(e) => e.target.value !== t.quote && patch(t.id, { quote: e.target.value })} className="input mt-3" />
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <select defaultValue={t.accent} onChange={(e) => patch(t.id, { accent: e.target.value })} className="input py-1.5 text-xs">{ACCENTS.map(a => <option key={a} value={a}>{a.replace("from-","")}</option>)}</select>
              <button onClick={() => patch(t.id, { active: !t.active })} className={`text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full ${t.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{t.active ? "Active" : "Hidden"}</button>
              {busy === t.id && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
