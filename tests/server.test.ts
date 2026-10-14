import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
test('AI Studio dev server serves UI and uses environment key for text assistant', { timeout: 20000 }, async () => {
  const port = 35000 + Math.floor(Math.random() * 15000);
  const child = spawn(process.execPath, ['--import', 'tsx', '--import', './tests/mock-google.mjs', 'server.ts'], {
    env: { ...process.env, NODE_ENV: 'development', PORT: String(port), GEMINI_API_KEY: 'test-environment-key', DISABLE_HMR: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  // Consume startup output, without printing request content or credentials.
  child.stdout.resume(); child.stderr.resume();
  const exit = once(child, 'exit');
  const root = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 50; i++) {
      try { const r = await fetch(root + '/api/status'); if (r.ok) { assert.deepEqual(await r.json(), { configured: true }); ready = true; break; } } catch {}
      await delay(100);
    }
    assert.ok(ready, 'Express + Vite dev server must start');
    const html = await (await fetch(root)).text(); assert.match(html, /src\/main.tsx/);
    for (const apiKey of ['', 'test-custom-key']) {
      const r = await fetch(root + '/api/assist-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey, selectedModel: 'gemini-test', prompt: 'девушка у окна', assistMode: 'expand' }) });
      assert.equal(r.status, 200);
      const data = await r.json(); assert.equal(data.draft, 'девушка у окна'); assert.equal(data.model, 'gemini-test');
    }
    const invalid = await fetch(root + '/api/assist-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selectedModel: 'gemini-test', prompt: '' }) });
    assert.equal(invalid.status, 400);
  } finally { child.kill(); await exit; }
});
