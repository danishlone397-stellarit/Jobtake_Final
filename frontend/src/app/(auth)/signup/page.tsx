"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SEEKER" | "EMPLOYER">("SEEKER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, location, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Signup failed"); setLoading(false); return; }
      router.push(role === "EMPLOYER" ? "/employer" : "/dashboard"); router.refresh();
    } catch {
      setError("Network error"); setLoading(false);
    }
  }

  return (
    <div data-testid="signup-page">
      <h1 className="font-display text-4xl tracking-tight font-medium text-zinc-950">Create your account</h1>
      <p className="text-zinc-600 mt-2">It takes less than a minute.</p>

      <div className="mt-6 grid grid-cols-2 gap-2 glass rounded-2xl p-1.5">
        {(["SEEKER", "EMPLOYER"] as const).map((r) => (
          <button key={r} type="button" onClick={() => setRole(r)} data-testid={`role-${r.toLowerCase()}`}
            className={`text-sm font-medium rounded-xl py-2 transition-all ${role === r ? "btn-primary text-white" : "text-zinc-700 hover:bg-white/70"}`}>
            {r === "SEEKER" ? "Job Seeker" : "Employer"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" required minLength={2} className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" data-testid="signup-name" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone number</label>
          <input id="phone" type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" data-testid="signup-phone" />
        </div>
        <div>
          <label className="label" htmlFor="location">Address / Location</label>
          <input id="location" type="text" className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Indore, MP" data-testid="signup-location" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@work.com" data-testid="signup-email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" required minLength={8} type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" data-testid="signup-password" />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2" data-testid="signup-error">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary w-full rounded-full px-5 py-3 text-sm font-medium inline-flex items-center justify-center gap-2" data-testid="signup-submit">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create account
        </button>
      </form>
      <p className="mt-6 text-sm text-zinc-600">
        Already a member? <Link href="/login" className="text-zinc-950 font-medium underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
