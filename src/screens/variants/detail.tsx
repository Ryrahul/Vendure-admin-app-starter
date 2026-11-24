/**
 * Product variant detail: edit, or create for an existing product (id === 'new' + productId param).
 * Name, SKU, enabled, price, tax category, stock per location, inventory settings,
 * assets, facet values, custom fields; options are read-only (chosen at creation).
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import { ProductDetailDocument, ProductListDocument } from '@/api/documents/products';
import {
  CreateProductVariantsDocument,
  DeleteProductVariantDocument,
  UpdateProductVariantDocument,
  VariantDetailDocument,
  VariantFormDataDocument,
  VariantListDocument,
  VariantProductDocument,
} from '@/api/documents/variants';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { useChannelInfo } from '@/api/use-channel-info';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { LinkRow, MoneyRow, NumberRow, SelectRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { ErrorState, LoadingState } from '@/components/screen-state';
import { useAfterTransition } from '@/hooks/use-after-transition';
import { Section } from '@/components/section';
import type { GlobalFlag, VariantDetailQuery, VariantFormDataQuery, VariantProductQuery } from '@/gql/graphql';
import { AssetsEditor, assetsInput, assetsValue } from '@/screens/assets/assets-editor';
import { FacetValuesEditor, toEditableFacetValues } from '@/screens/facets/facet-values-editor';
import { activeTranslation, editLanguage } from '@/screens/products/helpers';
import { alertError } from '@/utils/confirm';
import { formatDate, formatMoney } from '@/utils/format';

type Variant = NonNullable<VariantDetailQuery['productVariant']>;
type FormData = VariantFormDataQuery;
type ParentProduct = NonNullable<VariantProductQuery['product']>;

const TRACK_OPTIONS: { value: GlobalFlag; label: string }[] = [
  { value: 'INHERIT', label: 'Use global setting' },
  { value: 'TRUE', label: 'Track' },
  { value: 'FALSE', label: "Don't track" },
];

export function VariantDetailScreen({ id, productId }: { id: string; productId?: string }) {
  const isNew = id === 'new';
  const query = useVendureQuery(VariantDetailDocument, { id }, { enabled: !isNew });
  const formData = useVendureQuery(VariantFormDataDocument, undefined, { staleTime: 60_000 });
  const parent = useVendureQuery(VariantProductDocument, { id: productId ?? '' }, { enabled: isNew && !!productId });
  const ready = useAfterTransition();

  if (formData.isLoading || !ready) return <LoadingState variant="form" label="Loading variant…" />;
  if (!formData.data)
    return (
      <ErrorState
        error={formData.error ?? new Error('Could not load the variant form.')}
        onRetry={() => void formData.refetch()}
      />
    );

  if (isNew) {
    if (!productId) return <ErrorState error={new Error('Open “Add variant” from a product to create a variant.')} />;
    return (
      <QueryBoundary query={parent} pick={(d) => d.product} noun="product">
        {(product) => <VariantForm formData={formData.data} product={product} />}
      </QueryBoundary>
    );
  }
  return (
    <QueryBoundary query={query} pick={(d) => d.productVariant} noun="variant">
      {(variant) => (
        <VariantForm
          key={variant.updatedAt}
          formData={formData.data}
          variant={variant}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function VariantForm({
  formData,
  variant,
  product,
  refetch,
  refreshing,
}: {
  formData: FormData;
  variant?: Variant;
  product?: ParentProduct;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { can } = usePermissions();
  const { currencyCode, precision } = useChannelInfo();
  const defs = useCustomFields('ProductVariant');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateProductVariantsDocument);
  const update = useVendureMutation(UpdateProductVariantDocument);
  const remove = useVendureMutation(DeleteProductVariantDocument);

  const translation = activeTranslation(variant);
  const defaultTax = formData.taxCategories.items.find((t) => t.isDefault) ?? formData.taxCategories.items[0];
  const [name, setName] = useState(translation?.name ?? variant?.name ?? product?.name ?? '');
  const [sku, setSku] = useState(variant?.sku ?? '');
  const [enabled, setEnabled] = useState(variant?.enabled ?? true);
  const [price, setPrice] = useState<number | null>(variant?.price ?? 0);
  const [taxCategoryId, setTaxCategoryId] = useState<string | null>(variant?.taxCategory.id ?? defaultTax?.id ?? null);
  const [trackInventory, setTrackInventory] = useState<GlobalFlag>(variant?.trackInventory ?? 'INHERIT');
  const [useGlobalThreshold, setUseGlobalThreshold] = useState(variant?.useGlobalOutOfStockThreshold ?? true);
  const [threshold, setThreshold] = useState<number | null>(variant?.outOfStockThreshold ?? 0);
  const [stock, setStock] = useState<Record<string, number | null>>(() =>
    Object.fromEntries((variant?.stockLevels ?? []).map((l) => [l.stockLocationId, l.stockOnHand])),
  );
  const [stockEdited, setStockEdited] = useState<Set<string>>(() => new Set());
  const [optionIds, setOptionIds] = useState<Record<string, string | null>>({});
  const [facetValues, setFacetValues] = useState(() => toEditableFacetValues(variant?.facetValues ?? []));
  const [assets, setAssets] = useState(() => assetsValue(variant));
  const [cf, setCf] = useState(() => customFieldValues(defs, variant?.customFields, translation));
  const [dirty, setDirty] = useState(false);
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };

  const canEdit = variant ? can('UpdateCatalog', 'UpdateProduct') : can('CreateCatalog', 'CreateProduct');
  const saving = create.isPending || update.isPending;
  const productId = variant?.product.id ?? product?.id;
  const productName = variant?.product.name ?? product?.name;

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    if (!sku.trim()) return alertError(new Error('SKU is required.'), 'Missing SKU');
    const groups = product?.optionGroups ?? [];
    const missing = groups.filter((g) => !optionIds[g.id]);
    if (!variant && missing.length) {
      return alertError(new Error(`Choose a value for ${missing.map((g) => g.name).join(', ')}.`), 'Missing options');
    }
    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const stockLevels = formData.stockLocations.items
      .filter((l) => stockEdited.has(l.id))
      .map((l) => ({ stockLocationId: l.id, stockOnHand: stock[l.id] ?? 0 }));
    const common = {
      sku: sku.trim(),
      enabled,
      price: price ?? 0,
      taxCategoryId,
      trackInventory,
      useGlobalOutOfStockThreshold: useGlobalThreshold,
      outOfStockThreshold: threshold ?? 0,
      facetValueIds: facetValues.map((v) => v.id),
      ...assetsInput(assets),
      ...(stockLevels.length ? { stockLevels } : {}),
      customFields,
    };
    const translations = [
      {
        ...(translation ? { id: translation.id } : {}),
        languageCode: editLanguage(variant),
        name: name.trim(),
        customFields: translationCustomFields,
      },
    ];
    try {
      if (variant) {
        await update.mutateAsync({ input: { id: variant.id, ...common, translations } });
      } else if (productId) {
        const res = await create.mutateAsync({
          input: [
            { productId, ...common, translations, optionIds: groups.map((g) => optionIds[g.id]!).filter(Boolean) },
          ],
        });
        const created = res.createProductVariants[0];
        if (created) router.replace(`/catalog/variants/${created.id}`);
      }
      setDirty(false);
      await invalidate(VariantListDocument, VariantDetailDocument, ProductDetailDocument, ProductListDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={variant?.name ?? 'New variant'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={variant ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title={translation ? `General (${translation.languageCode})` : 'General'}>
          <TextRow label="Name" value={name} onChangeText={edit(setName)} readOnly={!canEdit} />
          <TextRow
            label="SKU"
            value={sku}
            mono
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={edit(setSku)}
            readOnly={!canEdit}
            autoFocus={!variant}
          />
          <SwitchRow label="Enabled" value={enabled} disabled={!canEdit} onValueChange={edit(setEnabled)} />
          {productId ? (
            <LinkRow
              label="Product"
              value={productName}
              onPress={() => router.push(`/catalog/products/${productId}`)}
            />
          ) : null}
        </Section>

        {variant?.options.length ? (
          <Section title="Options">
            {variant.options.map((o) => (
              <ValueRow key={o.id} label={o.group.name} value={o.name} />
            ))}
          </Section>
        ) : null}
        {!variant && product?.optionGroups.length ? (
          <Section title="Options" footer="One option from each of the product's option groups.">
            {product.optionGroups.map((g) => (
              <SelectRow
                key={g.id}
                label={g.name}
                value={optionIds[g.id] ?? null}
                options={g.options.map((o) => ({ value: o.id, label: o.name }))}
                emptyLabel="Choose…"
                onChange={(v) => edit(setOptionIds)({ ...optionIds, [g.id]: v })}
              />
            ))}
          </Section>
        ) : null}

        <Section
          title="Price"
          footer={
            variant ? `${formatMoney(variant.priceWithTax, variant.currencyCode, precision)} incl. tax` : undefined
          }>
          <MoneyRow
            label="Price"
            value={price}
            currencyCode={variant?.currencyCode ?? currencyCode}
            precision={precision}
            onChange={edit(setPrice)}
            readOnly={!canEdit}
          />
          <SelectRow
            label="Tax category"
            value={taxCategoryId}
            options={formData.taxCategories.items.map((t) => ({ value: t.id, label: t.name }))}
            disabled={!canEdit}
            onChange={edit(setTaxCategoryId)}
          />
        </Section>

        <Section title="Stock">
          {formData.stockLocations.items.map((l) => {
            const level = variant?.stockLevels.find((s) => s.stockLocationId === l.id);
            return (
              <NumberRow
                key={l.id}
                label={`On hand · ${l.name}`}
                hint={level?.stockAllocated ? `${level.stockAllocated} allocated` : undefined}
                integer
                value={stock[l.id] ?? (level ? level.stockOnHand : null)}
                readOnly={!canEdit}
                onChange={(v) => {
                  setStock((prev) => ({ ...prev, [l.id]: v }));
                  setStockEdited((prev) => new Set(prev).add(l.id));
                  setDirty(true);
                }}
              />
            );
          })}
          <SelectRow
            label="Track inventory"
            hint={`Global setting: ${formData.globalSettings.trackInventory ? 'track' : "don't track"}`}
            value={trackInventory}
            options={TRACK_OPTIONS}
            disabled={!canEdit}
            onChange={(v) => edit(setTrackInventory)((v ?? 'INHERIT') as GlobalFlag)}
          />
          <SwitchRow
            label="Use global out-of-stock threshold"
            hint={`Global threshold: ${formData.globalSettings.outOfStockThreshold}`}
            value={useGlobalThreshold}
            disabled={!canEdit}
            onValueChange={edit(setUseGlobalThreshold)}
          />
          {!useGlobalThreshold ? (
            <NumberRow
              label="Out-of-stock threshold"
              integer
              value={threshold}
              readOnly={!canEdit}
              onChange={edit(setThreshold)}
            />
          ) : null}
        </Section>

        <AssetsEditor value={assets} onChange={edit(setAssets)} readOnly={!canEdit} />
        <FacetValuesEditor value={facetValues} onChange={edit(setFacetValues)} readOnly={!canEdit} />
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />

        {variant ? (
          <Section title="Info">
            <ValueRow label="ID" value={variant.id} mono />
            <ValueRow label="Created" value={formatDate(variant.createdAt)} />
            <ValueRow label="Updated" value={formatDate(variant.updatedAt)} />
          </Section>
        ) : null}
        {variant ? (
          <DeleteSection
            label="Delete variant"
            message={`“${variant.name}” (${variant.sku}) will be deleted.`}
            hidden={!can('DeleteCatalog', 'DeleteProduct')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: variant.id })).deleteProductVariant);
              await invalidate(VariantListDocument, ProductDetailDocument, ProductListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
