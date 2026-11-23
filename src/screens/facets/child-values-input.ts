/**
 * Pure draft/input helpers for the inline child editor (`child-values.tsx`): facet values of a
 * facet, options of an option group. Kept free of React Native so the dev smoke can use them.
 */
import { customFieldsInput, customFieldValues, type CustomFieldDef } from '@/api/custom-fields';
import type { LanguageCode } from '@/gql/graphql';
import { activeTranslation, toCode } from '@/screens/products/helpers';

export interface ChildDraft {
  key: string;
  id?: string;
  translationId?: string;
  languageCode: string;
  name: string;
  code: string;
  cf: Record<string, unknown>;
  dirty: boolean;
  /** For new items: the code follows the name until edited. */
  codeTouched: boolean;
}

type ServerChild = {
  id: string;
  code: string;
  name: string;
  languageCode?: string | null;
  translations: { id: string; languageCode: string; name: string; customFields?: unknown }[];
  customFields?: unknown;
};

export function childDrafts(items: ServerChild[], defs: CustomFieldDef[]): ChildDraft[] {
  return items.map((item) => {
    const tr = activeTranslation(item);
    return {
      key: item.id,
      id: item.id,
      translationId: tr?.id,
      languageCode: tr?.languageCode ?? item.languageCode ?? 'en',
      name: tr?.name ?? item.name,
      code: item.code,
      cf: customFieldValues(defs, item.customFields, tr),
      dirty: false,
      codeTouched: true,
    };
  });
}

/**
 * Splits drafts into create and update inputs (only new or edited items). Each entry keeps its
 * draft `key` beside the `input` so the caller can mark drafts saved as each step succeeds.
 */
export function childValuesInput(drafts: ChildDraft[], defs: CustomFieldDef[], languageCode: string) {
  const toInput = (d: ChildDraft) => {
    const { customFields, translationCustomFields } = customFieldsInput(defs, d.cf);
    return {
      code: d.code.trim() || toCode(d.name),
      customFields,
      translations: [
        {
          ...(d.translationId ? { id: d.translationId } : {}),
          languageCode: (d.id ? d.languageCode : languageCode) as LanguageCode,
          name: d.name.trim(),
          customFields: translationCustomFields,
        },
      ],
    };
  };
  return {
    create: drafts.filter((d) => !d.id).map((d) => ({ key: d.key, input: toInput(d) })),
    update: drafts.filter((d) => d.id && d.dirty).map((d) => ({ key: d.key, input: { id: d.id!, ...toInput(d) } })),
    invalid: drafts.filter((d) => (d.dirty || !d.id) && !d.name.trim()),
  };
}

type ChildInput = ReturnType<typeof childValuesInput>['create'][number]['input'];

/**
 * The nested shape for creating children together with a new parent (`CreateGroupOptionInput`,
 * `CreateFacetValueWithFacetInput`): those inputs have no custom fields, so they are stripped
 * here and applied afterwards with `nestedCustomFieldUpdates`.
 */
export function nestedChildInput({ code, translations }: ChildInput) {
  return { code, translations: translations.map(({ languageCode, name }) => ({ languageCode, name })) };
}

type CreatedChild = { id: string; code: string; translations: { id: string; languageCode: string }[] };

/** Matches children returned by a create mutation to the drafts they came from (by code, in order). */
export function matchCreated(items: { key: string; input: ChildInput }[], created: CreatedChild[]) {
  const pool = [...created];
  const out: { key: string; input: ChildInput; saved: CreatedChild }[] = [];
  for (const item of items) {
    const i = pool.findIndex((c) => c.code === item.input.code);
    if (i < 0) continue;
    out.push({ ...item, saved: pool[i] });
    pool.splice(i, 1);
  }
  return out;
}

/** Update inputs carrying the custom fields that the nested create could not send. */
export function nestedCustomFieldUpdates(matched: ReturnType<typeof matchCreated>) {
  return matched
    .filter(({ input }) => input.customFields || input.translations.some((t) => t.customFields))
    .map(({ input, saved }) => ({
      id: saved.id,
      customFields: input.customFields,
      translations: input.translations.map((t) => ({
        ...t,
        id: saved.translations.find((x) => x.languageCode === t.languageCode)?.id,
      })),
    }));
}

/**
 * Marks drafts as saved: created ones get their server id (so a retry updates instead of
 * re-creating them), updated ones are no longer dirty.
 */
export function markSaved(drafts: ChildDraft[], created: { key: string; saved: CreatedChild }[], updatedKeys: string[] = []) {
  const byKey = new Map(created.map((c) => [c.key, c.saved]));
  return drafts.map((d) => {
    const saved = byKey.get(d.key);
    if (saved) {
      const tr = saved.translations.find((t) => t.languageCode === d.languageCode) ?? saved.translations[0];
      return { ...d, id: saved.id, translationId: tr?.id, languageCode: tr?.languageCode ?? d.languageCode, dirty: false, codeTouched: true };
    }
    return updatedKeys.includes(d.key) ? { ...d, dirty: false } : d;
  });
}

