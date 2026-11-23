/**
 * Seeds the dev server with Vendure's standard sample data (from @vendure/create):
 * countries, zones, tax rates, shipping methods, ~50 products with images, collections.
 * Run once against an empty database.
 */
import path from 'node:path';

import { bootstrap, defaultConfig, mergeConfig } from '@vendure/core';
import { populate } from '@vendure/core/cli';

import { config } from './config';

const assets = path.join(path.dirname(require.resolve('@vendure/create/package.json')), 'assets');

async function main() {
  const populateConfig = mergeConfig(defaultConfig, mergeConfig(config, {
    apiOptions: { port: Number(process.env.APP_PORT ?? 3300) + 50 },
    importExportOptions: { importAssetsDir: path.join(assets, 'images') },
    dbConnectionOptions: { synchronize: true },
  }));
  const app = await populate(
    () => bootstrap(populateConfig),
    require(path.join(assets, 'initial-data.json')),
    path.join(assets, 'products.csv'),
  );
  await app.close();
  console.log('Populated.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
