/**
 * Form rows for edit screens. Each row is meant to sit inside a <Section>, so a form reads
 * as grouped native settings rows rather than a stack of boxed inputs.
 *
 *   <Section title="General">
 *     <TextRow label="Name" value={name} onChangeText={setName} />
 *     <SwitchRow label="Enabled" value={enabled} onValueChange={setEnabled} />
 *     <SelectRow label="Tax category" value={taxId} options={…} onChange={setTaxId} />
 *   </Section>
 */
import { Host, Picker, Switch } from '@expo/ui';
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';
import { formatDate } from '@/utils/format';

interface ShellProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  /** Put the control to the right of the label (switches, short values). */
  inline?: boolean;
  trailing?: ReactNode;
}

export function FieldShell({ label, hint, error, children, inline, trailing }: ShellProps) {
  const { spacing } = useTheme();
  const meta =
    error || hint ? (
      <Text variant="caption" color={error ? 'destructive' : 'mutedForeground'}>
        {error ?? hint}
      </Text>
    ) : null;
  if (inline) {
    return (
      <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[1] }}>
        <View style={styles.inline}>
          <Text variant="bodyMedium" style={{ flex: 1 }}>
            {label}
          </Text>
          {children}
        </View>
        {meta}
      </View>
    );
  }
  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[1] }}>
      <View style={styles.inline}>
        <Text variant="caption" color="mutedForeground" style={{ flex: 1 }}>
          {label}
        </Text>
        {trailing}
      </View>
      {children}
      {meta}
    </View>
  );
}

export interface TextRowProps extends Omit<TextInputProps, 'style'> {
  label: string;
  hint?: string;
  error?: string;
  readOnly?: boolean;
  mono?: boolean;
}

export function TextRow({ label, hint, error, readOnly, mono, multiline, ...rest }: TextRowProps) {
  const { colors, text } = useTheme();
  const { fontWeight: _w, ...font } = mono ? text.mono : text.body;
  return (
    <FieldShell label={label} hint={hint} error={error}>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        selectionColor={colors.brand}
        accessibilityLabel={label}
        editable={!readOnly}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...rest}
        style={[
          font,
          styles.input,
          { color: readOnly ? colors.mutedForeground : colors.foreground },
          multiline && { minHeight: 88 },
        ]}
      />
    </FieldShell>
  );
}

/** Numeric input. `value` is a number (or null); the text is parsed on change. */
export function NumberRow({
  label,
  value,
  onChange,
  integer,
  hint,
  error,
  readOnly,
  suffix,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  integer?: boolean;
  hint?: string;
  error?: string;
  readOnly?: boolean;
  suffix?: string;
}) {
  const [draft, setDraft] = useState(value == null ? '' : String(value));
  // Keep the draft when it parses to the same number (so "1." stays while typing).
  const parsedDraft = draft.trim() === '' ? null : Number(draft.replace(',', '.'));
  const text = parsedDraft === (value ?? null) ? draft : value == null ? '' : String(value);
  return (
    <TextRow
      label={suffix ? `${label} (${suffix})` : label}
      hint={hint}
      error={error}
      readOnly={readOnly}
      value={text}
      keyboardType={integer ? 'number-pad' : 'decimal-pad'}
      onChangeText={(t) => {
        const cleaned = integer ? t.replace(/[^0-9-]/g, '') : t.replace(/[^0-9.,-]/g, '');
        setDraft(cleaned);
        if (cleaned.trim() === '' || cleaned === '-') return onChange(null);
        const n = Number(cleaned.replace(',', '.'));
        if (!Number.isNaN(n)) onChange(integer ? Math.trunc(n) : n);
      }}
    />
  );
}

/** Money in minor units (Vendure's `Money` scalar), edited in major units. */
export function MoneyRow({
  label,
  value,
  onChange,
  currencyCode,
  precision = 2,
  hint,
  readOnly,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (minorUnits: number) => void;
  currencyCode: string;
  precision?: number;
  hint?: string;
  readOnly?: boolean;
}) {
  const factor = 10 ** precision;
  return (
    <NumberRow
      label={label}
      suffix={currencyCode}
      hint={hint}
      readOnly={readOnly}
      value={value == null ? null : value / factor}
      onChange={(major) => onChange(Math.round((major ?? 0) * factor))}
    />
  );
}

