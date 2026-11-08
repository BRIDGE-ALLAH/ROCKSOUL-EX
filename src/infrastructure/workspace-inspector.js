import fs from 'node:fs/promises';
import path from 'node:path';
import { isExcludedPath, isTextCandidate, clampInteger } from '../domain/policy.js';

const MANIFEST_NAMES = new Set([
  'package.json', 'pnpm-workspace.yaml', 'Cargo.toml', 'go.mod',
  'pyproject.toml', 'requirements.txt', 'Pipfile', 'Gemfile',
  'composer.json', 'pom.xml', 'build.gradle', 'settings.gradle'
]);
const SOURCE_DIR_NAMES = new Set(['src', 'app', 'lib', 'packages', 'services', 'cmd', 'internal']);
const TEST_DIR_NAMES = new Set(['test', 'tests', '__tests__', 'spec', 'specs', 'e2e']);
const DOC_DIR_NAMES = new Set(['docs', 'doc', 'documentation']);

export async function inspectWorkspace(root, options = {}, isCancelled = () => false) {
  const limits = {
    maxDepth: clampInteger(options.maxDepth, 5, 1, 12),
    maxFiles: clampInteger(options.maxFiles, 400, 20, 5000),
    maxFileBytes: clampInteger(options.maxFileBytes, 131072, 4096, 1048576),
    maxTotalBytes: clampInteger(options.maxTotalBytes, 1048576, 65536, 10485760)
  };
  const customExclusions = Array.isArray(options.excludedPaths) ? options.excludedPaths : [];
  const files = [];
  const skipped = [];
  const directories = new Set();
  let totalBytes = 0;
  let visited = 0;
  let truncated = false;

  async function walk(absoluteDir, depth) {
    if (isCancelled()) throw new Error('Inspection cancelled.');
    if (depth > limits.maxDepth || files.length >= limits.maxFiles || totalBytes >= limits.maxTotalBytes) {
      truncated = true;
      return;
    }
    let entries;
    try {
      entries = await fs.readdir(absoluteDir, { withFileTypes: true });
    } catch (error) {
      skipped.push({ path: path.relative(root, absoluteDir).split(path.sep).join('/') || '.', reason: `Cannot read directory: ${error.code ?? 'unknown error'}` });
      return;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (isCancelled()) throw new Error('Inspection cancelled.');
      if (files.length >= limits.maxFiles || totalBytes >= limits.maxTotalBytes) { truncated = true; break; }
      const absolutePath = path.join(absoluteDir, entry.name);
      const relative = path.relative(root, absolutePath).split(path.sep).join('/');
      if (isExcludedPath(relative, customExclusions)) {
        skipped.push({ path: relative, reason: 'Excluded by ROCKSOUL-EX security policy or user setting.' });
        continue;
      }
      if (entry.isSymbolicLink()) {
        skipped.push({ path: relative, reason: 'Symbolic links are not followed.' });
        continue;
      }
      if (entry.isDirectory()) {
        directories.add(relative);
        if (depth < limits.maxDepth) await walk(absolutePath, depth + 1);
        else skipped.push({ path: relative, reason: 'Maximum scan depth reached.' });
        continue;
      }
      if (!entry.isFile()) continue;
      visited += 1;
      if (!isTextCandidate(relative)) {
        skipped.push({ path: relative, reason: 'File type is not on the text-inspection allowlist.' });
        continue;
      }
      let stat;
      try { stat = await fs.stat(absolutePath); } catch { skipped.push({ path: relative, reason: 'File metadata could not be read.' }); continue; }
      if (stat.size > limits.maxFileBytes) {
        skipped.push({ path: relative, reason: `File exceeds ${limits.maxFileBytes} byte limit.` });
        continue;
      }
      if (totalBytes + stat.size > limits.maxTotalBytes) {
        skipped.push({ path: relative, reason: 'Total inspection byte limit reached.' });
        truncated = true;
        break;
      }
      try {
        const content = await fs.readFile(absolutePath, 'utf8');
        if (content.includes('\0')) {
          skipped.push({ path: relative, reason: 'Binary content detected.' });
          continue;
        }
        totalBytes += stat.size;
        files.push({ path: relative, size: stat.size, content });
      } catch {
        skipped.push({ path: relative, reason: 'File could not be decoded as UTF-8 text.' });
      }
    }
  }

  await walk(root, 0);
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
    root,
    inspectedAt: new Date().toISOString(),
    limits,
    summary: { filesRead: files.length, filesVisited: visited, directoriesSeen: directories.size, skipped: skipped.length, bytesRead: totalBytes, truncated },
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
  const list = (items) => items.length ? items.map((item) => `- \`${item}\``).join('\n') : '- None observed';
  const extensions = Object.entries(result.extensionCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  return `# ROCKSOUL-EX — Witness Report\n\n> Read-only inspection. No workspace files were changed.\n\n- **Inspected at:** ${result.inspectedAt}\n- **Workspace:** \`${result.root}\`\n- **Files read:** ${result.summary.filesRead} / ${result.summary.filesVisited} visited\n- **Directories seen:** ${result.summary.directoriesSeen}\n- **Bytes read:** ${result.summary.bytesRead.toLocaleString()}\n- **Skipped paths:** ${result.summary.skipped}\n- **Limits reached:** ${result.summary.truncated ? 'Yes — report is partial' : 'No'}\n\n## Detected manifests\n\n${list(result.manifestFiles)}\n\n## Likely source roots\n\n${list(result.sourceRoots)}\n\n## Likely test roots\n\n${list(result.testRoots)}\n\n## Documentation roots\n\n${list(result.documentationRoots)}\n\n## File type distribution\n\n${extensions.length ? extensions.map(([ext, count]) => `- \`${ext}\`: ${count}`).join('\n') : '- No text files read'}\n\n## Skipped paths (first 40)\n\n${result.skipped.slice(0, 40).map((item) => `- \`${item.path}\` — ${item.reason}`).join('\n') || '- None'}\n\n## Interpretation boundary\n\nDirectory names and manifests are observed facts. The source/test/documentation classifications are heuristics, not a full semantic analysis. Project scripts were not executed. Secret paths, dependency folders, generated output, Git internals, and ROCKSOUL memory were excluded by default.\n`;
}
