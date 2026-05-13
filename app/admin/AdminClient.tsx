"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiSave,
  FiLogOut,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiCheck,
  FiAlertCircle,
  FiExternalLink,
  FiRotateCcw,
} from "react-icons/fi";
import type {
  Content,
  Education,
  Project,
  SkillGroup,
  About,
  AboutStat,
  Skill,
  SiteInfo,
} from "@/lib/types";
import { ICON_NAMES, resolveIcon } from "@/lib/icons";
import ThemeToggle from "@/components/ThemeToggle";

type TabId =
  | "site"
  | "about"
  | "phrases"
  | "skills"
  | "education"
  | "projects";

const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: "site", label: "Site & Contact", hint: "Name, email, socials" },
  { id: "about", label: "About", hint: "Intro, bio, stats" },
  { id: "phrases", label: "Typing phrases", hint: "Hero rotator" },
  { id: "skills", label: "Skills", hint: "Languages, frontend, backend" },
  { id: "education", label: "Education", hint: "Schools, degrees" },
  { id: "projects", label: "Projects", hint: "Portfolio cards" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function AdminClient({ initial }: { initial: Content }) {
  const router = useRouter();
  const [content, setContent] = useState<Content>(initial);
  const [tab, setTab] = useState<TabId>("site");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<
    { kind: "ok" | "err"; msg: string } | null
  >(null);

  const initialJson = useMemo(() => JSON.stringify(initial), [initial]);
  const currentJson = useMemo(() => JSON.stringify(content), [content]);
  const dirty = initialJson !== currentJson;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Save failed");
      }
      const j = await res.json();
      setContent(j.content as Content);
      setStatus({ kind: "ok", msg: "Saved." });
      router.refresh();
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3500);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function reset() {
    if (!confirm("Discard all unsaved changes?")) return;
    setContent(JSON.parse(initialJson) as Content);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent2 text-white shadow-md shadow-accent/30">
              ⚙
            </span>
            <div>
              <p className="font-display text-base font-bold leading-none">
                Admin
              </p>
              <p className="text-[11px] text-muted">
                {dirty ? "Unsaved changes" : "All changes saved"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  status.kind === "ok"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {status.kind === "ok" ? <FiCheck /> : <FiAlertCircle />}
                {status.msg}
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent sm:inline-flex"
            >
              View site <FiExternalLink size={12} />
            </a>
            <ThemeToggle />
            <button
              onClick={reset}
              disabled={!dirty}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent disabled:opacity-40"
            >
              <FiRotateCcw size={12} /> Reset
            </button>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-accent2 px-4 py-1.5 text-xs font-semibold text-white shadow shadow-accent/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSave size={12} /> {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted transition hover:border-red-500 hover:text-red-500"
            >
              <FiLogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="sticky top-24 flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition ${
                  tab === t.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-transparent text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                <span className="text-sm font-medium">{t.label}</span>
                <span className="text-[11px] text-muted">{t.hint}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          {tab === "site" && (
            <SiteEditor
              value={content.site}
              onChange={(v) => setContent({ ...content, site: v })}
            />
          )}
          {tab === "about" && (
            <AboutEditor
              value={content.about}
              onChange={(v) => setContent({ ...content, about: v })}
            />
          )}
          {tab === "phrases" && (
            <StringListEditor
              title="Hero typing phrases"
              description="Rotated through under the hero headline."
              items={content.typingPhrases}
              onChange={(v) =>
                setContent({ ...content, typingPhrases: v })
              }
              placeholder="Lifelong Learner"
            />
          )}
          {tab === "skills" && (
            <SkillsEditor
              groups={content.skillGroups}
              onChange={(v) => setContent({ ...content, skillGroups: v })}
            />
          )}
          {tab === "education" && (
            <EducationEditor
              items={content.education}
              onChange={(v) => setContent({ ...content, education: v })}
            />
          )}
          {tab === "projects" && (
            <ProjectsEditor
              items={content.projects}
              onChange={(v) => setContent({ ...content, projects: v })}
            />
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------- shared primitives ---------- */

function Card({
  title,
  children,
  actions,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6">
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          {title && (
            <h2 className="font-display text-xl font-bold">{title}</h2>
          )}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-accent"
      />
      {helper && <p className="mt-1 text-[11px] text-muted">{helper}</p>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-accent"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-current text-accent"
      />
      <span>{label}</span>
    </label>
  );
}

function RowActions({
  index,
  total,
  onUp,
  onDown,
  onDelete,
}: {
  index: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <IconBtn
        title="Move up"
        onClick={onUp}
        disabled={index === 0}
        icon={<FiArrowUp size={13} />}
      />
      <IconBtn
        title="Move down"
        onClick={onDown}
        disabled={index === total - 1}
        icon={<FiArrowDown size={13} />}
      />
      <IconBtn
        title="Delete"
        onClick={() => {
          if (confirm("Delete this item?")) onDelete();
        }}
        icon={<FiTrash2 size={13} />}
        danger
      />
    </div>
  );
}

function IconBtn({
  onClick,
  icon,
  title,
  disabled,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-muted transition disabled:opacity-30 ${
        danger
          ? "hover:border-red-500 hover:text-red-500"
          : "hover:border-accent hover:text-accent"
      }`}
    >
      {icon}
    </button>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-surface/40 px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent"
    >
      <FiPlus size={12} /> {label}
    </button>
  );
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/* ---------- editors ---------- */

function SiteEditor({
  value,
  onChange,
}: {
  value: SiteInfo;
  onChange: (v: SiteInfo) => void;
}) {
  const set = <K extends keyof SiteInfo>(k: K, v: SiteInfo[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <Card title="Site & contact details">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField label="Display name" value={value.name} onChange={(v) => set("name", v)} />
        <TextField label="Role / tagline" value={value.role} onChange={(v) => set("role", v)} />
        <TextField label="Email" type="email" value={value.email} onChange={(v) => set("email", v)} />
        <TextField label="Location" value={value.location} onChange={(v) => set("location", v)} />
        <TextField label="GitHub URL" value={value.github} onChange={(v) => set("github", v)} />
        <TextField label="LinkedIn URL" value={value.linkedin} onChange={(v) => set("linkedin", v)} />
        <TextField label="Twitter / X URL" value={value.twitter} onChange={(v) => set("twitter", v)} />
        <TextField label="Instagram URL" value={value.instagram} onChange={(v) => set("instagram", v)} />
      </div>
      <p className="mt-4 text-xs text-muted">
        Leave a social URL empty to hide its icon from the footer and contact section.
      </p>
    </Card>
  );
}

function AboutEditor({
  value,
  onChange,
}: {
  value: About;
  onChange: (v: About) => void;
}) {
  return (
    <div className="space-y-6">
      <Card title="About copy">
        <div className="space-y-4">
          <TextArea
            label="Intro line"
            value={value.intro}
            onChange={(v) => onChange({ ...value, intro: v })}
            rows={2}
          />
          {value.body.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  Paragraph {i + 1}
                </span>
                <RowActions
                  index={i}
                  total={value.body.length}
                  onUp={() => onChange({ ...value, body: moveItem(value.body, i, i - 1) })}
                  onDown={() => onChange({ ...value, body: moveItem(value.body, i, i + 1) })}
                  onDelete={() =>
                    onChange({ ...value, body: value.body.filter((_, j) => j !== i) })
                  }
                />
              </div>
              <textarea
                value={p}
                rows={3}
                onChange={(e) =>
                  onChange({
                    ...value,
                    body: value.body.map((x, j) => (j === i ? e.target.value : x)),
                  })
                }
                className="w-full resize-y rounded-lg border border-border bg-background p-2.5 text-sm outline-none transition focus:border-accent"
              />
            </div>
          ))}
          <AddButton
            label="Add paragraph"
            onClick={() => onChange({ ...value, body: [...value.body, ""] })}
          />
        </div>
      </Card>

      <Card title="Stats">
        <div className="space-y-3">
          {value.stats.map((s, i) => (
            <StatRow
              key={i}
              stat={s}
              index={i}
              total={value.stats.length}
              onChange={(ns) =>
                onChange({
                  ...value,
                  stats: value.stats.map((x, j) => (j === i ? ns : x)),
                })
              }
              onMoveUp={() =>
                onChange({ ...value, stats: moveItem(value.stats, i, i - 1) })
              }
              onMoveDown={() =>
                onChange({ ...value, stats: moveItem(value.stats, i, i + 1) })
              }
              onDelete={() =>
                onChange({
                  ...value,
                  stats: value.stats.filter((_, j) => j !== i),
                })
              }
            />
          ))}
          <AddButton
            label="Add stat"
            onClick={() =>
              onChange({
                ...value,
                stats: [...value.stats, { value: "0", label: "New stat" }],
              })
            }
          />
        </div>
      </Card>
    </div>
  );
}

function StatRow({
  stat,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  stat: AboutStat;
  index: number;
  total: number;
  onChange: (v: AboutStat) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-[1fr_2fr_auto] md:items-end">
      <TextField label="Value" value={stat.value} onChange={(v) => onChange({ ...stat, value: v })} />
      <TextField label="Label" value={stat.label} onChange={(v) => onChange({ ...stat, label: v })} />
      <div className="pb-1">
        <RowActions index={index} total={total} onUp={onMoveUp} onDown={onMoveDown} onDelete={onDelete} />
      </div>
    </div>
  );
}

function StringListEditor({
  title,
  description,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  description?: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Card title={title}>
      {description && <p className="-mt-2 mb-4 text-sm text-muted">{description}</p>}
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={s}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(items.map((x, j) => (j === i ? e.target.value : x)))
              }
              className="flex-1 rounded-xl border border-border bg-background p-2.5 text-sm outline-none transition focus:border-accent"
            />
            <RowActions
              index={i}
              total={items.length}
              onUp={() => onChange(moveItem(items, i, i - 1))}
              onDown={() => onChange(moveItem(items, i, i + 1))}
              onDelete={() => onChange(items.filter((_, j) => j !== i))}
            />
          </div>
        ))}
        <AddButton label="Add phrase" onClick={() => onChange([...items, ""])} />
      </div>
    </Card>
  );
}

function SkillsEditor({
  groups,
  onChange,
}: {
  groups: SkillGroup[];
  onChange: (v: SkillGroup[]) => void;
}) {
  return (
    <div className="space-y-6">
      <Card
        title="Skill groups"
        actions={
          <AddButton
            label="Add group"
            onClick={() =>
              onChange([
                ...groups,
                { id: uid(), title: "New group", skills: [] },
              ])
            }
          />
        }
      >
        <p className="-mt-2 mb-4 text-sm text-muted">
          Group skills however you like — by language, by stack, by domain. The
          frontend renders them as labelled cards.
        </p>
        <div className="space-y-5">
          {groups.map((g, gi) => (
            <SkillGroupBlock
              key={g.id}
              group={g}
              index={gi}
              total={groups.length}
              onChange={(ng) =>
                onChange(groups.map((x, j) => (j === gi ? ng : x)))
              }
              onMoveUp={() => onChange(moveItem(groups, gi, gi - 1))}
              onMoveDown={() => onChange(moveItem(groups, gi, gi + 1))}
              onDelete={() => onChange(groups.filter((_, j) => j !== gi))}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function SkillGroupBlock({
  group,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  group: SkillGroup;
  index: number;
  total: number;
  onChange: (v: SkillGroup) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-[220px] flex-1">
          <TextField
            label="Group title"
            value={group.title}
            onChange={(v) => onChange({ ...group, title: v })}
          />
        </div>
        <RowActions
          index={index}
          total={total}
          onUp={onMoveUp}
          onDown={onMoveDown}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-4 space-y-2">
        {group.skills.map((s, i) => (
          <SkillRow
            key={i}
            skill={s}
            index={i}
            total={group.skills.length}
            onChange={(ns) =>
              onChange({
                ...group,
                skills: group.skills.map((x, j) => (j === i ? ns : x)),
              })
            }
            onMoveUp={() =>
              onChange({
                ...group,
                skills: moveItem(group.skills, i, i - 1),
              })
            }
            onMoveDown={() =>
              onChange({
                ...group,
                skills: moveItem(group.skills, i, i + 1),
              })
            }
            onDelete={() =>
              onChange({
                ...group,
                skills: group.skills.filter((_, j) => j !== i),
              })
            }
          />
        ))}
        <AddButton
          label="Add skill"
          onClick={() =>
            onChange({
              ...group,
              skills: [...group.skills, { name: "New skill", iconName: "FaCode" }],
            })
          }
        />
      </div>
    </div>
  );
}

function SkillRow({
  skill,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  skill: Skill;
  index: number;
  total: number;
  onChange: (v: Skill) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const Icon = resolveIcon(skill.iconName);
  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-surface/40 p-3 md:grid-cols-[40px_1fr_1fr_auto] md:items-end">
      <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-accent">
        <Icon size={18} />
      </div>
      <TextField label="Name" value={skill.name} onChange={(v) => onChange({ ...skill, name: v })} />
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted">
          Icon
        </span>
        <select
          value={skill.iconName}
          onChange={(e) => onChange({ ...skill, iconName: e.target.value })}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-accent"
        >
          {ICON_NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <div className="pb-1">
        <RowActions index={index} total={total} onUp={onMoveUp} onDown={onMoveDown} onDelete={onDelete} />
      </div>
    </div>
  );
}

function EducationEditor({
  items,
  onChange,
}: {
  items: Education[];
  onChange: (v: Education[]) => void;
}) {
  return (
    <Card
      title="Education entries"
      actions={
        <AddButton
          label="Add entry"
          onClick={() =>
            onChange([
              ...items,
              {
                id: uid(),
                school: "New school",
                degree: "",
                period: "",
                location: "",
                description: "",
                grade: "",
              },
            ])
          }
        />
      }
    >
      <div className="space-y-4">
        {items.map((e, i) => (
          <div key={e.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Entry {i + 1}
              </span>
              <RowActions
                index={i}
                total={items.length}
                onUp={() => onChange(moveItem(items, i, i - 1))}
                onDown={() => onChange(moveItem(items, i, i + 1))}
                onDelete={() => onChange(items.filter((_, j) => j !== i))}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="School" value={e.school} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, school: v } : x)))} />
              <TextField label="Degree" value={e.degree} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, degree: v } : x)))} />
              <TextField label="Period" value={e.period} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, period: v } : x)))} />
              <TextField label="Location" value={e.location} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, location: v } : x)))} />
              <TextField label="Grade / honors" value={e.grade} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, grade: v } : x)))} />
            </div>
            <div className="mt-3">
              <TextArea
                label="Description"
                value={e.description}
                rows={3}
                onChange={(v) =>
                  onChange(items.map((x, j) => (j === i ? { ...x, description: v } : x)))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProjectsEditor({
  items,
  onChange,
}: {
  items: Project[];
  onChange: (v: Project[]) => void;
}) {
  return (
    <Card
      title="Projects"
      actions={
        <AddButton
          label="Add project"
          onClick={() =>
            onChange([
              ...items,
              {
                id: uid(),
                title: "New project",
                description: "",
                image: "",
                tags: [],
                github: "",
                demo: "",
                featured: false,
              },
            ])
          }
        />
      }
    >
      <div className="space-y-4">
        {items.map((p, i) => (
          <div key={p.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Project {i + 1}
              </span>
              <div className="flex items-center gap-3">
                <Toggle
                  label="Featured"
                  checked={!!p.featured}
                  onChange={(v) =>
                    onChange(items.map((x, j) => (j === i ? { ...x, featured: v } : x)))
                  }
                />
                <RowActions
                  index={i}
                  total={items.length}
                  onUp={() => onChange(moveItem(items, i, i - 1))}
                  onDown={() => onChange(moveItem(items, i, i + 1))}
                  onDelete={() => onChange(items.filter((_, j) => j !== i))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Title" value={p.title} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
              <TextField label="Image URL" value={p.image} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, image: v } : x)))} helper="Public image URL or /images/projects/xxx.jpg" />
              <TextField label="GitHub URL" value={p.github ?? ""} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, github: v } : x)))} />
              <TextField label="Demo URL" value={p.demo ?? ""} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, demo: v } : x)))} />
            </div>
            <div className="mt-3">
              <TextArea
                label="Description"
                value={p.description}
                rows={3}
                onChange={(v) =>
                  onChange(items.map((x, j) => (j === i ? { ...x, description: v } : x)))
                }
              />
            </div>
            <div className="mt-3">
              <TagsField
                label="Tags (comma-separated)"
                tags={p.tags}
                onChange={(v) =>
                  onChange(items.map((x, j) => (j === i ? { ...x, tags: v } : x)))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TagsField({
  label,
  tags,
  onChange,
}: {
  label: string;
  tags: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      <input
        type="text"
        value={tags.join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-accent"
        placeholder="React, TypeScript, Tailwind"
      />
    </label>
  );
}
