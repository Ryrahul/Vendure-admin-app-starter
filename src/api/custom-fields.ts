/**
 * Dynamic custom fields, the same idea as the web dashboard's `addCustomFields()`.
 *
 * Documents mark where custom fields go with the client-only `@customFields` directive:
 *
 *   product(id: $id) {
 *     customFields @customFields(entity: "Product")
 *     translations @customFields(entity: "Product", locale: true) { languageCode name }
 *   }
 *
 * Before a request is sent, `expandCustomFields()` rewrites those markers using the
 * server's `entityCustomFields` config: `customFields` gets a selection of every configured
 * field (or is removed when the entity has none), and `translations` gets a
 * `customFields { … }` selection of the localeString / localeText fields. When a server
 * adds a field, the app picks it up on the next login with no code change.
 */
import { Kind, parse, print, visit, type FieldNode, type SelectionNode } from 'graphql';

import type { ServerConfigQuery } from '@/gql/graphql';

type RawCustomField =
  ServerConfigQuery['globalSettings']['serverConfig']['entityCustomFields'][number]['customFields'][number];

type Localized = { languageCode: string; value: string }[] | null | undefined;

export type CustomFieldType =
  | 'string'
  | 'localeString'
  | 'text'
  | 'localeText'
  | 'int'
  | 'float'
  | 'boolean'
  | 'datetime'
  | 'relation'
  | 'struct';

export interface CustomFieldDef {
  name: string;
  type: CustomFieldType;
  list: boolean;
  readonly: boolean;
  nullable: boolean;
  label: string;
  description?: string;
  /** `ui.tab` from the field config — used to group fields. */
  tab?: string;
  requiresPermission: string[];
  options?: { value: string; label: string }[];
  pattern?: string | null;
  min?: number | string | null;
  max?: number | string | null;
  step?: number | null;
  /** Relation target entity and the scalar fields the server exposes for it. */
  entity?: string;
  scalarFields?: string[];
  structFields?: { name: string; type: string; list: boolean; label: string }[];
}

export type CustomFieldsMap = Map<string, CustomFieldDef[]>;

/** Vendure entity names whose custom fields are shared with another name. */
const ENTITY_ALIASES: Record<string, string> = { OrderAddress: 'Address', Country: 'Region', Region: 'Country' };

