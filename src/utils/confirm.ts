import { Alert } from 'react-native';

/** Native confirmation dialog as a promise. Use for every destructive action. */
export function confirm({
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = false,
}: {
  title: string;
  message?: string;
  confirmLabel?: string;
  destructive?: boolean;
}): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

/** Shows an error from a failed mutation. */
export function alertError(error: unknown, title = 'Something went wrong') {
  Alert.alert(title, error instanceof Error ? error.message : String(error));
}
