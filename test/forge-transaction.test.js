import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { applyFileTransaction, listIncompleteTransactions, recoverFileTransaction } from '../src/infrastructure/forge-transaction.js';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rocksoul-tx-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}

test('multi-file transaction restores earlier writes when a later write fails', async (t) => {
  const root = await fixture(t);
  const storage = await fixture(t);
  await fs.mkdir(path.join(root, 'src'));
  await fs.writeFile(path.join(root, 'src', 'a.js'), 'before-a');
  await fs.writeFile(path.join(root, 'src', 'b.js'), 'before-b');
  const changes = [
    { path: 'src/a.js', operation: 'update', beforeHash: 'f5c1f4e2f8f0c6b3d8c3a7c2b0c6d3a7f5d4c1e3', beforeContent: 'before-a', content: 'after-a' },
    { path: 'src/b.js', operation: 'update', beforeHash: 'f5c1f4e2f8f0c6b3d8c3a7c2b0c6d3a7f5d4c1e3', beforeContent: 'before-b', content: 'after-b' }
  ];
  const { createHash } = await import('node:crypto');
  const hash = (value) => createHash('sha256').update(value).digest('hex');
  changes[0].beforeHash = hash('before-a');
  changes[1].beforeHash = hash('before-b');
  await assert.rejects(() => applyFileTransaction(root, changes, path.join(storage, 'transactions'), {
    beforeApply: (_entry, index) => { if (index === 1) throw new Error('simulated second-file failure'); }
  }), /was rolled back/);
  assert.equal(await fs.readFile(path.join(root, 'src', 'a.js'), 'utf8'), 'before-a');
  assert.equal(await fs.readFile(path.join(root, 'src', 'b.js'), 'utf8'), 'before-b');
  assert.deepEqual(await listIncompleteTransactions(path.join(storage, 'transactions')), []);
});

test('transaction commits all files and records a durable journal', async (t) => {
  const root = await fixture(t);
  const storage = await fixture(t);
  await fs.mkdir(path.join(root, 'src'));
  await fs.writeFile(path.join(root, 'src', 'a.js'), 'before');
  const { createHash } = await import('node:crypto');
  const beforeHash = createHash('sha256').update('before').digest('hex');
  const result = await applyFileTransaction(root, [
    { path: 'src/a.js', operation: 'update', beforeHash, beforeContent: 'before', content: 'after' },
    { path: 'src/new.js', operation: 'create', beforeHash: null, beforeContent: '', content: 'created' }
  ], path.join(storage, 'transactions'));
  assert.equal(await fs.readFile(path.join(root, 'src', 'a.js'), 'utf8'), 'after');
  assert.equal(await fs.readFile(path.join(root, 'src', 'new.js'), 'utf8'), 'created');
  const journal = JSON.parse(await fs.readFile(result.journalFile, 'utf8'));
  assert.equal(journal.state, 'committed');
  assert.deepEqual(result.paths, ['src/a.js', 'src/new.js']);
});

test('recovery rolls back changes recorded before an interrupted process', async (t) => {
  const root = await fixture(t);
  const storage = await fixture(t);
  await fs.mkdir(path.join(root, 'src'));
  await fs.writeFile(path.join(root, 'src', 'a.js'), 'after');
  const { createHash, randomUUID } = await import('node:crypto');
  const id = `rsx-tx-${randomUUID()}`;
  const txDir = path.join(storage, 'transactions', id);
  await fs.mkdir(txDir, { recursive: true });
  await fs.writeFile(path.join(txDir, 'backup-000.bin'), 'before');
  const hash = (value) => createHash('sha256').update(value).digest('hex');
  const journal = {
    version: 1, id, workspaceRoot: root, state: 'applying', createdAt: new Date().toISOString(),
    entries: [{ path: 'src/a.js', operation: 'update', beforeHash: hash('before'), afterHash: hash('after'), backupFile: 'backup-000.bin', stagePath: null, mode: 0o600, state: 'applied' }]
  };
  await fs.writeFile(path.join(txDir, 'journal.json'), JSON.stringify(journal));
  assert.equal((await listIncompleteTransactions(path.join(storage, 'transactions'))).length, 1);
  const result = await recoverFileTransaction(path.join(storage, 'transactions'), id);
  assert.equal(result.state, 'rolled-back');
  assert.equal(await fs.readFile(path.join(root, 'src', 'a.js'), 'utf8'), 'before');
});

test('rollback preserves an external edit and marks the transaction for manual recovery', async (t) => {
  const root = await fixture(t);
  const storage = await fixture(t);
  await fs.mkdir(path.join(root, 'src'));
  await fs.writeFile(path.join(root, 'src', 'a.js'), 'before');
  const { createHash } = await import('node:crypto');
  const beforeHash = createHash('sha256').update('before').digest('hex');
  await assert.rejects(() => applyFileTransaction(root, [
    { path: 'src/a.js', operation: 'update', beforeHash, beforeContent: 'before', content: 'transaction-output' }
  ], path.join(storage, 'transactions'), {
    afterApply: async () => {
      await fs.writeFile(path.join(root, 'src', 'a.js'), 'external-edit');
      throw new Error('simulated concurrent edit');
    }
  }), /needs manual recovery/);
  assert.equal(await fs.readFile(path.join(root, 'src', 'a.js'), 'utf8'), 'external-edit');
  const pending = await listIncompleteTransactions(path.join(storage, 'transactions'));
  assert.equal(pending.length, 1);
  assert.equal(pending[0].state, 'recovery-required');
});