export function SwitchRow({
  label,
  value,
  onValueChange,
  hint,
  disabled,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <FieldShell label={label} hint={hint} inline>
      <Host matchContents>
        <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
      </Host>
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

const NONE = '__none__';

/** Native menu picker for short option lists. For long or searchable lists use <LinkRow> + openPicker(). */
export function SelectRow({
  label,
  value,
  options,
  onChange,
  hint,
  disabled,
  allowEmpty,
  emptyLabel = 'None',
}: {
  label: string;
  value: string | null | undefined;
  options: SelectOption[];
  onChange: (value: string | null) => void;
  hint?: string;
  disabled?: boolean;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const items = allowEmpty || value == null ? [{ value: NONE, label: emptyLabel }, ...options] : options;
  return (
    <FieldShell label={label} hint={hint} inline>
      <Host matchContents>
        <Picker
          selectedValue={value ?? NONE}
          enabled={!disabled}
          accessibilityLabel={label}
          onValueChange={(v) => onChange(v === NONE ? null : String(v))}>
          {items.map((o) => (
            <Picker.Item key={o.value} label={o.label} value={o.value} />
          ))}
        </Picker>
      </Host>
    </FieldShell>
  );
}

/** ISO date-time value. Android shows the date dialog, then the time dialog. */
export function DateRow({
  label,
  value,
  onChange,
  hint,
  readOnly,
  mode = 'datetime',
  clearable = true,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (iso: string | null) => void;
  hint?: string;
  readOnly?: boolean;
  mode?: 'date' | 'datetime';
  clearable?: boolean;
}) {
  const { spacing } = useTheme();
  const [step, setStep] = useState<'idle' | 'date' | 'time'>('idle');
  const date = value ? new Date(value) : new Date();

  if (Platform.OS === 'ios') {
    return (
      <FieldShell label={label} hint={hint} inline>
        <View style={[styles.inline, { gap: spacing[2] }]}>
          {value || !clearable ? (
            <DateTimePicker
              value={date}
              mode={mode}
              display="compact"
              onValueChange={(_, d) => !readOnly && onChange(d.toISOString())}
            />
          ) : (
            <Pressable accessibilityRole="button" onPress={() => !readOnly && onChange(new Date().toISOString())}>
              <Text variant="bodyMedium" color="mutedForeground">
                Not set
              </Text>
            </Pressable>
          )}
          {value && clearable && !readOnly ? <ClearButton onPress={() => onChange(null)} /> : null}
        </View>
      </FieldShell>
    );
  }

  return (
    <FieldShell label={label} hint={hint} inline>
      <View style={[styles.inline, { gap: spacing[2] }]}>
        <Pressable accessibilityRole="button" disabled={readOnly} onPress={() => setStep('date')}>
          <Text variant="bodyMedium" color={value ? 'foreground' : 'mutedForeground'}>
            {value ? formatDate(value) : 'Not set'}
          </Text>
        </Pressable>
        {value && clearable && !readOnly ? <ClearButton onPress={() => onChange(null)} /> : null}
      </View>
      {step !== 'idle' ? (
        <DateTimePicker
          value={date}
          mode={step}
          onChange={(event, d) => {
            if (event.type !== 'set' || !d) return setStep('idle');
            onChange(d.toISOString());
            setStep(step === 'date' && mode === 'datetime' ? 'time' : 'idle');
          }}
          onDismiss={() => setStep('idle')}
        />
      ) : null}
    </FieldShell>
  );
}

function ClearButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Clear" hitSlop={8} onPress={onPress}>
      <Icon ios="xmark.circle.fill" android="cancel" size={18} />
    </Pressable>
  );
}

/** Read-only label/value row. */
export function ValueRow({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <FieldShell label={label} inline>
      <Text variant={mono ? 'mono' : 'body'} color="mutedForeground" numberOfLines={2} style={styles.value}>
        {value || '—'}
      </Text>
    </FieldShell>
  );
}

/** A row that opens something (a picker, a sub-screen) and shows the current value. */
export function LinkRow({
  label,
  value,
  onPress,
  disabled,
  hint,
}: {
  label: string;
  value?: string | null;
  onPress: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  const { colors, spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: colors.accent }}
      style={({ pressed }) => [pressed && { backgroundColor: colors.accent }]}>
      <FieldShell label={label} hint={hint} inline>
        <View style={[styles.inline, { gap: spacing[2], maxWidth: '60%' }]}>
          <Text variant="body" color="mutedForeground" numberOfLines={2} style={styles.value}>
            {value || 'None'}
          </Text>
          {!disabled ? <Icon ios="chevron.right" android="chevron_right" size={16} /> : null}
        </View>
      </FieldShell>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  input: { paddingVertical: 4, paddingHorizontal: 0 },
  value: { textAlign: 'right', flexShrink: 1 },
});
