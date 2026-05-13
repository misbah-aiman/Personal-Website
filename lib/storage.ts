import { promises as fs } from "fs";
import path from "path";
import type { Content } from "./types";
import { DEFAULT_CONTENT } from "./defaults";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

let memoryCache: Content | null = null;

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function getContent(): Promise<Content> {
  if (memoryCache) return memoryCache;
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw) as Content;
    memoryCache = mergeWithDefaults(parsed);
    return memoryCache;
  } catch {
    memoryCache = structuredClone(DEFAULT_CONTENT);
    return memoryCache;
  }
}

export async function saveContent(content: Content): Promise<Content> {
  await ensureDir();
  const merged = mergeWithDefaults(content);
  await fs.writeFile(CONTENT_FILE, JSON.stringify(merged, null, 2), "utf8");
  memoryCache = merged;
  return merged;
}

export function clearCache() {
  memoryCache = null;
}

function mergeWithDefaults(input: Partial<Content>): Content {
  return {
    site: { ...DEFAULT_CONTENT.site, ...(input.site ?? {}) },
    typingPhrases: input.typingPhrases ?? DEFAULT_CONTENT.typingPhrases,
    about: {
      intro: input.about?.intro ?? DEFAULT_CONTENT.about.intro,
      body: input.about?.body ?? DEFAULT_CONTENT.about.body,
      stats: input.about?.stats ?? DEFAULT_CONTENT.about.stats,
    },
    skillGroups: input.skillGroups ?? DEFAULT_CONTENT.skillGroups,
    education: input.education ?? DEFAULT_CONTENT.education,
    projects: input.projects ?? DEFAULT_CONTENT.projects,
  };
}
