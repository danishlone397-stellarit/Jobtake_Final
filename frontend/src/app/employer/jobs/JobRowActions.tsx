"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Users, MoreVertical, Pencil, Trash2 } from "lucide-react";

export function JobRowActions({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleDelete() {
    if (!confirm(`Delete "${jobTitle}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch {
      alert("Failed to delete job. Please try again.");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2 relative" ref={menuRef}>
      <Link href={`/employer/jobs/${jobId}/preview`} title="Preview" className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
        <Eye className="h-4 w-4 text-zinc-500" />
      </Link>
      <Link href={`/employer/jobs/${jobId}/applicants`} title="Applicants" className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
        <Users className="h-4 w-4 text-zinc-500" />
      </Link>
      <button
        title="More"
        onClick={() => setOpen(v => !v)}
        className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-zinc-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-zinc-200 bg-white shadow-lg py-1">
          <Link
            href={`/employer/jobs/${jobId}/preview`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            <Eye className="h-4 w-4 text-zinc-400" /> Preview Job
          </Link>
          <Link
            href={`/employer/jobs/${jobId}/edit`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            <Pencil className="h-4 w-4 text-zinc-400" /> Edit Job
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> {deleting ? "Deleting..." : "Delete Job"}
          </button>
        </div>
      )}
    </div>
  );
}
