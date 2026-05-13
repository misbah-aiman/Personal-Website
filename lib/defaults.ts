import type { Content } from "./types";

export const DEFAULT_CONTENT: Content = {
  site: {
    name: "Misbah",
    role: "Computer Science Student",
    email: "misbahaiman65@gmail.com",
    github: "https://github.com/misbah",
    linkedin: "https://linkedin.com/in/misbah",
    twitter: "https://twitter.com/misbah",
    instagram: "https://instagram.com/misbah",
    location: "Lahore, Pakistan",
  },
  typingPhrases: [
    "Computer Science Student",
    "Full-Stack Developer",
    "Open Source Tinkerer",
    "Digital Artist & Sketcher",
    "Lifelong Learner",
  ],
  about: {
    intro:
      "Hi, I’m Misbah — a Computer Science student who loves crafting things at the intersection of code and creativity.",
    body: [
      "I’m currently studying CS with a focus on systems, web engineering, and applied machine learning. When I’m not chasing bugs, I’m usually sketching, writing, or chasing a new side project that probably doesn’t need to exist.",
      "I care a lot about clean interfaces, thoughtful typography, and code that reads like prose. I believe the best engineers are also curious humans — so I balance late-night coding sessions with charcoal pencils, books, and long walks.",
    ],
    stats: [
      { value: "20+", label: "Projects Built" },
      { value: "5+", label: "Languages" },
      { value: "100+", label: "Sketches Drawn" },
      { value: "∞", label: "Cups of Chai" },
    ],
  },
  skillGroups: [
    {
      id: "languages",
      title: "Languages",
      skills: [
        { name: "TypeScript", iconName: "SiTypescript" },
        { name: "JavaScript", iconName: "SiJavascript" },
        { name: "Python", iconName: "SiPython" },
        { name: "Java", iconName: "FaJava" },
        { name: "C++", iconName: "SiCplusplus" },
      ],
    },
    {
      id: "frontend",
      title: "Frontend",
      skills: [
        { name: "React", iconName: "SiReact" },
        { name: "Next.js", iconName: "SiNextdotjs" },
        { name: "Tailwind CSS", iconName: "SiTailwindcss" },
        { name: "HTML5", iconName: "SiHtml5" },
        { name: "CSS3", iconName: "SiCss3" },
      ],
    },
    {
      id: "backend",
      title: "Backend & Data",
      skills: [
        { name: "Node.js", iconName: "SiNodedotjs" },
        { name: "PostgreSQL", iconName: "SiPostgresql" },
        { name: "MongoDB", iconName: "SiMongodb" },
        { name: "GraphQL", iconName: "SiGraphql" },
        { name: "Firebase", iconName: "SiFirebase" },
      ],
    },
    {
      id: "tools",
      title: "Tools & ML",
      skills: [
        { name: "Git", iconName: "SiGit" },
        { name: "Docker", iconName: "SiDocker" },
        { name: "Linux", iconName: "SiLinux" },
        { name: "Figma", iconName: "SiFigma" },
        { name: "TensorFlow", iconName: "SiTensorflow" },
        { name: "Vercel", iconName: "SiVercel" },
      ],
    },
  ],
  education: [
    {
      id: "uet",
      school: "University of Engineering & Technology",
      degree: "B.S. Computer Science",
      period: "2023 — 2027",
      location: "Lahore, Pakistan",
      description:
        "Coursework in algorithms, distributed systems, machine learning, and HCI. Active member of the ACM student chapter.",
      grade: "GPA: 3.9 / 4.0",
    },
    {
      id: "beaconhouse",
      school: "Beaconhouse School System",
      degree: "Pre-Engineering, A-Levels",
      period: "2021 — 2023",
      location: "Lahore, Pakistan",
      description:
        "Specialized in Mathematics, Physics, and Computer Science. Led the school’s coding club and tutored juniors in algorithms.",
      grade: "Distinction — 3 A*s",
    },
  ],
  projects: [
    {
      id: "quill",
      title: "Quill — AI Writing Studio",
      description:
        "A distraction-free editor with on-device summarization, citation lookups, and a streaming AI co-writer.",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=60",
      tags: ["Next.js", "TypeScript", "OpenAI", "Tailwind"],
      github: "https://github.com/misbah/quill",
      demo: "https://quill.misbah.dev",
      featured: true,
    },
    {
      id: "sift",
      title: "Sift — Personal Search Engine",
      description:
        "Index your notes, screenshots, and bookmarks. Query in natural language. Fully local, fully yours.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60",
      tags: ["Rust", "SQLite", "Embeddings", "Tauri"],
      github: "https://github.com/misbah/sift",
      featured: true,
    },
    {
      id: "charcoal",
      title: "Charcoal — Sketch-to-Code",
      description:
        "Upload a UI sketch, get a working React + Tailwind component. Trained on my own messy notebooks.",
      image:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=60",
      tags: ["Python", "PyTorch", "FastAPI", "React"],
      github: "https://github.com/misbah/charcoal",
      demo: "https://charcoal.misbah.dev",
    },
    {
      id: "lantern",
      title: "Lantern — Campus Events",
      description:
        "Real-time event board for our university with RSVPs, push notifications, and a moderator dashboard.",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=60",
      tags: ["React", "Firebase", "Tailwind"],
      github: "https://github.com/misbah/lantern",
      demo: "https://lantern.misbah.dev",
    },
    {
      id: "pulse",
      title: "Pulse — Habit Tracker",
      description:
        "Minimal habit tracker with streak heatmaps, weekly reviews, and gentle nudges that don’t guilt you.",
      image:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=60",
      tags: ["Next.js", "Prisma", "PostgreSQL"],
      github: "https://github.com/misbah/pulse",
    },
    {
      id: "inkling",
      title: "Inkling — Markdown Blogging",
      description:
        "A static blog engine built around plain markdown, MDX components, and an obsessively fast reading experience.",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=60",
      tags: ["Astro", "MDX", "TypeScript"],
      github: "https://github.com/misbah/inkling",
      demo: "https://inkling.misbah.dev",
    },
  ],
};
