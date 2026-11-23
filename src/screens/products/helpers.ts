/** Small helpers shared by the catalog screens (translations, slugs, descriptions). */
import type { LanguageCode } from '@/gql/graphql';
import { stripHtml } from '@/utils/format';

type Translatable<T> = { languageCode?: string | null; translations: T[] };

/** The translation being edited: the entity's active language, else the first one. */
export function activeTranslation<T extends { languageCode: string }>(entity: Translatable<T> | null | undefined): T | undefined {
  if (!entity) return undefined;
  return entity.translations.find((t) => t.languageCode === entity.languageCode) ?? entity.translations[0];
}

/** The language to write: the edited translation's, else the entity's, else English. */
export function editLanguage(entity: Translatable<{ languageCode: string }> | null | undefined): LanguageCode {
  return (activeTranslation(entity)?.languageCode ?? entity?.languageCode ?? 'en') as LanguageCode;
}

/** Same rule as Vendure's slug normalizer, close enough for a default suggestion. */
export function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** A code from a name: lowercase, dashes. */
export const toCode = slugify;

/** Plain text shown in the multiline description editor. */
export const descriptionToText = (html: string | null | undefined) => stripHtml(html);

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Plain text back to simple HTML: blank lines → paragraphs, single newlines → <br>. */
export function textToHtml(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  return trimmed
    .split(/\n{2,}/)
    .map((p) => `<p>${escape(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** Moves an item one step left (-1) or right (+1). */
export function move<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const to = index + delta;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[index], next[to]] = [next[to], next[index]];
  return next;
}
