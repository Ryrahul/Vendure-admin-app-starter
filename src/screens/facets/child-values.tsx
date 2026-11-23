/**
 * Inline editor for a parent's translatable child items: facet values of a facet, options of
 * an option group. Items are listed in one section; tapping one opens its fields (name, code,
 * custom fields) below the list. New and edited items are saved by the parent screen's Save
 * (`childValuesInput`); deleting an existing item runs immediately after a confirmation.
 */
import { useState } from 'react';
import { View } from 'react-native';

import { customFieldsInput, customFieldValues, type CustomFieldDef } from '@/api/custom-fields';
import { Button } from '@/components/button';
import { CustomFieldsSection } from '@/components/form/custom-fields-section';
import { TextRow } from '@/components/form/fields';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { LanguageCode } from '@/gql/graphql';
import { activeTranslation, toCode } from '@/screens/products/helpers';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';

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

let counter = 0;

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

/** Splits drafts into create and update inputs (only new or edited items). */
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
    create: drafts.filter((d) => !d.id).map(toInput),
    update: drafts.filter((d) => d.id && d.dirty).map((d) => ({ id: d.id!, ...toInput(d) })),
    invalid: drafts.filter((d) => (d.dirty || !d.id) && !d.name.trim()),
  };
}

export function ChildValuesEditor({
  title,
  noun,
  defs,
  value,
  onChange,
  readOnly,
  canDelete,
  onDelete,
}: {
  title: string;
  noun: string;
  defs: CustomFieldDef[];
  value: ChildDraft[];
  onChange: (value: ChildDraft[]) => void;
  readOnly?: boolean;
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
        action={readOnly ? undefined : <Button title={`Add ${noun}`} variant="ghost" size="sm" onPress={add} />}>
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
            {!readOnly && (canDelete || !current.id) ? (
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
