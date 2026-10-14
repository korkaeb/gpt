import { generate, listModels, assistPrompt, type AssistInput, type AssistResult, type RequestInput, type PromptResult } from './gemini';
export const STATIC_MODE = import.meta.env.VITE_STATIC_MODE === 'true';
async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(100_000) });
  } catch { throw new Error('Сервер не ответил. Проверьте соединение и запуск сервера.'); }
  const data = await response.json().catch(() => { throw new Error(`Сервер вернул не JSON (HTTP ${response.status}). Для GitHub Pages нужна сборка npm run build:pages.`); });
  if (!response.ok) throw new Error(data.error || `Ошибка сервера ${response.status}`);
  return data;
}
export function requestPrompt(input: RequestInput, vision: boolean): Promise<PromptResult> {
  return STATIC_MODE ? generate(input, vision) : post(vision ? '/api/vision-prompt' : '/api/sort-prompt', input);
}
export async function requestModels(apiKey: string) {
  return STATIC_MODE ? listModels(apiKey) : (await post<{ models: { value: string; label: string }[] }>('/api/models', { apiKey })).models;
}

export function requestAssist(input: AssistInput): Promise<AssistResult> {
  return STATIC_MODE ? assistPrompt(input) : post('/api/assist-prompt', input);
}
