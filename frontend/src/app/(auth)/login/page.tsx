"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      const dest = data.user.role === "ADMIN" ? "/admin" : data.user.role === "EMPLOYER" ? "/employer" : "/dashboard";
      router.push(dest); router.refresh();
    } catch {
      setError("Network error"); setLoading(false);
    }
  }

  return (
    <div data-testid="login-page">
      <h1 className="font-display text-4xl tracking-tight font-medium text-zinc-950">Welcome back</h1>
      <p className="text-zinc-600 mt-2">Sign in to continue your search.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" data-testid="login-email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@work.com" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" data-testid="login-password" type="password" required minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2" data-testid="login-error">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary w-full rounded-full px-5 py-3 text-sm font-medium inline-flex items-center justify-center gap-2" data-testid="login-submit">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
      </form>
      <p className="mt-6 text-sm text-zinc-600">
        New here? <Link href="/signup" className="text-zinc-950 font-medium underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
