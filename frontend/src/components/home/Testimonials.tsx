"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export type T = { id: string; name: string; role: string; quote: string; avatarUrl: string | null; accent: string };

export function Testimonials({ items }: { items: T[] }) {
  if (!items.length) return null;
  return (
    <section className="relative py-24 md:py-32" data-testid="testimonials-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-14">
          <div className="text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold">Success stories</div>
          <h2 className="font-display mt-3 text-4xl md:text-5xl tracking-tight font-medium text-zinc-950 leading-[1.05] max-w-2xl mx-auto">
            Careers <span className="text-black">redirected,</span> not just filled.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {items.map((t, i) => (
            <motion.figure key={t.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.8 }} whileHover={{ y: -6 }}
              className="glass rounded-3xl p-7 relative overflow-hidden flex flex-col"
            >
              <div className={`absolute -top-14 -right-14 h-40 w-40 rounded-full bg-gradient-to-br ${t.accent} blur-2xl opacity-25`} />
              <Quote className="h-7 w-7 text-zinc-300 relative" strokeWidth={1.5} />
              <blockquote className="relative mt-5 text-zinc-800 text-[15.5px] leading-relaxed font-medium">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="relative mt-7 pt-5 border-t border-zinc-200/60 flex items-center gap-3">
                <span className={`relative h-11 w-11 rounded-full p-[1.5px] bg-gradient-to-br ${t.accent}`}>
                  {t.avatarUrl ? (
                    <Image src={t.avatarUrl} alt={t.name} width={44} height={44} className="h-full w-full rounded-full object-cover bg-white" />
                  ) : (
                    <span className="h-full w-full rounded-full bg-white grid place-items-center text-xs font-medium text-zinc-800">{t.name.split(" ").map(p => p[0]).slice(0,2).join("")}</span>
                  )}
                </span>
                <div>
                  <div className="font-display font-medium text-zinc-950 text-[14.5px]">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
