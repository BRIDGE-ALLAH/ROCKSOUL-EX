# ROCKSOUL-EX — Product Roadmap

## 0.2.x — Local-first engineering foundation

- [x] VS Code Activity Bar, Missions Tree View, commands, and Output.
- [x] Project memory, missions, handoff, and evidence storage.
- [x] OpenAI Responses API adapter, SecretStorage, provider/context disclosure.
- [x] Mission-scoped structured patch proposals and diff review.
- [x] Explicit apply/reject and apply-time snapshot validation.
- [x] Approved npm command runner with timeout, cancellation, and redacted evidence.
- [x] Node 20/22 CI, Extension Host smoke test, VSIX packaging, and GitHub Release workflow.

## 0.3.0 — Reliability and repository intelligence

- [x] Nested .gitignore support for common patterns, anchoring, globstar, directory-only rules, and negation.
- [x] Git root, branch, clean/dirty state, and bounded status discovery.
- [x] Session-scoped incremental scan cache with metadata invalidation.
- [x] Previous-scan added/changed/removed file reporting.
- [x] Safer no-follow file opening and resolved path checks.
- [x] Durable Forge transaction journal, backups, per-file atomic replacement, rollback, and interrupted-transaction recovery.
- [x] Evidence-to-acceptance-criteria mapping with explicit review.
- [x] Cumulative evidence matrix and Verified closure gate.
- [ ] Multi-root aggregate reporting, stress profiling, and deeper Gitignore conformance tests.
- [ ] More provider adapters and improved context ranking.
- [ ] Non-npm verification runners.

## 0.4.0 — Workflow maturity

- [ ] Mission decomposition and overlap detection.
- [ ] Mission templates and project playbooks.
- [ ] DNA freshness reports and links to canonical documents.
- [ ] pnpm/yarn/bun and language-specific verification runners.
- [ ] Review comments, checkpoints, and richer conflict resolution.
- [ ] Accessibility, keyboard-navigation, and extension theme audits.

## 1.x — Mature product

- [ ] Stable migration policy and release channels.
- [ ] Optional team sync only after privacy/access boundaries are validated.
- [ ] Optional MoonWitness knowledge bridge with explicit data boundaries.
- [ ] Optional local-model adapter.
- [ ] Marketplace adoption; telemetry only if separately designed and disclosed.

Later work must not introduce a required backend or turn ROCKSOUL-EX into a generic dashboard. The editor, local context, human approval, and evidence remain central.
