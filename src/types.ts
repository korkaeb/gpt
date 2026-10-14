export type CategoryKey = 'quality' | 'count' | 'character' | 'series' | 'artist' | 'general';

export interface CategoryInfo {
  key: CategoryKey;
  number: number;
  nameRu: string;
  badgeColor: string; // Hex color code
  description: string;
  examples: string;
}

export interface PromptCategories {
  quality: string[];
  count: string[];
  character: string[];
  series: string[];
  artist: string[];
  general: string[];
}

export const CATEGORIES_CONFIG: CategoryInfo[] = [
  {
    key: 'quality',
    number: 1,
    nameRu: 'Качество / Мета / Безопасность',
    badgeColor: '#d6a63f',
    description: 'Оценки качества, разрешение, года и рейтинг безопасности',
    examples: 'masterpiece, best quality, score_7, score_8, safe, sensitive, highres, absurdres, newest, year 2024',
  },
  {
    key: 'count',
    number: 2,
    nameRu: 'Количество',
    badgeColor: '#7fa06a',
    description: 'Указатели количества персонажей и присутствия',
    examples: '1girl, 1boy, 2girls, solo, multiple girls, no humans, 3boys',
  },
  {
    key: 'character',
    number: 3,
    nameRu: 'Персонаж',
    badgeColor: '#c06e88',
    description: 'Имена конкретных персонажей',
    examples: 'hatsune miku, rem, asuka langley, raiden shogun, march 7th',
  },
  {
    key: 'series',
    number: 4,
    nameRu: 'Серия / Франшиза',
    badgeColor: '#4f9490',
    description: 'Названия аниме, игр, манги и франшиз',
    examples: 'vocaloid, re:zero, genshin impact, fate/stay night, touhou project',
  },
  {
    key: 'artist',
    number: 5,
    nameRu: 'Художник',
    badgeColor: '#8388c9',
    description: 'Теги художников и стилей',
    examples: 'artist:keisin, by artist_name, drawn by xyz',
  },
  {
    key: 'general',
    number: 6,
    nameRu: 'Общие теги',
    badgeColor: '#b7ab8e',
    description: 'Внутренняя сортировка Danbooru: 1.Ракурс → 2.Эмоции → 3.Прическа/Аксессуары → 4.Анатомия → 5.Одежда → 6.Поза → 7.Фон → 8.Цензура',
    examples: 'dutch angle, smile, blonde hair, purple eyes, dress, sitting, indoors, censored',
  },
];

export const RECOMMENDED_QUALITY_PREFIX = ['masterpiece', 'best quality'];
export const DEFAULT_NEGATIVE_PROMPT =
  'low quality, blurry, malformed hands, extra fingers, duplicate limbs';

export type OutputFormatMode = 'blocks' | 'single';

export function parseTagWeight(tag: string): { text: string; weight: number } {
  if (!tag) return { text: '', weight: 1.0 };
  const trimmed = tag.trim();

  // Pattern 1: (text:weight) or (text : weight)
  const matchParen = trimmed.match(/^\((.+?)\s*:\s*([0-9.]+)\)$/);
  if (matchParen) {
    const w = parseFloat(matchParen[2]);
    return { text: matchParen[1].trim(), weight: isNaN(w) ? 1.0 : w };
  }

  // Pattern 2: text:weight or text : weight
  const matchColon = trimmed.match(/^(.+?)\s*:\s*([0-9.]+)$/);
  if (matchColon) {
    const w = parseFloat(matchColon[2]);
    return { text: matchColon[1].trim(), weight: isNaN(w) ? 1.0 : w };
  }

  return { text: trimmed, weight: 1.0 };
}

export function formatTagWithWeight(text: string, weight: number): string {
  const cleanText = text.trim();
  const rounded = Math.round(weight * 10) / 10;
  if (rounded === 1 || rounded === 1.0) {
    return cleanText;
  }
  return `(${cleanText}:${rounded})`;
}

export const NSFW_KEYWORDS = [
  'explicit',
  'nsfw',
  'nude',
  'nudity',
  'sex',
  'hentai',
  'ecchi',
  'censored',
  'uncensored',
  'pussy',
  'penis',
  'breasts',
  'nipples',
  'bondage',
  'cum',
  'creampie',
  'fellatio',
  'anal',
  'vaginal',
  'questionable',
  'sexually explicit',
  'erotic',
];

