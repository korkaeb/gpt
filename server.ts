import { sdkTransport } from './server/gemini-sdk';
import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { generate, listModels, assistPrompt, GeminiError } from './src/lib/gemini';
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3000);
app.use(express.json({ limit: '12mb' }));
app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
// Body-supplied keys take precedence. Server keys are never sent to the browser.
function key(body: any) { return (typeof body?.apiKey === 'string' ? body.apiKey.trim() : '') || process.env.GEMINI_API_KEY || ''; }
app.get('/api/status', (_req, res) => res.json({ configured: Boolean(process.env.GEMINI_API_KEY?.trim()) }));
app.post('/api/models', async (req, res, next) => {
  try { res.json({ models: await listModels(key(req.body), undefined, sdkTransport) }); } catch (error) { next(error); }
});
for (const [route, vision] of [['vision-prompt', true], ['sort-prompt', false]] as const) {
  app.post(`/api/${route}`, async (req, res, next) => {
    try { res.json(await generate({ ...req.body, selectedModel: req.body?.selectedModel?.trim() || req.body?.model?.trim() || process.env.GEMINI_MODEL || 'gemini-flash-latest', apiKey: key(req.body) }, vision, undefined, sdkTransport)); }
    catch (error) { next(error); }
  });
}
app.post('/api/assist-prompt', async (req, res, next) => {
  try {
    res.json(await assistPrompt({ ...req.body, selectedModel: req.body?.selectedModel || req.body?.model || process.env.GEMINI_MODEL || 'gemini-flash-latest', apiKey: key(req.body) }, undefined, sdkTransport));
  } catch (error) { next(error); }
});
app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint не найден.' }));
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err instanceof GeminiError ? err.status : err.type === 'entity.too.large' ? 413 : err instanceof SyntaxError ? 400 : 500;
  if (err instanceof GeminiError && err.retryAfter) res.set('Retry-After', String(err.retryAfter));
  res.status(status).json({ error: err instanceof GeminiError ? err.message : status === 413 ? 'Изображение слишком большое (максимум 8 МБ).' : status === 400 ? 'Некорректный JSON запроса.' : 'Внутренняя ошибка сервера.' });
});
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.argv[1]?.endsWith('server.cjs')) {
    const { createServer } = await import('vite');
    app.use((await createServer({ server: { middlewareMode: true }, appType: 'spa' })).middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Anima Prompt Sorter: http://localhost:${PORT}`));
}
startServer();
