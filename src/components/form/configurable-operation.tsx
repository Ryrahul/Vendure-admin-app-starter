/**
 * Editor for Vendure "configurable operations": promotion conditions and actions, collection
 * filters, shipping eligibility checkers and calculators, payment handlers, fulfillment handlers.
 *
 * The server describes each operation (`ConfigurableOperationDefinition`), and every argument
 * value is sent as a string: lists as JSON arrays, booleans as "true"/"false".
 * Inputs follow the argument's `ui.component`, the same hints the web dashboard uses.
 */
import { View } from 'react-native';

import { openPicker, type PickerSource } from '@/api/picker';
import { customerGroupPicker, facetValuePicker, productPicker, variantPicker } from '@/api/pickers/common';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { DateRow, LinkRow, MoneyRow, NumberRow, SelectRow, SwitchRow, TextRow } from '@/components/form/fields';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';
import { stripHtml } from '@/utils/format';

/** Same shape as the schema's `ConfigurableOperationInput`. */
export interface ConfigurableOperationInput {
  code: string;
  arguments: { name: string; value: string }[];
}

/** Selection for definitions; spread into your query: `…{ code description args { …ConfigArgDef } }`. */
export interface OperationDefinition {
  code: string;
  description: string;
  args: {
    name: string;
    type: string;
    list: boolean;
    required: boolean;
    defaultValue?: unknown;
    label?: string | null;
    description?: string | null;
    ui?: unknown;
  }[];
}

type ArgDef = OperationDefinition['args'][number];

/** Converts a stored operation (`{ code, args }`) into the input shape (`{ code, arguments }`). */
export function toOperationInput(op: { code: string; args: { name: string; value: string }[] }): ConfigurableOperationInput {
  return { code: op.code, arguments: op.args.map((a) => ({ name: a.name, value: a.value })) };
}

/** A fresh operation with each argument's default value. */
export function defaultOperation(def: OperationDefinition): ConfigurableOperationInput {
  return {
    code: def.code,
    arguments: def.args.map((a) => ({
      name: a.name,
      value:
        a.defaultValue == null
          ? a.list
            ? '[]'
            : a.type === 'boolean'
              ? 'false'
              : ''
          : typeof a.defaultValue === 'string'
            ? a.defaultValue
            : JSON.stringify(a.defaultValue),
    })),
  };
}

/** Missing required arguments, for validation before save. */
export function missingArgs(op: ConfigurableOperationInput, defs: OperationDefinition[]): string[] {
  const def = defs.find((d) => d.code === op.code);
  if (!def) return [];
  return def.args
    .filter((a) => a.required)
    .filter((a) => {
      const v = op.arguments.find((x) => x.name === a.name)?.value ?? '';
      return v === '' || v === '[]';
    })
    .map((a) => a.label ?? a.name);
}

const label = (arg: ArgDef) => arg.label || humanizeArg(arg.name);
const humanizeArg = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const ID_SOURCES: Record<string, { source: PickerSource; noun: string }> = {
  'facet-value-form-input': { source: facetValuePicker, noun: 'facet value' },
  'product-selector-form-input': { source: variantPicker, noun: 'variant' },
  'customer-group-form-input': { source: customerGroupPicker, noun: 'customer group' },
};

