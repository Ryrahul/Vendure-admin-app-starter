import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { useSession } from '@/api/session';
import { useTheme } from '@/theme';
import { assetUrl, type AssetPreset } from '@/utils/asset';

export interface ThumbnailProps {
  preview?: string | null;
  size?: number;
  preset?: AssetPreset;
}

/** Product/asset image from the Vendure AssetServer, with a neutral placeholder. */
export function Thumbnail({ preview, size = 48, preset = 'thumb' }: ThumbnailProps) {
  const { colors, radius } = useTheme();
  const { state } = useSession();
  const uri = assetUrl(preview, state.apiUrl, preset);
  const frame = {
    width: size,
    height: size,
    borderRadius: radius.lg,
    backgroundColor: colors.neutralSubtle,
    borderColor: colors.border,
  };
  if (!uri) {
    return (
      <View style={[styles.frame, frame]}>
        <Icon ios="photo" android="image" size={size * 0.4} />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={[styles.frame, frame]}
      contentFit="cover"
      transition={150}
      recyclingKey={uri}
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
});
