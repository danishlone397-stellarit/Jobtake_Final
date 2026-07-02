"use client";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Target, Clock } from "lucide-react";

export function CTA() {
  const router = useRouter();

  return (
    <section className="relative bg-white py-20 md:py-28">
      {/* Soft blue glow on right */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0  top-0 h-full w-[55%] bg-[radial-gradient(ellipse_70%_60%_at_75%_50%,rgba(219,234,254,0.55)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* ── LEFT — copy ── */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[13px] font-semibold text-blue-600 mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Join thousands of professionals
            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-[3.4rem] font-black leading-[1.07] tracking-tight text-zinc-900">
              Your next role is<br />
              <span className="relative inline-block text-blue-600">
                one signal
                <svg
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full"
                  style={{ height: 10 }}
                  viewBox="0 0 280 10"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M30 7C65 2.5 120 2 165 4.5C195 6.5 225 8.5 248 7" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.65" />
                </svg>
              </span>
              {" "}away.
            </h2>

            {/* Subtitle */}
            <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-500">
              Create your free profile in minutes and let the right opportunities find you — confidentiality guaranteed.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => router.push("/signup?role=candidate")}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-blue-500/25 transition-colors hover:bg-blue-700"
              >
                Create my profile <span>→</span>
              </button>
              <button
                onClick={() => router.push("/employers/login")}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-[15px] font-semibold text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                I&apos;m hiring instead
              </button>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap gap-7">
              {[
                { icon: Lock,   title: "100% Private",  desc: "Your data stays private and secure." },
                { icon: Target, title: "Smart Matching", desc: "Better matches using skills, experience & preferences." },
                { icon: Clock,  title: "Quick & Easy",   desc: "Create your profile in just 4 minutes." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-2.5" style={{ maxWidth: 148 }}>
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-zinc-100 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-zinc-900">{title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — illustration (inline SVG) ── */}
          <div className="hidden lg:flex items-center justify-center">
            <svg
              viewBox="0 0 540 520"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[520px]"
              aria-hidden="true"
            >
              {/* concentric rings */}
              <circle cx="290" cy="260" r="220" stroke="#E4E7EF" strokeWidth="1.2" />
              <circle cx="290" cy="260" r="158" stroke="#E4E7EF" strokeWidth="1.2" />
              <circle cx="290" cy="260" r="96"  stroke="#D1D5E0" strokeWidth="1.2" />

              {/* coloured dots */}
              <circle cx="140" cy="148" r="7"  fill="#3B82F6" />
              <circle cx="448" cy="198" r="6"  fill="#34D399" />
              <circle cx="108" cy="336" r="8"  fill="#FB923C" />
              <circle cx="238" cy="308" r="5"  fill="#A78BFA" />

              {/* center blue circle with person icon */}
              <circle cx="290" cy="260" r="46" fill="#2563EB" />
              <circle cx="290" cy="248" r="12" fill="white" fillOpacity="0.95" />
              <path d="M265 278 Q265 262 290 262 Q315 262 315 278 Q315 285 290 288 Q265 285 265 278Z" fill="white" fillOpacity="0.95" />
              <path d="M278 260 L262 252M302 260 L318 252" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.85" />

              {/* ── For Job Seekers card (top-left) ── */}
              <rect x="18" y="30" width="210" height="168" rx="18" fill="white" />
              <rect x="18" y="30" width="210" height="168" rx="18" stroke="#E4E7EF" strokeWidth="1.2" />

              <rect x="30" y="44" width="100" height="18" rx="9" fill="#F1F5F9" />
              <text x="80" y="57" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="system-ui,sans-serif">For Job Seekers</text>

              <circle cx="58" cy="106" r="22" fill="url(#wGrad)" />
              <circle cx="58" cy="100" r="9"  fill="white" fillOpacity="0.88" />
              <ellipse cx="58" cy="118" rx="13" ry="8" fill="white" fillOpacity="0.88" />

              <rect x="90" y="96"  width="96" height="7" rx="3.5" fill="#E2E8F0" />
              <rect x="90" y="109" width="72" height="7" rx="3.5" fill="#E2E8F0" />
              <rect x="90" y="122" width="52" height="7" rx="3.5" fill="#E2E8F0" />

              <circle cx="210" cy="96" r="11" fill="#2563EB" />
              <path d="M205 96.5 L208.5 100 L215 93" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

              <text x="30" y="163" fill="#0F172A" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Discover roles</text>
              <text x="30" y="180" fill="#64748B" fontSize="11" fontFamily="system-ui,sans-serif">that match your skills</text>
              <text x="30" y="193" fill="#64748B" fontSize="11" fontFamily="system-ui,sans-serif">and ambition.</text>

              {/* ── For Employers card (bottom-right) ── */}
              <rect x="312" y="322" width="210" height="168" rx="18" fill="white" />
              <rect x="312" y="322" width="210" height="168" rx="18" stroke="#FED7AA" strokeWidth="1.5" />

              <rect x="324" y="336" width="88" height="18" rx="9" fill="#FFF7ED" />
              <text x="368" y="349" textAnchor="middle" fill="#F97316" fontSize="9" fontWeight="600" fontFamily="system-ui,sans-serif">For Employers</text>

              <circle cx="352" cy="398" r="22" fill="url(#mGrad)" />
              <circle cx="352" cy="392" r="9"  fill="white" fillOpacity="0.88" />
              <ellipse cx="352" cy="410" rx="13" ry="8" fill="white" fillOpacity="0.88" />

              <rect x="384" y="388" width="96" height="7" rx="3.5" fill="#E2E8F0" />
              <rect x="384" y="401" width="72" height="7" rx="3.5" fill="#E2E8F0" />

              <circle cx="504" cy="388" r="11" fill="#F97316" />
              <path d="M499 388.5 L502.5 392 L509 385" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

              <text x="324" y="447" fill="#0F172A" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Find the right talent</text>
              <text x="324" y="464" fill="#64748B" fontSize="11" fontFamily="system-ui,sans-serif">faster with curated,</text>
              <text x="324" y="477" fill="#64748B" fontSize="11" fontFamily="system-ui,sans-serif">quality profiles.</text>

              <defs>
                <linearGradient id="wGrad" x1="36" y1="84" x2="80" y2="128" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93C5FD" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="mGrad" x1="330" y1="376" x2="374" y2="420" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FDB976" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
