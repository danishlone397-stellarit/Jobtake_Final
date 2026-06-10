import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import Link from "next/link";
import { Sparkles, Building2, Users, BrainCircuit, ArrowRight } from "lucide-react";

export default function EmployersPage() {
  return (
    <main className="min-h-screen relative">
      <PublicNav />
      <div className="absolute inset-0 mesh-bg -z-10 opacity-60" />
      <div className="orb bg-brand-blue/25 h-[420px] w-[420px] -top-24 -left-24" />
      <div className="orb bg-brand-orange/25 h-[420px] w-[420px] top-32 -right-32" style={{ animationDelay: "-6s" }} />

      <section className="pt-36 pb-16 mx-auto max-w-6xl px-6 md:px-12 text-center">
        <div className="chip-ring inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-700">
          <Sparkles className="h-3 w-3 text-brand-blue" /> For hiring teams
        </div>
        <h1 className="font-display mt-6 text-5xl md:text-7xl tracking-[-0.04em] font-medium leading-[0.96] text-zinc-950">
          Hire the <span className="text-gradient italic">top 1%</span><br />without the noise.
        </h1>
        <p className="text-zinc-600 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
          Skip the inbound flood. Jobtake delivers calibrated shortlists from a private pool of senior, principal, and leadership professionals.
        </p>
        <div className="mt-10 flex gap-3 justify-center flex-wrap">
          <Link href="/signup" className="btn-primary rounded-full px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2" data-testid="employer-cta-signup">Start hiring <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/employer/post-job" className="btn-glass rounded-full px-6 py-3.5 text-sm font-medium">Post a role</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 md:px-12 py-16 grid md:grid-cols-3 gap-5">
        {[
          { icon: BrainCircuit, title: "AI-calibrated shortlists", desc: "Trajectory, taste & culture weighted independently — not just keywords." },
          { icon: Users, title: "Private candidate pool", desc: "Senior talent opted-in to be discovered. Never indexed externally." },
          { icon: Building2, title: "End-to-end pipeline", desc: "Stage tracking, ratings, notes, interview events — all in one place." },
        ].map(f => (
          <div key={f.title} className="glass rounded-3xl p-7">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange grid place-items-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_24px_-8px_rgba(99,71,250,0.45)]">
              <f.icon className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <h3 className="font-display mt-5 text-xl font-medium text-zinc-950">{f.title}</h3>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <PublicFooter />
    </main>
  );
}
