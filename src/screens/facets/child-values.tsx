/**
 * Inline editor for a parent's translatable child items: facet values of a facet, options of
 * an option group. Items are listed in one section; tapping one opens its fields (name, code,
 * custom fields) below the list. New and edited items are saved by the parent screen's Save
 * (`childValuesInput` in `child-values-input.ts`); deleting an existing item runs immediately
 * after a confirmation.
 */
import { useState } from 'react';
import { View } from 'react-native';

import { customFieldValues, type CustomFieldDef } from '@/api/custom-fields';
import { Button } from '@/components/button';
import { CustomFieldsSection } from '@/components/form/custom-fields-section';
import { TextRow } from '@/components/form/fields';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { toCode } from '@/screens/products/helpers';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';

import type { ChildDraft } from './child-values-input';

let counter = 0;

export function ChildValuesEditor({
  title,
  noun,
  defs,
  value,
  onChange,
  readOnly,
  canCreate = true,
  canDelete,
  onDelete,
}: {
  title: string;
  noun: string;
  defs: CustomFieldDef[];
  value: ChildDraft[];
  onChange: (value: ChildDraft[]) => void;
  /** Edits to name, code and custom fields (and discarding unsaved items). */
  readOnly?: boolean;
  /** Shows "Add" (also needs `readOnly` off, since new items are saved by the parent's Save). */
  canCreate?: boolean;
  /** Shows "Delete" on saved items; independent of `readOnly`. */
  canDelete?: boolean;
  /** Deletes a saved item on the server; throw to keep it. */
  onDelete: (id: string) => Promise<void>;
}) {
  const { spacing } = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const current = value.find((d) => d.key === expanded);

  const patch = (key: string, p: Partial<ChildDraft>) =>
    onChange(value.map((d) => (d.key === key ? { ...d, ...p, dirty: true } : d)));

  const add = () => {
    const key = `new-${++counter}`;
    onChange([...value, { key, languageCode: 'en', name: '', code: '', cf: customFieldValues(defs, {}), dirty: true, codeTouched: false }]);
    setExpanded(key);
  };

  const removeCurrent = async () => {
    if (!current) return;
    if (!current.id) {
      onChange(value.filter((d) => d.key !== current.key));
      setExpanded(null);
      return;
    }
    const ok = await confirm({
      title: `Delete ${noun}?`,
      message: `“${current.name}” will be deleted.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await onDelete(current.id);
      onChange(value.filter((d) => d.key !== current.key));
      setExpanded(null);
    } catch (e) {
      alertError(e, `Could not delete ${noun}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Section
        title={`${title} (${value.length})`}
        action={readOnly || !canCreate ? undefined : <Button title={`Add ${noun}`} variant="ghost" size="sm" onPress={add} />}>
        {value.length ? (
          value.map((d) => (
            <ListRow
              key={d.key}
              title={d.name || `New ${noun}`}
              code={d.code || undefined}
              chevron
              trailing={
                !d.id ? (
                  <StatusBadge label="New" tone="info" />
                ) : d.dirty ? (
                  <StatusBadge label="Edited" tone="neutral" />
                ) : undefined
              }
              onPress={() => setExpanded(expanded === d.key ? null : d.key)}
            />
          ))
        ) : (
          <ListRow title={`No ${title.toLowerCase()} yet`} />
        )}
      </Section>
      {current ? (
        <>
          <Section
            title={current.id ? `Edit ${noun}` : `New ${noun}`}
            action={<Button title="Done" variant="ghost" size="sm" onPress={() => setExpanded(null)} />}>
            <TextRow
              label="Name"
              value={current.name}
              readOnly={readOnly}
              autoFocus={!current.id}
              onChangeText={(name) => patch(current.key, { name, ...(current.codeTouched ? {} : { code: toCode(name) }) })}
            />
            <TextRow
              label="Code"
              value={current.code}
              mono
              autoCapitalize="none"
              autoCorrect={false}
              readOnly={readOnly}
              onChangeText={(code) => patch(current.key, { code, codeTouched: true })}
            />
            {(current.id ? canDelete : !readOnly) ? (
              <View style={{ padding: spacing[3] }}>
                <Button
                  title={current.id ? `Delete ${noun}` : `Discard ${noun}`}
                  variant="destructive"
                  size="sm"
                  loading={deleting}
                  onPress={() => void removeCurrent()}
                />
              </View>
            ) : null}
          </Section>
          <CustomFieldsSection
            title={`${noun.charAt(0).toUpperCase()}${noun.slice(1)} custom fields`}
            defs={defs}
            values={current.cf}
            readOnly={readOnly}
            onChange={(k, v) => patch(current.key, { cf: { ...current.cf, [k]: v } })}
          />
        </>
      ) : null}
    </>
  );
}
