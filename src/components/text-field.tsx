import type { ComponentRef, Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/theme';

export interface TextFieldProps extends TextInputProps {
  label: string;
  ref?: Ref<ComponentRef<typeof TextInput>>;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, style, ref, ...rest }: TextFieldProps) {
  const { colors, metrics, radius, spacing, text } = useTheme();
  const { fontWeight: _w, ...bodyFont } = text.body;
  return (
    <View style={{ gap: spacing[1.5] }}>
      <Text variant="label">{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor={colors.mutedForeground}
        selectionColor={colors.brand}
        accessibilityLabel={label}
        {...rest}
        style={[
          bodyFont,
          styles.input,
          {
            minHeight: metrics.inputHeight + 8,
            paddingHorizontal: metrics.inputPaddingX + 2,
            borderRadius: radius.md,
            borderColor: error ? colors.destructive : colors.controlBorder,
            backgroundColor: colors.surfaceRaised,
            color: colors.foreground,
          },
          style,
        ]}
      />
      {error ? (
        <Text variant="caption" color="destructive">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="mutedForeground">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1 },
});
