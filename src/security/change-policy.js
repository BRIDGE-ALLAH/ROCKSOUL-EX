import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isExcludedPath, isPathInside, isTextCandidate, normalizeRelativePath } from '../domain/policy.js';

const MAX_CHANGES = 20;
const MAX_CONTENT_BYTES = 262144;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizePatchPath(value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Every proposed change needs a relative file path.');
  const candidate = normalizeRelativePath(value.trim());
  if (!candidate || candidate.startsWith('/') || /^[a-z]:/i.test(candidate) || candidate.includes('\0')) {
    throw new Error(`Unsafe patch path: ${value}`);
  }
  const segments = candidate.split('/');
  if (segments.some((part) => !part || part === '.' || part === '..')) throw new Error(`Path traversal is not allowed: ${value}`);
  if (isExcludedPath(candidate)) throw new Error(`Protected or excluded path cannot be changed: ${candidate}`);
  if (!isTextCandidate(candidate)) throw new Error(`Only allowlisted text files can be changed: ${candidate}`);
  return candidate;
}

function isWithinScope(relativePath, scopes) {
  return scopes.some((rawScope) => {
    const scope = normalizeRelativePath(rawScope);
    if (!scope || scope.includes('*') || scope.split('/').includes('..')) return false;
    const prefix = scope.endsWith('/') ? scope : `${scope}/`;
    return relativePath === scope || relativePath.startsWith(prefix);
  });
}

async function inspectTarget(root, relativePath) {
  const absolutePath = path.resolve(root, ...relativePath.split('/'));
  if (!isPathInside(root, absolutePath) || absolutePath === path.resolve(root)) {
    throw new Error(`Patch path escapes the selected workspace: ${relativePath}`);
  }
  const segments = relativePath.split('/');
  let current = path.resolve(root);
  for (const segment of segments.slice(0, -1)) {
    current = path.join(current, segment);
    try {
      const stat = await fs.lstat(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Refusing to follow a symlink or non-directory path: ${relativePath}`);
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error(`Create the parent directory before proposing a file there: ${relativePath}`);
      throw error;
    }
  }
  try {
    const stat = await fs.lstat(absolutePath);
    if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`Target must be a regular file, not a symlink or special file: ${relativePath}`);
    if (stat.nlink > 1) throw new Error(`Refusing to patch a hard-linked file: ${relativePath}`);
    if (stat.size > MAX_CONTENT_BYTES) throw new Error(`Existing file is too large to patch safely: ${relativePath}`);
    const content = await fs.readFile(absolutePath, 'utf8');
    if (content.includes('\0')) throw new Error(`Binary file cannot be patched: ${relativePath}`);
    return { exists: true, absolutePath, beforeContent: content, beforeHash: sha256(content) };
  } catch (error) {
    if (error.code === 'ENOENT') return { exists: false, absolutePath, beforeContent: '', beforeHash: null };
    throw error;
  }
}

export async function validatePatchProposal(root, mission, proposal) {
  if (!mission || !Array.isArray(mission.scope) || mission.scope.length === 0) {
    throw new Error('A mission must define at least one in-scope path before AI patch generation.');
  }
  if (!proposal || typeof proposal.summary !== 'string' || !Array.isArray(proposal.changes) || !Array.isArray(proposal.notes)) {
    throw new Error('The provider returned a malformed patch proposal.');
  }
  if (proposal.changes.length === 0) throw new Error('The provider did not propose any file changes. Review the model notes or clarify the mission.');
  if (proposal.changes.length > MAX_CHANGES) throw new Error(`A proposal may contain at most ${MAX_CHANGES} files.`);
  const seen = new Set();
  const changes = [];
  for (const change of proposal.changes) {
    const relativePath = normalizePatchPath(change?.path);
    if (seen.has(relativePath)) throw new Error(`The proposal contains duplicate file paths: ${relativePath}`);
    seen.add(relativePath);
    if (!isWithinScope(relativePath, mission.scope)) throw new Error(`Proposed path is outside the approved mission scope: ${relativePath}`);
    if (!['create', 'update'].includes(change.operation)) throw new Error(`Unsupported operation for ${relativePath}. Only create and update are supported.`);
    if (typeof change.content !== 'string' || change.content.includes('\0')) throw new Error(`Proposed content for ${relativePath} is not valid text.`);
    if (Buffer.byteLength(change.content, 'utf8') > MAX_CONTENT_BYTES) throw new Error(`Proposed file exceeds the 256 KiB limit: ${relativePath}`);
    const target = await inspectTarget(root, relativePath);
    if (change.operation === 'create' && target.exists) throw new Error(`The model tried to create an existing file: ${relativePath}`);
    if (change.operation === 'update' && !target.exists) throw new Error(`The model tried to update a missing file: ${relativePath}`);
    changes.push({
      path: relativePath,
      operation: change.operation,
      content: change.content,
      rationale: String(change.rationale ?? '').slice(0, 2000),
      absolutePath: target.absolutePath,
      beforeContent: target.beforeContent,
      beforeHash: target.beforeHash
    });
  }
  return {
    summary: proposal.summary.slice(0, 4000),
    notes: proposal.notes.slice(0, 30).map((item) => String(item).slice(0, 1000)),
    changes
  };
}

export async function revalidatePatchSnapshot(root, proposal) {
  for (const change of proposal.changes) {
    const current = await inspectTarget(root, change.path);
    if (current.exists !== (change.beforeHash !== null)) {
      throw new Error(`The workspace changed since the proposal was generated: ${change.path}. Generate a fresh proposal.`);
    }
    if (current.beforeHash !== change.beforeHash) {
      throw new Error(`The file changed since the proposal was generated: ${change.path}. Review the new version before applying.`);
    }
  }
  return true;
}
