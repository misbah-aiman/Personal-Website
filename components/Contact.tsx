"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import SectionHeading from "./SectionHeading";
import type { SiteInfo } from "@/lib/types";

export default function Contact({ site }: { site: SiteInfo }) {
  const [submitted, setSubmitted] = useState(false);

  const socials = [
    { icon: FaGithub, href: site.github, label: "GitHub" },
    { icon: FaLinkedin, href: site.linkedin, label: "LinkedIn" },
    { icon: FaTwitter, href: site.twitter, label: "Twitter" },
    { icon: FaInstagram, href: site.instagram, label: "Instagram" },
  ].filter((s) => s.href);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(
      `Hello from ${String(data.get("name") ?? "your site")}`,
    );
    const body = encodeURIComponent(
      `${data.get("message") ?? ""}\n\n— ${data.get("name") ?? ""} (${data.get("email") ?? ""})`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    form.reset();
  };

  return (
    <section id="contact" className="section-padding relative bg-surface/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s build something"
          description="Open to internships, collabs, freelance briefs, or just a friendly hello. I usually reply within a day or two."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur md:p-8">
              <h3 className="font-display text-xl font-semibold">
                Other ways to reach me
              </h3>
              <p className="mt-2 text-sm text-muted">
                Pick whichever feels right. I check my email most often.
              </p>

              <div className="mt-6 space-y-4">
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-4 transition hover:-translate-y-0.5 hover:border-accent/60"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-accent">
                    <FiMail size={16} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      Email
                    </p>
                    <p className="text-sm font-medium">{site.email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-accent">
                    <FiMapPin size={16} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      Based in
                    </p>
                    <p className="text-sm font-medium">{site.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  >
                    <s.icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={onSubmit}
            className="relative overflow-hidden rounded-2xl border border-border bg-background/60 p-6 backdrop-blur md:p-8 lg:col-span-3"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Name" name="name" placeholder="Ada Lovelace" />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <Field
              label="Subject"
              name="subject"
              placeholder="Just saying hello"
              wrapperClass="mt-4"
            />
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell me about your idea, project, or question…"
                className="w-full resize-none rounded-xl border border-border bg-surface/60 p-3.5 text-sm outline-none transition focus:border-accent focus:bg-background"
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-xs text-muted">
                {submitted ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-500">
                    <FiCheckCircle /> Opening your mail client…
                  </span>
                ) : (
                  "Form opens your email app — no servers, no tracking."
                )}
              </p>
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition hover:-translate-y-0.5"
              >
                Send message
                <FiSend className="transition group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  wrapperClass = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  wrapperClass?: string;
}) {
  return (
    <div className={wrapperClass}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface/60 p-3.5 text-sm outline-none transition focus:border-accent focus:bg-background"
      />
    </div>
  );
}
