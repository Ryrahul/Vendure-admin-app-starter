import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * Typed GraphQL operations for the Vendure Admin API.
 *
 * - Schema: the *standard* Vendure Admin API (graphql/admin-schema.graphql). Pull a fresh
 *   copy with `npm run schema:pull`, or introspect your own server (with its custom fields)
 *   via `SCHEMA_URL=https://your-host/admin-api npm run schema:pull`.
 * - Documents: every `graphql(\`...\`)` call under src/.
 * - Output: src/gql/ (generated — do not edit). Run `npm run codegen`.
 */
const config: CodegenConfig = {
  schema: 'graphql/admin-schema.graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/gql/**/*'],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'client',
      presetConfig: { fragmentMasking: false },
      config: {
        documentMode: 'string',
        enumsAsTypes: true,
        useTypeImports: true,
        skipTypename: false,
        scalars: {
          ID: 'string',
          DateTime: 'string',
          Money: 'number',
          JSON: 'unknown',
          Upload: 'unknown',
        },
      },
    },
  },
};

export default config;
