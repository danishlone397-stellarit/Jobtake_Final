"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  jobTitle: string;
  companyName: string;
  location: string;
  slug: string;
  isSeeker: boolean;
  hasApplied: boolean;
}

export function StickyApplyBar({ jobTitle, companyName, location, slug, isSeeker, hasApplied }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 shadow-md px-6 py-3 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
      <div className="min-w-0">
        <div className="font-bold text-zinc-900 text-sm truncate">{jobTitle}</div>
        <div className="text-xs text-zinc-500 truncate">{companyName} · {location}</div>
      </div>
      {isSeeker ? (
        hasApplied ? (
          <span className="shrink-0 px-6 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm border border-emerald-200">
            ✓ Applied
          </span>
        ) : (
          <Link href={`/jobs/${slug}#apply`} className="shrink-0 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors">
            Apply Now →
          </Link>
        )
      ) : (
        <Link href="/login" className="shrink-0 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors">
          Apply Now →
        </Link>
      )}
    </div>
  );
}
