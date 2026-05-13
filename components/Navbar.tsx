"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import { NAV_LINKS } from "@/lib/nav";
import type { SiteInfo } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  site,
  isAdmin = false,
}: {
  site: SiteInfo;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  async function logout() {
    setMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {isAdmin ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="group flex items-center gap-2 rounded-full font-display text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent2 text-white shadow-lg shadow-accent/20 transition group-hover:rotate-6">
                {site.name?.[0]?.toUpperCase() ?? "M"}
              </span>
              <span className="hidden sm:inline">
                {site.name}
                <span className="text-accent">.</span>
              </span>
              <FiChevronDown
                size={14}
                className={`text-muted transition ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-background/95 shadow-lg backdrop-blur-xl"
                >
                  <a
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted transition hover:bg-surface hover:text-foreground"
                  >
                    <FiSettings size={14} /> Admin
                  </a>
                  <button
                    onClick={logout}
                    role="menuitem"
                    className="flex w-full items-center gap-2 border-t border-border px-3 py-2.5 text-left text-sm text-muted transition hover:bg-surface hover:text-red-500"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
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
        )}

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
