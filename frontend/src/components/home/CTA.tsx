"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative rounded-[36px] overflow-hidden glass-strong p-10 md:p-16">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand-blue/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-brand-orange/30 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-end">
            <div>
              <div className="chip-ring inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-zinc-700">
                <Sparkles className="h-3 w-3 text-brand-blue" /> Become a member
              </div>
              <h2 className="font-display mt-5 text-4xl md:text-6xl tracking-tight font-medium text-zinc-950 leading-[1.02]">
                Your next role is <span className="text-black">one signal</span> away.
              </h2>
              <p className="mt-6 text-zinc-600 text-lg max-w-md leading-relaxed">
                Build a private profile in 4 minutes. The right teams find you — quietly, on your terms.
              </p>
            </div>
            <div className="flex md:justify-end items-end">
              <div className="flex flex-wrap gap-3">
                <Link href="/signup" className="btn-primary rounded-full px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2" data-testid="cta-signup">
                  Create my profile <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/employer/post-job" className="btn-glass rounded-full px-6 py-3.5 text-sm font-medium" data-testid="cta-employer">
                  I'm hiring instead
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