export function humanize(name: string) {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function pickLocalized(values: Localized, language = 'en'): string | undefined {
  if (!values?.length) return undefined;
  return (values.find((v) => v.languageCode === language) ?? values[0]).value;
}

function normalize(raw: RawCustomField, language: string): CustomFieldDef | null {
  if (!('name' in raw) || raw.internal) return null;
  const ui = (raw.ui ?? {}) as { tab?: string };
  const def: CustomFieldDef = {
    name: raw.name,
    type: raw.type as CustomFieldType,
    list: raw.list,
    readonly: !!raw.readonly,
    nullable: raw.nullable !== false,
    label: pickLocalized(raw.label, language) ?? humanize(raw.name),
    description: pickLocalized(raw.description, language),
    tab: typeof ui.tab === 'string' ? ui.tab : undefined,
    requiresPermission: (raw.requiresPermission ?? []) as string[],
  };
  if ('options' in raw && raw.options?.length) {
    def.options = raw.options.map((o) => ({ value: o.value, label: pickLocalized(o.label, language) ?? o.value }));
  }
  if ('pattern' in raw) def.pattern = raw.pattern;
  if ('intMin' in raw) Object.assign(def, { min: raw.intMin, max: raw.intMax, step: raw.intStep });
  if ('floatMin' in raw) Object.assign(def, { min: raw.floatMin, max: raw.floatMax, step: raw.floatStep });
  if ('datetimeMin' in raw) Object.assign(def, { min: raw.datetimeMin, max: raw.datetimeMax });
  if ('entity' in raw) Object.assign(def, { entity: raw.entity, scalarFields: raw.scalarFields });
  if ('fields' in raw) {
    def.structFields = raw.fields.map((f) => ({
      name: f.name,
      type: f.type,
      list: !!f.list,
      label: pickLocalized(f.label, language) ?? humanize(f.name),
    }));
  }
  return def;
}

export function buildCustomFieldsMap(
  entityCustomFields: ServerConfigQuery['globalSettings']['serverConfig']['entityCustomFields'],
  language = 'en',
): CustomFieldsMap {
  const map: CustomFieldsMap = new Map();
  for (const entry of entityCustomFields) {
    const defs = entry.customFields.map((f) => normalize(f, language)).filter((f): f is CustomFieldDef => !!f);
    if (defs.length) map.set(entry.entityName, defs);
  }
  return map;
}

export function customFieldsFor(map: CustomFieldsMap | undefined, entity: string): CustomFieldDef[] {
  if (!map) return [];
  return map.get(entity) ?? (ENTITY_ALIASES[entity] ? map.get(ENTITY_ALIASES[entity]) : undefined) ?? [];
}

export const isLocaleField = (def: CustomFieldDef) => def.type === 'localeString' || def.type === 'localeText';

const field = (name: string, selections?: SelectionNode[]): FieldNode => ({
  kind: Kind.FIELD,
  name: { kind: Kind.NAME, value: name },
  ...(selections ? { selectionSet: { kind: Kind.SELECTION_SET, selections } } : {}),
});

function selectionFor(def: CustomFieldDef): FieldNode {
  if (def.type === 'relation') {
    const scalars = def.scalarFields?.length ? def.scalarFields : ['id'];
    return field(def.name, scalars.map((s) => field(s)));
  }
  if (def.type === 'struct') return field(def.name, (def.structFields ?? []).map((f) => field(f.name)));
  return field(def.name);
}

const DIRECTIVE = 'customFields';
const cache = new WeakMap<CustomFieldsMap, Map<string, string>>();
const EMPTY: CustomFieldsMap = new Map();

/** Rewrites `@customFields` markers in a query string for the given server config. */
export function expandCustomFields(query: string, map: CustomFieldsMap | undefined): string {
  if (!query.includes(`@${DIRECTIVE}`)) return query;
  const key = map ?? EMPTY;
  let perMap = cache.get(key);
  if (!perMap) cache.set(key, (perMap = new Map()));
  const hit = perMap.get(query);
  if (hit) return hit;

  const ast = visit(parse(query), {
    Field(node) {
      const directive = node.directives?.find((d) => d.name.value === DIRECTIVE);
      if (!directive) return undefined;
      const arg = (name: string) => directive.arguments?.find((a) => a.name.value === name)?.value;
      const entityArg = arg('entity');
      const localeArg = arg('locale');
      const entity = entityArg?.kind === Kind.STRING ? entityArg.value : '';
      const locale = localeArg?.kind === Kind.BOOLEAN && localeArg.value;
      const defs = customFieldsFor(map, entity);
      const directives = node.directives?.filter((d) => d !== directive);

      if (locale) {
        const localeDefs = defs.filter(isLocaleField);
        if (!localeDefs.length || !node.selectionSet) return { ...node, directives };
        return {
          ...node,
          directives,
          selectionSet: {
            ...node.selectionSet,
            selections: [...node.selectionSet.selections, field('customFields', localeDefs.map(selectionFor))],
          },
        };
      }
      // No custom fields for this entity → drop the field (a bare object field is invalid).
      if (!defs.length) return null;
      return { ...node, directives, selectionSet: { kind: Kind.SELECTION_SET, selections: defs.map(selectionFor) } };
    },
  });
  const out = print(ast);
  perMap.set(query, out);
  return out;
}

/**
 * Splits form values into the `customFields` input (relation fields become `<name>Id(s)`)
 * and the per-translation `customFields` for locale fields. Readonly fields are skipped.
 */
export function customFieldsInput(defs: CustomFieldDef[], values: Record<string, unknown>) {
  const customFields: Record<string, unknown> = {};
  const translationCustomFields: Record<string, unknown> = {};
  for (const def of defs) {
    if (def.readonly || !(def.name in values)) continue;
    const value = values[def.name];
    if (isLocaleField(def)) translationCustomFields[def.name] = value;
    else if (def.type === 'relation') {
      if (def.list) {
        customFields[`${def.name}Ids`] = ((value as { id: string }[] | null) ?? []).map((v) => v.id);
      } else {
        customFields[`${def.name}Id`] = (value as { id: string } | null)?.id ?? null;
      }
    } else customFields[def.name] = value;
  }
  return {
    customFields: Object.keys(customFields).length ? customFields : undefined,
    translationCustomFields: Object.keys(translationCustomFields).length ? translationCustomFields : undefined,
  };
}

/** Merges entity-level and translation-level custom field values into one form state. */
export function customFieldValues(
  defs: CustomFieldDef[],
  customFields: unknown,
  translation?: { customFields?: unknown } | null,
): Record<string, unknown> {
  const base = (customFields ?? {}) as Record<string, unknown>;
  const tr = (translation?.customFields ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const def of defs) out[def.name] = isLocaleField(def) && def.name in tr ? tr[def.name] : base[def.name];
  return out;
}
