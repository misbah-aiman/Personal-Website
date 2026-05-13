import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import type { Content } from "./types";
import { DEFAULT_CONTENT } from "./defaults";

const BLOB_PATH = "content.json";
const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const useBlob = !!blobToken;

let memoryCache: Content | null = null;

/** Reads JSON from Blob using the SDK (auth + store routing). Avoids naked CDN fetch on meta.url, which can fail or appear stale. */
async function readFromBlob(token: string): Promise<string | null> {
  try {
    const result = await get(BLOB_PATH, {
      access: "public",
      token,
      useCache: false,
    });
    if (result === null) return null;
    if (result.statusCode !== 200 || !result.stream) return null;
    return await new Response(result.stream).text();
  } catch (e) {
    console.error("[storage] readFromBlob failed:", e);
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

  const blobRaw =
    useBlob && blobToken ? await readFromBlob(blobToken) : null;
  const fileRaw = blobRaw === null ? await readFromFile() : null;
  const raw = blobRaw ?? fileRaw;
  if (useBlob && blobRaw === null && fileRaw !== null) {
    console.warn(
      "[storage] BLOB_READ_WRITE_TOKEN is set but blob read failed or empty; using data/content.json until blob is readable.",
    );
  }

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
  if (useBlob && blobToken) {
    await put(BLOB_PATH, serialized, {
      access: "public",
      token: blobToken,
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
