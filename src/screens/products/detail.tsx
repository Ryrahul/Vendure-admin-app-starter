/**
 * Product detail: a full editor (create when id === 'new').
 * General fields, variants, assets, facet values, option groups, channels, custom fields, info, delete.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AssignProductsToChannelDocument,
  CreateProductDocument,
  DeleteProductDocument,
  ProductDetailDocument,
  ProductListDocument,
  RemoveProductsFromChannelDocument,
  UpdateProductDocument,
} from '@/api/documents/products';
import { CreateProductVariantsDocument, VariantListDocument } from '@/api/documents/variants';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { useSession } from '@/api/session';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { MoneyRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { ListRow } from '@/components/list-row';
import { DeleteSection, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Thumbnail } from '@/components/thumbnail';
import type { ProductDetailQuery } from '@/gql/graphql';
import { AssetsEditor, assetsInput, assetsValue } from '@/screens/assets/assets-editor';
import { FacetValuesEditor, toEditableFacetValues } from '@/screens/facets/facet-values-editor';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { formatDate, formatMoney } from '@/utils/format';

import { activeTranslation, descriptionToText, editLanguage, slugify, textToHtml } from './helpers';

type Product = NonNullable<ProductDetailQuery['product']>;

export function ProductDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(ProductDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <ProductForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.product} noun="product">
      {(product) => (
        // Keyed on updatedAt so the form resets to server values after a save.
        <ProductForm
          key={product.updatedAt}
          product={product}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function ProductForm({
  product,
  refetch,
  refreshing,
}: {
  product?: Product;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { can } = usePermissions();
  const { currencyCode, precision } = useChannelInfo();
  const defs = useCustomFields('Product');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateProductDocument);
  const createVariants = useVendureMutation(CreateProductVariantsDocument);
  const update = useVendureMutation(UpdateProductDocument);
  const remove = useVendureMutation(DeleteProductDocument);

  const translation = activeTranslation(product);
  const [name, setName] = useState(translation?.name ?? product?.name ?? '');
  const [slug, setSlug] = useState(translation?.slug ?? product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [description, setDescription] = useState(() =>
    descriptionToText(translation?.description ?? product?.description),
  );
  const [descriptionEdited, setDescriptionEdited] = useState(false);
  const [enabled, setEnabled] = useState(product?.enabled ?? true);
  const [assets, setAssets] = useState(() => assetsValue(product));
  const [facetValues, setFacetValues] = useState(() => toEditableFacetValues(product?.facetValues ?? []));
  const [cf, setCf] = useState(() => customFieldValues(defs, product?.customFields, translation));
  // Default variant (create only).
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | null>(0);
  const [dirty, setDirty] = useState(false);
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };

  const canEdit = product ? can('UpdateCatalog', 'UpdateProduct') : can('CreateCatalog', 'CreateProduct');
  const saving = create.isPending || update.isPending || createVariants.isPending;

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const finalSlug = slug.trim() || slugify(name);
    if (!product && !sku.trim()) return alertError(new Error('Enter a SKU for the default variant.'), 'Missing SKU');
    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const html = descriptionEdited ? textToHtml(description) : (translation?.description ?? product?.description ?? '');
    const common = {
      enabled,
      ...assetsInput(assets),
      facetValueIds: facetValues.map((v) => v.id),
      customFields,
    };
    try {
      if (product) {
        await update.mutateAsync({
          input: {
            id: product.id,
            ...common,
            translations: [
              {
                ...(translation ? { id: translation.id } : {}),
                languageCode: editLanguage(product),
                name: name.trim(),
                slug: finalSlug,
                description: html,
                customFields: translationCustomFields,
              },
            ],
          },
        });
      } else {
        const res = await create.mutateAsync({
          input: {
            ...common,
            translations: [
              {
                languageCode: 'en',
                name: name.trim(),
                slug: finalSlug,
                description: html,
                customFields: translationCustomFields,
              },
            ],
          },
        });
        const productId = res.createProduct.id;
        try {
          await createVariants.mutateAsync({
            input: [
              {
                productId,
                sku: sku.trim(),
                price: price ?? 0,
                enabled: true,
                translations: [{ languageCode: 'en', name: name.trim() }],
              },
            ],
          });
        } catch (e) {
          alertError(e, 'Product created, but the default variant failed');
        }
        router.replace(`/catalog/products/${productId}`);
      }
      setDirty(false);
      await invalidate(ProductListDocument, ProductDetailDocument, VariantListDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={product?.name ?? 'New product'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={product ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title={translation ? `General (${translation.languageCode})` : 'General'}>
          <TextRow
            label="Name"
            value={name}
            readOnly={!canEdit}
            autoFocus={!product}
            onChangeText={(v) => {
              edit(setName)(v);
              if (!slugTouched) setSlug(slugify(v));
            }}
          />
          <TextRow
            label="Slug"
            value={slug}
            mono
            autoCapitalize="none"
            autoCorrect={false}
            readOnly={!canEdit}
            onChangeText={(v) => {
              setSlugTouched(true);
              edit(setSlug)(v);
            }}
          />
          <SwitchRow
            label="Enabled"
            hint="Disabled products are hidden from the storefront."
            value={enabled}
            disabled={!canEdit}
            onValueChange={edit(setEnabled)}
          />
          <TextRow
            label="Description"
            hint={descriptionEdited ? 'Saved as simple paragraphs.' : undefined}
            value={description}
            multiline
            readOnly={!canEdit}
            onChangeText={(v) => {
              setDescriptionEdited(true);
              edit(setDescription)(v);
            }}
          />
        </Section>

        {!product ? (
          <Section title="Default variant" footer="Add more variants after the product is created.">
            <TextRow
              label="SKU"
              value={sku}
              mono
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={edit(setSku)}
            />
            <MoneyRow
              label="Price"
              value={price}
              currencyCode={currencyCode}
              precision={precision}
              onChange={edit(setPrice)}
            />
          </Section>
        ) : null}

        {product ? <Variants product={product} canCreate={can('CreateCatalog', 'CreateProduct')} /> : null}
        <AssetsEditor value={assets} onChange={edit(setAssets)} readOnly={!canEdit} />
        <FacetValuesEditor value={facetValues} onChange={edit(setFacetValues)} readOnly={!canEdit} />
        {product?.optionGroups.length ? (
          <Section title="Option groups">
            {product.optionGroups.map((g) => (
              <ListRow
                key={g.id}
                title={g.name}
                code={g.code}
                onPress={() => router.push(`/catalog/option-groups/${g.id}`)}
              />
            ))}
          </Section>
        ) : null}
        {product ? <Channels product={product} /> : null}
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />

        {product ? (
          <Section title="Info">
            <ValueRow label="ID" value={product.id} mono />
            <ValueRow label="Created" value={formatDate(product.createdAt)} />
            <ValueRow label="Updated" value={formatDate(product.updatedAt)} />
          </Section>
        ) : null}
        {product ? (
          <DeleteSection
            label="Delete product"
            message={`“${product.name}” and its ${product.variantList.totalItems} variant(s) will be deleted.`}
            hidden={!can('DeleteCatalog', 'DeleteProduct')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: product.id })).deleteProduct);
              await invalidate(ProductListDocument, VariantListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}

/** Rows shown before "Show all" in long read-only lists. */
const COLLAPSED_ROWS = 5;