function parseList(value: string): string[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function ArgInput({ arg, value, onChange }: { arg: ArgDef; value: string; onChange: (v: string) => void }) {
  const { currencyCode, precision } = useChannelInfo();
  const ui = (arg.ui ?? {}) as {
    component?: string;
    options?: { value: string; label?: { languageCode: string; value: string }[] }[];
    selectionMode?: 'product' | 'variant';
    tab?: string;
  };
  const hint = arg.description ? stripHtml(arg.description) : undefined;
  const name = label(arg);

  const idSource =
    ui.component === 'product-multi-form-input'
      ? ui.selectionMode === 'product'
        ? { source: productPicker, noun: 'product' }
        : { source: variantPicker, noun: 'variant' }
      : ui.component
        ? ID_SOURCES[ui.component]
        : undefined;

  if (idSource || (arg.type === 'ID' && arg.list)) {
    const ids = arg.list ? parseList(value) : value ? [value] : [];
    const source = idSource?.source;
    return (
      <LinkRow
        label={name}
        hint={hint}
        value={ids.length ? `${ids.length} ${idSource?.noun ?? 'item'}${ids.length === 1 ? '' : 's'}` : undefined}
        disabled={!source}
        onPress={async () => {
          if (!source) return;
          const picked = await openPicker({ title: name, source, multiple: arg.list, selected: ids });
          if (!picked) return;
          onChange(arg.list ? JSON.stringify(picked.map((p) => p.id)) : (picked[0]?.id ?? ''));
        }}
      />
    );
  }

  if (ui.component === 'select-form-input' && ui.options?.length) {
    return (
      <SelectRow
        label={name}
        hint={hint}
        value={value || null}
        allowEmpty={!arg.required}
        options={ui.options.map((o) => ({ value: o.value, label: o.label?.[0]?.value ?? o.value }))}
        onChange={(v) => onChange(v ?? '')}
      />
    );
  }

  if (ui.component === 'combination-mode-form-input') {
    return (
      <SelectRow
        label={name}
        hint={hint}
        value={value || 'AND'}
        options={[
          { value: 'AND', label: 'All (AND)' },
          { value: 'OR', label: 'Any (OR)' },
        ]}
        onChange={(v) => onChange(v ?? 'AND')}
      />
    );
  }

  if (arg.list) {
    const list = parseList(value);
    return (
      <TextRow
        label={name}
        hint={hint ?? 'One value per line'}
        multiline
        value={list.join('\n')}
        onChangeText={(t) => onChange(JSON.stringify(t.split('\n').filter((l) => l.trim() !== '')))}
      />
    );
  }

  switch (arg.type) {
    case 'boolean':
      return <SwitchRow label={name} hint={hint} value={value === 'true'} onValueChange={(v) => onChange(String(v))} />;
    case 'int':
      if (ui.component === 'currency-form-input') {
        return (
          <MoneyRow
            label={name}
            hint={hint}
            currencyCode={currencyCode}
            precision={precision}
            value={value === '' ? null : Number(value)}
            onChange={(v) => onChange(String(v))}
          />
        );
      }
      return <NumberRow label={name} hint={hint} integer value={value === '' ? null : Number(value)} onChange={(v) => onChange(v == null ? '' : String(v))} />;
    case 'float':
      return <NumberRow label={name} hint={hint} value={value === '' ? null : Number(value)} onChange={(v) => onChange(v == null ? '' : String(v))} />;
    case 'datetime':
      return <DateRow label={name} hint={hint} value={value || null} onChange={(v) => onChange(v ?? '')} />;
    default:
      return (
        <TextRow
          label={name}
          hint={hint}
          value={value}
          onChangeText={onChange}
          secureTextEntry={ui.component === 'password-form-input'}
          multiline={ui.component === 'textarea-form-input' || ui.component === 'json-editor-form-input'}
          autoCapitalize="none"
        />
      );
  }
}

/** Argument rows for one operation (render inside a <Section>). */
export function OperationArgs({
  op,
  def,
  onChange,
}: {
  op: ConfigurableOperationInput;
  def: OperationDefinition;
  onChange: (op: ConfigurableOperationInput) => void;
}) {
  return def.args.map((arg) => (
    <ArgInput
      key={arg.name}
      arg={arg}
      value={op.arguments.find((a) => a.name === arg.name)?.value ?? ''}
      onChange={(v) => {
        const rest = op.arguments.filter((a) => a.name !== arg.name);
        onChange({ ...op, arguments: [...rest, { name: arg.name, value: v }] });
      }}
    />
  ));
}

/** Pick one operation (e.g. a shipping calculator) and edit its arguments. */
export function OperationEditor({
  title,
  definitions,
  value,
  onChange,
}: {
  title: string;
  definitions: OperationDefinition[];
  value: ConfigurableOperationInput | null | undefined;
  onChange: (op: ConfigurableOperationInput) => void;
}) {
  const def = definitions.find((d) => d.code === value?.code);
  return (
    <Section title={title}>
      <SelectRow
        label="Type"
        value={value?.code ?? null}
        options={definitions.map((d) => ({ value: d.code, label: stripHtml(d.description) || d.code }))}
        onChange={(code) => {
          const next = definitions.find((d) => d.code === code);
          if (next) onChange(defaultOperation(next));
        }}
      />
      {def && value ? <OperationArgs op={value} def={def} onChange={onChange} /> : null}
    </Section>
  );
}

/** A list of operations (promotion conditions/actions, collection filters). */
export function OperationListEditor({
  title,
  addLabel,
  definitions,
  value,
  onChange,
}: {
  title: string;
  addLabel: string;
  definitions: OperationDefinition[];
  value: ConfigurableOperationInput[];
  onChange: (ops: ConfigurableOperationInput[]) => void;
}) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing[3] }}>
      {value.length === 0 ? (
        <Text variant="caption" color="mutedForeground" style={{ paddingHorizontal: spacing[1] }}>
          {title}: none
        </Text>
      ) : null}
      {value.map((op, index) => {
        const def = definitions.find((d) => d.code === op.code);
        return (
          <Section
            key={`${op.code}-${index}`}
            title={def ? stripHtml(def.description) : op.code}
            action={
              <Button
                title="Remove"
                size="sm"
                variant="ghost"
                onPress={() => onChange(value.filter((_, i) => i !== index))}
              />
            }>
            {def ? (
              <OperationArgs op={op} def={def} onChange={(next) => onChange(value.map((o, i) => (i === index ? next : o)))} />
            ) : (
              <TextRow label="Code" value={op.code} readOnly />
            )}
          </Section>
        );
      })}
      <Button
        title={addLabel}
        variant="secondary"
        onPress={async () => {
          const picked = await openPicker({
            title: addLabel,
            options: definitions.map((d) => ({ id: d.code, title: stripHtml(d.description) || d.code, code: d.code })),
          });
          const def = picked?.[0] && definitions.find((d) => d.code === picked[0].id);
          if (def) onChange([...value, defaultOperation(def)]);
        }}
      />
    </View>
  );
}
