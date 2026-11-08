import test from 'node:test';
import assert from 'node:assert/strict';
import { isExcludedPath, isTextCandidate, clampInteger, isPathInside } from '../src/domain/policy.js';

test('security exclusions reject secrets, credentials, dependencies, and generated directories', () => {
  for (const candidate of ['.env', '.env.production', 'src/.env.local', '.ssh/id_rsa', '.git/config', 'node_modules/pkg/index.js', 'dist/app.js', 'private/cert.pem', '.rocksoul/DNA.md']) {
    assert.equal(isExcludedPath(candidate), true, `${candidate} should be excluded`);
  }
});

test('custom exclusions support path segments and simple wildcards', () => {
  assert.equal(isExcludedPath('packages/private/file.ts', ['private']), true);
  assert.equal(isExcludedPath('apps/mobile/generated/file.js', ['**/generated/**']), true);
  assert.equal(isExcludedPath('src/index.js', ['private', '**/generated/**']), false);
});

test('text allowlist accepts source and project documents but not images or archives', () => {
  assert.equal(isTextCandidate('src/index.js'), true);
  assert.equal(isTextCandidate('README.md'), true);
  assert.equal(isTextCandidate('assets/photo.png'), false);
  assert.equal(isTextCandidate('release/archive.zip'), false);
});

test('limits clamp unsafe values and path containment rejects traversal', () => {
  assert.equal(clampInteger(999999, 10, 1, 100), 100);
  assert.equal(clampInteger('nope', 10, 1, 100), 10);
  assert.equal(isPathInside('/workspace/project', '/workspace/project/src/index.js'), true);
  assert.equal(isPathInside('/workspace/project', '/workspace/secrets/.env'), false);
});
