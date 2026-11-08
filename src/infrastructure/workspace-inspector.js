import fs from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { isExcludedPath, isTextCandidate, clampInteger, isPathInside } from '../domain/policy.js';
import { parseGitignore, isGitIgnored } from './gitignore.js';

const execFileAsync = promisify(execFile);
const MANIFEST_NAMES = new Set([
  'package.json', 'pnpm-workspace.yaml', 'Cargo.toml', 'go.mod',
  'pyproject.toml', 'requirements.txt', 'Pipfile', 'Gemfile',
  'composer.json', 'pom.xml', 'build.gradle', 'settings.gradle'
]);
const SOURCE_DIR_NAMES = new Set(['src', 'app', 'lib', 'packages', 'services', 'cmd', 'internal']);
const TEST_DIR_NAMES = new Set(['test', 'tests', '__tests__', 'spec', 'specs', 'e2e']);
const DOC_DIR_NAMES = new Set(['docs', 'doc', 'documentation']);
const MAX_CACHE_BYTES = 8 * 1024 * 1024;
const MAX_CACHE_ENTRIES = 5000;
const fileCache = new Map();
const previousScans = new Map();
let cacheBytes = 0;

const hash = (value) => createHash('sha256').update(value).digest('hex');

function cacheKey(root, limits) {
  return `${root}:${JSON.stringify(limits)}`;
}

function cacheGet(key) {
  const value = fileCache.get(key);
  if (!value) return null;
  fileCache.delete(key);
  fileCache.set(key, value);
  return value;
}

function cacheSet(key, value) {
  const previous = fileCache.get(key);
  if (previous) cacheBytes -= previous.bytes;
  fileCache.delete(key);
  if (value.bytes > MAX_CACHE_BYTES) return;
  while (fileCache.size >= MAX_CACHE_ENTRIES || cacheBytes + value.bytes > MAX_CACHE_BYTES) {
    const oldestKey = fileCache.keys().next().value;
    if (!oldestKey) break;
    cacheBytes -= fileCache.get(oldestKey).bytes;
    fileCache.delete(oldestKey);
  }
  fileCache.set(key, value);
  cacheBytes += value.bytes;
}

function sameFileVersion(left, right) {
  return left && right && left.dev === right.dev && left.ino === right.ino
    && left.size === right.size && left.mtimeMs === right.mtimeMs && left.ctimeMs === right.ctimeMs;
}

async function secureReadText(root, absolutePath, maxBytes, useCache = true) {
  const before = await fs.lstat(absolutePath);
  if (before.isSymbolicLink() || !before.isFile() || before.nlink > 1) throw new Error('Not a normal, singly linked file.');
  if (before.size > maxBytes) throw new Error('File exceeds the configured limit.');
  const realBefore = await fs.realpath(absolutePath);
  if (!isPathInside(root, realBefore)) throw new Error('Resolved file path escapes the workspace.');
  const noFollow = fsConstants.O_NOFOLLOW ?? 0;
  const handle = await fs.open(absolutePath, fsConstants.O_RDONLY | noFollow);
  try {
    const stat = await handle.stat();
    const identity = { dev: stat.dev, ino: stat.ino, size: stat.size, mtimeMs: stat.mtimeMs, ctimeMs: stat.ctimeMs };
    if (!stat.isFile() || stat.nlink > 1 || stat.size > maxBytes || before.dev !== stat.dev || before.ino !== stat.ino) {
      throw new Error('File identity changed while opening it.');
    }
    const realAfter = await fs.realpath(absolutePath);
    if (realAfter !== realBefore || !isPathInside(root, realAfter)) throw new Error('File path changed while opening it.');
    const key = absolutePath;
    const cached = useCache ? cacheGet(key) : null;
    if (cached && sameFileVersion(cached.identity, identity)) {
      return { content: cached.content, size: stat.size, identity, cacheHit: true };
    }
    const buffer = await handle.readFile();
    if (buffer.includes(0)) throw new Error('Binary content detected.');
    const content = buffer.toString('utf8');
    if (!Buffer.from(content, 'utf8').equals(buffer)) throw new Error('File is not valid UTF-8 text.');
    if (useCache) cacheSet(key, { identity, content, bytes: buffer.length });
    return { content, size: buffer.length, identity, cacheHit: false };
  } finally {
    await handle.close();
  }
}