function Variants({ product, canCreate }: { product: Product; canCreate: boolean }) {
  const { precision } = useChannelInfo();
  const [showAll, setShowAll] = useState(false);
  const { totalItems, items } = product.variantList;
  const visible = showAll ? items : items.slice(0, COLLAPSED_ROWS);
  return (
    <Section
      title={`Variants (${totalItems})`}
      action={
        canCreate ? (
          <Button
            title="Add variant"
            variant="ghost"
            size="sm"
            onPress={() =>
              router.push({ pathname: '/catalog/variants/[id]', params: { id: 'new', productId: product.id } })
            }
          />
        ) : undefined
      }
      footer={totalItems > items.length ? `Showing the first ${items.length}.` : undefined}>
      {items.length ? (
        visible.map((v) => {
          const onHand = v.stockLevels.reduce((s, l) => s + l.stockOnHand, 0);
          const allocated = v.stockLevels.reduce((s, l) => s + l.stockAllocated, 0);
          const options = v.options.map((o) => o.name).join(' · ');
          return (
            <ListRow
              key={v.id}
              leading={
                <Thumbnail
                  preview={v.featuredAsset?.preview ?? product.featuredAsset?.preview}
                  preset="thumb"
                  size={40}
                />
              }
              title={v.name}
              code={v.sku}
              subtitle={`${options ? `${options} · ` : ''}Stock ${onHand}${allocated ? ` (${allocated} allocated)` : ''}`}
              value={formatMoney(v.priceWithTax, v.currencyCode, precision)}
              trailing={v.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />}
              onPress={() => router.push(`/catalog/variants/${v.id}`)}
            />
          );
        })
      ) : (
        <ListRow title="No variants" subtitle="A product needs at least one variant to be sold." />
      )}
      {items.length > COLLAPSED_ROWS ? (
        <ListRow
          title={showAll ? 'Show less' : `Show all ${items.length}`}
          chevron={false}
          onPress={() => setShowAll((v) => !v)}
        />
      ) : null}
    </Section>
  );
}

