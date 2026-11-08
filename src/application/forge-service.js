import path from 'node:path';
import { inspectWorkspace } from '../infrastructure/workspace-inspector.js';
import { readStoreFile } from '../infrastructure/rocksoul-store.js';
import { normalizeRelativePath } from '../domain/policy.js';

const MAX_CONTEXT_CHARS = 32000;
const MAX_CONTEXT_FILES = 18;

function inScope(relativePath, scopes) {
  return scopes.some((raw) => {
    const scope = normalizeRelativePath(raw);
    return scope && (relativePath === scope || relativePath.startsWith(scope.endsWith('/') ? scope : `${scope}/`));
  });
}

function isContextFile(relativePath, scopes) {
  const name = path.posix.basename(relativePath);
  const canonicalDocs = /^(README(?:\..+)?|CONTRIBUTING(?:\..+)?|AGENTS\.md|package\.json|pnpm-workspace\.yaml|Cargo\.toml|go\.mod|pyproject\.toml)$/i.test(name);
  return canonicalDocs || inScope(relativePath, scopes);
}

function takeExcerpt(remaining, label, content) {
  const allowance = Math.max(0, remaining - label.length - 32);
  if (!allowance) return { text: '', consumed: 0 };
  const value = String(content).slice(0, allowance);
  return { text: `\n## ${label}\n\n${value}\n`, consumed: value.length + label.length + 8 };
}

export async function buildMissionContext(root, mission, scanOptions = {}) {
  if (!Array.isArray(mission.scope) || mission.scope.length === 0) throw new Error('Define one or more mission scope paths before using Forge.');
  const scan = await inspectWorkspace(root, scanOptions);
  let remaining = MAX_CONTEXT_CHARS;
  const excerpts = [];
  const dnaPaths = ['PROJECT.md', 'DNA.md', 'ARCHITECTURE.md', 'DECISIONS.md'];
  for (const relative of dnaPaths) {
    if (remaining <= 0) break;
    const content = await readStoreFile(root, relative);
    if (content === null) continue;
    const excerpt = takeExcerpt(remaining, `.rocksoul/${relative}`, content);
    if (!excerpt.text) continue;
    excerpts.push({ path: `.rocksoul/${relative}`, content: excerpt.text });
    remaining -= excerpt.consumed;
  }
  const selected = scan.files.filter((file) => isContextFile(file.path, mission.scope)).slice(0, MAX_CONTEXT_FILES);
  for (const file of selected) {
    if (remaining <= 0) break;
    const excerpt = takeExcerpt(remaining, file.path, file.content);
    if (!excerpt.text) continue;
    excerpts.push({ path: file.path, content: excerpt.text });
    remaining -= excerpt.consumed;
  }
  return {
    inspection: scan.summary,
    excerpts,
    disclosedPaths: excerpts.map((item) => item.path),
    omittedFileCount: Math.max(0, selected.length - excerpts.filter((item) => !item.path.startsWith('.rocksoul/')).length)
  };
}
