import { View } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/theme';

/** Non-blocking error shown above stale content (refetch failed, mutation failed). */
export function InlineError({ message }: { message: string }) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View
      accessibilityRole="alert"
      style={{
        backgroundColor: colors.destructiveSubtle,
        borderColor: colors.destructiveBorder,
        borderWidth: 1,
        borderRadius: radius.lg,
        padding: spacing[3],
      }}>
      <Text variant="caption" color="destructiveSubtleForeground">
        {message}
      </Text>
    </View>
  );
}
