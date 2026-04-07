import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { Snippet, SnippetMeta, SnippetVariant } from "@/types/snippet";

const snippetsRoot = path.join(process.cwd(), "snippets");

async function loadMeta(slug: string): Promise<SnippetMeta> {
  const metaPath = path.join(snippetsRoot, slug, "meta.json");
  const raw = await readFile(metaPath, "utf8");
  return JSON.parse(raw) as SnippetMeta;
}

async function loadVariantCode(slug: string, file: string): Promise<string> {
  const codePath = path.join(snippetsRoot, slug, file);
  return readFile(codePath, "utf8");
}

async function loadVariants(slug: string, meta: SnippetMeta): Promise<SnippetVariant[]> {
  return Promise.all(
    meta.variants.map(async (variant) => ({
      ...variant,
      code: await loadVariantCode(slug, variant.file),
    })),
  );
}

export async function getAllSnippets(): Promise<Snippet[]> {
  const entries = await readdir(snippetsRoot, { withFileTypes: true });
  const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const snippets = await Promise.all(
    slugs.map(async (slug) => {
      const meta = await loadMeta(slug);
      const variants = await loadVariants(slug, meta);
      return { ...meta, variants };
    }),
  );

  return snippets.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSnippetBySlug(slug: string): Promise<Snippet | undefined> {
  try {
    const meta = await loadMeta(slug);
    const variants = await loadVariants(slug, meta);
    return { ...meta, variants };
  } catch {
    return undefined;
  }
}
