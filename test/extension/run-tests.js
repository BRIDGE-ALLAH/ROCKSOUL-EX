import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTests } from '@vscode/test-electron';

const here = path.dirname(fileURLToPath(import.meta.url));
const extensionDevelopmentPath = path.resolve(here, '../..');
const extensionTestsPath = path.join(here, 'suite', 'index.cjs');

await runTests({
  extensionDevelopmentPath,
  extensionTestsPath,
  version: 'stable',
  launchArgs: ['--disable-extensions', '--disable-gpu', '--no-sandbox']
});
