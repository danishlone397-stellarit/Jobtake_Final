"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, Briefcase, Building, Trophy } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  users: Users, jobs: Briefcase, building: Building, trophy: Trophy,
};

export type Stat = { id: string; label: string; value: string; suffix: string | null; iconKey: string | null; accent: string };

function Counter({ value, suffix, duration = 2 }: { value: string; suffix: string | null; duration?: number }) {
  // parse value: "2.4M", "184320", "1,824+"
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const m = value.match(/^([\d.]+)\s*([A-Za-z+]*)$/);
    if (!m) { setDisplay(value); return; }
    const target = parseFloat(m[1]);
    const tail = m[2] || "";
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setDisplay(`${current.toFixed(target % 1 === 0 ? 0 : 1)}${tail}`);
      if (t < 1) requestAnimationFrame(tick);
      else setDisplay(`${target}${tail}`);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}{suffix || ""}</span>;
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative py-24 md:py-32" data-testid="stats-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-14">
          <div className="text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold">By the numbers</div>
          <h2 className="font-display mt-3 text-4xl md:text-5xl tracking-tight font-medium text-zinc-950 max-w-2xl mx-auto leading-[1.05]">
            A hiring network <span className="text-black">built at scale,</span> tuned for nuance.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => {
            const Icon = ICONS[s.iconKey || "users"] || Users;
            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.8 }} whileHover={{ y: -6 }}
                className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden group" data-testid={`stat-${i}`}
              >
                <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} opacity-25 blur-2xl group-hover:opacity-40 transition-opacity`} />
                <div className={`relative h-12 w-12 rounded-2xl bg-gradient-to-br ${s.accent} grid place-items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-8px_rgba(99,71,250,0.45)]`}>
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                </div>
                <div className="relative mt-6 font-display text-4xl md:text-5xl font-medium tracking-tight text-zinc-950">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="relative mt-1 text-sm text-zinc-500">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
