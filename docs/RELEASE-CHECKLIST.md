# ROCKSOUL-EX — Release Checklist

## CI path

Pull requests and pushes run:

- Syntax and unit checks on Node 20 and Node 22.
- VS Code Extension Development Host smoke test on Linux under Xvfb.
- VSIX packaging after both test gates pass.

The generated VSIX is uploaded as a GitHub Actions artifact for 30 days.

## GitHub Release path

A version tag named vX.Y.Z triggers the release workflow. It re-runs the required checks, builds a VSIX, and creates a GitHub Release with generated release notes and the VSIX attached.

The workflow currently uses version 0.2.0 in package metadata. Change the package and lockfile version together before creating a matching future tag.

## Marketplace publishing

Marketplace publication is a separate credential/ownership requirement:

1. Register and verify the publisher ID configured in package.json.
2. Configure Marketplace OIDC trust and the repository variable VSCE_USE_OIDC=true, or set repository secret VSCE_PAT.
3. Run a test publish or verify publisher access before announcing a Marketplace release.

This repository does not contain Marketplace credentials. A tag-based GitHub Release can publish the VSIX without Marketplace publication.

## Required before calling the release production-ready

- [ ] Merge the reviewed PR to main after required checks pass.
- [ ] Confirm the latest main CI is green.
- [ ] Confirm package version matches the intended release tag.
- [ ] Download the VSIX artifact from the successful CI workflow.
- [ ] Install it in a clean VS Code profile.
- [ ] Confirm activation, Activity Bar view, all new commands, and keyboard flows.
- [ ] Confirm key storage/clearing in SecretStorage.
- [ ] Test a real API request with a non-sensitive fixture repository and confirm API billing/model availability.
- [ ] Verify provider disclosure lists only intended files.
- [ ] Verify diff review, rejection, apply, apply-time conflict rejection, and Source Control result.
- [ ] Run a harmless npm script after approval; test cancellation and timeout.
- [ ] Confirm secrets and excluded files never enter the provider context.
- [ ] Confirm the publisher identity and Marketplace credentials before announcing Marketplace publication.
- [ ] Create and push the matching version tag.

## Honesty gate

Do not call a GitHub Release a Marketplace publication. Do not call a passed shell command a Verified mission. Do not claim a clean VSIX install or a live provider request unless that exact check actually ran.
