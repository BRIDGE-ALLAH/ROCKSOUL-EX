import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { validatePatchProposal, revalidatePatchSnapshot } from '../src/security/change-policy.js';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rocksoul-patch-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}

const mission = { scope: ['src/'] };
const proposal = (change) => ({ summary: 'Test proposal', notes: [], changes: [change] });

test('patch validator accepts scoped text file create and update with baseline hashes', async (t) => {
  const root = await fixture(t);
  await fs.mkdir(path.join(root, 'src'));
  await fs.writeFile(path.join(root, 'src', 'existing.js'), 'export const oldValue = 1;');
  const result = await validatePatchProposal(root, mission, proposal({
    path: 'src/existing.js',
    operation: 'update',
    content: 'export const newValue = 2;',
    rationale: 'Rename for clarity.'
  }));
  assert.equal(result.changes[0].beforeContent, 'export const oldValue = 1;');
  assert.equal(typeof result.changes[0].beforeHash, 'string');
  const created = await validatePatchProposal(root, mission, proposal({
    path: 'src/new.js',
    operation: 'create',
    content: 'export const value = 3;',
    rationale: 'Add a helper.'
  }));
  assert.equal(created.changes[0].beforeHash, null);
});

test('patch validator rejects out-of-scope, traversal, secret, binary, and duplicate paths', async (t) => {
  const root = await fixture(t);
  await fs.mkdir(path.join(root, 'src'), { recursive: true });
  await assert.rejects(() => validatePatchProposal(root, mission, proposal({ path: 'docs/README.md', operation: 'create', content: 'x', rationale: '' })), /outside the approved mission scope/);
  await assert.rejects(() => validatePatchProposal(root, mission, proposal({ path: '../outside.js', operation: 'create', content: 'x', rationale: '' })), /traversal|Unsafe/);
  await assert.rejects(() => validatePatchProposal(root, mission, proposal({ path: 'src/.env', operation: 'create', content: 'x', rationale: '' })), /excluded|allowlisted/);
  await assert.rejects(() => validatePatchProposal(root, mission, proposal({ path: 'src/image.png', operation: 'create', content: 'x', rationale: '' })), /allowlisted/);
  await assert.rejects(() => validatePatchProposal(root, mission, { summary: 'x', notes: [], changes: [
    { path: 'src/new.js', operation: 'create', content: 'a', rationale: '' },
    { path: 'src/new.js', operation: 'create', content: 'b', rationale: '' }
  ] }), /duplicate/);
});

test('patch validator refuses symlink parents', async (t) => {
  const root = await fixture(t);
  const outside = await fixture(t);
  await fs.symlink(outside, path.join(root, 'src'), 'dir');
  await assert.rejects(() => validatePatchProposal(root, mission, proposal({ path: 'src/new.js', operation: 'create', content: 'export {};', rationale: '' })), /symlink/);
  assert.deepEqual(await fs.readdir(outside), []);
});

test('apply-time snapshot check rejects a file changed after proposal generation', async (t) => {
  const root = await fixture(t);
  await fs.mkdir(path.join(root, 'src'));
  await fs.writeFile(path.join(root, 'src', 'existing.js'), 'const before = true;');
  const validated = await validatePatchProposal(root, mission, proposal({
    path: 'src/existing.js',
    operation: 'update',
    content: 'const after = true;',
    rationale: 'Test concurrent edit.'
  }));
  await fs.writeFile(path.join(root, 'src', 'existing.js'), 'const userEdited = true;');
  await assert.rejects(() => revalidatePatchSnapshot(root, validated), /changed since the proposal/);
});
