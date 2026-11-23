/**
 * Live smoke test: runs every operation the app uses against a real Vendure server.
 *
 *   VENDURE_API=https://host/admin-api VENDURE_USER=... VENDURE_PASS=... npm run smoke
 *   SMOKE_MUTATION=1 ... npm run smoke   # also toggles a product's `enabled` flag and restores it
 *
 * Credentials come only from the environment — never commit them.
 */
import { ActiveChannelDocument } from '../src/api/documents/auth';
import { DashboardMetricsDocument, DashboardOrdersDocument } from '../src/api/documents/dashboard';
import { OrderDetailDocument, OrderListDocument } from '../src/api/documents/orders';
import { ProductDetailDocument, ProductListDocument, UpdateProductDocument } from '../src/api/documents/products';
import { connect } from './smoke-lib';

const env = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env ${k}`);
  return v;
};

async function main() {
  const { run, ok, state, customFields } = await connect(env('VENDURE_API'), env('VENDURE_USER'), env('VENDURE_PASS'));
  ok('login', `bearer token received; channel token ${state.channelToken ? 'set' : 'none'}`);
  ok('server config', `${customFields.size} entit${customFields.size === 1 ? 'y' : 'ies'} with custom fields`);

  const ch = await run(ActiveChannelDocument);
  ok('activeChannel', `${ch.activeChannel.defaultCurrencyCode}, precision ${ch.globalSettings.serverConfig.moneyStrategyPrecision}`);

  const metrics = await run(DashboardMetricsDocument);
  ok('metricSummary', metrics.metricSummary.map((m) => `${m.type}:${m.entries.length}d`).join(' '));

  const now = new Date();
  const dash = await run(DashboardOrdersDocument, {
    today: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
    monthStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
  });
  ok('dashboard orders', `today ${dash.today.totalItems}, month ${dash.month.totalItems}, latest ${dash.latest.items.length}`);

  const products = await run(ProductListDocument, { options: { take: 5, sort: { updatedAt: 'DESC' } } });
  const withImage = products.products.items.filter((p) => p.featuredAsset?.preview).length;
  ok('products', `${products.products.totalItems} total, ${withImage}/5 with images`);

  const term = products.products.items[0]?.name.split(' ')[0] ?? 'a';
  const search = await run(ProductListDocument, {
    options: { take: 5, filter: { _or: [{ name: { contains: term } }, { slug: { contains: term } }, { sku: { contains: term } }] } },
  });
  ok('product search', `"${term}" → ${search.products.totalItems}`);

  const first = products.products.items[0];
  if (first) {
    const detail = await run(ProductDetailDocument, { id: first.id });
    const p = detail.product!;
    ok('product detail', `#${p.id} ${p.variantList.totalItems} variant(s), ${p.translations.length} translation(s)`);

    if (process.env.SMOKE_MUTATION === '1') {
      const original = p.enabled;
      const flipped = await run(UpdateProductDocument, { input: { id: p.id, enabled: !original } });
      const restored = await run(UpdateProductDocument, { input: { id: p.id, enabled: original } });
      if (flipped.updateProduct.enabled !== !original || restored.updateProduct.enabled !== original) {
        throw new Error('mutation round-trip mismatch');
      }
      ok('updateProduct', `#${p.id} enabled ${original} → ${!original} → ${original} (restored)`);
    }
  }

  const orders = await run(OrderListDocument, {
    options: { take: 5, sort: { orderPlacedAt: 'DESC' }, filter: { active: { eq: false }, state: { notIn: ['Draft'] } } },
  });
  ok('orders', `${orders.orders.totalItems} placed, states: ${[...new Set(orders.orders.items.map((o) => o.state))].join(', ')}`);
  const o = orders.orders.items[0];
  if (o) {
    const od = await run(OrderDetailDocument, { id: o.id });
    ok('order detail', `${od.order?.code} ${od.order?.lines.length} line(s), ${od.order?.payments?.length ?? 0} payment(s)`);
  }
  console.log('\nAll smoke checks passed.');
}

main().catch((e) => {
  console.error('✘', e instanceof Error ? e.message : e);
  process.exit(1);
});
