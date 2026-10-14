import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generate, listModels, assistPrompt, resultSchema, GeminiError } from '../src/lib/gemini';
import { createClient, createSdkTransport } from '../server/gemini-sdk';
function fixture(schema: any): any {
  if (schema.type === 'string') return 'finding';
  if (schema.type === 'array') return [];
  return Object.fromEntries(Object.entries(schema.properties).map(([k, v]) => [k, fixture(v)]));
}
function transport(fn: typeof fetch) { return createSdkTransport(key => createClient(key, fn)); }
const input = { apiKey: 'test-not-a-real-key', selectedModel: 'gemini-test', prompt: 'девушка стоит у окна' };
const reply = (body: any, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
test('real SDK serializes image/model/schema and retains original AI Studio header', async () => {
  let calls = 0;
  const t = transport(async (url, options) => {
    calls++;
    assert.match(String(url), /gemini-test:generateContent/);
    const headers = new Headers(options?.headers);
    assert.match(headers.get('user-agent') || '', /aistudio-build/);
    assert.equal(headers.get('x-goog-api-key'), input.apiKey);
    const body = JSON.parse(String(options?.body));
    assert.equal(body.contents[0].parts[1].inlineData.data, 'AAAA');
    assert.equal(body.generationConfig.responseSchema.type, 'OBJECT');
    return reply({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(fixture(resultSchema)) }] } }] });
  });
  const out = await generate({ ...input, image: { mimeType: 'image/png', data: 'AAAA' } }, true, undefined, t);
  assert.equal(calls, 1); assert.equal(out.model, input.selectedModel);
});
test('assistant sends polish/expand intent and direction without modifying original', async () => {
  for (const mode of ['polish', 'expand'] as const) {
    const t = transport(async (_url, options) => {
      const body = JSON.parse(String(options?.body));
      const source = JSON.parse(body.contents[0].parts[0].text);
      assert.equal(source.original, input.prompt); assert.equal(source.mode, mode); assert.equal(source.direction, 'не меняй одежду');
      assert.equal(body.contents[0].parts.length, 1);
      return reply({ candidates: [{ content: { parts: [{ text: JSON.stringify({ draft: 'Девушка стоит у окна.', englishPrompt: 'A woman stands by a window.', additions: [], questions: [] }) }] }, finishReason: 'STOP' }] });
    });
    const out = await assistPrompt({ ...input, assistMode: mode, direction: 'не меняй одежду' }, undefined, t);
    assert.equal(out.draft, 'Девушка стоит у окна.'); assert.equal(input.prompt, 'девушка стоит у окна');
  }
});
test('SDK quota error is sanitized, status and retry survive; no fallback/retry', async () => {
  let calls = 0;
  const t = transport(async () => { calls++; return reply({ error: { code: 429, message: input.apiKey, details: [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '5s' }] } }, 429); });
  await assert.rejects(assistPrompt(input, undefined, t), (e: GeminiError) => e.status === 429 && e.retryAfter === 5 && !e.message.includes(input.apiKey));
  assert.equal(calls, 1);
});
test('SDK model pager maps supportedActions to the application list', async () => {
  const t = transport(async () => reply({ models: [{ name: 'models/gemini-test', displayName: 'Test', supportedGenerationMethods: ['generateContent'] }] }));
  const models = await listModels(input.apiKey, undefined, t);
  assert.equal(models[0]?.value, input.selectedModel);
});
