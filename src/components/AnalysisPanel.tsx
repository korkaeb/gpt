import React from 'react';
import type { PromptResult } from '../lib/gemini';
export function AnalysisPanel({ result }: { result: PromptResult }) {
  const a = result.analysis;
  return <section className="bg-[#201e26] border border-[#3a3641] rounded-xl p-5 space-y-4">
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl text-[#d6a63f]">Разбор сцены</h2><span className="text-xs text-[#a49d90]">Получено от: {result.model}</span></div>
    <p>{a.summary}</p>
    <div className="grid md:grid-cols-2 gap-4">{[['Камера и ракурс', a.camera], ['Композиция', a.composition], ['Окружение', a.environment], ['Свет', a.lighting]].map(([title, text]) => <div key={title}><h3 className="text-[#c06e88]">{title}</h3><p className="text-sm">{text || 'Не определено'}</p></div>)}</div>
    {a.subjects.map((s, i) => <div key={`${s.id}-${i}`} className="border-t border-[#3a3641] pt-3"><h3 className="text-[#d6a63f]">Объект / персонаж {s.id}</h3><dl className="grid sm:grid-cols-2 gap-2 text-sm">{[['Внешность', s.appearance], ['Одежда', s.clothing], ['Поза и опора', s.pose], ['Руки', s.hands], ['Взгляд', s.gaze]].map(([k, v]) => <div key={k}><dt className="text-[#a49d90]">{k}</dt><dd>{v || 'Не определено'}</dd></div>)}</dl></div>)}
    {[['Взаимодействия и контакты', a.interactions], ['Неопределённые детали', a.uncertain], ['Пожелания и добавления', a.requestedChanges]].map(([label, items]) => <div key={String(label)}><h3 className="text-[#c06e88]">{String(label)}</h3>{(items as string[]).length ? <ul className="list-disc pl-5 text-sm">{(items as string[]).map((t, i) => <li key={i}>{t}</li>)}</ul> : <p className="text-sm text-[#a49d90]">Нет</p>}</div>)}
    <details><summary className="cursor-pointer text-[#d6a63f]">Подробный промпт · выделить и скопировать</summary><p className="select-all whitespace-pre-wrap mt-3 text-sm">{result.precisionPrompt}</p></details>
  </section>;
}
