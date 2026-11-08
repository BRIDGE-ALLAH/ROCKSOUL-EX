# ROCKSOUL-EX — Release Checklist

## Continuous integration

Pull requests and pushes run:

- Syntax and unit checks on Node 20 and Node 22.
- VS Code Extension Development Host smoke test on Linux under Xvfb.
- VSIX packaging after both test gates pass.

The generated VSIX is uploaded as a GitHub Actions artifact for 30 days.

## Versioned GitHub Release

A push to `main` that changes the release workflow, package metadata, changelog, or this checklist triggers the release workflow.

The workflow reads the version from `package.json`, verifies that `package-lock.json` and its root package entry match, and checks whether the corresponding `vX.Y.Z` GitHub Release already exists. When no release exists, it re-runs the automated checks, builds a VSIX, creates the matching tag on the triggering `main` commit, and attaches the VSIX to a GitHub Release.

The current release candidate is version `0.2.0`. Do not change package metadata without updating `package.json` and `package-lock.json` together.

## Visual Studio Marketplace

Marketplace publication is separate from a GitHub Release and requires publisher ownership/access:

1. Register and verify the publisher ID configured in `package.json`.
2. Configure Marketplace OIDC trusted publishing and set repository variable `VSCE_USE_OIDC=true`, or configure repository secret `VSCE_PAT`.
3. Verify publisher access before announcing a Marketplace publication.

The workflow attempts Marketplace publication only when one of those explicit repository settings is present. A successful GitHub Release does not imply Marketplace publication.

## Manual product acceptance still required

- [ ] Install the VSIX in a clean VS Code profile.
- [ ] Confirm activation, Activity Bar view, commands, and keyboard flows.
- [ ] Confirm key storage and deletion using VS Code SecretStorage.
- [ ] Test a live provider request with a non-sensitive fixture repository and confirm API billing/model access.
- [ ] Verify the provider disclosure lists only the intended files.
- [ ] Verify diff review, rejection, apply, apply-time conflict rejection, and the Source Control result.
- [ ] Run a harmless npm script after approval; test cancellation and timeout.
- [ ] Confirm secrets and excluded files never enter the provider context.
- [ ] Confirm the publisher identity and Marketplace configuration before announcing Marketplace publication.

## Honesty gate

Do not call a GitHub Release a Marketplace publication. Do not call a passed shell command a Verified mission. Do not claim a clean VSIX install, live provider request, or Marketplace publication unless that exact check actually ran.