async function readIgnoreRules(root, absoluteDir, relativeDir) {
  const ignorePath = path.join(absoluteDir, '.gitignore');
  try {
    const result = await secureReadText(root, ignorePath, 65536, false);
    return parseGitignore(result.content, relativeDir);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw new Error(`Cannot safely read .gitignore in ${relativeDir || 'workspace root'}: ${error.message}`);
  }
}

async function readGitMetadata(root) {
  try {
    const base = await execFileAsync('git', ['-C', root, 'rev-parse', '--show-toplevel'], { timeout: 1500, maxBuffer: 65536, windowsHide: true });
    const gitRoot = path.resolve(base.stdout.trim());
    const [branchResult, statusResult] = await Promise.all([
      execFileAsync('git', ['-C', root, 'branch', '--show-current'], { timeout: 1500, maxBuffer: 65536, windowsHide: true }),
      execFileAsync('git', ['-C', root, 'status', '--short', '--branch', '--untracked-files=all'], { timeout: 2500, maxBuffer: 131072, windowsHide: true })
    ]);
    const lines = statusResult.stdout.split(String.fromCharCode(10)).map((line) => line.replace(/\r$/, '')).filter(Boolean).slice(0, 80);
    return {
      available: true,
      root: gitRoot,
      branch: branchResult.stdout.trim() || '(detached HEAD)',
      dirty: lines.some((line) => !line.startsWith('##')),
      statusLines: lines
    };
  } catch {
    return { available: false, root: null, branch: null, dirty: null, statusLines: [], reason: 'Git metadata unavailable (Git may be absent or this folder is not a repository).' };
  }
}

