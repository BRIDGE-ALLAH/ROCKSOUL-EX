import test from 'node:test';
import assert from 'node:assert/strict';
import { requestPatchProposal, validateProviderSettings, patchResponseSchema } from '../src/providers/openai-responses.js';

test('provider settings require HTTPS except localhost and require a model ID', () => {
  assert.deepEqual(validateProviderSettings({ baseUrl: 'https://api.openai.com/v1/', model: 'gpt-6-luna' }), {
    baseUrl: 'https://api.openai.com/v1', model: 'gpt-6-luna'
  });
  assert.equal(validateProviderSettings({ baseUrl: 'http://localhost:1234/v1', model: 'local-model' }).model, 'local-model');
  assert.throws(() => validateProviderSettings({ baseUrl: 'http://example.com/v1', model: 'x' }), /HTTPS/);
  assert.throws(() => validateProviderSettings({ baseUrl: 'https://api.openai.com/v1', model: '' }), /model ID/);
});

test('Responses API request disables server-side storage and parses structured output', async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        status: 'completed',
        output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({
          summary: 'Add a helper',
          changes: [{ path: 'src/helper.js', operation: 'create', content: 'export {};', rationale: 'Keep work small.' }],
          notes: []
        }) }] }]
      })
    };
  };
  const result = await requestPatchProposal({
    apiKey: 'test-secret',
    mission: { title: 'Add helper' },
    context: { excerpts: [] },
    fetchImpl
  });
  assert.equal(request.url, 'https://api.openai.com/v1/responses');
  assert.equal(request.options.headers.Authorization, 'Bearer test-secret');
  assert.equal(request.body.store, false);
  assert.equal(request.body.text.format.type, 'json_schema');
  assert.equal(request.body.text.format.strict, true);
  assert.equal(result.changes[0].path, 'src/helper.js');
  assert.equal(patchResponseSchema().additionalProperties, false);
});

test('provider errors never echo the API key in the surfaced message', async () => {
  await assert.rejects(() => requestPatchProposal({
    apiKey: 'sensitive-test-key',
    mission: {},
    context: {},
    fetchImpl: async () => ({ ok: false, status: 401, text: async () => 'invalid token sensitive-test-key' })
  }), (error) => {
    assert.match(error.message, /401/);
    assert.doesNotMatch(error.message, /sensitive-test-key/);
    return true;
  });
});
