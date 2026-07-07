import Link from "next/link";
import Image from "next/image";
import worldMap from "@/assets/img/world-map.svg";
import { Facebook, Twitter, Linkedin, MapPin, Mail, Phone } from "lucide-react";

const COLS = [
  {
    title: "PRODUCT",
    links: [
      ["Browse Jobs",       "/jobs"],
      ["Browse Companies",  "/companies"],
      ["Post a Job",        "/employer/post-job"],
      ["For Employers",     "/employers"],
      ["AI Match",          "/ai-match"],
    ],
  },
  {
    title: "FOR JOB SEEKERS",
    links: [
      ["Sign In",          "/login"],
      ["Sign Up",          "/signup"],
      ["Seeker Dashboard", "/dashboard"],
      ["Saved Jobs",       "/dashboard/saved"],
      ["Job Alerts",       "/dashboard/alerts"],
      ["Career Advice",    "/blog"],
    ],
  },
  {
    title: "FOR EMPLOYERS",
    links: [
      ["Employer Dashboard", "/employer"],
      ["Post a Job",         "/employer/post-job"],
      ["Manage Jobs",        "/employer/jobs"],
      ["Applicants",         "/employer/jobs"],
    ],
  },
  {
    title: "COMPANY",
    links: [
      ["About Us",        "/about"],
      ["Careers",         "/careers"],
      ["Privacy Policy",  "/privacy"],
      ["Terms of Service","/terms"],
      ["Contact Us",      "/contact"],
    ],
  },
];

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

const SOCIALS = [
  { icon: Facebook,      label: "Facebook",  href: "#" },
  { icon: Twitter,       label: "Twitter",   href: "#" },
  { icon: Linkedin,      label: "LinkedIn",  href: "#" },
  { icon: PinterestIcon, label: "Pinterest", href: "#" },
];

const TRUST = [
  { icon: "🛡", title: "Trusted by Top Companies",     desc: "Helping leading organizations build high-performing teams." },
  { icon: "👥", title: "Great Careers Start Here",      desc: "Connecting exceptional talent with meaningful opportunities." },
  { icon: "⚡", title: "Smart Hiring, Simplified",      desc: "Powerful tools to find, hire and manage the right talent." },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#0d2154] text-white">

      {/* ── Main footer grid ── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 pt-16 pb-12">
        <div className="grid lg:grid-cols-[300px_1fr] gap-12">

          {/* Left: Brand + trust + subscribe */}
          <div>
            <p className="text-sm text-blue-200 leading-relaxed mb-6">
              The hiring layer for extraordinary careers.<br />Built for senior talent and ambitious teams.
            </p>

            {/* Trust points */}
            <div className="space-y-4 mb-8">
              {TRUST.map(t => (
                <div key={t.title} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-base shrink-0">{t.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.title}</div>
                    <div className="text-xs text-blue-300 leading-relaxed">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="bg-white/10 rounded-2xl p-5">
              <div className="font-bold text-white text-sm mb-1">Stay Updated</div>
              <p className="text-xs text-blue-200 mb-4">Get the latest job alerts and hiring insights straight to your inbox.</p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-blue-300 outline-none focus:border-blue-400 mb-2"
              />
              <button className="w-full bg-blue-500 hover:bg-blue-400 transition text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2">
                Subscribe ✈
              </button>
            </div>
          </div>

          {/* Right: Nav columns + contact + social */}
          <div className="space-y-10">

            {/* Nav columns */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {COLS.map(col => (
                <div key={col.title}>
                  <div className="text-xs font-black tracking-[0.18em] text-white mb-4">{col.title}</div>
                  <div className="w-8 h-0.5 bg-blue-400 mb-4" />
                  <ul className="space-y-2.5">
                    {col.links.map(([label, href]) => (
                      <li key={label}>
                        <Link href={href} className="text-sm text-blue-200 hover:text-white transition-colors">{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact + Social row */}
            <div className="grid sm:grid-cols-2 gap-8">

              {/* Get In Touch */}
              <div>
                <div className="text-xs font-black tracking-[0.18em] text-white mb-4">GET IN TOUCH</div>
                <div className="w-8 h-0.5 bg-blue-400 mb-4" />
                <ul className="space-y-3 text-sm text-blue-200">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-white" />
                    <span>202, Mourya Center, 16, Race Course Road,<br />Opp. BBC, Indore — 452003</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-white" />
                    <span>For Employers: <a href="mailto:enquiry@jobtake.com" className="hover:text-white transition-colors">enquiry@jobtake.com</a></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-white" />
                    <span>Resume Submission: <a href="mailto:resume@jobtake.com" className="hover:text-white transition-colors">resume@jobtake.com</a></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-white" />
                    <span>Support: <a href="mailto:support@jobtake.com" className="hover:text-white transition-colors">support@jobtake.com</a></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-white" />
                    <span>Contact No.: Will be shared shortly</span>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <div className="text-xs font-black tracking-[0.18em] text-white mb-4">WE ARE SOCIALIZE</div>
                <div className="w-8 h-0.5 bg-blue-400 mb-4" />
                <div className="flex items-center gap-3">
                  {SOCIALS.map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} aria-label={label}
                      className="h-10 w-10 rounded-xl bg-white/10 hover:bg-blue-500 transition-colors flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </a>
                  ))}
                </div>

                {/* World map */}
                <div className="mt-6 rounded-2xl overflow-hidden p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <Image
                    src={worldMap}
                    alt="Global reach"
                    width={400}
                    height={222}
                    className="w-full h-auto opacity-70"
                    style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(40%) saturate(500%) hue-rotate(180deg) brightness(1.3)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
          <div>© {new Date().getFullYear()} Jobtake™ Labs. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🛡</span> Your data is secure with us
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
