/**
 * Pick images from the photo library or camera and upload them as Vendure assets.
 *
 *   const { upload, uploading } = useAssetUpload();
 *   const assets = await upload();   // asks "Photo library / Camera", returns the new assets
 */
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

import { AssetListDocument } from '@/api/documents/assets';
import { useInvalidate } from '@/api/mutations';
import { useSession } from '@/api/session';
import { uploadAssets, type UploadedAsset, type UploadFile } from '@/api/upload';
import { alertError } from '@/utils/confirm';

export type UploadSource = 'library' | 'camera';

function chooseSource(): Promise<UploadSource | null> {
  return new Promise((resolve) => {
    Alert.alert(
      'Upload image',
      undefined,
      [
        { text: 'Photo library', onPress: () => resolve('library') },
        { text: 'Camera', onPress: () => resolve('camera') },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}

function extensionFor(mime: string | undefined) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/heic') return 'heic';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

export function useAssetUpload() {
  const { state } = useSession();
  const invalidate = useInvalidate();
  const [uploading, setUploading] = useState(false);

  const pick = async (source: UploadSource): Promise<ImagePicker.ImagePickerAsset[] | null> => {
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.9 };
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Camera access needed', 'Allow camera access in Settings to take photos for assets.');
        return null;
      }
      const res = await ImagePicker.launchCameraAsync(options);
      return res.canceled ? null : res.assets;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ ...options, allowsMultipleSelection: true, selectionLimit: 10 });
    return res.canceled ? null : res.assets;
  };

  /** Asks for the source (unless given), uploads, and returns the created assets ([] when cancelled). */
  const upload = async (source?: UploadSource): Promise<UploadedAsset[]> => {
    const from = source ?? (await chooseSource());
    if (!from) return [];
    try {
      const picked = await pick(from);
      if (!picked?.length) return [];
      const files: UploadFile[] = picked.map((a, i) => {
        const type = a.mimeType ?? 'image/jpeg';
        return { uri: a.uri, type, name: a.fileName ?? `photo-${Date.now()}-${i}.${extensionFor(type)}` };
      });
      setUploading(true);
      const created = await uploadAssets(state, files);
      await invalidate(AssetListDocument);
      return created;
    } catch (e) {
      alertError(e, 'Upload failed');
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