export async function inspectWorkspace(root, options = {}, isCancelled = () => false) {
  const workspaceRoot = await fs.realpath(root);
  const limits = {
    maxDepth: clampInteger(options.maxDepth, 5, 1, 12),
    maxFiles: clampInteger(options.maxFiles, 400, 20, 5000),
    maxFileBytes: clampInteger(options.maxFileBytes, 131072, 4096, 1048576),
    maxTotalBytes: clampInteger(options.maxTotalBytes, 1048576, 65536, 10485760)
  };
  const customExclusions = Array.isArray(options.excludedPaths) ? options.excludedPaths : [];
  const respectGitignore = options.respectGitignore !== false;
  const incremental = options.incremental !== false;
  const files = [];
  const skipped = [];
  const directories = new Set();
  const currentSnapshot = new Map();
  let totalBytes = 0;
  let visited = 0;
  let truncated = false;
  let cacheHits = 0;
  let cacheMisses = 0;

  async function walk(absoluteDir, depth, inheritedRuleSets) {
    if (isCancelled()) throw new Error('Inspection cancelled.');
    if (depth > limits.maxDepth || files.length >= limits.maxFiles || totalBytes >= limits.maxTotalBytes) {
      truncated = true;
      return;
    }
    let realDir;
    try {
      const dirStat = await fs.lstat(absoluteDir);
      if (dirStat.isSymbolicLink() || !dirStat.isDirectory()) throw new Error('Not a normal directory.');
      realDir = await fs.realpath(absoluteDir);
      if (!isPathInside(workspaceRoot, realDir)) throw new Error('Resolved directory escapes the workspace.');
    } catch (error) {
      skipped.push({ path: path.relative(workspaceRoot, absoluteDir).split(path.sep).join('/') || '.', reason: `Cannot safely inspect directory: ${error.code ?? error.message}` });
      return;
    }
    const relativeDir = path.relative(workspaceRoot, realDir).split(path.sep).join('/');
    const localRules = respectGitignore ? await readIgnoreRules(workspaceRoot, realDir, relativeDir) : [];
    const ruleSets = localRules.length ? [...inheritedRuleSets, { base: relativeDir, rules: localRules }] : inheritedRuleSets;
    let entries;
    try {
      entries = await fs.readdir(realDir, { withFileTypes: true });
      const realAfterRead = await fs.realpath(absoluteDir);
      if (realAfterRead !== realDir || !isPathInside(workspaceRoot, realAfterRead)) throw new Error('Directory path changed during inspection.');
    } catch (error) {
      skipped.push({ path: path.relative(workspaceRoot, absoluteDir).split(path.sep).join('/') || '.', reason: `Cannot read directory safely: ${error.code ?? error.message}` });
      return;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (isCancelled()) throw new Error('Inspection cancelled.');
      if (files.length >= limits.maxFiles || totalBytes >= limits.maxTotalBytes) { truncated = true; break; }
      const absolutePath = path.join(realDir, entry.name);
      const relative = path.relative(workspaceRoot, absolutePath).split(path.sep).join('/');
      if (isExcludedPath(relative, customExclusions)) {
        skipped.push({ path: relative, reason: 'Excluded by ROCKSOUL-EX security policy or user setting.' });
        continue;
      }
      if (entry.isSymbolicLink()) {
        skipped.push({ path: relative, reason: 'Symbolic links are not followed.' });
        continue;
      }
      if (entry.isDirectory()) {
        if (respectGitignore && isGitIgnored(relative, true, ruleSets)) {
          skipped.push({ path: relative, reason: 'Excluded by .gitignore.' });
          continue;
        }
        directories.add(relative);
        if (depth < limits.maxDepth) await walk(absolutePath, depth + 1, ruleSets);
        else skipped.push({ path: relative, reason: 'Maximum scan depth reached.' });
        continue;
      }
      if (!entry.isFile()) continue;
      if (respectGitignore && isGitIgnored(relative, false, ruleSets)) {
        skipped.push({ path: relative, reason: 'Excluded by .gitignore.' });
        continue;
      }
      visited += 1;
      if (!isTextCandidate(relative)) {
        skipped.push({ path: relative, reason: 'File type is not on the text-inspection allowlist.' });
        continue;
      }
      try {
        const contentResult = await secureReadText(workspaceRoot, absolutePath, limits.maxFileBytes, incremental);
        if (totalBytes + contentResult.size > limits.maxTotalBytes) {
          skipped.push({ path: relative, reason: 'Total inspection byte limit reached.' });
          truncated = true;
          break;
        }
        totalBytes += contentResult.size;
        if (contentResult.cacheHit) cacheHits += 1; else cacheMisses += 1;
        const fileHash = hash(contentResult.content);
        files.push({ path: relative, size: contentResult.size, content: contentResult.content });
        currentSnapshot.set(relative, fileHash);
      } catch (error) {
        skipped.push({ path: relative, reason: error.message === 'Binary content detected.' ? error.message : 'File could not be read safely as UTF-8 text.' });
      }
    }
  }

  await walk(workspaceRoot, 0, []);
  const snapshotKey = cacheKey(workspaceRoot, { ...limits, respectGitignore, excludedPaths: customExclusions });
  const previous = previousScans.get(snapshotKey);
  const changesSincePreviousScan = { baselineAvailable: Boolean(previous), added: [], changed: [], removed: [] };
  if (previous) {
    for (const [relative, fileHash] of currentSnapshot) {
      if (!previous.has(relative)) changesSincePreviousScan.added.push(relative);
      else if (previous.get(relative) !== fileHash) changesSincePreviousScan.changed.push(relative);
    }
    for (const relative of previous.keys()) if (!currentSnapshot.has(relative)) changesSincePreviousScan.removed.push(relative);
  }
  previousScans.set(snapshotKey, currentSnapshot);
  const manifestFiles = files.filter((file) => MANIFEST_NAMES.has(path.posix.basename(file.path))).map((file) => file.path);
  const sourceRoots = [...directories].filter((dir) => SOURCE_DIR_NAMES.has(path.posix.basename(dir))).sort();
  const testRoots = [...directories].filter((dir) => TEST_DIR_NAMES.has(path.posix.basename(dir))).sort();
  const documentationRoots = [...directories].filter((dir) => DOC_DIR_NAMES.has(path.posix.basename(dir))).sort();
  const extensionCounts = {};
  for (const file of files) {
    const extension = path.posix.extname(file.path).toLowerCase() || '(no extension)';
    extensionCounts[extension] = (extensionCounts[extension] ?? 0) + 1;
  }

  return {
    root: workspaceRoot,
    inspectedAt: new Date().toISOString(),
    limits,
    summary: { filesRead: files.length, filesVisited: visited, directoriesSeen: directories.size, skipped: skipped.length, bytesRead: totalBytes, truncated, cacheHits, cacheMisses },
    git: await readGitMetadata(workspaceRoot),
    changesSincePreviousScan,
    manifestFiles,
    sourceRoots,
    testRoots,
    documentationRoots,
    extensionCounts,
    files,
    skipped
  };
}

