import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { useTheme } from '@/theme';

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search',
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const { colors, metrics, radius, spacing, text } = useTheme();
  const { fontWeight: _w, ...font } = text.body;
  return (
    <View
      style={[
        styles.wrap,
        {
          minHeight: metrics.inputHeight + 4,
          borderRadius: radius.lg,
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          paddingHorizontal: spacing[3],
          gap: spacing[2],
        },
      ]}>
      <Icon ios="magnifyingglass" android="search" size={16} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        selectionColor={colors.brand}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel={placeholder}
        style={[font, styles.input, { color: colors.foreground }]}
      />
      {/* iOS has its own clear button (clearButtonMode); Android needs one. */}
      {value && Platform.OS !== 'ios' ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={8} onPress={() => onChangeText('')}>
          <Icon ios="xmark.circle.fill" android="close" size={16} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, paddingVertical: 8 },
});
