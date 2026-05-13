"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { NAV_LINKS } from "@/lib/nav";
import type { SiteInfo } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ site }: { site: SiteInfo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#home"
          className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent2 text-white shadow-lg shadow-accent/20 transition group-hover:rotate-6">
            {site.name?.[0]?.toUpperCase() ?? "M"}
          </span>
          <span className="hidden sm:inline">
            {site.name}
            <span className="text-accent">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:-translate-y-0.5 hover:shadow-lg md:inline-flex"
          >
            Let’s talk
          </a>
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface/60 text-foreground lg:hidden"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-base text-muted transition hover:bg-surface hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-xl bg-foreground px-3 py-2 text-center text-base font-medium text-background"
                >
                  Let’s talk
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
