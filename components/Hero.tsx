"use client";

import { motion } from "framer-motion";
import { FiArrowDown, FiGithub, FiMail } from "react-icons/fi";
import TypingEffect from "./TypingEffect";
import type { SiteInfo } from "@/lib/types";

type Props = { site: SiteInfo; typingPhrases: string[] };

export default function Hero({ site, typingPhrases }: Props) {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-28"
    >
      <div className="absolute inset-0 -z-10 bg-grid-pattern bg-[size:48px_48px] opacity-60 dark:opacity-100" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-background" />

      <motion.div
        aria-hidden
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute -top-32 -left-32 -z-10 h-[480px] w-[480px] rounded-full bg-accent/30 blur-[120px]"
      />
      <motion.div
        aria-hidden
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute -bottom-32 -right-32 -z-10 h-[480px] w-[480px] rounded-full bg-accent2/25 blur-[120px]"
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-mono text-muted backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            available for internships & collabs
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            Hey, I’m{" "}
            <span className="gradient-text">{site.name}</span>.
            <br />
            <span className="text-foreground/90">I build &amp; sketch.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg text-muted md:text-xl"
          >
            <span className="font-mono text-foreground">&gt;</span>{" "}
            <TypingEffect
              phrases={typingPhrases.length ? typingPhrases : [site.role]}
              className="font-mono text-foreground"
            />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
          >
            I’m a CS undergrad obsessed with clean interfaces, thoughtful
            interactions, and the quiet joy of making something from nothing —
            whether that’s a side project or a charcoal sketch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/20"
            >
              See my work
              <FiArrowDown className="transition group-hover:translate-y-0.5" />
            </a>
            {site.github && (
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-3 text-sm font-medium backdrop-blur transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <FiGithub /> GitHub
              </a>
            )}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-3 text-sm font-medium backdrop-blur transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <FiMail /> Contact
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative lg:col-span-5"
        >
          <div className="relative animate-float">
            <div className="glow-ring overflow-hidden rounded-2xl border border-border bg-surface/70 p-4 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-1.5 pb-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-muted">
                  ~/{site.name.toLowerCase()}/about.ts
                </span>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-background/70 p-4 font-mono text-[12.5px] leading-relaxed text-foreground/90">
{`const ${site.name.toLowerCase()} = {
  role:     ${JSON.stringify(site.role)},
  stack:    ["TS", "React", "Next", "Python"],
  loves:    ["clean UI", "ink wash", "long walks"],
  building: "things that didn't exist yesterday",
  reachOut: () => ${JSON.stringify(site.email)},
};

export default ${site.name.toLowerCase()};`}
              </pre>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden h-24 w-24 rotate-12 rounded-2xl bg-gradient-to-br from-accent to-accent2 opacity-90 blur-2xl md:block" />
            <div className="absolute -top-4 -right-4 hidden h-20 w-20 -rotate-12 rounded-2xl border border-accent/40 bg-surface/70 backdrop-blur md:block" />
          </div>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted md:flex"
      >
        <span className="font-mono">scroll</span>
        <span className="h-10 w-[2px] animate-pulse bg-gradient-to-b from-accent to-transparent" />
      </a>
    </section>
  );
}
