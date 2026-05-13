import { promises as fs } from "fs";
import path from "path";
import { head, put } from "@vercel/blob";
import type { Content } from "./types";
import { DEFAULT_CONTENT } from "./defaults";

const BLOB_PATH = "content.json";
const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

let memoryCache: Content | null = null;

async function readFromBlob(): Promise<string | null> {
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function readFromFile(): Promise<string | null> {
  try {
    return await fs.readFile(CONTENT_FILE, "utf8");
  } catch {
    return null;
  }
}

export async function getContent(): Promise<Content> {
  if (!useBlob && memoryCache) return memoryCache;

  const raw = (useBlob ? await readFromBlob() : null) ?? (await readFromFile());

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Content;
      const merged = mergeWithDefaults(parsed);
      if (!useBlob) memoryCache = merged;
      return merged;
    } catch {
      // fall through to defaults
    }
  }

  const fallback = structuredClone(DEFAULT_CONTENT);
  if (!useBlob) memoryCache = fallback;
  return fallback;
}

export async function saveContent(content: Content): Promise<Content> {
  const merged = mergeWithDefaults(content);
  const serialized = JSON.stringify(merged, null, 2);
  if (useBlob) {
    await put(BLOB_PATH, serialized, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } else {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CONTENT_FILE, serialized, "utf8");
    memoryCache = merged;
  }
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
