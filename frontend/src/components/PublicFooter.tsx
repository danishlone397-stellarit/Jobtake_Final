import Link from "next/link";
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
      ["Blog",            "/blog"],
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
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
                    <span>202, Mourya Center, 16, Race Course Road,<br />Opp. BBC, Indore — 452003</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                    <span>For Employers: <a href="mailto:enquiry@jobtake.com" className="hover:text-white transition-colors">enquiry@jobtake.com</a></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                    <span>Resume Submission: <a href="mailto:resume@jobtake.com" className="hover:text-white transition-colors">resume@jobtake.com</a></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                    <span>Support: <a href="mailto:support@jobtake.com" className="hover:text-white transition-colors">support@jobtake.com</a></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-blue-400" />
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

                {/* Dotted world map */}
                <div className="mt-6 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-40">
                    {/* Americas */}
                    {[[60,55],[65,60],[62,65],[58,70],[55,75],[57,80],[60,85],[63,90],[65,95],[68,100],[66,105],[63,108],[60,112],[62,118],[65,122],[67,127],[70,132],[68,137],[65,140],[62,143],[60,148],[58,152],[55,157],[53,162],[56,165],[59,168],[57,172],[54,175],[52,179],[50,182],[48,186],[50,190],[53,192],[56,188],[58,184],[60,180],[62,176],[65,173],[68,170],[70,166],[72,163],[74,159],[72,155],[70,151],[68,147],[70,143],[72,140],[74,137],[76,133],[78,129],[80,125],[78,121],[76,118],[78,114],[80,110],[82,106],[80,103],[78,100],[80,96],[82,92],[84,88],[82,84],[80,80],[78,77],[80,73],[82,69],[80,65],[78,62],[76,58],[73,55],[70,52],[67,50],[63,52]].map(([cx,cy],i)=>(
                      <circle key={`am${i}`} cx={cx} cy={cy} r="1.8" fill="rgba(147,197,253,0.7)" />
                    ))}
                    {/* Europe */}
                    {[[160,38],[165,35],[170,33],[175,30],[180,28],[185,30],[190,32],[195,30],[200,28],[205,30],[200,35],[195,38],[190,40],[185,42],[180,44],[175,46],[170,48],[165,50],[163,55],[165,58],[168,60],[172,62],[175,60],[178,57],[182,55],[186,53],[190,55],[193,58],[196,60],[193,63],[190,65],[187,67],[184,65],[181,68],[178,70],[175,68],[172,65],[169,63],[166,65],[163,68],[160,65],[158,62],[156,58],[158,53],[160,48],[162,43],[160,38]].map(([cx,cy],i)=>(
                      <circle key={`eu${i}`} cx={cx} cy={cy} r="1.8" fill="rgba(147,197,253,0.7)" />
                    ))}
                    {/* Africa */}
                    {[[175,80],[180,78],[185,76],[190,78],[195,80],[200,82],[198,87],[195,90],[193,95],[190,98],[188,103],[186,108],[184,113],[182,118],[180,123],[178,128],[176,133],[174,138],[176,143],[178,148],[180,152],[182,148],[184,143],[186,138],[188,133],[190,128],[192,123],[194,118],[196,113],[198,108],[200,103],[202,98],[204,93],[206,88],[204,83],[202,78],[200,75],[197,73],[193,72],[188,73],[183,75],[178,77]].map(([cx,cy],i)=>(
                      <circle key={`af${i}`} cx={cx} cy={cy} r="1.8" fill="rgba(147,197,253,0.7)" />
                    ))}
                    {/* Asia */}
                    {[[210,30],[215,28],[220,26],[225,28],[230,30],[235,28],[240,26],[245,28],[250,30],[255,28],[260,30],[265,32],[270,30],[275,28],[280,30],[285,32],[280,35],[275,37],[270,40],[265,42],[260,44],[255,42],[250,40],[245,42],[240,44],[235,42],[230,44],[225,46],[220,44],[215,42],[212,45],[210,48],[212,52],[215,55],[218,58],[222,60],[226,62],[230,60],[234,58],[238,56],[242,58],[246,60],[250,58],[254,60],[258,62],[262,60],[266,58],[270,60],[274,62],[278,60],[282,58],[285,60],[283,65],[280,68],[276,70],[272,68],[268,65],[264,68],[260,70],[256,68],[252,70],[248,68],[244,70],[240,68],[236,70],[232,68],[228,65],[224,68],[220,70],[216,68],[213,65],[210,62],[212,57]].map(([cx,cy],i)=>(
                      <circle key={`as${i}`} cx={cx} cy={cy} r="1.8" fill="rgba(147,197,253,0.7)" />
                    ))}
                    {/* Australia */}
                    {[[290,130],[295,128],[300,126],[305,128],[310,130],[315,128],[320,130],[318,135],[315,138],[310,140],[305,142],[300,140],[295,138],[292,135],[290,130]].map(([cx,cy],i)=>(
                      <circle key={`au${i}`} cx={cx} cy={cy} r="1.8" fill="rgba(147,197,253,0.7)" />
                    ))}
                  </svg>
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
