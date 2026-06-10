"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export type Cat = { id: string; name: string; slug: string; iconUrl: string | null; accent: string | null; count: number };

export function Categories({ categories }: { categories: Cat[] }) {
  return (
    <section className="relative py-24 md:py-32" data-testid="categories-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold">Explore by craft</div>
            <h2 className="font-display mt-3 text-4xl md:text-5xl tracking-tight font-medium text-zinc-950 leading-[1.05] max-w-xl">
              Find your <span className="text-black">discipline.</span>
            </h2>
          </div>
          <p className="text-zinc-600 max-w-md text-base">Hand-curated categories with senior, principal and leadership roles across high-trust companies.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((c, i) => (
            <motion.div key={c.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.04, duration: 0.7 }}
              whileHover={{ y: -6 }}
            >
              <Link href={`/jobs?category=${c.slug}`} className="glass relative rounded-3xl p-5 md:p-6 overflow-hidden group block" data-testid={`category-${c.slug}`}>
                <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent || "from-violet-500/30 to-blue-500/30"} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`} />
                <div className="relative h-20 md:h-24 flex items-center justify-center">
                  {c.iconUrl ? (
                    <Image src={c.iconUrl} alt={c.name} width={96} height={96} className="h-full w-auto object-contain drop-shadow-[0_18px_28px_rgba(60,40,140,0.25)]" />
                  ) : (
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-blue to-violet-500" />
                  )}
                </div>
                <div className="relative mt-4 flex items-end justify-between">
                  <div>
                    <div className="font-display font-medium text-zinc-950 text-[15px]">{c.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{c.count.toLocaleString()} open roles</div>
                  </div>
                  <div className="h-8 w-8 rounded-full glass grid place-items-center group-hover:rotate-[-12deg] transition-transform">
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
