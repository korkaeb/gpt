// Imported only by the integration test child process; never by the application.
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (!String(url).startsWith('https://generativelanguage.googleapis.com/')) return originalFetch(url, options);
  const headers = new Headers(options?.headers);
  const body = JSON.parse(String(options?.body));
  const source = JSON.parse(body.contents[0].parts[0].text);
  const key = headers.get('x-goog-api-key');
  if (!['test-environment-key', 'test-custom-key'].includes(key)) return new Response(JSON.stringify({ error: { code: 401 } }), { status: 401 });
  return new Response(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ draft: source.original, englishPrompt: 'A woman stands by a window.', additions: [], questions: [] }) }] } }] }), { headers: { 'Content-Type': 'application/json' } });
};
