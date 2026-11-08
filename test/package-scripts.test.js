import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const manifestUrl = new URL('../package.json', import.meta.url);

test('unit test discovery is explicit and does not launch the VS Code host runner', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  assert.equal(manifest.scripts.test, 'node --test test/*.test.js');
  assert.equal(manifest.scripts['test:extension'], 'node test/extension/run-tests.js');
  assert.equal(manifest.publisher, 'MohRezzaFahlevi');
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  assert.equal(manifest.version, '0.3.0');
  assert.equal(manifest.version, lock.version);
  assert.equal(manifest.version, lock.packages[''].version);
});
