import { randomUUID } from 'node:crypto';
import { validateMission, transitionMission } from '../domain/mission.js';
import { createMissionRecord, listMissions, updateMissionRecord } from '../infrastructure/rocksoul-store.js';

export async function createMission(root, input, now = new Date().toISOString()) {
  const validation = validateMission(input);
  if (!validation.valid) throw new Error(validation.errors.join('\n'));
  const mission = {
    id: `rsx-${now.replace(/[-:.TZ]/g, '').slice(0, 14)}-${randomUUID().slice(0, 8)}`,
    title: validation.normalized.title,
    goal: validation.normalized.goal,
    scope: validation.normalized.scope,
    outOfScope: validation.normalized.outOfScope,
    acceptanceCriteria: validation.normalized.acceptanceCriteria,
    risks: Array.isArray(input.risks) ? input.risks.filter(Boolean) : [],
    status: 'Draft',
    createdAt: now,
    updatedAt: now,
    evidenceIds: []
  };
  const path = await createMissionRecord(root, mission);
  return { mission, path };
}

export async function changeMissionStatus(root, missionId, nextStatus, now = new Date().toISOString()) {
  const records = await listMissions(root);
  const record = records.find((item) => item.id === missionId);
  if (!record) throw new Error(`Mission ${missionId} was not found.`);
  const missionFile = await import('../infrastructure/rocksoul-store.js').then((module) => module.openMissionRecord(root, missionId));
  const mission = parseMissionMarkdown(missionFile.content, record);
  const updated = transitionMission(mission, nextStatus, now);
  const path = await updateMissionRecord(root, updated);
  return { mission: updated, path };
}

export async function loadMissionSummaries(root) {
  return listMissions(root);
}

function parseMissionMarkdown(content, record) {
  const section = (heading) => {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = content.match(new RegExp(`## ${escaped}\\s+([\\s\\S]*?)(?=\\n## |$)`, 'i'));
    return match?.[1]?.trim() ?? '';
  };
  const lines = (heading) => section(heading).split(/\r?\n/).map((line) => line.replace(/^-\s*/, '').trim()).filter((line) => line && line !== 'None recorded' && !line.startsWith('[ ]'));
  const goal = section('Goal');
  const criteria = section('Acceptance criteria').split(/\r?\n/).map((line) => line.replace(/^-\s*\[[ xX]\]\s*/, '').trim()).filter(Boolean);
  return {
    id: record.id,
    title: record.title,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    goal,
    scope: lines('In scope'),
    outOfScope: lines('Out of scope'),
    acceptanceCriteria: criteria,
    risks: lines('Risks and assumptions'),
    evidenceIds: lines('Evidence').map((line) => line.replaceAll('`', ''))
  };
}
