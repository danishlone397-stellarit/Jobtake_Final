"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Company = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  website: string | null;
  industry: string | null;
  size: string | null;
  founded: number | null;
  headquarters: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  benefits: { id: string; label: string }[];
} | null;

export function CompanyEditForm({ company }: { company: Company }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name:         company?.name         ?? "",
    tagline:      company?.tagline      ?? "",
    description:  company?.description  ?? "",
    website:      company?.website      ?? "",
    industry:     company?.industry     ?? "",
    size:         company?.size         ?? "",
    founded:      company?.founded?.toString() ?? "",
    headquarters: company?.headquarters ?? "",
    logoUrl:      company?.logoUrl      ?? "",
    bannerUrl:    company?.bannerUrl    ?? "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/employer/company", {
        method: company ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, founded: form.founded ? parseInt(form.founded) : null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save"); setLoading(false); return; }
      setSaved(true);
      setTimeout(() => { router.push("/employer/company"); router.refresh(); }, 800);
    } catch { setError("Network error"); setLoading(false); }
  }

  const Field = ({ label, name, type = "text", placeholder = "" }: { label: string; name: keyof typeof form; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">{label}</label>
      <input
        type={type} value={form[name]} onChange={set(name)} placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
      />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
        <h2 className="font-bold text-zinc-900 mb-4">Company Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Company Name *" name="name" placeholder="Acme Technologies" />
          <Field label="Industry" name="industry" placeholder="IT Services & Consulting" />
          <Field label="Company Size" name="size" placeholder="201-500" />
          <Field label="Founded Year" name="founded" type="number" placeholder="2010" />
          <Field label="Website" name="website" placeholder="https://yourcompany.com" />
          <Field label="Headquarters" name="headquarters" placeholder="Mumbai, Maharashtra, India" />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Tagline</label>
          <input
            type="text" value={form.tagline} onChange={set("tagline")}
            placeholder="Where teams build the future"
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Company Description</label>
          <textarea
            value={form.description} onChange={set("description")} rows={4}
            placeholder="Tell candidates about your company, culture, and mission..."
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white resize-none"
          />
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
        <h2 className="font-bold text-zinc-900 mb-4">Branding</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Logo URL" name="logoUrl" placeholder="https://..." />
          <Field label="Banner URL" name="bannerUrl" placeholder="https://..." />
        </div>
        {(form.logoUrl || form.bannerUrl) && (
          <div className="mt-4 flex gap-4">
            {form.logoUrl && (
              <div>
                <p className="text-xs text-zinc-400 mb-1">Logo Preview</p>
                <img src={form.logoUrl} alt="logo" className="h-16 w-16 rounded-xl object-contain border border-zinc-200" />
              </div>
            )}
            {form.bannerUrl && (
              <div className="flex-1">
                <p className="text-xs text-zinc-400 mb-1">Banner Preview</p>
                <img src={form.bannerUrl} alt="banner" className="h-16 w-full rounded-xl object-cover border border-zinc-200" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error / Success */}
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      {saved && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">✓ Saved! Redirecting...</div>}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit" disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
        <Link href="/employer/company" className="flex items-center gap-2 border border-zinc-200 text-zinc-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Cancel
        </Link>
      </div>
    </form>
  );
}
