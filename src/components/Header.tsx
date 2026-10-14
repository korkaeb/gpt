import React from 'react';
import { Sparkles, Layers, Cpu } from 'lucide-react';

interface HeaderProps {
  selectedModel?: string;
}

export const Header: React.FC<HeaderProps> = ({ selectedModel = 'gemini-flash-latest' }) => {
  return (
    <header className="mb-8 border-b border-[#3a3641] pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d6a63f]/40 bg-[#d6a63f]/10 text-[#d6a63f] text-xs font-mono font-medium tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#d6a63f]" />
          <span>Gemini · Anima Prompt Studio</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Currently active model badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#c06e88]/40 bg-[#c06e88]/10 text-[#c06e88] text-xs font-mono font-medium shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#c06e88]" />
            <span>Модель: {selectedModel}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#a49d90] bg-[#201e26] px-3 py-1.5 rounded-md border border-[#3a3641]">
            <Layers className="w-3.5 h-3.5 text-[#d6a63f]" />
            <span>6-Tier Tag Hierarchy</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#efe8da] flex items-center gap-3">
          Anima Prompt Sorter
          <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded border border-[#3a3641] bg-[#28252f] text-[#a49d90] uppercase tracking-wider">
            v3.1
          </span>
        </h1>
        <p className="text-[#a49d90] text-sm sm:text-base font-sans max-w-3xl leading-relaxed">
          Структурирование и упорядочивание тегов для Stable Diffusion чекпоинта <span className="text-[#efe8da] font-semibold">Anima</span> по строгой 6-уровневой иерархии с использованием алгоритмов Gemini AI.
        </p>
      </div>
    </header>
  );
};

