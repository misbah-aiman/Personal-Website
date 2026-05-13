"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiStar } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import type { Project } from "@/lib/types";

export default function Projects({ projects }: { projects: Project[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, [projects]);
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.tags.includes(active)),
    [active, projects],
  );

  return (
    <section id="projects" className="section-padding relative bg-surface/30">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Projects"
            title="Things I’ve built"
            description="A rotating selection of side projects and coursework — pick a tag to filter."
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active === t
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-background text-muted hover:border-accent/60 hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
                  {p.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur">
                      <FiStar size={10} className="text-accent" /> featured
                    </span>
                  )}

                  <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-accent hover:text-white"
                      >
                        <FiGithub size={12} /> Code
                      </a>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:bg-accent hover:text-white"
                      >
                        <FiExternalLink size={12} /> Demo
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold transition group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {p.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
