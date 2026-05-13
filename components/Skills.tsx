"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { resolveIcon } from "@/lib/icons";
import type { SkillGroup } from "@/lib/types";

export default function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section id="skills" className="section-padding relative bg-surface/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="02 · Skills"
          title="Tools I reach for"
          description="A loose taxonomy of the languages, libraries, and tools I’ve used the most. Always learning, always swapping things out."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
              className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {group.title}
                </h3>
                <span className="font-mono text-xs text-muted">
                  0{gi + 1}
                </span>
              </div>

              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.skills.map((s, i) => {
                  const Icon = resolveIcon(s.iconName);
                  return (
                    <motion.li
                      key={s.name + i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-accent/60"
                    >
                      <Icon
                        size={20}
                        className="text-muted transition group-hover:text-accent"
                      />
                      <span className="text-sm font-medium">{s.name}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
