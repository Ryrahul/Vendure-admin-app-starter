/**
 * Renders an entity's custom fields from the server config, with an input for each type.
 * Works with any Vendure server: nothing here knows which fields exist.
 *
 *   const defs = useCustomFields('Product');
 *   <CustomFieldsSection defs={defs} values={cf} onChange={(name, v) => setCf({ ...cf, [name]: v })} />
 *
 * Load the values with `customFields @customFields(entity: "Product")` in the document, merge
 * them with `customFieldValues()` and send them back with `customFieldsInput()`.
 */
import { customFieldsFor, type CustomFieldDef } from '@/api/custom-fields';
import { openPicker, type PickerSource } from '@/api/picker';
import {
  assetPicker,
  collectionPicker,
  customerGroupPicker,
  customerPicker,
  facetValuePicker,
  productPicker,
  variantPicker,
} from '@/api/pickers/common';
import { usePermissions } from '@/api/permissions';
import { useServerConfig } from '@/api/session';
import { DateRow, LinkRow, NumberRow, SelectRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { Section } from '@/components/section';

/** Custom field definitions the connected server has for `entity` (empty when none). */
export function useCustomFields(entity: string): CustomFieldDef[] {
  return customFieldsFor(useServerConfig()?.customFields, entity);
}

const RELATION_SOURCES: Record<string, PickerSource> = {
  Asset: assetPicker,
  Product: productPicker,
  ProductVariant: variantPicker,
  Customer: customerPicker,
  CustomerGroup: customerGroupPicker,
  FacetValue: facetValuePicker,
  Collection: collectionPicker,
};

type Related = { id: string; [key: string]: unknown };

function relationLabel(v: Related | null | undefined): string {
  if (!v) return '';
  for (const key of ['name', 'title', 'code', 'emailAddress', 'sku', 'identifier', 'slug']) {
    if (typeof v[key] === 'string' && v[key]) return v[key] as string;
  }
  return `#${v.id}`;
}

export function CustomFieldsSection({
  defs,
  values,
  onChange,
  readOnly,
  title = 'Custom fields',
}: {
  defs: CustomFieldDef[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  readOnly?: boolean;
  title?: string;
}) {
  const { can } = usePermissions();
  if (!defs.length) return null;

  // Group by `ui.tab` like the web dashboard; untabbed fields first.
  const groups = new Map<string, CustomFieldDef[]>();
  for (const def of defs) {
    const key = def.tab ?? '';
    groups.set(key, [...(groups.get(key) ?? []), def]);
  }

  return (
    <>
      {[...groups].map(([tab, fields]) => (
        <Section key={tab || '_'} title={tab ? `${title} · ${tab}` : title}>
          {fields.map((def) => (
            <CustomFieldInput
              key={def.name}
              def={def}
              value={values[def.name]}
              readOnly={readOnly || def.readonly || (def.requiresPermission.length > 0 && !can(...def.requiresPermission))}
              onChange={(v) => onChange(def.name, v)}
            />
          ))}
        </Section>
      ))}
    </>
  );
}

function CustomFieldInput({
  def,
  value,
  onChange,
  readOnly,
}: {
  def: CustomFieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  readOnly: boolean;
}) {
  const { label, description: hint } = def;

  if (def.type === 'relation') {
    const source = def.entity ? RELATION_SOURCES[def.entity] : undefined;
    const items = (def.list ? ((value as Related[] | null) ?? []) : value ? [value as Related] : []) as Related[];
    const text = items.map(relationLabel).join(', ');
    if (readOnly || !source) return <ValueRow label={label} value={text} />;
    return (
      <LinkRow
        label={label}
        hint={hint}
        value={text}
        onPress={async () => {
          const picked = await openPicker({
            title: label,
            source,
            multiple: def.list,
            selected: items.map((i) => i.id),
          });
          if (!picked) return;
          const mapped = picked.map((p) => ({ id: p.id, name: p.title }));
          onChange(def.list ? mapped : (mapped[0] ?? null));
        }}
      />
    );
  }

  if (def.type === 'struct') {
    return <ValueRow label={label} value={value == null ? '' : JSON.stringify(value)} />;
  }

  if (def.list) {
    // Scalar lists are edited one value per line.
    const list = (value as unknown[] | null) ?? [];
    const numeric = def.type === 'int' || def.type === 'float';
    return (
      <TextRow
        label={label}
        hint={hint ?? 'One value per line'}
        readOnly={readOnly}
        multiline
        value={list.map((v) => String(v ?? '')).join('\n')}
        onChangeText={(t) => {
          const parts = t.split('\n');
          onChange(numeric ? parts.filter((p) => p.trim() !== '').map(Number).filter((n) => !Number.isNaN(n)) : parts);
        }}
      />
    );
  }

  switch (def.type) {
    case 'boolean':
      return <SwitchRow label={label} hint={hint} value={!!value} disabled={readOnly} onValueChange={onChange} />;
    case 'int':
    case 'float':
      return (
        <NumberRow
          label={label}
          hint={hint}
          readOnly={readOnly}
          integer={def.type === 'int'}
          value={value as number | null}
          onChange={onChange}
        />
      );
    case 'datetime':
      return (
        <DateRow
          label={label}
          hint={hint}
          readOnly={readOnly}
          clearable={def.nullable}
          value={value as string | null}
          onChange={onChange}
        />
      );
    case 'string':
      if (def.options?.length) {
        return (
          <SelectRow
            label={label}
            hint={hint}
            disabled={readOnly}
            allowEmpty={def.nullable}
            value={(value as string | null) ?? null}
            options={def.options}
            onChange={onChange}
          />
        );
      }
      return <TextRow label={label} hint={hint} readOnly={readOnly} value={(value as string) ?? ''} onChangeText={onChange} />;
    case 'localeString':
      return <TextRow label={label} hint={hint} readOnly={readOnly} value={(value as string) ?? ''} onChangeText={onChange} />;
    case 'text':
    case 'localeText':
      return (
        <TextRow label={label} hint={hint} readOnly={readOnly} multiline value={(value as string) ?? ''} onChangeText={onChange} />
      );
    default:
      return <ValueRow label={label} value={value == null ? '' : String(value)} />;
  }
}
