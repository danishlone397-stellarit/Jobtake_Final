"use client";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Target, Clock } from "lucide-react";

export default function Hero({ totalJobs: _totalJobs }: { totalJobs: number }) {
  const router = useRouter();

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative flex-1 flex items-center mx-auto max-w-7xl px-6 md:px-12 w-full pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Join thousands of professionals
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-[1.08] tracking-tight">
              Your next role is<br />
              <span className="relative inline-block text-blue-600">
                one signal
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 320 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 8.5C60 3.5 140 2 200 5.5C240 8 290 10 318 8.5" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
              </span>{" "}away.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-zinc-500 text-lg leading-relaxed max-w-md">
              Create your free profile in minutes and let the right opportunities find you — confidentiality guaranteed.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <button
                onClick={() => router.push("/signup?role=candidate")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-[15px] shadow-lg shadow-blue-600/25"
              >
                Create my profile <span className="text-lg leading-none">→</span>
              </button>
              <button
                onClick={() => router.push("/employers/login")}
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold px-7 py-3.5 rounded-full border border-zinc-200 hover:border-zinc-300 transition-colors text-[15px]"
              >
                I&apos;m hiring instead
              </button>
            </div>

            {/* Trust items */}
            <div className="mt-10 flex items-start gap-8 flex-wrap">
              {[
                { icon: Lock, title: "100% Private", desc: "Your data stays private and secure." },
                { icon: Target, title: "Smart Matching", desc: "Better matches using skills, experience & preferences." },
                { icon: Clock, title: "Quick & Easy", desc: "Create your profile in just 4 minutes." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-2.5 max-w-[160px]">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — illustration */}
          <div className="relative flex items-center justify-center h-[480px] lg:h-[520px]">
            {/* Concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-[420px] w-[420px] rounded-full border border-zinc-100" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-[300px] w-[300px] rounded-full border border-zinc-100" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-[180px] w-[180px] rounded-full border border-zinc-200/60" />
            </div>

            {/* Center circle with Jobtake star */}
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 z-10">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                <path d="M24 4L28 16H40L31 23L34 36L24 29L14 36L17 23L8 16H20L24 4Z" fill="white" />
              </svg>
            </div>

            {/* Dot accents */}
            <div className="absolute top-[22%] left-[18%] h-3 w-3 rounded-full bg-blue-500" />
            <div className="absolute top-[38%] right-[14%] h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="absolute bottom-[30%] left-[12%] h-4 w-4 rounded-full bg-orange-400" />
            <div className="absolute top-[60%] right-[22%] h-2 w-2 rounded-full bg-violet-400" />

            {/* For Job Seekers card */}
            <div className="absolute top-[8%] left-[4%] bg-white rounded-2xl border border-zinc-200 shadow-xl p-4 w-52">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">For Job Seekers</div>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold text-base shrink-0">
                  S
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 bg-zinc-100 rounded-full w-full" />
                  <div className="h-2 bg-zinc-100 rounded-full w-3/4" />
                </div>
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-bold text-zinc-900">Discover roles</div>
                <div className="text-xs text-zinc-500 mt-0.5">that match your skills and ambition.</div>
              </div>
            </div>

            {/* For Employers card */}
            <div className="absolute bottom-[6%] right-[2%] bg-white rounded-2xl border border-zinc-200 shadow-xl p-4 w-52">
              <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-3">For Employers</div>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-base shrink-0">
                  E
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 bg-zinc-100 rounded-full w-full" />
                  <div className="h-2 bg-zinc-100 rounded-full w-2/3" />
                </div>
                <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-bold text-zinc-900">Find the right talent</div>
                <div className="text-xs text-zinc-500 mt-0.5">faster with curated, quality profiles.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
