import { serverOrigin } from '@/api/client';

/** AssetServerPlugin presets: tiny 50, thumb 150, small 300, medium 500, large 800. */
export type AssetPreset = 'tiny' | 'thumb' | 'small' | 'medium' | 'large';

/**
 * Builds an image URL from `asset.preview`. Previews may be relative when the server has
 * no `assetUrlPrefix`, so they are resolved against the API origin.
 */
export function assetUrl(preview: string | null | undefined, apiUrl: string, preset: AssetPreset = 'thumb') {
  if (!preview) return undefined;
  const absolute = /^https?:\/\//i.test(preview)
    ? preview
    : `${serverOrigin(apiUrl)}/${preview.replace(/^\/+/, '')}`;
  return `${absolute}${absolute.includes('?') ? '&' : '?'}preset=${preset}`;
}
