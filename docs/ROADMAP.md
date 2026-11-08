# ROCKSOUL-EX — Product Roadmap

## 0.2.0 — Forge and review

**Implemented in source; final CI/installation acceptance pending.**

- [x] OpenAI Responses API adapter and strict structured patch output.
- [x] Secure API-key storage via VS Code SecretStorage.
- [x] Endpoint/model/path disclosure before each provider request.
- [x] Mission-scoped context and output limits.
- [x] Patch path/scope validation and file snapshot capture.
- [x] VS Code diff review, explicit apply/reject, apply-time stale-file checks.
- [x] Separate patch application and verification evidence.
- [x] npm script verification with approval, timeout, cancellation, and suppressed lifecycle hooks.
- [x] CI workflow for Node 20/22, Extension Host smoke test, and VSIX artifact.

## 0.3.0 — Reliability and repository intelligence

- [ ] Full .gitignore/.ignore support with tested precedence.
- [ ] Git root, branch, working-tree and changed-file awareness.
- [ ] Incremental scan cache with deterministic invalidation.
- [ ] Multi-root workspace coverage and large-repository profiling.
- [ ] Transactional or recoverable multi-file patch application.
- [ ] Provider request retry/backoff and better usage/cost display.
- [ ] Additional providers behind the same provider port.
- [ ] Evidence-to-acceptance-criteria mapping.

## 0.4.0 — Workflow maturity

- [ ] Mission decomposition and overlap detection.
- [ ] Mission templates and project playbooks.
- [ ] DNA freshness reports and links to canonical documents.
- [ ] Additional verification runners beyond npm.
- [ ] Review comments and patch checkpoints.
- [ ] Richer accessibility, keyboard, and multi-theme audits.

## 1.x — Mature product

- [ ] Release channels and stable migration policy.
- [ ] Optional team sync after privacy/access model validation.
- [ ] Optional MoonWitness knowledge bridge with clear data boundaries.
- [ ] Optional local model adapter.
- [ ] Marketplace adoption and extension compatibility telemetry only if explicitly designed and disclosed.

Later work must not introduce a required backend or turn ROCKSOUL-EX into a generic dashboard. The editor, local context, human approval, and evidence remain central.
