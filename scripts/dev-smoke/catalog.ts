import {
  AssetDetailDocument,
  AssetListDocument,
  AssetTagsDocument,
  DeleteAssetsDocument,
  UpdateAssetDocument,
} from '../../src/api/documents/assets';
import {
  CollectionContentsDocument,
  CollectionDetailDocument,
  CollectionFiltersDocument,
  CollectionListDocument,
  CreateCollectionDocument,
  DeleteCollectionDocument,
  MoveCollectionDocument,
  UpdateCollectionDocument,
} from '../../src/api/documents/collections';
import {
  CreateFacetDocument,
  CreateFacetValuesDocument,
  DeleteFacetDocument,
  DeleteFacetValuesDocument,
  FacetDetailDocument,
  FacetListDocument,
  UpdateFacetDocument,
  UpdateFacetValuesDocument,
} from '../../src/api/documents/facets';
import {
  CreateOptionGroupDocument,
  CreateProductOptionDocument,
  DeleteOptionGroupDocument,
  DeleteProductOptionDocument,
  OptionGroupDetailDocument,
  OptionGroupListDocument,
  UpdateOptionGroupDocument,
  UpdateProductOptionDocument,
} from '../../src/api/documents/option-groups';
import {
  AssignProductsToChannelDocument,
  CreateProductDocument,
  DeleteProductDocument,
  ProductDetailDocument,
  ProductListDocument,
  RemoveProductsFromChannelDocument,
  UpdateProductDocument,
} from '../../src/api/documents/products';
import {
  CreateProductVariantsDocument,
  DeleteProductVariantDocument,
  UpdateProductVariantDocument,
  VariantDetailDocument,
  VariantFormDataDocument,
  VariantListDocument,
  VariantProductDocument,
} from '../../src/api/documents/variants';
import { customFieldsInput, customFieldsFor, customFieldValues } from '../../src/api/custom-fields';
import { uploadAssets } from '../../src/api/upload';
import type { TypedDocumentString } from '../../src/gql/graphql';
import { expect, type SmokeContext } from '../smoke-lib';
import type { Suite } from './index';

const stamp = () => `Smoke ${Date.now()}`;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** A valid 1×1 PNG. */
const PNG = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
  (c) => c.charCodeAt(0),
);

async function upload(ctx: SmokeContext, name: string, tags?: string[]) {
  const [asset] = await uploadAssets(ctx.state, [{ blob: new Blob([PNG], { type: 'image/png' }), name }], { tags });
  expect(asset?.id, 'asset uploaded');
  return asset;
}

/** Untyped raw operation (for helpers outside this area, e.g. a temporary channel). */
const raw = <R = any>(query: string) => ({ toString: () => query }) as unknown as TypedDocumentString<R, any>;

async function assets(ctx: SmokeContext) {
  const { run, ok } = ctx;
  const name = `${stamp()}.png`;
  const asset = await upload(ctx, name, ['smoke-tag']);
  try {
    const list = await run(AssetListDocument, { options: { take: 5, filter: { name: { contains: 'Smoke' } } } });
    expect(list.assets.items.some((a) => a.id === asset.id), 'uploaded asset is listed');
    const tags = await run(AssetTagsDocument, { options: { take: 100 } });
    expect(tags.tags.items.some((t) => t.value === 'smoke-tag'), 'tag created');
    await run(UpdateAssetDocument, { input: { id: asset.id, name: `${name} edited`, tags: ['smoke-tag', 'smoke-tag-2'] } });
    const detail = await run(AssetDetailDocument, { id: asset.id });
    expect(detail.asset?.name === `${name} edited`, 'asset renamed');
    expect(detail.asset?.tags.length === 2, 'asset tags updated');
    expect(detail.asset?.width === 1 && detail.asset.mimeType === 'image/png', 'asset metadata');
  } finally {
    const del = await run(DeleteAssetsDocument, { input: { assetIds: [asset.id], force: false } });
    expect(del.deleteAssets.result === 'DELETED', 'asset deleted');
  }
  ok('catalog assets', 'multipart upload → tags → rename → delete');
}

