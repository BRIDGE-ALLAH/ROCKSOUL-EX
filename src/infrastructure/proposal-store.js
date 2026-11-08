import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

function proposalsDirectory(context) {
  return path.join(context.globalStorageUri.fsPath, 'proposals');
}

function proposalFile(context, proposalId) {
  if (!/^rsx-proposal-[a-f0-9-]{36}$/i.test(proposalId)) throw new Error('Invalid proposal identifier.');
  return path.join(proposalsDirectory(context), `${proposalId}.json`);
}

export async function savePendingProposal(context, proposal) {
  const directory = proposalsDirectory(context);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const proposalId = `rsx-proposal-${randomUUID()}`;
  const target = proposalFile(context, proposalId);
  const temp = `${target}.tmp`;
  const record = { ...proposal, id: proposalId, status: 'pending', savedAt: new Date().toISOString() };
  await fs.writeFile(temp, JSON.stringify(record, null, 2), { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  await fs.rename(temp, target);
  return proposalId;
}

export async function updatePendingProposal(context, proposal) {
  const target = proposalFile(context, proposal.id);
  const current = JSON.parse(await fs.readFile(target, 'utf8'));
  if (current.status !== 'pending') throw new Error('The proposal is no longer pending.');
  const temp = `${target}.tmp`;
  await fs.writeFile(temp, JSON.stringify({ ...proposal, status: 'pending', savedAt: current.savedAt }, null, 2), { encoding: 'utf8', flag: 'w', mode: 0o600 });
  await fs.rename(temp, target);
}

export async function listPendingProposals(context) {
  let entries;
  try { entries = await fs.readdir(proposalsDirectory(context), { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const proposals = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    try {
      const proposal = JSON.parse(await fs.readFile(path.join(proposalsDirectory(context), entry.name), 'utf8'));
      if (proposal.status === 'pending' && typeof proposal.id === 'string' && Array.isArray(proposal.changes)) proposals.push(proposal);
    } catch { /* An unreadable proposal is ignored; source files are never touched. */ }
  }
  return proposals.sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
}

export async function getPendingProposal(context, proposalId) {
  const target = proposalFile(context, proposalId);
  const proposal = JSON.parse(await fs.readFile(target, 'utf8'));
  if (proposal.id !== proposalId || proposal.status !== 'pending') throw new Error('The selected proposal is no longer pending.');
  return proposal;
}

export async function deletePendingProposal(context, proposalId) {
  await fs.rm(proposalFile(context, proposalId), { force: true });
}

export async function createProposalPreviews(context, proposal) {
  const root = path.join(context.globalStorageUri.fsPath, 'previews', proposal.id);
  for (let index = 0; index < proposal.changes.length; index += 1) {
    const change = proposal.changes[index];
    const extension = path.extname(change.path) || '.txt';
    const directory = path.join(root, String(index).padStart(3, '0'));
    await fs.mkdir(directory, { recursive: true, mode: 0o700 });
    const beforePath = path.join(directory, `before${extension}`);
    const afterPath = path.join(directory, `after${extension}`);
    await fs.writeFile(beforePath, change.beforeContent ?? '', { encoding: 'utf8', mode: 0o600 });
    await fs.writeFile(afterPath, change.content, { encoding: 'utf8', mode: 0o600 });
    change.previewBefore = beforePath;
    change.previewAfter = afterPath;
  }
  return proposal;
}

export async function deleteProposalPreviews(context, proposalId) {
  await fs.rm(path.join(context.globalStorageUri.fsPath, 'previews', proposalId), { recursive: true, force: true });
}
