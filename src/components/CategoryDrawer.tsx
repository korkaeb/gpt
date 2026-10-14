import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryInfo, parseTagWeight, formatTagWithWeight } from '../types';
import { Plus, Minus, X, Copy, Check } from 'lucide-react';

interface TagChipProps {
  categoryKey: string;
  index: number;
  rawTag: string;
  badgeColor: string;
  onRemoveTag: (categoryKey: string, index: number) => void;
  onUpdateTagWeight?: (categoryKey: string, index: number, newWeight: number) => void;
}

const TagChip: React.FC<TagChipProps> = ({
  categoryKey,
  index,
  rawTag,
  badgeColor,
  onRemoveTag,
  onUpdateTagWeight,
}) => {
  const { text, weight } = parseTagWeight(rawTag);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState(weight.toString());

  useEffect(() => {
    setWeightInput(weight.toString());
  }, [weight]);

  const handleWeightStep = (delta: number) => {
    if (!onUpdateTagWeight) return;
    const nextW = Math.min(2.0, Math.max(0.1, Math.round((weight + delta) * 10) / 10));
    onUpdateTagWeight(categoryKey, index, nextW);
  };

  const handleInputSubmit = () => {
    setIsEditingWeight(false);
    if (!onUpdateTagWeight) return;
    const parsed = parseFloat(weightInput);
    if (isNaN(parsed)) {
      setWeightInput(weight.toString());
      return;
    }
    const clamped = Math.min(2.0, Math.max(0.1, Math.round(parsed * 10) / 10));
    onUpdateTagWeight(categoryKey, index, clamped);
  };

  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border shadow-sm group transition-all ${
        weight !== 1.0 ? 'border-[#d6a63f] bg-[#2d2936]' : 'border-[#3a3641] bg-[#28252f]'
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: badgeColor }}
      />

      <span className="select-all font-medium text-[#efe8da]">
        {weight !== 1.0 ? `(${text}:${weight})` : text}
      </span>

      {/* Interactive Weight Controls */}
      <div className="flex items-center gap-0.5 ml-1 bg-[#17161b] px-1 py-0.5 rounded border border-[#3a3641]">
        <button
          type="button"
          onClick={() => handleWeightStep(-0.1)}
          title="Уменьшить вес (-0.1)"
          className="p-0.5 text-[#a49d90] hover:text-[#efe8da] hover:bg-[#3a3641] rounded transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>

        {isEditingWeight ? (
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="2.0"
            autoFocus
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInputSubmit();
              if (e.key === 'Escape') setIsEditingWeight(false);
            }}
            className="w-10 bg-[#201e26] border border-[#d6a63f] text-[#d6a63f] font-mono text-[11px] font-bold text-center outline-none rounded p-0"
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditingWeight(true)}
            title="Двойной клик для ввода собственного веса (0.1 - 2.0)"
            className={`cursor-pointer px-1 text-[11px] font-mono font-bold transition-colors select-none rounded ${
              weight !== 1.0
                ? 'text-[#d6a63f] bg-[#d6a63f]/20'
                : 'text-[#a49d90]/70 hover:text-[#efe8da]'
            }`}
          >
            {weight.toFixed(1)}
          </span>
        )}

        <button
          type="button"
          onClick={() => handleWeightStep(0.1)}
          title="Увеличить вес (+0.1)"
          className="p-0.5 text-[#a49d90] hover:text-[#efe8da] hover:bg-[#3a3641] rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemoveTag(categoryKey, index)}
        title="Удалить тег"
        className="ml-0.5 text-[#a49d90] hover:text-[#c06e88] transition-colors p-0.5 rounded hover:bg-[#3a3641]"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.span>
  );
};

interface CategoryDrawerProps {
  info: CategoryInfo;
  tags: string[];
  onRemoveTag: (categoryKey: string, index: number) => void;
  onAddTag: (categoryKey: string, newTag: string) => void;
  onCopyCategory: (categoryKey: string) => void;
  onUpdateTagWeight?: (categoryKey: string, index: number, newWeight: number) => void;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  info,
  tags,
  onRemoveTag,
  onAddTag,
  onCopyCategory,
  onUpdateTagWeight,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    onAddTag(info.key, newTagInput.trim());
    setNewTagInput('');
    setIsAdding(false);
  };

  const handleCopy = () => {
    onCopyCategory(info.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="bg-[#201e26] border border-[#3a3641] rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:border-[#4f4958] flex flex-col"
      style={{
        borderTop: `3px solid ${info.badgeColor}`,
      }}
    >
      {/* Drawer Header */}
      <div className="p-4 bg-[#28252f]/60 border-b border-[#3a3641] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Number Badge */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-sm"
            style={{
              backgroundColor: `${info.badgeColor}20`,
              color: info.badgeColor,
              border: `1px solid ${info.badgeColor}50`,
            }}
          >
            {info.number}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-semibold text-[#efe8da] text-base leading-tight">
                {info.nameRu}
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-mono font-bold"
                style={{
                  backgroundColor: `${info.badgeColor}25`,
                  color: info.badgeColor,
                }}
              >
                {tags.length}
              </span>
            </div>
            <p className="text-xs text-[#a49d90] font-sans mt-0.5 leading-snug">
              {info.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleCopy}
            disabled={tags.length === 0}
            title="Скопировать теги категории"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#17161b] border border-[#3a3641] hover:bg-[#3a3641] text-[#a49d90] hover:text-[#efe8da] text-xs font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#7fa06a]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Скопировано' : 'Копировать'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            title="Добавить тег вручную"
            className="flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-mono transition-colors"
            style={{
              borderColor: `${info.badgeColor}60`,
              backgroundColor: isAdding ? info.badgeColor : `${info.badgeColor}15`,
              color: isAdding ? '#17161b' : info.badgeColor,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Добавить</span>
          </button>
        </div>
      </div>

      {/* Manual Add Tag Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubmit}
            className="bg-[#17161b] p-3 border-b border-[#3a3641] flex items-center gap-2 overflow-hidden"
          >
            <input
              type="text"
              autoFocus
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Введите новый тег (например: (blue eyes:1.2))..."
              className="flex-1 bg-[#201e26] border border-[#3a3641] focus:border-[#d6a63f] rounded px-3 py-1.5 text-xs font-mono text-[#efe8da] outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded text-xs font-mono font-medium text-[#17161b] transition-opacity hover:opacity-90"
              style={{ backgroundColor: info.badgeColor }}
            >
              ОК
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1.5 rounded text-[#a49d90] hover:text-[#efe8da] hover:bg-[#3a3641]"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Chips Area */}
      <div className="p-4 flex-1 min-h-[90px] flex flex-wrap content-start gap-2 bg-[#17161b]/40">
        <AnimatePresence>
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <TagChip
                key={`${tag}-${idx}`}
                categoryKey={info.key}
                index={idx}
                rawTag={tag}
                badgeColor={info.badgeColor}
                onRemoveTag={onRemoveTag}
                onUpdateTagWeight={onUpdateTagWeight}
              />
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center py-6 text-center text-[#a49d90]/60 font-mono text-xs border border-dashed border-[#3a3641] rounded-lg bg-[#201e26]/30">
              <span className="mb-1 italic">Нет тегов в категории</span>
              <span className="text-[11px] text-[#a49d90]/40">Например: {info.examples.split(',').slice(0, 3).join(', ')}</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
