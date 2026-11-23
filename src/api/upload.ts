/**
 * Asset upload via the GraphQL multipart request spec
 * (https://github.com/jaydenseric/graphql-multipart-request-spec), which Vendure's
 * `createAssets` mutation expects. The JSON `request()` client can't carry files.
 *
 *   operations: { query, variables: { input: [{ file: null }, …] } }
 *   map:        { "0": ["variables.input.0.file"], … }
 *   0, 1, …:    the file parts
 *
 * Works in React Native (files as `{ uri, name, type }`) and in Node (files as `Blob`).
 */
import { CHANNEL_TOKEN_HEADER, VendureApiError, type ClientState, type GraphQLErrorShape } from '@/api/client';
import { CreateAssetsDocument } from '@/api/documents/assets';
import type { CreateAssetsMutation } from '@/gql/graphql';

/** A React Native file reference (what expo-image-picker returns) or a Blob. */
export type UploadFile = { uri: string; name: string; type: string } | { blob: Blob; name: string };

export type UploadedAsset = Extract<CreateAssetsMutation['createAssets'][number], { __typename: 'Asset' }>;

export async function uploadAssets(
  state: ClientState,
  files: UploadFile[],
  options: { tags?: string[] } = {},
): Promise<UploadedAsset[]> {
  if (!files.length) return [];
  const body = new FormData();
  body.append(
    'operations',
    JSON.stringify({
      query: CreateAssetsDocument.toString(),
      variables: { input: files.map(() => ({ file: null, ...(options.tags?.length ? { tags: options.tags } : {}) })) },
    }),
  );
  body.append('map', JSON.stringify(Object.fromEntries(files.map((_, i) => [String(i), [`variables.input.${i}.file`]]))));
  files.forEach((f, i) => {
    if ('blob' in f) body.append(String(i), f.blob, f.name);
    // React Native's FormData accepts a `{ uri, name, type }` file descriptor.
    else body.append(String(i), f as unknown as Blob);
  });

  // No content-type: fetch sets the multipart boundary itself.
  const headers: Record<string, string> = { accept: 'application/json', 'apollo-require-preflight': 'true' };
  if (state.authToken) headers.authorization = `Bearer ${state.authToken}`;
  if (state.channelToken) headers[CHANNEL_TOKEN_HEADER] = state.channelToken;

  let response: Response;
  try {
    response = await fetch(state.apiUrl, { method: 'POST', headers, body });
  } catch {
    throw new VendureApiError(`Could not reach ${state.apiUrl} to upload.`, 'NETWORK_ERROR');
  }
  let json: { data?: CreateAssetsMutation; errors?: GraphQLErrorShape[] } | undefined;
  try {
    json = await response.json();
  } catch {
    throw new VendureApiError(`Unexpected upload response (${response.status}).`, 'BAD_RESPONSE', [], response.status);
  }
  if (json?.errors?.length) {
    const first = json.errors[0];
    throw new VendureApiError(first.message, first.extensions?.code, json.errors, response.status);
  }
  const results = json?.data?.createAssets ?? [];
  const failed = results.find((r) => r.__typename === 'MimeTypeError');
  if (failed && failed.__typename === 'MimeTypeError') {
    throw new VendureApiError(failed.message || `${failed.fileName}: unsupported file type ${failed.mimeType}`, failed.errorCode);
  }
  return results.filter((r): r is UploadedAsset => r.__typename === 'Asset');
}
