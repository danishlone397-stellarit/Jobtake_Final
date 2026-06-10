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
    <button onClick={logout} className="btn-glass rounded-full text-xs px-3 py-1.5 inline-flex items-center gap-1.5" data-testid="dashboard-logout">
      <LogOut className="h-3 w-3" /> Sign out
    </button>
  );
}