/** Channel assignment, only shown when the admin has more than one channel. */
function Channels({ product }: { product: Product }) {
  const { state } = useSession();
  const { can } = usePermissions();
  const { spacing } = useTheme();
  const invalidate = useInvalidate();
  const assign = useVendureMutation(AssignProductsToChannelDocument);
  const removeFrom = useVendureMutation(RemoveProductsFromChannelDocument);
  const [busy, setBusy] = useState<string | null>(null);
  if (state.channels.length < 2) return null;
  const canEdit = can('UpdateCatalog', 'UpdateProduct');
  const assigned = new Set(product.channels.map((c) => c.id));

  const toggle = async (channel: { id: string; code: string }) => {
    const isIn = assigned.has(channel.id);
    const ok = await confirm({
      title: isIn ? `Remove from ${channel.code}?` : `Assign to ${channel.code}?`,
      message: isIn
        ? `“${product.name}” and its variants will no longer be available in this channel.`
        : `“${product.name}” and its variants will be added to this channel.`,
      confirmLabel: isIn ? 'Remove' : 'Assign',
      destructive: isIn,
    });
    if (!ok) return;
    setBusy(channel.id);
    try {
      const input = { productIds: [product.id], channelId: channel.id };
      if (isIn) await removeFrom.mutateAsync({ input });
      else await assign.mutateAsync({ input });
      await invalidate(ProductDetailDocument, ProductListDocument);
    } catch (e) {
      alertError(e, 'Could not update channels');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Section title="Channels">
      {state.channels.map((c) => {
        const isIn = assigned.has(c.id);
        const isDefault = c.code === '__default_channel__';
        return (
          <ListRow
            key={c.id}
            title={isDefault ? 'Default channel' : c.code}
            trailing={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                {isIn ? <StatusBadge label="Assigned" tone="info" /> : null}
                {canEdit && !isDefault ? (
                  <Button
                    title={isIn ? 'Remove' : 'Assign'}
                    size="sm"
                    variant={isIn ? 'ghost' : 'secondary'}
                    loading={busy === c.id}
                    onPress={() => void toggle(c)}
                  />
                ) : null}
              </View>
            }
          />
        );
      })}
    </Section>
  );
}
