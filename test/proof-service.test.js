import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEvidenceMatrix, createCriterionReviews } from '../src/application/proof-service.js';

const mission = {
  id: 'rsx-proof-test',
  acceptanceCriteria: ['Unit tests pass', 'Secrets stay excluded', 'Patch can be recovered', 'Changes are documented', 'User approves release']
};

test('one missing criterion prevents a mission from reaching Verified', () => {
  const evidence = [{
    id: 'proof-one',
    missionId: mission.id,
    status: 'passed',
    criterionReviews: createCriterionReviews(mission.acceptanceCriteria, [0, 1, 2, 3])
  }];
  const matrix = buildEvidenceMatrix(mission, evidence);
  assert.equal(matrix.covered, 4);
  assert.equal(matrix.total, 5);
  assert.equal(matrix.complete, false);
  assert.deepEqual(matrix.missing.map((item) => item.criterionIndex), [4]);
});

test('unreviewed, failed, and mismatched evidence cannot cover a criterion', () => {
  const evidence = [
    { id: 'failed', missionId: mission.id, status: 'failed', criterionReviews: createCriterionReviews(mission.acceptanceCriteria, [0]) },
    { id: 'unreviewed', missionId: mission.id, status: 'passed', criterionReviews: [{ criterionIndex: 1, criterion: mission.acceptanceCriteria[1], covered: true, reviewed: false }] },
    { id: 'stale', missionId: mission.id, status: 'passed', criterionReviews: [{ criterionIndex: 2, criterion: 'Old wording', covered: true, reviewed: true }] }
  ];
  const matrix = buildEvidenceMatrix(mission, evidence);
  assert.equal(matrix.covered, 0);
  assert.equal(matrix.complete, false);
});

test('multiple passing evidence records can cover every criterion independently', () => {
  const evidence = mission.acceptanceCriteria.map((criterion, index) => ({
    id: `proof-${index}`,
    missionId: mission.id,
    status: 'passed',
    criterionReviews: createCriterionReviews(mission.acceptanceCriteria, [index])
  }));
  const matrix = buildEvidenceMatrix(mission, evidence);
  assert.equal(matrix.complete, true);
  assert.equal(matrix.covered, 5);
  assert.deepEqual(matrix.missing, []);
});
