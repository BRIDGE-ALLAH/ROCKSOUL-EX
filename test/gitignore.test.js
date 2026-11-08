import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parseGitignore, isGitIgnored } from '../src/infrastructure/gitignore.js';
import { inspectWorkspace } from '../src/infrastructure/workspace-inspector.js';

test('gitignore rules support directory, nested, anchored, globstar, and negation patterns', () => {
  const rules = parseGitignore('\n# comment\nnode_modules/\n*.log\n/src/private/**\n!important.log\n');
  const root = [{ base: '', rules }];
  assert.equal(isGitIgnored('node_modules/pkg/index.js', false, root), true);
  assert.equal(isGitIgnored('tmp/debug.log', false, root), true);
  assert.equal(isGitIgnored('important.log', false, root), false);
  assert.equal(isGitIgnored('src/private/token.txt', false, root), true);
  assert.equal(isGitIgnored('src/public/token.txt', false, root), false);
});

test('nested ignore rules override parent rules and cannot reopen an ignored parent', () => {
  const root = [{ base: '', rules: parseGitignore('logs/\n*.tmp\n') }];
  const nested = [{ base: '', rules: root[0].rules }, { base: 'src', rules: parseGitignore('!keep.tmp\n', 'src') }];
  assert.equal(isGitIgnored('logs/keep.tmp', false, nested), true);
  assert.equal(isGitIgnored('src/drop.tmp', false, nested), true);
  assert.equal(isGitIgnored('src/keep.tmp', false, nested), false);
});

test('inspection excludes ignored files before reading context and reuses unchanged content', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rocksoul-witness-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, 'src'), { recursive: true });
  await fs.mkdir(path.join(root, 'logs'), { recursive: true });
  await fs.writeFile(path.join(root, '.gitignore'), 'logs/\n*.secret\n');
  await fs.writeFile(path.join(root, 'README.md'), '# Witness\n');
  await fs.writeFile(path.join(root, 'src', 'index.js'), 'export const safe = true;');
  await fs.writeFile(path.join(root, 'src', 'api.secret'), 'DO_NOT_READ_ME');
  await fs.writeFile(path.join(root, 'logs', 'debug.log'), 'ignored');
  const options = { maxDepth: 5, maxFiles: 100, maxFileBytes: 4096, maxTotalBytes: 65536 };
  const first = await inspectWorkspace(root, options);
  assert.ok(first.files.some((file) => file.path === 'src/index.js'));
  assert.ok(!first.files.some((file) => file.path === 'src/api.secret'));
  assert.ok(!first.files.some((file) => file.path === 'logs/debug.log'));
  assert.ok(first.skipped.some((item) => item.path === 'logs' && /gitignore/.test(item.reason)));
  const second = await inspectWorkspace(root, options);
  assert.equal(second.summary.cacheHits, first.summary.filesRead);
  assert.equal(second.changesSincePreviousScan.baselineAvailable, true);
  assert.equal(second.changesSincePreviousScan.added.length, 0);
});

test('an unreadable .gitignore fails closed instead of scanning that directory', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rocksoul-ignore-failclosed-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.writeFile(path.join(root, '.gitignore'), 'private/\n');
  await fs.writeFile(path.join(root, 'README.md'), '# safe\n');
  await fs.mkdir(path.join(root, 'private'));
  await fs.writeFile(path.join(root, 'private', 'token.txt'), 'never read');
  await fs.rm(path.join(root, '.gitignore'));
  await fs.mkdir(path.join(root, '.gitignore'));
  await assert.rejects(() => inspectWorkspace(root), /Cannot safely read .gitignore/);
});
