import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { isPathInside } from '../domain/policy.js';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const TX_PATTERN = /^rsx-tx-[a-f0-9-]{36}$/i;

function resolveTarget(root, relativePath) {
  if (typeof relativePath !== 'string' || !relativePath.trim()) throw new Error('A transaction entry needs a relative path.');
  const normalized = relativePath.split(String.fromCharCode(92)).join('/');
  if (normalized.startsWith('/') || /^[a-z]:/i.test(normalized) || normalized.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`Unsafe transaction path: ${relativePath}`);
  }
  const absolutePath = path.resolve(root, ...normalized.split('/'));
  if (!isPathInside(root, absolutePath) || absolutePath === path.resolve(root)) throw new Error(`Transaction path escapes the workspace: ${relativePath}`);
  return { normalized, absolutePath };
}

async function inspectFile(root, relativePath) {
  const { normalized, absolutePath } = resolveTarget(root, relativePath);
  let parent = path.resolve(root);
  for (const segment of normalized.split('/').slice(0, -1)) {
    parent = path.join(parent, segment);
    const parentStat = await fs.lstat(parent);
    if (parentStat.isSymbolicLink() || !parentStat.isDirectory()) throw new Error(`Refusing symlink or non-directory parent: ${relativePath}`);
  }
  try {
    const stat = await fs.lstat(absolutePath);
    if (stat.isSymbolicLink() || !stat.isFile() || stat.nlink > 1) throw new Error(`Refusing symlink, special, or hard-linked target: ${relativePath}`);
    const content = await fs.readFile(absolutePath);
    return { exists: true, hash: sha256(content), content, mode: stat.mode & 0o777 };
  } catch (error) {
    if (error.code === 'ENOENT') return { exists: false, hash: null, content: null, mode: 0o600 };
    throw error;
  }
}

