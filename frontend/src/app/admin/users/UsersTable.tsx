"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type Row = { id: string; name: string; email: string; role: "ADMIN" | "EMPLOYER" | "SEEKER"; status: "ACTIVE" | "SUSPENDED" | "PENDING"; createdAt: string; lastLoginAt: string | null };

export function UsersTable({ users }: { users: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function patch(id: string, body: object) {
    setBusy(id);
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(null); router.refresh();
  }

  return (
    <div className="glass rounded-3xl p-2 overflow-x-auto" data-testid="users-table">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Last login</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t border-zinc-200/60">
              <td className="px-4 py-3 font-medium text-zinc-950">{u.name}</td>
              <td className="px-4 py-3 text-zinc-700">{u.email}</td>
              <td className="px-4 py-3">
                <select defaultValue={u.role} onChange={(e) => patch(u.id, { role: e.target.value })} className="input py-1.5 text-xs">
                  <option value="SEEKER">Seeker</option>
                  <option value="EMPLOYER">Employer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <select defaultValue={u.status} onChange={(e) => patch(u.id, { status: e.target.value })} className="input py-1.5 text-xs">
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING">Pending</option>
                </select>
              </td>
              <td className="px-4 py-3 text-zinc-500">{timeAgo(u.createdAt)}</td>
              <td className="px-4 py-3 text-zinc-500">{u.lastLoginAt ? timeAgo(u.lastLoginAt) : "—"}</td>
              <td className="px-4 py-3">{busy === u.id && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
