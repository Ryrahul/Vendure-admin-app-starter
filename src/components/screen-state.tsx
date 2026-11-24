import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon, type IconProps } from '@/components/icon';
import { SkeletonForm, SkeletonList } from '@/components/skeleton';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';

/**
 * First-load state. Only shown when there is no cached data yet. Renders a skeleton shaped
 * like the content (a grouped list or a form) instead of a lone spinner.
 */
export function LoadingState({ label = 'Loading…', variant = 'list' }: { label?: string; variant?: 'list' | 'form' }) {
  return variant === 'form' ? <SkeletonForm label={label} /> : <SkeletonList label={label} />;
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { spacing } = useTheme();
  const message = error instanceof Error ? error.message : 'Something went wrong.';
  return (
    <View style={[styles.center, { gap: spacing[3], padding: spacing[8] }]}>
      <Icon ios="exclamationmark.triangle" android="warning" size={28} color="destructive" />
      <Text variant="subheading" align="center">
        Couldn’t load this
      </Text>
      <Text variant="body" color="mutedForeground" align="center">
        {message}
      </Text>
      {onRetry ? <Button title="Try again" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyState({
  title,
  message,
  icon = { ios: 'tray', android: 'inbox' },
  actionTitle,
  onAction,
}: {
  title: string;
  message?: string;
  icon?: Pick<IconProps, 'ios' | 'android'>;
  actionTitle?: string;
  onAction?: () => void;
}) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.center, { gap: spacing[2], padding: spacing[8] }]}>
      <Icon {...icon} size={28} />
      <Text variant="subheading" align="center">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="mutedForeground" align="center">
          {message}
        </Text>
      ) : null}
      {actionTitle && onAction ? <Button title={actionTitle} variant="secondary" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
});
