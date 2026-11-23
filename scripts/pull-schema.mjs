#!/usr/bin/env node
/**
 * Refresh graphql/admin-schema.graphql.
 *
 *   npm run schema:pull                                   # standard Vendure Admin API (vendure master)
 *   SCHEMA_URL=https://host/admin-api npm run schema:pull # introspect your own server
 *
 * Introspecting your own server includes its custom fields/plugins, which you can then
 * query with full types. Vendure allows introspection on the Admin API by default.
 */
import { writeFileSync } from 'node:fs';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';

const url = process.env.SCHEMA_URL;
let introspection;
let source;
if (url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });
  introspection = (await res.json()).data;
  source = url;
} else {
  source = 'https://raw.githubusercontent.com/vendurehq/vendure/master/schema-admin.json';
  const json = await (await fetch(source)).json();
  introspection = json.data ?? json;
}
if (!introspection?.__schema) {
  console.error('No introspection result from', source);
  process.exit(1);
}
const sdl = printSchema(buildClientSchema(introspection));
writeFileSync(
  'graphql/admin-schema.graphql',
  `# Vendure Admin API schema, pulled from ${source}.\n# Regenerate: npm run schema:pull\n${sdl}\n`,
);
console.log('Wrote graphql/admin-schema.graphql from', source);
