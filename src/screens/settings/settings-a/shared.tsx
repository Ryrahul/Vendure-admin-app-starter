/** Small helpers shared by the Settings-A screens (sellers, channels, roles, admins, API keys…). */
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { openPicker, type PickerItem, type PickerSource } from '@/api/picker';
import { LinkRow } from '@/components/form/fields';
import { Button } from '@/components/button';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';

import { summarize } from './codes';

/** Dirty-tracking setter wrapper used by every form: `edit(setName)`. */
export function useDirty() {
  const [dirty, setDirty] = useState(false);
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };
  return { dirty, setDirty, edit };
}

export interface Picked {
  id: string;
  label: string;
}

/**
 * Multi-select row backed by `openPicker()`. The picker returns id-only placeholders for
 * preselected items it hasn't loaded, so known labels are kept and merged.
 */
export function MultiPickRow({
  label,
  title,
  value,
  onChange,
  source,
  options,
  disabled,
  hint,
  emptyLabel = 'None',
}: {
  label: string;
  title?: string;
  value: Picked[];
  onChange: (value: Picked[]) => void;
  source?: PickerSource;
  options?: PickerItem[];
  disabled?: boolean;
  hint?: string;
  emptyLabel?: string;
}) {
  return (
    <LinkRow
      label={label}
      hint={hint}
      disabled={disabled}
      value={value.length ? summarize(value.map((v) => v.label)) : emptyLabel}
      onPress={async () => {
        const picked = await openPicker({ title: title ?? label, source, options, multiple: true, selected: value.map((v) => v.id) });
        if (!picked) return;
        const known = new Map(value.map((v) => [v.id, v.label]));
        onChange(
          picked.map((p) => ({
            id: p.id,
            label: p.title !== p.id || !known.has(p.id) ? p.title : known.get(p.id)!,
          })),
        );
      }}
    />
  );
}

/** Single-select row backed by `openPicker()` for longer lists (zones, sellers). */
export function PickRow({
  label,
  value,
  onChange,
  source,
  options,
  disabled,
  hint,
  clearable,
}: {
  label: string;
  value: Picked | null;
  onChange: (value: Picked | null) => void;
  source?: PickerSource;
  options?: PickerItem[];
  disabled?: boolean;
  hint?: string;
  clearable?: boolean;
}) {
  return (
    <LinkRow
      label={label}
      hint={hint}
      disabled={disabled}
      value={value?.label}
      onPress={async () => {
        const none: PickerItem = { id: '__none__', title: 'None' };
        const picked = await openPicker({
          title: label,
          source,
          options: options && clearable ? [none, ...options] : options,
        });
        if (!picked?.[0]) return;
        onChange(picked[0].id === none.id ? null : { id: picked[0].id, label: picked[0].title });
      }}
    />
  );
}

/** Compact on/off pill (for the permission matrix, where four switches per row don't fit). */
export function TogglePill({
  label,
  value,
  onToggle,
  disabled,
  accessibilityLabel,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const { colors, radius, spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={onToggle}
      hitSlop={4}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing[1.5],
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: value ? colors.primary : colors.border,
        backgroundColor: value ? colors.primary : pressed ? colors.accent : colors.surfaceRaised,
        opacity: disabled && !value ? 0.6 : 1,
      })}>
      <Text variant="label" color={value ? 'primaryForeground' : 'mutedForeground'}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Shows a freshly generated secret once, with a copy button and a warning. The value lives
 * only in component state; it is never logged or persisted.
 */
export function SecretSection({ secret, onDone }: { secret: string; onDone: () => void }) {
  const { colors, radius, spacing } = useTheme();
  const [copied, setCopied] = useState(false);
  return (
    <Section title="API key" footer="Copy this key now. It is shown only once and cannot be retrieved again.">
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        <View
          style={{
            backgroundColor: colors.warningSubtle,
            borderColor: colors.warningBorder,
            borderWidth: 1,
            borderRadius: radius.md,
            padding: spacing[3],
          }}>
          <Text variant="caption" color="warningSubtleForeground">
            Store it somewhere safe. Anyone with this key can call the Admin API with its roles.
          </Text>
        </View>
        <Text variant="mono" selectable>
          {secret}
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <Button
            title={copied ? 'Copied' : 'Copy key'}
            style={{ flex: 1 }}
            onPress={async () => {
              await Clipboard.setStringAsync(secret);
              setCopied(true);
            }}
          />
          <Button title="Done" variant="secondary" style={{ flex: 1 }} onPress={onDone} />
        </View>
      </View>
    </Section>
  );
}