async function products(ctx: SmokeContext) {
  const { run, ok, customFields } = ctx;
  const name = stamp();
  const list = await run(ProductListDocument, { options: { take: 5, filter: { enabled: { eq: false } } } });

  // Create (simple flow): product + one default variant.
  const { createProduct } = await run(CreateProductDocument, {
    input: {
      enabled: true,
      facetValueIds: ['1'],
      translations: [{ languageCode: 'en', name, slug: slugify(name), description: '<p>Smoke <b>test</b></p>' }],
    },
  });
  const id = createProduct.id;
  const asset = await upload(ctx, `${name}.png`);
  let channelNote = 'channel n/a';
  try {
    const [variant] = await run(CreateProductVariantsDocument, {
      input: [{ productId: id, sku: `SMOKE-${Date.now()}`, price: 1234, translations: [{ languageCode: 'en', name }] }],
    }).then((r) => r.createProductVariants);
    expect(variant?.id, 'default variant created');

    await run(UpdateProductDocument, {
      input: { id, enabled: false, assetIds: [asset.id], featuredAssetId: asset.id, facetValueIds: ['1', '3'] },
    });
    let detail = (await run(ProductDetailDocument, { id })).product;
    expect(detail?.enabled === false, 'product disabled');
    expect(detail.featuredAsset?.id === asset.id && detail.assets.length === 1, 'product assets set');
    expect(detail.facetValues.length === 2, 'product facet values set');
    expect(detail.description === '<p>Smoke <b>test</b></p>', 'description HTML preserved');
    expect(detail.variantList.totalItems === 1 && detail.variantList.items[0].price === 1234, 'variant price');

    // Asset in use → force:false is refused with a message.
    const inUse = await run(DeleteAssetsDocument, { input: { assetIds: [asset.id], force: false } });
    expect(inUse.deleteAssets.result === 'NOT_DELETED' && !!inUse.deleteAssets.message, 'in-use asset not deleted');

    // Translation update (send only the edited translation, with its id).
    const tr = detail.translations[0];
    await run(UpdateProductDocument, { input: { id, translations: [{ id: tr.id, languageCode: tr.languageCode, name: `${name} edited` }] } });
    detail = (await run(ProductDetailDocument, { id })).product;
    expect(detail?.name === `${name} edited`, 'product renamed');
    expect(detail.description === '<p>Smoke <b>test</b></p>', 'description untouched by rename');

    // Channels: assign to a temporary second channel, then remove.
    const channel = await tempChannel(ctx);
    if (channel) {
      try {
        await run(AssignProductsToChannelDocument, { input: { productIds: [id], channelId: channel } });
        detail = (await run(ProductDetailDocument, { id })).product;
        expect(detail?.channels.some((c) => c.id === channel), 'assigned to channel');
        await run(RemoveProductsFromChannelDocument, { input: { productIds: [id], channelId: channel } });
        detail = (await run(ProductDetailDocument, { id })).product;
        expect(!detail?.channels.some((c) => c.id === channel), 'removed from channel');
        channelNote = 'channel assign/remove';
      } finally {
        await run(raw(`mutation { deleteChannel(id: "${channel}") { result } }`));
      }
    }
  } finally {
    const del = await run(DeleteProductDocument, { id });
    expect(del.deleteProduct.result === 'DELETED', 'product deleted');
    await run(DeleteAssetsDocument, { input: { assetIds: [asset.id], force: true } });
  }

  // Custom fields on a seeded product: change every editable field, verify, restore.
  const defs = customFieldsFor(customFields, 'Product');
  const seeded = (await run(ProductListDocument, { options: { take: 1, sort: { id: 'ASC' } } })).products.items[0];
  const before = (await run(ProductDetailDocument, { id: seeded.id })).product!;
  const tr = before.translations.find((t) => t.languageCode === before.languageCode) ?? before.translations[0];
  const original = customFieldValues(defs, before.customFields, tr);
  const sizeChart = await upload(ctx, `${name}-chart.png`);
  try {
    const changed: Record<string, unknown> = { ...original };
    for (const def of defs) {
      if (def.readonly) continue;
      if (def.name === 'brand') changed.brand = 'Smoke brand';
      if (def.name === 'warrantyMonths') changed.warrantyMonths = 24;
      if (def.name === 'featured') changed.featured = !original.featured;
      if (def.name === 'tags') changed.tags = ['smoke-a', 'smoke-b'];
      if (def.name === 'subtitle') changed.subtitle = 'Smoke subtitle';
      if (def.name === 'careInstructions') changed.careInstructions = 'Smoke care';
      if (def.name === 'sizeChart') changed.sizeChart = { id: sizeChart.id };
    }
    const input = customFieldsInput(defs, changed);
    await run(UpdateProductDocument, {
      input: {
        id: before.id,
        customFields: input.customFields,
        translations: [{ id: tr.id, languageCode: tr.languageCode, customFields: input.translationCustomFields }],
      },
    });
    const after = (await run(ProductDetailDocument, { id: before.id })).product!;
    const afterTr = after.translations.find((t) => t.id === tr.id);
    const values = customFieldValues(defs, after.customFields, afterTr);
    if (defs.some((d) => d.name === 'brand')) expect(values.brand === 'Smoke brand', 'string custom field');
    if (defs.some((d) => d.name === 'warrantyMonths')) expect(values.warrantyMonths === 24, 'int custom field');
    if (defs.some((d) => d.name === 'subtitle')) expect(values.subtitle === 'Smoke subtitle', 'localeString custom field');
    if (defs.some((d) => d.name === 'careInstructions')) expect(values.careInstructions === 'Smoke care', 'localeText custom field');
    if (defs.some((d) => d.name === 'sizeChart')) {
      expect((values.sizeChart as { id?: string } | null)?.id === sizeChart.id, 'relation custom field');
    }
  } finally {
    const restore = customFieldsInput(defs, original);
    await run(UpdateProductDocument, {
      input: {
        id: before.id,
        customFields: restore.customFields,
        translations: [{ id: tr.id, languageCode: tr.languageCode, customFields: restore.translationCustomFields }],
      },
    });
    await run(DeleteAssetsDocument, { input: { assetIds: [sizeChart.id], force: true } });
  }
  ok('catalog products', `${list.products.totalItems} disabled; create → assets/facets → rename → ${channelNote} → delete; custom fields restored`);
}

