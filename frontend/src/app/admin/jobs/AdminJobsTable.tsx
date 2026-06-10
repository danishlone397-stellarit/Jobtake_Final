"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type Row = { id: string; title: string; status: string; featured: boolean; location: string; company: string; applicants: number; createdAt: string };

export function AdminJobsTable({ jobs }: { jobs: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function patch(id: string, body: object) {
    setBusy(id);
    await fetch(`/api/admin/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(null); router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    setBusy(id);
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    setBusy(null); router.refresh();
  }

  return (
    <div className="glass rounded-3xl p-2 overflow-x-auto" data-testid="admin-jobs-table">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applicants</th>
            <th className="px-4 py-3">Posted</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id} className="border-t border-zinc-200/60 hover:bg-white/70" data-testid={`admin-job-${j.id}`}>
              <td className="px-4 py-3 font-medium text-zinc-950">
                <div className="flex items-center gap-2">
                  {j.featured && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                  {j.title}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">{j.location}</div>
              </td>
              <td className="px-4 py-3 text-zinc-700">{j.company}</td>
              <td className="px-4 py-3"><span className="text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">{j.status.toLowerCase()}</span></td>
              <td className="px-4 py-3">{j.applicants}</td>
              <td className="px-4 py-3 text-zinc-500">{timeAgo(j.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-1.5">
                  {busy === j.id && <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />}
                  {j.status === "PENDING" && <button onClick={() => patch(j.id, { status: "PUBLISHED" })} className="btn-primary rounded-full text-xs px-3 py-1.5" data-testid={`approve-${j.id}`}>Publish</button>}
                  {j.status === "PENDING" && <button onClick={() => patch(j.id, { status: "REJECTED" })} className="btn-glass rounded-full text-xs px-3 py-1.5">Reject</button>}
                  <button onClick={() => patch(j.id, { featured: !j.featured })} className="btn-glass rounded-full text-xs px-3 py-1.5" data-testid={`feature-${j.id}`}>{j.featured ? "Unfeature" : "Feature"}</button>
                  <button onClick={() => remove(j.id)} className="btn-glass rounded-full text-xs px-3 py-1.5 text-red-600">Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {!jobs.length && <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500 text-sm">No jobs in the system yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
