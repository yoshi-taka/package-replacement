import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REQUIRE_RE = /require\(['"](\.\/[^'"]+)['"]\)/g;
const MODULE_EXPORT_RE = /^\s*module\.exports\s*=\s*.+;\s*$/gm;
const LOCAL_REQUIRE_LINE_RE = /^\s*var\s+[\s\S]*?require\(['"]\.\/[^'"]+['"]\)[\s\S]*?;\s*$/gm;

function resolveModuleFile(sourceRoot, parentFile, request) {
  return path.resolve(path.dirname(parentFile), `${request}.js`);
}

async function collectFiles(sourceRoot, entryFile, seen = new Set(), order = []) {
  if (seen.has(entryFile)) return order;
  seen.add(entryFile);

  const source = await readFile(entryFile, "utf8");
  const dependencies = [...source.matchAll(REQUIRE_RE)]
    .map((match) => resolveModuleFile(sourceRoot, entryFile, match[1]))
    .filter((dep) => dep.startsWith(sourceRoot));

  for (const dependency of dependencies) {
    await collectFiles(sourceRoot, dependency, seen, order);
  }

  order.push(entryFile);
  return order;
}

function rewriteModule(source, isEntry) {
  const withoutLocalRequires = source.replace(LOCAL_REQUIRE_LINE_RE, "");
  if (isEntry) return withoutLocalRequires;
  return withoutLocalRequires.replace(MODULE_EXPORT_RE, "").trimEnd();
}

export async function extractLodashEntry({ sourceRoot, entry, outputFile }) {
  const entryFile = path.resolve(sourceRoot, entry);
  const orderedFiles = await collectFiles(sourceRoot, entryFile);

  const chunks = [];
  for (const file of orderedFiles) {
    const relative = path.relative(sourceRoot, file);
    const source = await readFile(file, "utf8");
    const rewritten = rewriteModule(source, file === entryFile);
    chunks.push(`// source: ${relative}\n${rewritten}\n`);
  }

  const bundle = chunks.join("\n");

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, bundle, "utf8");

  return {
    entry: path.relative(sourceRoot, entryFile),
    extractedHelpers: orderedFiles
      .map((file) => path.relative(sourceRoot, file))
      .filter((file) => file !== path.relative(sourceRoot, entryFile)),
  };
}

async function main() {
  const sourceRoot = process.argv[2];
  const entry = process.argv[3];
  const outputFile = process.argv[4];

  if (!sourceRoot || !entry || !outputFile) {
    throw new Error("Usage: bun run extract:lodash-entry <sourceRoot> <entry> <outputFile>");
  }

  const result = await extractLodashEntry({
    sourceRoot: path.resolve(sourceRoot),
    entry,
    outputFile: path.resolve(outputFile),
  });

  process.stdout.write(
    `Extracted ${result.entry} with ${result.extractedHelpers.length} helpers\n`,
  );
}

const isDirectRun =
  process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isDirectRun) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  });
}