/** A temporary second channel for assign/remove tests (null if the admin can't create one). */
async function tempChannel({ run }: SmokeContext): Promise<string | null> {
  try {
    const zones = await run(raw<{ zones: { items: { id: string }[] } }>(`{ zones(options: { take: 1 }) { items { id } } }`));
    const zone = zones.zones.items[0]?.id;
    if (!zone) return null;
    const code = `smoke-${Date.now()}`;
    const res = await run(
      raw<{ createChannel: { id?: string } }>(`mutation { createChannel(input: {
        code: "${code}", token: "${code}", defaultLanguageCode: en, pricesIncludeTax: false,
        defaultCurrencyCode: USD, defaultTaxZoneId: "${zone}", defaultShippingZoneId: "${zone}"
      }) { ... on Channel { id } } }`),
    );
    return res.createChannel.id ?? null;
  } catch {
    return null;
  }
}

async function variants(ctx: SmokeContext) {
  const { run, ok, customFields } = ctx;
  const name = stamp();
  const search = await run(VariantListDocument, { options: { take: 5, filter: { sku: { contains: 'L' } } } });
  const form = await run(VariantFormDataDocument);
  const location = form.stockLocations.items[0];
  const tax = form.taxCategories.items[form.taxCategories.items.length - 1];
  const { createProduct } = await run(CreateProductDocument, {
    input: { translations: [{ languageCode: 'en', name, slug: slugify(name), description: '' }] },
  });
  try {
    const product = await run(VariantProductDocument, { id: createProduct.id });
    expect(product.product?.optionGroups.length === 0, 'new product has no option groups');
    const sku = `SMOKE-V-${Date.now()}`;
    const [created] = (
      await run(CreateProductVariantsDocument, {
        input: [{ productId: createProduct.id, sku, price: 500, translations: [{ languageCode: 'en', name: `${name} V` }] }],
      })
    ).createProductVariants;
    const id = created!.id;
    const defs = customFieldsFor(customFields, 'ProductVariant');
    const cf = customFieldsInput(
      defs,
      Object.fromEntries(defs.filter((d) => d.type === 'string' && !d.list).map((d) => [d.name, 'SMOKE-123'])),
    );
    await run(UpdateProductVariantDocument, {
      input: {
        id,
        sku: `${sku}-E`,
        price: 999,
        enabled: false,
        taxCategoryId: tax.id,
        trackInventory: 'TRUE',
        useGlobalOutOfStockThreshold: false,
        outOfStockThreshold: 3,
        stockLevels: location ? [{ stockLocationId: location.id, stockOnHand: 42 }] : undefined,
        customFields: cf.customFields,
      },
    });
    const v = (await run(VariantDetailDocument, { id })).productVariant!;
    expect(v.sku === `${sku}-E` && v.price === 999 && !v.enabled, 'variant sku/price/enabled');
    expect(v.taxCategory.id === tax.id, 'variant tax category');
    expect(v.trackInventory === 'TRUE' && v.outOfStockThreshold === 3 && !v.useGlobalOutOfStockThreshold, 'variant stock settings');
    if (location) expect(v.stockLevels.find((l) => l.stockLocationId === location.id)?.stockOnHand === 42, 'variant stock on hand');
    if (cf.customFields) {
      const values = customFieldValues(defs, v.customFields);
      expect(Object.values(values).includes('SMOKE-123'), 'variant custom field');
    }
    const del = await run(DeleteProductVariantDocument, { id });
    expect(del.deleteProductVariant.result === 'DELETED', 'variant deleted');
  } finally {
    await run(DeleteProductDocument, { id: createProduct.id });
  }
  ok('catalog variants', `${search.productVariants.totalItems} match "L"; create → price/stock/tax/cf → delete`);
}

