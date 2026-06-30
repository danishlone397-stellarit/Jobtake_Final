import Link from "next/link";
import { Logo } from "./Logo";
import { Twitter, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const COLS = [
  { title: "Product", links: [["AI Match", "/ai-match"], ["Jobs", "/jobs"], ["Companies", "/companies"], ["Post a job", "/employer/post-job"]] },
  { title: "For You", links: [["Sign in", "/login"], ["Sign up", "/signup"], ["Seeker dashboard", "/dashboard"], ["Employer dashboard", "/employer"]] },
  { title: "Company", links: [["About", "/about"], ["Privacy", "/privacy"], ["Terms", "/terms"]] },
];

export function PublicFooter() {
  return (
    <footer className="relative pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="divider-grad mb-16" />
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <Logo size={54} />
            <p className="mt-5 text-sm text-zinc-600 max-w-sm leading-relaxed">
              The hiring layer for extraordinary careers. Built for senior talent and ambitious teams.
            </p>
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 font-semibold">Contact</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-zinc-500" /><span>202, Mourya Center, 16, Race Course Road, Opp. BBC, Indore – 452003</span></li>
                <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-zinc-500" /><span>For Employers: <a href="mailto:enquiry@jobtake.com" className="hover:text-zinc-950 transition-colors">enquiry@jobtake.com</a></span></li>
                <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-zinc-500" /><span>For Employees / Resume Submission: <a href="mailto:resume@jobtake.com" className="hover:text-zinc-950 transition-colors">resume@jobtake.com</a></span></li>
                <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-zinc-500" /><span>Support: <a href="mailto:support@jobtake.com" className="hover:text-zinc-950 transition-colors">support@jobtake.com</a></span></li>
                <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-zinc-500" /><span>Contact No.: Will be shared shortly</span></li>
              </ul>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-full glass grid place-items-center text-zinc-700 hover:text-zinc-950 hover:-translate-y-0.5 transition-all" aria-label="social">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 font-semibold">{c.title}</div>
              <ul className="mt-5 space-y-3 text-sm text-zinc-700">
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-zinc-950 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} Jobtake™ Labs</div>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> All systems normal</span>
        </div>
      </div>
    </footer>
  );
}
