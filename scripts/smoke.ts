/**
 * Live smoke test: runs every operation the app uses against a real Vendure server.
 *
 *   VENDURE_API=https://host/admin-api VENDURE_USER=... VENDURE_PASS=... npm run smoke
 *   SMOKE_MUTATION=1 ... npm run smoke   # also toggles a product's `enabled` flag and restores it
 *
 * Credentials come only from the environment — never commit them.
 */
import { ActiveChannelDocument, CurrentUserDocument, LoginDocument } from '../src/api/documents/auth';
import { DashboardMetricsDocument, DashboardOrdersDocument } from '../src/api/documents/dashboard';
import { OrderDetailDocument, OrderListDocument } from '../src/api/documents/orders';
import { ProductDetailDocument, ProductListDocument, UpdateProductDocument } from '../src/api/documents/products';
import { normalizeApiUrl, request, type ClientState } from '../src/api/client';

const env = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env ${k}`);
  return v;
};

async function main() {
  const state: ClientState = { apiUrl: normalizeApiUrl(env('VENDURE_API')) };
  const ok = (label: string, detail: string) => console.log(`✔ ${label.padEnd(18)} ${detail}`);

  const login = await request(state, LoginDocument, { username: env('VENDURE_USER'), password: env('VENDURE_PASS') });
  if (login.data.login.__typename !== 'CurrentUser' || !login.authToken) throw new Error('login failed');
  state.authToken = login.authToken;
  ok('login', `bearer token received (${login.data.login.identifier})`);

  const me = await request(state, CurrentUserDocument);
  const channels = me.data.me?.channels ?? [];
  state.channelToken = (channels.find((c) => c.code === '__default_channel__') ?? channels[0])?.token;
  ok('me', `${channels.length} channel(s), active ${channels.find((c) => c.token === state.channelToken)?.code}`);

  const ch = await request(state, ActiveChannelDocument);
  ok('activeChannel', `${ch.data.activeChannel.defaultCurrencyCode}, precision ${ch.data.globalSettings.serverConfig.moneyStrategyPrecision}`);

  const metrics = await request(state, DashboardMetricsDocument);
  ok('metricSummary', metrics.data.metricSummary.map((m) => `${m.type}:${m.entries.length}d`).join(' '));

  const now = new Date();
  const dash = await request(state, DashboardOrdersDocument, {
    today: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
    monthStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
  });
  ok('dashboard orders', `today ${dash.data.today.totalItems}, month ${dash.data.month.totalItems}, latest ${dash.data.latest.items.length}`);

  const products = await request(state, ProductListDocument, { options: { take: 5, sort: { updatedAt: 'DESC' } } });
  const withImage = products.data.products.items.filter((p) => p.featuredAsset?.preview).length;
  ok('products', `${products.data.products.totalItems} total, ${withImage}/5 with images`);

  const term = products.data.products.items[0]?.name.split(' ')[0] ?? 'a';
  const search = await request(state, ProductListDocument, {
    options: { take: 5, filter: { _or: [{ name: { contains: term } }, { slug: { contains: term } }, { sku: { contains: term } }] } },
  });
  ok('product search', `"${term}" → ${search.data.products.totalItems}`);

  const first = products.data.products.items[0];
  if (first) {
    const detail = await request(state, ProductDetailDocument, { id: first.id });
    const p = detail.data.product!;
    ok('product detail', `#${p.id} ${p.variantList.totalItems} variant(s), ${p.translations.length} translation(s)`);

    if (process.env.SMOKE_MUTATION === '1') {
      const original = p.enabled;
      const flipped = await request(state, UpdateProductDocument, { input: { id: p.id, enabled: !original } });
      const restored = await request(state, UpdateProductDocument, { input: { id: p.id, enabled: original } });
      if (flipped.data.updateProduct.enabled !== !original || restored.data.updateProduct.enabled !== original) {
        throw new Error('mutation round-trip mismatch');
      }
      ok('updateProduct', `#${p.id} enabled ${original} → ${!original} → ${original} (restored)`);
    }
  }

  const orders = await request(state, OrderListDocument, {
    options: { take: 5, sort: { orderPlacedAt: 'DESC' }, filter: { active: { eq: false }, state: { notIn: ['Draft'] } } },
  });
  ok('orders', `${orders.data.orders.totalItems} placed, states: ${[...new Set(orders.data.orders.items.map((o) => o.state))].join(', ')}`);
  const o = orders.data.orders.items[0];
  if (o) {
    const od = await request(state, OrderDetailDocument, { id: o.id });
    ok('order detail', `${od.data.order?.code} ${od.data.order?.lines.length} line(s), ${od.data.order?.payments?.length ?? 0} payment(s)`);
  }
  console.log('\nAll smoke checks passed.');
}

main().catch((e) => {
  console.error('✘', e instanceof Error ? e.message : e);
  process.exit(1);
});