export function renderInspectionReport(result) {
  const newline = String.fromCharCode(10);
  const list = (items) => items.length ? items.map((item) => '- `' + item + '`').join(newline) : '- None observed';
  const extensions = Object.entries(result.extensionCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const gitLines = result.git?.available
    ? [
        '- **Git root:** `' + result.git.root + '`',
        '- **Branch:** ' + result.git.branch,
        '- **Working tree:** ' + (result.git.dirty ? 'Dirty' : 'Clean'),
        '',
        ...(result.git.statusLines.length ? result.git.statusLines.map((line) => '- `' + line + '`') : ['- No Git changes reported'])
      ]
    : ['- Git metadata unavailable'];
  const delta = result.changesSincePreviousScan;
  const changeLines = delta?.baselineAvailable
    ? ['- Added: ' + delta.added.length, '- Changed: ' + delta.changed.length, '- Removed: ' + delta.removed.length]
    : ['- No previous scan baseline; this inspection establishes one.'];
  return [
    '# ROCKSOUL-EX — Witness Report',
    '',
    '> Read-only inspection. No workspace files were changed.',
    '',
    '- **Inspected at:** ' + result.inspectedAt,
    '- **Workspace:** `' + result.root + '`',
    '- **Files read:** ' + result.summary.filesRead + ' / ' + result.summary.filesVisited + ' visited',
    '- **Directories seen:** ' + result.summary.directoriesSeen,
    '- **Bytes read:** ' + result.summary.bytesRead.toLocaleString(),
    '- **Cache:** ' + result.summary.cacheHits + ' reused, ' + result.summary.cacheMisses + ' read',
    '- **Skipped paths:** ' + result.summary.skipped,
    '- **Limits reached:** ' + (result.summary.truncated ? 'Yes — report is partial' : 'No'),
    '',
    '## Git state',
    '',
    ...gitLines,
    '',
    '## Changes since previous inspection',
    '',
    ...changeLines,
    '',
    '## Detected manifests',
    '',
    list(result.manifestFiles),
    '',
    '## Likely source roots',
    '',
    list(result.sourceRoots),
    '',
    '## Likely test roots',
    '',
    list(result.testRoots),
    '',
    '## Documentation roots',
    '',
    list(result.documentationRoots),
    '',
    '## File type distribution',
    '',
    ...(extensions.length ? extensions.map(([ext, count]) => '- `' + ext + '`: ' + count) : ['- No text files read']),
    '',
    '## Skipped paths (first 40)',
    '',
    ...(result.skipped.slice(0, 40).map((item) => '- `' + item.path + '` — ' + item.reason).length
      ? result.skipped.slice(0, 40).map((item) => '- `' + item.path + '` — ' + item.reason)
      : ['- None']),
    '',
    '## Interpretation boundary',
    '',
    'File and Git metadata are observed facts. Source/test/documentation classifications are heuristics. Git status may be unavailable when Git is absent or the workspace is not a repository. The scan is bounded and does not execute project scripts. Cache entries are in-memory and are invalidated when file identity or timestamps change.'
  ].join(newline) + newline;
}
