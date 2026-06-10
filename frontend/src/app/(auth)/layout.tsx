import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg -z-10" />
      <div className="orb bg-brand-blue/25 h-[400px] w-[400px] -top-20 -left-20" />
      <div className="orb bg-brand-orange/20 h-[420px] w-[420px] bottom-0 right-10" style={{ animationDelay: "-6s" }} />

      <section className="relative flex flex-col p-8 md:p-12 lg:p-16">
        <Logo size={32} />
        <div className="my-auto py-12 max-w-md w-full mx-auto">{children}</div>
        <div className="text-xs text-zinc-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Jobtake™</span>
          <Link href="/" className="hover:text-zinc-900">← Back to home</Link>
        </div>
      </section>

      <aside className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden">
        <div className="relative w-full max-w-md aspect-[3/4] rounded-[36px] glass-strong p-8 flex flex-col justify-between">
          <div>
            <div className="chip-ring inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium text-zinc-700">
              <span className="h-2 w-2 rounded-full bg-brand-blue" /> Calibrated AI matching
            </div>
            <p className="font-display mt-6 text-3xl tracking-tight font-medium leading-snug text-zinc-950">
              Join 240,000+ professionals already on <span className="text-gradient italic">Jobtake</span>.
            </p>
          </div>
          <div className="flex items-end justify-between">
            <div className="glass rounded-2xl p-4 w-44">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-blue to-violet-500 mb-2" />
              <div className="text-xs font-medium">Senior PM · 96% match</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Stripe · NYC</div>
            </div>
            <div className="text-right text-xs text-zinc-500">
              <div className="font-display font-medium text-zinc-950 text-lg">$240k+</div>
              <div>avg comp</div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
