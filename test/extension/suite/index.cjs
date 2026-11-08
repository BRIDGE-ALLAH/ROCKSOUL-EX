const Mocha = require('mocha');
const manifest = require('../../../package.json');

function run() {
  const mocha = new Mocha({ ui: 'tdd', color: false });
  mocha.suite.emit('pre-require', global, 'test/extension/suite/index.cjs', mocha);
  const assert = require('node:assert/strict');
  const vscode = require('vscode');

  suite('ROCKSOUL-EX Extension Host', () => {
    test('extension activates and registers the production command surface', async () => {
      const extension = vscode.extensions.getExtension(`${manifest.publisher}.${manifest.name}`);
      assert.ok(extension, 'ROCKSOUL-EX must be discoverable by its publisher and package name');
      await extension.activate();
      assert.equal(extension.isActive, true);
      const commands = await vscode.commands.getCommands(true);
      for (const command of [
        'rocksoul.inspectProject',
        'rocksoul.createMission',
        'rocksoul.generatePatch',
        'rocksoul.reviewPatch',
        'rocksoul.applyPatch',
        'rocksoul.verifyMission'
      ]) {
        assert.ok(commands.includes(command), `Expected command to be registered: ${command}`);
      }
    });
  });

  return new Promise((resolve, reject) => {
    mocha.run((failures) => {
      if (failures > 0) reject(new Error(`Extension Host tests failed: ${failures}`));
      else resolve();
    });
  });
}

module.exports = { run };
