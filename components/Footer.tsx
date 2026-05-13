"use client";

import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import type { SiteInfo } from "@/lib/types";

export default function Footer({ site }: { site: SiteInfo }) {
  const socials = [
    { icon: FaGithub, href: site.github, label: "GitHub" },
    { icon: FaLinkedin, href: site.linkedin, label: "LinkedIn" },
    { icon: FaTwitter, href: site.twitter, label: "Twitter" },
    { icon: FaInstagram, href: site.instagram, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <footer className="relative border-t border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-bold">
              {site.name}
              <span className="text-accent">.</span>
            </p>
            <p className="mt-2 max-w-md text-sm text-muted">
              Built late at night with Next.js, Tailwind, and a lot of chai.
              Designed and developed by {site.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <s.icon size={16} />
              </a>
            ))}
            <a
              href="#home"
              aria-label="Back to top"
              className="ml-2 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent2 text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5"
            >
              <FiArrowUp size={16} />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">made with care · v1.0</p>
        </div>
      </div>
    </footer>
  );
}
