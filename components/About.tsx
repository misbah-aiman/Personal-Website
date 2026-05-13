"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import type { About as AboutType } from "@/lib/types";

export default function About({ about }: { about: AboutType }) {
  return (
    <section id="about" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="About" title="A little about me" />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <p className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
              {about.intro}
            </p>
            {about.body.map((para, i) => (
              <p
                key={i}
                className="mt-5 text-base leading-relaxed text-muted md:text-lg"
              >
                {para}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-4 lg:col-span-5"
          >
            {about.stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-accent/60"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/0 via-accent/0 to-accent2/0 opacity-0 transition-opacity group-hover:opacity-20" />
                <p className="font-display text-4xl font-bold tracking-tight md:text-5xl gradient-text">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
