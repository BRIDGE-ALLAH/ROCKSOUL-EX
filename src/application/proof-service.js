export function createCriterionReviews(criteria, selectedIndexes, reviewedAt = new Date().toISOString()) {
  const selected = new Set(selectedIndexes.filter((value) => Number.isInteger(value) && value >= 0 && value < criteria.length));
  return criteria.flatMap((criterion, criterionIndex) => selected.has(criterionIndex)
    ? [{ criterionIndex, criterion, covered: true, reviewed: true, reviewedAt }]
    : []);
}

export function buildEvidenceMatrix(mission, evidenceRecords = []) {
  const criteria = Array.isArray(mission?.acceptanceCriteria) ? mission.acceptanceCriteria : [];
  const passing = evidenceRecords.filter((record) => record?.missionId === mission.id && record.status === 'passed');
  const rows = criteria.map((criterion, criterionIndex) => {
    const evidenceIds = [];
    for (const record of passing) {
      const review = (record.criterionReviews ?? []).find((item) =>
        item.criterionIndex === criterionIndex
        && item.criterion === criterion
        && item.covered === true
        && item.reviewed === true
      );
      if (review && typeof record.id === 'string') evidenceIds.push(record.id);
    }
    return { criterionIndex, criterion, covered: evidenceIds.length > 0, evidenceIds };
  });
  const covered = rows.filter((row) => row.covered).length;
  return {
    missionId: mission?.id ?? null,
    total: rows.length,
    covered,
    missing: rows.filter((row) => !row.covered),
    criteria: rows,
    complete: rows.length > 0 && covered === rows.length
  };
}
