import path from 'node:path';

import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import {
  Asset,
  DefaultJobQueuePlugin,
  DefaultSchedulerPlugin,
  DefaultSearchPlugin,
  dummyPaymentHandler,
  LanguageCode,
  type VendureConfig,
} from '@vendure/core';

const env = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) throw new Error(`Missing env ${key} (see dev-server/.env.example)`);
  return value;
};

const port = Number(env('APP_PORT', '3300'));

export const config: VendureConfig = {
  apiOptions: {
    hostname: env('APP_HOST', '127.0.0.1'),
    port,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    adminApiPlayground: false,
    shopApiPlayground: false,
  },
  authOptions: {
    // The mobile app uses bearer tokens.
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: env('SUPERADMIN_USERNAME', 'superadmin'),
      password: env('SUPERADMIN_PASSWORD', 'superadmin'),
    },
    cookieOptions: { secret: env('COOKIE_SECRET', 'dev-server-cookie-secret') },
  },
  dbConnectionOptions: {
    type: 'postgres',
    host: env('DB_HOST', '127.0.0.1'),
    port: Number(env('DB_PORT', '5432')),
    database: env('DB_NAME'),
    username: env('DB_USER'),
    password: env('DB_PASS'),
    schema: env('DB_SCHEMA', 'public'),
    synchronize: true, // dev only: schema follows the Vendure version, no migrations
    logging: false,
  },
  // Sample custom fields covering every input type the app renders (see issue #19).
  customFields: {
    Product: [
      { name: 'brand', type: 'string', label: [{ languageCode: LanguageCode.en, value: 'Brand' }] },
      {
        name: 'condition',
        type: 'string',
        options: [{ value: 'new' }, { value: 'refurbished' }, { value: 'used' }],
        defaultValue: 'new',
      },
      { name: 'subtitle', type: 'localeString', nullable: true },
      { name: 'careInstructions', type: 'localeText', nullable: true, ui: { tab: 'Details' } },
      { name: 'warrantyMonths', type: 'int', min: 0, max: 120, defaultValue: 12 },
      { name: 'weightKg', type: 'float', nullable: true, ui: { tab: 'Details' } },
      { name: 'featured', type: 'boolean', defaultValue: false },
      { name: 'launchDate', type: 'datetime', nullable: true },
      { name: 'tags', type: 'string', list: true, nullable: true },
      { name: 'internalNote', type: 'string', internal: true, nullable: true },
      { name: 'legacyId', type: 'string', readonly: true, nullable: true },
      { name: 'sizeChart', type: 'relation', entity: Asset, nullable: true },
    ],
    ProductVariant: [{ name: 'barcode', type: 'string', nullable: true }],
    Customer: [
      { name: 'loyaltyPoints', type: 'int', defaultValue: 0 },
      { name: 'notes', type: 'text', nullable: true },
    ],
    Order: [{ name: 'giftMessage', type: 'text', nullable: true }],
    Collection: [{ name: 'showInMenu', type: 'boolean', defaultValue: true }],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      assetUrlPrefix: `http://${env('APP_HOST', '127.0.0.1')}:${port}/assets/`,
    }),
    DefaultSchedulerPlugin.init(),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
  ],
};
