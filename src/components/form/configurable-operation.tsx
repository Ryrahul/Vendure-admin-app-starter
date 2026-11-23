/**
 * Editor for Vendure "configurable operations": promotion conditions and actions, collection
 * filters, shipping eligibility checkers and calculators, payment handlers, fulfillment handlers.
 *
 * The server describes each operation (`ConfigurableOperationDefinition`), and every argument
 * value is sent as a string: lists as JSON arrays, booleans as "true"/"false".
 * Inputs follow the argument's `ui.component`, the same hints the web dashboard uses.
 */
import { View } from 'react-native';

import {
  defaultOperation,
  type ArgDef,
  type ConfigurableOperationInput,
  type OperationDefinition,
} from '@/api/operations';
import { openPicker, type PickerSource } from '@/api/picker';
import { customerGroupPicker, facetValuePicker, productPicker, variantPicker } from '@/api/pickers/common';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { DateRow, LinkRow, MoneyRow, NumberRow, SelectRow, SwitchRow, TextRow } from '@/components/form/fields';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';
import { stripHtml } from '@/utils/format';

export {
  defaultOperation,
  missingArgs,
  toOperationInput,
  type ConfigurableOperationInput,
  type OperationDefinition,
} from '@/api/operations';

const label = (arg: ArgDef) => arg.label || humanizeArg(arg.name);
const humanizeArg = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const ID_SOURCES: Record<string, { source: PickerSource; noun: string }> = {
  'facet-value-form-input': { source: facetValuePicker, noun: 'facet value' },
  'product-selector-form-input': { source: variantPicker, noun: 'variant' },
  'customer-group-form-input': {
    source: customerGroupPicker,
    noun: 'customer group',
  },
};

function parseList(value: string): string[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function ArgInput({
  arg,
  value,
  onChange: change,
  readOnly,
}: {
  arg: ArgDef;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const onChange = (v: string) => {
    if (!readOnly) change(v);
  };
  const { currencyCode, precision } = useChannelInfo();
  const ui = (arg.ui ?? {}) as {
    component?: string;
    options?: {
      value: string;
      label?: { languageCode: string; value: string }[];
    }[];
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
        disabled={!source || readOnly}
        onPress={async () => {
          if (!source) return;
          const picked = await openPicker({
            title: name,
            source,
            multiple: arg.list,
            selected: ids,
          });
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
        disabled={readOnly}
        hint={hint}
        value={value || null}
        allowEmpty={!arg.required}
        options={ui.options.map((o) => ({
          value: o.value,
          label: o.label?.[0]?.value ?? o.value,
        }))}
        onChange={(v) => onChange(v ?? '')}
      />
    );
  }

  if (ui.component === 'combination-mode-form-input') {
    // A boolean argument: true = all filters must match (AND), false = any (OR).
    return (
      <SelectRow
        label={name}
        hint={hint}
        disabled={readOnly}
        value={value === 'false' ? 'false' : 'true'}
        options={[
          { value: 'true', label: 'All (AND)' },
          { value: 'false', label: 'Any (OR)' },
        ]}
        onChange={(v) => onChange(v ?? 'true')}
      />
    );
  }

  if (arg.list) {
    const list = parseList(value);
    return (
      <TextRow
        label={name}
        readOnly={readOnly}
        hint={hint ?? 'One value per line'}
        multiline
        value={list.join('\n')}
        onChangeText={(t) => onChange(JSON.stringify(t.split('\n').filter((l) => l.trim() !== '')))}
      />
    );
  }

  switch (arg.type) {
    case 'boolean':
      return (
        <SwitchRow
          label={name}
          hint={hint}
          disabled={readOnly}
          value={value === 'true'}
          onValueChange={(v) => onChange(String(v))}
        />
      );
    case 'int':
      if (ui.component === 'currency-form-input') {
        return (
          <MoneyRow
            label={name}
            readOnly={readOnly}
            hint={hint}
            currencyCode={currencyCode}
            precision={precision}
            value={value === '' ? null : Number(value)}
            onChange={(v) => onChange(String(v))}
          />
        );
      }
      return (
        <NumberRow
          label={name}
          hint={hint}
          readOnly={readOnly}
          integer
          value={value === '' ? null : Number(value)}
          onChange={(v) => onChange(v == null ? '' : String(v))}
        />
      );
    case 'float':
      return (
        <NumberRow
          label={name}
          hint={hint}
          readOnly={readOnly}
          value={value === '' ? null : Number(value)}
          onChange={(v) => onChange(v == null ? '' : String(v))}
        />
      );
    case 'datetime':
      return (
        <DateRow
          label={name}
          hint={hint}
          readOnly={readOnly}
          value={value || null}
          onChange={(v) => onChange(v ?? '')}
        />
      );
    default:
      return (
        <TextRow
          label={name}
          readOnly={readOnly}
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
  readOnly,
}: {
  op: ConfigurableOperationInput;
  def: OperationDefinition;
  onChange: (op: ConfigurableOperationInput) => void;
  readOnly?: boolean;
}) {
  return def.args.map((arg) => (
    <ArgInput
      key={arg.name}
      arg={arg}
      readOnly={readOnly}
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
  readOnly,
}: {
  title: string;
  definitions: OperationDefinition[];
  value: ConfigurableOperationInput | null | undefined;
  onChange: (op: ConfigurableOperationInput) => void;
  readOnly?: boolean;
}) {
  const def = definitions.find((d) => d.code === value?.code);
  return (
    <Section title={title}>
      <SelectRow
        label="Type"
        disabled={readOnly}
        value={value?.code ?? null}
        options={definitions.map((d) => ({
          value: d.code,
          label: stripHtml(d.description) || d.code,
        }))}
        onChange={(code) => {
          const next = definitions.find((d) => d.code === code);
          if (next) onChange(defaultOperation(next));
        }}
      />
      {def && value ? <OperationArgs op={value} def={def} onChange={onChange} readOnly={readOnly} /> : null}
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
  readOnly,
}: {
  title: string;
  addLabel: string;
  definitions: OperationDefinition[];
  value: ConfigurableOperationInput[];
  onChange: (ops: ConfigurableOperationInput[]) => void;
  readOnly?: boolean;
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
              readOnly ? undefined : (
                <Button
                  title="Remove"
                  size="sm"
                  variant="ghost"
                  onPress={() => onChange(value.filter((_, i) => i !== index))}
                />
              )
            }>
            {def ? (
              <OperationArgs
                op={op}
                def={def}
                readOnly={readOnly}
                onChange={(next) => onChange(value.map((o, i) => (i === index ? next : o)))}
              />
            ) : (
              <TextRow label="Code" value={op.code} readOnly />
            )}
          </Section>
        );
      })}
      {readOnly ? null : (
        <Button
          title={addLabel}
          variant="secondary"
          onPress={async () => {
            const picked = await openPicker({
              title: addLabel,
              options: definitions.map((d) => ({
                id: d.code,
                title: stripHtml(d.description) || d.code,
                code: d.code,
              })),
            });
            const def = picked?.[0] && definitions.find((d) => d.code === picked[0].id);
            if (def) onChange([...value, defaultOperation(def)]);
          }}
        />
      )}
    </View>
  );
}
