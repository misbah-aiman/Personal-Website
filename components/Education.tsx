"use client";

import { motion } from "framer-motion";
import { FiBookOpen, FiMapPin, FiAward } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import type { Education as EducationType } from "@/lib/types";

export default function Education({
  education,
}: {
  education: EducationType[];
}) {
  return (
    <section id="education" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="03 · Education"
          title="Where I’ve been studying"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {education.map((edu, i) => (
            <motion.article
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-accent/60 md:p-8"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-accent/0 to-accent2/0 transition duration-500 group-hover:from-accent/20 group-hover:to-accent2/10" />

              <div className="flex items-start justify-between gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-background text-accent">
                  <FiBookOpen size={20} />
                </div>
                <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted">
                  {edu.period}
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold md:text-2xl">
                {edu.school}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">
                {edu.degree}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                {edu.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <FiMapPin size={14} /> {edu.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiAward size={14} /> {edu.grade}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
