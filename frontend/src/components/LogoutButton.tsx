"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={logout} className="flex items-center gap-2 w-full text-sm font-medium text-zinc-500 hover:text-zinc-900 px-1 py-1 transition-colors" data-testid="dashboard-logout">
      <LogOut className="h-4 w-4" /> Sign Out
    </button>
  );
}