async function optionGroups({ run, ok }: SmokeContext) {
  const name = stamp();
  const code = slugify(name);
  const list = await run(OptionGroupListDocument, { options: { take: 5 } });
  const { createProductOptionGroup } = await run(CreateOptionGroupDocument, {
    input: {
      code,
      translations: [{ languageCode: 'en', name }],
      options: [{ code: 'small', translations: [{ languageCode: 'en', name: 'Small' }] }],
    },
  });
  const id = createProductOptionGroup.id;
  try {
    const opt = await run(CreateProductOptionDocument, {
      input: { productOptionGroupId: id, code: 'large', translations: [{ languageCode: 'en', name: 'Large' }] },
    });
    let detail = (await run(OptionGroupDetailDocument, { id })).productOptionGroup!;
    const tr = detail.translations[0];
    await run(UpdateOptionGroupDocument, { input: { id, translations: [{ id: tr.id, languageCode: tr.languageCode, name: `${name} edited` }] } });
    const small = detail.options.find((o) => o.code === 'small')!;
    await run(UpdateProductOptionDocument, {
      input: { id: small.id, code: 'sm', translations: [{ id: small.translations[0].id, languageCode: 'en', name: 'Smol' }] },
    });
    const delOpt = await run(DeleteProductOptionDocument, { id: opt.createProductOption.id });
    expect(delOpt.deleteProductOption.result === 'DELETED', 'option deleted');
    detail = (await run(OptionGroupDetailDocument, { id })).productOptionGroup!;
    expect(detail.name === `${name} edited`, 'option group renamed');
    expect(detail.options.length === 1 && detail.options[0].code === 'sm' && detail.options[0].name === 'Smol', 'option updated');
  } finally {
    const del = await run(DeleteOptionGroupDocument, { id });
    expect(del.deleteProductOptionGroup.result === 'DELETED', 'option group deleted');
  }
  ok('catalog option groups', `${list.productOptionGroups.totalItems} listed; group + options CRUD`);
}

