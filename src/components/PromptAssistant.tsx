import React, { useState } from 'react';
import { requestAssist } from '../lib/api';
import type { AssistResult } from '../lib/gemini';
interface Props {
  prompt: string; apiKey: string; model: string; busy: boolean;
  onBusy: (busy: boolean) => void; onApply: (text: string) => void;
}
export function PromptAssistant({ prompt, apiKey, model, busy, onBusy, onApply }: Props) {
  const [mode, setMode] = useState<'polish' | 'expand'>('expand');
  const [direction, setDirection] = useState('');
  const [result, setResult] = useState<AssistResult | null>(null);
  const [source, setSource] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const input = 'w-full rounded-lg border border-[#4f4958] bg-[#17161b] p-3 text-sm text-[#efe8da]';
  async function help() {
    if (busy || !prompt.trim()) return;
    setPending(true); onBusy(true); setError(''); setNotice('');
    const original = prompt;
    try { const answer = await requestAssist({ prompt: original, apiKey, selectedModel: model, assistMode: mode, direction }); setSource(original); setResult(answer); }
    catch (e) { setError(e instanceof Error ? e.message : 'Не получилось дополнить текст.'); }
    finally { setPending(false); onBusy(false); }
  }
  function apply(text: string) { onApply(text); setNotice('Вариант вставлен в исходный промпт. Теперь его можно разложить на теги или использовать как пожелание к фото.'); }
  return <section className="rounded-xl border border-[#c06e88]/50 bg-[#28252f] p-4 space-y-3">
    <h3 className="text-[#c06e88] font-semibold">Помочь написать промпт</h3>
    <p className="text-xs text-[#a49d90]">Напиши свою идею в поле выше — даже пару слов. Помощник работает с текстом; загруженное фото анализируется отдельной кнопкой.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      <label className="text-sm">Что сделать
        <select className={input} value={mode} disabled={busy} onChange={e => setMode(e.target.value as typeof mode)}>
          <option value="polish">Поправить формулировку · без новых деталей</option>
          <option value="expand">Дополнить идею · сохранить мой замысел</option>
        </select>
      </label>
      <label className="text-sm">Пожелание к дополнению (необязательно)
        <input className={input} value={direction} maxLength={4000} disabled={busy} onChange={e => setDirection(e.target.value)} placeholder="Например: подробнее описать свет, одежду не менять" />
      </label>
    </div>
    <button type="button" onClick={help} disabled={busy || !prompt.trim()} className="rounded-lg px-4 py-2 bg-[#c06e88] text-[#17161b] font-semibold disabled:opacity-50">{pending ? 'Дописываю…' : 'Помочь дописать мои слова'}</button>
    {error && <p role="alert" className="text-[#efb0bf]">{error}</p>}
    {result && <div className="space-y-3 border-t border-[#4f4958] pt-3">
      <p className="text-xs text-[#a49d90]">Вариант от {result.model}. Исходный текст автоматически не заменяется.</p>
      <details><summary>Мой исходный текст для этого варианта</summary><p className="whitespace-pre-wrap text-sm">{source}</p></details>
      <label className="block text-sm">Дополненный вариант (можно поправить)
        <textarea rows={5} className={input} value={result.draft} onChange={e => setResult({ ...result, draft: e.target.value })} />
      </label>
      <button type="button" disabled={busy || !result.draft.trim()} onClick={() => apply(result.draft)} className="rounded-lg border border-[#c06e88] px-3 py-2 text-sm disabled:opacity-50">Вставить этот вариант в исходный промпт</button>
      <details><summary className="cursor-pointer">English prompt · вариант для генерации</summary>
        <p className="text-xs text-[#a49d90] my-2">Английский вариант получен вместе с ответом ИИ. Ручные изменения текста выше автоматически его не переводят.</p>
        <textarea aria-label="English prompt" rows={5} className={input} value={result.englishPrompt} onChange={e => setResult({ ...result, englishPrompt: e.target.value })} />
        <button type="button" disabled={busy || !result.englishPrompt.trim()} onClick={() => apply(result.englishPrompt)} className="text-sm underline mt-2">Вставить английский вариант</button>
      </details>
      {result.additions.length > 0 && <div><h4>Что ИИ добавил</h4><ul className="list-disc pl-5 text-sm">{result.additions.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}
      {result.questions.length > 0 && <div><h4>Что можно уточнить в пожеланиях</h4><ul className="list-disc pl-5 text-sm">{result.questions.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}
      <button type="button" disabled={busy} onClick={() => { onApply(source); setNotice('Исходный текст восстановлен.'); }} className="text-xs underline">Вернуть текст до дополнения</button>
    </div>}
    {notice && <p role="status" className="text-sm text-[#b7d69f]">{notice}</p>}
  </section>;
}