async function syncWrite(filePath, content, mode = 0o600) {
  const handle = await fs.open(filePath, 'wx', mode);
  try {
    await handle.writeFile(content);
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function persistJournal(journalFile, journal) {
  const temp = `${journalFile}.${randomUUID()}.tmp`;
  await syncWrite(temp, Buffer.from(JSON.stringify(journal, null, 2) + String.fromCharCode(10)));
  await fs.rename(temp, journalFile);
}

async function cleanupStages(journal) {
  for (const entry of journal.entries) {
    try {
      const { absolutePath } = resolveTarget(journal.workspaceRoot, entry.path);
      const expectedStage = path.join(path.dirname(absolutePath), `.${path.basename(absolutePath)}.${journal.id}.stage`);
      await fs.rm(expectedStage, { force: true });
    } catch { /* A changed or unsafe path is never followed during cleanup. */ }
  }
}

async function rollbackJournal(journalFile, journal) {
  const conflicts = [];
  for (const entry of [...journal.entries].reverse()) {
    const { absolutePath } = resolveTarget(journal.workspaceRoot, entry.path);
    const current = await inspectFile(journal.workspaceRoot, entry.path);
    if (current.hash === entry.beforeHash) continue;
    if (current.hash !== entry.afterHash) {
      conflicts.push(entry.path);
      continue;
    }
    if (entry.beforeHash === null) {
      await fs.rm(absolutePath);
    } else {
      const backupPath = path.join(path.dirname(journalFile), entry.backupFile);
      const backup = await fs.readFile(backupPath);
      if (sha256(backup) !== entry.beforeHash) throw new Error(`Transaction backup integrity check failed: ${entry.path}`);
      const temp = path.join(path.dirname(absolutePath), `.${path.basename(absolutePath)}.${randomUUID()}.rollback`);
      await syncWrite(temp, backup, entry.mode ?? 0o600);
      await fs.rename(temp, absolutePath);
    }
    entry.state = 'rolled-back';
    await persistJournal(journalFile, journal);
  }
  await cleanupStages(journal);
  journal.state = conflicts.length ? 'recovery-required' : 'rolled-back';
  journal.conflicts = conflicts;
  journal.finishedAt = new Date().toISOString();
  await persistJournal(journalFile, journal);
  return { state: journal.state, conflicts, transactionId: journal.id };
}

export async function applyFileTransaction(root, changes, journalDirectory, hooks = {}) {
  if (!Array.isArray(changes) || changes.length === 0) throw new Error('A transaction needs at least one file change.');
  const workspaceRoot = await fs.realpath(root);
  await fs.mkdir(journalDirectory, { recursive: true, mode: 0o700 });
  const id = `rsx-tx-${randomUUID()}`;
  const transactionDirectory = path.join(journalDirectory, id);
  await fs.mkdir(transactionDirectory, { mode: 0o700 });
  const journalFile = path.join(transactionDirectory, 'journal.json');
  const entries = [];
  const seen = new Set();
  let journalCreated = false;

  try {
    for (const change of changes) {
      const { normalized } = resolveTarget(workspaceRoot, change.path);
      if (seen.has(normalized)) throw new Error(`Duplicate transaction path: ${normalized}`);
      seen.add(normalized);
      if (!['create', 'update'].includes(change.operation) || typeof change.content !== 'string') throw new Error(`Invalid transaction change: ${normalized}`);
      const current = await inspectFile(workspaceRoot, normalized);
      if (current.hash !== (change.beforeHash ?? null)) throw new Error(`Workspace changed before transaction preflight: ${normalized}`);
      if (change.operation === 'create' && current.exists) throw new Error(`Create target already exists: ${normalized}`);
      if (change.operation === 'update' && !current.exists) throw new Error(`Update target is missing: ${normalized}`);
      if (current.content && current.content.toString('utf8') !== change.beforeContent) throw new Error(`Snapshot content mismatch: ${normalized}`);
      const after = Buffer.from(change.content, 'utf8');
      entries.push({
        path: normalized,
        operation: change.operation,
        beforeHash: current.hash,
        afterHash: sha256(after),
        backupFile: current.exists ? `backup-${String(entries.length).padStart(3, '0')}.bin` : null,
        stagePath: path.join(path.dirname(path.resolve(workspaceRoot, normalized)), `.${path.basename(normalized)}.${id}.stage`),
        mode: current.mode,
        state: 'pending'
      });
      if (current.exists) await syncWrite(path.join(transactionDirectory, entries.at(-1).backupFile), current.content, 0o600);
    }
    const journal = {
      version: 1,
      id,
      workspaceRoot,
      state: 'prepared',
      createdAt: new Date().toISOString(),
      entries
    };
    await persistJournal(journalFile, journal);
    journalCreated = true;
    journal.state = 'applying';
    await persistJournal(journalFile, journal);

    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];
      const entry = entries[index];
      await hooks.beforeApply?.(entry, index);
      const current = await inspectFile(workspaceRoot, entry.path);
      if (current.hash !== entry.beforeHash) throw new Error(`Workspace changed during transaction: ${entry.path}`);
      await syncWrite(entry.stagePath, Buffer.from(change.content, 'utf8'), entry.mode ?? 0o600);
      if (entry.operation === 'create') {
        await fs.link(entry.stagePath, path.resolve(workspaceRoot, entry.path));
        await fs.rm(entry.stagePath);
      } else {
        const finalCheck = await inspectFile(workspaceRoot, entry.path);
        if (finalCheck.hash !== entry.beforeHash) throw new Error(`Workspace changed immediately before write: ${entry.path}`);
        await fs.rename(entry.stagePath, path.resolve(workspaceRoot, entry.path));
      }
      entry.state = 'applied';
      await persistJournal(journalFile, journal);
      await hooks.afterApply?.(entry, index);
    }

    journal.state = 'committed';
    journal.finishedAt = new Date().toISOString();
    await persistJournal(journalFile, journal);
    return { transactionId: id, journalFile, paths: entries.map((entry) => entry.path) };
  } catch (error) {
    if (!journalCreated) {
      await fs.rm(transactionDirectory, { recursive: true, force: true }).catch(() => {});
      throw error;
    }
    try {
      const raw = await fs.readFile(journalFile, 'utf8');
      const journal = JSON.parse(raw);
      const rollback = await rollbackJournal(journalFile, journal);
      if (rollback.state === 'recovery-required') {
        throw new Error(`Forge transaction ${id} needs manual recovery. Conflicting paths: ${rollback.conflicts.join(', ')}. Original error: ${error.message}`);
      }
    } catch (rollbackError) {
      if (rollbackError.message.includes('needs manual recovery')) throw rollbackError;
      throw new Error(`Forge transaction ${id} failed and rollback could not be completed: ${rollbackError.message}. Original error: ${error.message}`);
    }
    throw new Error(`Forge transaction ${id} was rolled back: ${error.message}`);
  }
}

export async function listIncompleteTransactions(journalDirectory) {
  let directories;
  try { directories = await fs.readdir(journalDirectory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const transactions = [];
  for (const item of directories) {
    if (!item.isDirectory() || !TX_PATTERN.test(item.name)) continue;
    const journalFile = path.join(journalDirectory, item.name, 'journal.json');
    try {
      const journal = JSON.parse(await fs.readFile(journalFile, 'utf8'));
      if (journal.id === item.name && ['prepared', 'applying', 'recovery-required'].includes(journal.state)) {
        transactions.push({ id: journal.id, workspaceRoot: journal.workspaceRoot, createdAt: journal.createdAt, state: journal.state, paths: journal.entries.map((entry) => entry.path), journalFile });
      }
    } catch { /* Incomplete or unreadable journals are not modified automatically. */ }
  }
  return transactions.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export async function recoverFileTransaction(journalDirectory, transactionId) {
  if (!TX_PATTERN.test(transactionId)) throw new Error('Invalid transaction identifier.');
  const journalFile = path.join(journalDirectory, transactionId, 'journal.json');
  const journal = JSON.parse(await fs.readFile(journalFile, 'utf8'));
  if (journal.id !== transactionId || !['prepared', 'applying', 'recovery-required'].includes(journal.state)) {
    throw new Error('This transaction does not need recovery.');
  }
  const root = await fs.realpath(journal.workspaceRoot);
  if (root !== journal.workspaceRoot) throw new Error('Workspace root no longer resolves to the original location.');
  return rollbackJournal(journalFile, journal);
}