async function collections({ run, ok, customFields }: SmokeContext) {
  const name = stamp();
  const top = await run(CollectionListDocument, { options: { topLevelOnly: true, take: 50 } });
  const filters = await run(CollectionFiltersDocument);
  expect(filters.collectionFilters.some((f) => f.code === 'facet-value-filter'), 'collection filters listed');
  const parent = top.collections.items[0];
  const facetFilter = {
    code: 'facet-value-filter',
    arguments: [
      { name: 'facetValueIds', value: '["1"]' },
      { name: 'containsAny', value: 'false' },
      { name: 'combineWithAnd', value: 'true' },
    ],
  };
  const { createCollection } = await run(CreateCollectionDocument, {
    input: {
      parentId: parent.id,
      isPrivate: true,
      filters: [facetFilter],
      translations: [{ languageCode: 'en', name, slug: slugify(name), description: '' }],
    },
  });
  const id = createCollection.id;
  try {
    const children = await run(CollectionListDocument, { options: { filter: { parentId: { eq: parent.id } }, take: 50 } });
    expect(children.collections.items.some((c) => c.id === id), 'child listed under parent');
    const defs = customFieldsFor(customFields, 'Collection');
    const cf = customFieldsInput(defs, Object.fromEntries(defs.filter((d) => d.type === 'boolean').map((d) => [d.name, false])));
    let detail = (await run(CollectionDetailDocument, { id })).collection!;
    const tr = detail.translations[0];
    await run(UpdateCollectionDocument, {
      input: {
        id,
        isPrivate: false,
        inheritFilters: false,
        filters: [{ code: 'variant-name-filter', arguments: [{ name: 'operator', value: 'contains' }, { name: 'term', value: 'a' }, { name: 'combineWithAnd', value: 'true' }] }],
        customFields: cf.customFields,
        translations: [{ id: tr.id, languageCode: tr.languageCode, name: `${name} edited` }],
      },
    });
    const root = detail.breadcrumbs[0].id;
    await run(MoveCollectionDocument, { input: { collectionId: id, parentId: root, index: 0 } });
    detail = (await run(CollectionDetailDocument, { id })).collection!;
    expect(detail.name === `${name} edited` && !detail.isPrivate && !detail.inheritFilters, 'collection updated');
    expect(detail.filters[0]?.code === 'variant-name-filter', 'collection filters updated');
    expect(detail.parentId === root, 'collection moved to top level');
    const contents = await run(CollectionContentsDocument, { id, options: { take: 5 } });
    expect(contents.collection != null, 'contents preview loads');
  } finally {
    const del = await run(DeleteCollectionDocument, { id });
    expect(del.deleteCollection.result === 'DELETED', 'collection deleted');
  }
  ok('catalog collections', `${top.collections.totalItems} top-level; create (child) → filters/cf → move → delete`);
}

async function facets({ run, ok }: SmokeContext) {
  const name = stamp();
  const list = await run(FacetListDocument, { options: { take: 5 } });
  const { createFacet } = await run(CreateFacetDocument, {
    input: {
      code: slugify(name),
      isPrivate: false,
      translations: [{ languageCode: 'en', name }],
      values: [{ code: 'one', translations: [{ languageCode: 'en', name: 'One' }] }],
    },
  });
  const id = createFacet.id;
  try {
    const created = await run(CreateFacetValuesDocument, {
      input: [{ facetId: id, code: 'two', translations: [{ languageCode: 'en', name: 'Two' }] }],
    });
    let detail = (await run(FacetDetailDocument, { id })).facet!;
    const one = detail.values.find((v) => v.code === 'one')!;
    await run(UpdateFacetValuesDocument, {
      input: [{ id: one.id, code: 'uno', translations: [{ id: one.translations[0].id, languageCode: 'en', name: 'Uno' }] }],
    });
    const tr = detail.translations[0];
    await run(UpdateFacetDocument, {
      input: { id, isPrivate: true, translations: [{ id: tr.id, languageCode: tr.languageCode, name: `${name} edited` }] },
    });
    const delValue = await run(DeleteFacetValuesDocument, { ids: [created.createFacetValues[0].id], force: false });
    expect(delValue.deleteFacetValues[0].result === 'DELETED', 'facet value deleted');
    detail = (await run(FacetDetailDocument, { id })).facet!;
    expect(detail.name === `${name} edited` && detail.isPrivate, 'facet updated');
    expect(detail.values.length === 1 && detail.values[0].name === 'Uno', 'facet value updated');
  } finally {
    const del = await run(DeleteFacetDocument, { id, force: false });
    expect(del.deleteFacet.result === 'DELETED', 'facet deleted');
  }
  ok('catalog facets', `${list.facets.totalItems} listed; facet + values CRUD`);
}

/** Dev-server write suites for this area group: name → suite. */
export const catalogSuites: Record<string, Suite> = {
  'catalog-assets': assets,
  'catalog-products': products,
  'catalog-variants': variants,
  'catalog-option-groups': optionGroups,
  'catalog-collections': collections,
  'catalog-facets': facets,
};
