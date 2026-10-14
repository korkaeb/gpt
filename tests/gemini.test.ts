import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generate, listModels, resultSchema, GeminiError } from '../src/lib/gemini';
function fixture(schema: any): any {
  if (schema.type === 'string') return 'visible finding';
  if (schema.type === 'array') return [];
  return Object.fromEntries(Object.entries(schema.properties).map(([k, v]) => [k, fixture(v)]));
}
const input = { apiKey: 'test-only-key', selectedModel: 'gemini-test', prompt: 'two people, facing each other' };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
test('selected model and image reach Google once; structured scene and prompts survive', async () => {
  let calls = 0;
  const result = await generate({ ...input, image: { mimeType: 'image/png', data: 'AAAA' } }, true, (async (url, options) => {
    calls++;
    assert.match(String(url), /models\/gemini-test:generateContent$/);
    const body = JSON.parse(options!.body as string);
    assert.equal(body.contents[0].parts[1].inlineData.mimeType, 'image/png');
    assert.equal((options!.headers as any)['x-goog-api-key'], input.apiKey);
    assert.equal(String(url).includes(input.apiKey), false);
    return reply({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(fixture(resultSchema)) }] } }] });
  }) as typeof fetch);
  assert.equal(calls, 1);
  assert.equal(result.model, input.selectedModel);
  assert.equal(result.analysis.camera, 'visible finding');
});
test('429 preserves status/retry and never silently switches models or leaks upstream text', async () => {
  let calls = 0;
  await assert.rejects(generate(input, false, (async () => {
    calls++;
    return reply({ error: { message: 'secret test-only-key', details: [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '12.4s' }] } }, 429);
  }) as typeof fetch), (e: GeminiError) => e.status === 429 && e.retryAfter === 13 && !e.message.includes('test-only-key'));
  assert.equal(calls, 1);
});
test('rejects invalid image and invalid model before network', async () => {
  const network = (() => { throw new Error('Network should not run'); }) as typeof fetch;
  await assert.rejects(generate({ ...input, image: { mimeType: 'image/svg+xml', data: 'AAAA' } }, true, network), (e: GeminiError) => e.status === 400);
  await assert.rejects(generate({ ...input, selectedModel: '../bad' }, false, network), (e: GeminiError) => e.status === 400);
});
test('empty, truncated and malformed structured responses report useful errors', async () => {
  for (const body of [{}, { candidates: [{ finishReason: 'MAX_TOKENS' }] }, { candidates: [{ content: { parts: [{ text: '{}' }] } }] }]) {
    await assert.rejects(generate(input, false, (async () => reply(body)) as typeof fetch), GeminiError);
  }
});
test('model discovery follows pagination, filters unsupported endpoints and preserves exact IDs', async () => {
  let calls = 0;
  const list = await listModels('test-key', (async (url) => {
    calls++;
    if (calls === 1) return reply({ models: [{ name: 'models/gemini-a', supportedGenerationMethods: ['generateContent'] }, { name: 'models/gemini-embed', supportedGenerationMethods: ['embedContent'] }], nextPageToken: 'next' });
    assert.match(String(url), /pageToken=next/);
    return reply({ models: [{ name: 'models/gemini-b', supportedGenerationMethods: ['generateContent'] }] });
  }) as typeof fetch);
  assert.deepEqual(list.map(m => m.value), ['gemini-a', 'gemini-b']);
});
