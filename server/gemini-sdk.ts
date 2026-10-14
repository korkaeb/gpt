import { GoogleGenAI, type Schema } from '@google/genai';
import { apiError, GeminiError, type Transport } from '../src/lib/gemini';
// Server-only module. Matches the original AI Studio project's SDK and header.
export function createClient(apiKey: string, fetcher?: typeof fetch) {
  return new GoogleGenAI({ apiKey, httpOptions: { timeout: 90_000, ...(fetcher ? { fetch: fetcher } : {}), headers: { 'User-Agent': 'aistudio-build' } } });
}
function sdkSchema(schema: any): Schema {
  return {
    ...schema,
    type: schema.type.toUpperCase(),
    ...(schema.properties ? { properties: Object.fromEntries(Object.entries(schema.properties).map(([k, v]) => [k, sdkSchema(v)])) } : {}),
    ...(schema.items ? { items: sdkSchema(schema.items) } : {}),
  };
}
export function createSdkTransport(factory: typeof createClient = createClient): Transport {
  return async (path, apiKey, body) => {
    const ai = factory(apiKey);
    try {
      if (body) {
        const model = decodeURIComponent(path.replace(/^models\//, '').replace(/:generateContent$/, ''));
        return await ai.models.generateContent({
          model,
          contents: body.contents,
          config: {
            systemInstruction: body.systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: sdkSchema(body.generationConfig.responseJsonSchema),
          },
        });
      }
      const pager = await ai.models.list({ config: { pageSize: 100 } });
      const models = [];
      for await (const model of pager) models.push({ ...model, supportedGenerationMethods: model.supportedActions });
      return { models };
    } catch (error: any) {
      if (error instanceof GeminiError) throw error;
      let detail: any;
      try { detail = JSON.parse(error.message); } catch { /* Never echo raw provider errors or keys. */ }
      const status = Number(error.status || detail?.error?.code || 502);
      if (['TimeoutError', 'AbortError'].includes(error.name)) throw new GeminiError('Gemini не ответил за 90 секунд. Повторите запрос.', 504);
      throw apiError(status >= 400 && status <= 599 ? status : 502, detail);
    }
  };
}
export const sdkTransport = createSdkTransport();
