import { Host, Switch } from '@expo/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ProductDetailDocument, UpdateProductDocument } from '@/api/documents/products';
import { operationName, useVendureMutation, useVendureQuery } from '@/api/hooks';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { ErrorState, LoadingState } from '@/components/screen-state';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import { TextField } from '@/components/text-field';
import { Thumbnail } from '@/components/thumbnail';
import type { ProductDetailQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { formatDate, formatMoney, stripHtml } from '@/utils/format';

type Product = NonNullable<ProductDetailQuery['product']>;

export function ProductDetailScreen({ id }: { id: string }) {
  const { spacing } = useTheme();
  const { precision } = useChannelInfo();
  const query = useVendureQuery(ProductDetailDocument, { id });
  const product = query.data?.product;

  if (query.isLoading) return <LoadingState label="Loading product…" />;
  if (!product) {
    return query.error ? (
      <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    ) : (
      <ErrorState error={new Error('This product does not exist in the active channel.')} />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: spacing[4], gap: spacing[6] }}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}>
        {query.error ? <InlineError message={query.error.message} /> : null}
        <ProductHeader product={product} />
        {/* Keyed on server values so local edit state resets when the product changes. */}
        <ProductEditor key={`${product.name}|${product.enabled}`} product={product} />
        <Variants product={product} precision={precision} />
        <Details product={product} />
      </ScrollView>
    </>
  );
}

function ProductHeader({ product }: { product: Product }) {
  const { spacing } = useTheme();
  const images = product.assets.length ? product.assets : product.featuredAsset ? [product.featuredAsset] : [];
  return (
    <View style={{ gap: spacing[3] }}>
      <View style={{ alignItems: 'center' }}>
        <Thumbnail preview={product.featuredAsset?.preview} size={220} preset="medium" />
      </View>
      {images.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[2] }}>
          {images.map((a) => (
            <Thumbnail key={a.id} preview={a.preview} size={56} preset="thumb" />
          ))}
        </ScrollView>
      ) : null}
      <View style={{ gap: spacing[1] }}>
        <Text variant="heading">{product.name}</Text>
        <Text variant="mono" color="mutedForeground">
          {product.slug}
        </Text>
      </View>
    </View>
  );
}

/**
 * The starter's "writes work" feature: toggle `enabled` and rename the product.
 * Both are reversible and send only the changed fields (as the web dashboard does).
 */
function ProductEditor({ product }: { product: Product }) {
  const { spacing } = useTheme();
  const queryClient = useQueryClient();
  const mutation = useVendureMutation(UpdateProductDocument);
  const [name, setName] = useState(product.name);
  const [enabled, setEnabled] = useState(product.enabled);

  const translation =
    product.translations.find((t) => t.languageCode === product.languageCode) ?? product.translations[0];

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [operationName(ProductDetailDocument)] }),
      queryClient.invalidateQueries({ queryKey: ['ProductList'] }),
    ]);

  const toggleEnabled = (value: boolean) => {
    setEnabled(value); // optimistic
    mutation.mutate(
      { input: { id: product.id, enabled: value } },
      {
        onSuccess: refresh,
        onError: () => setEnabled(!value),
      },
    );
  };

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === product.name || !translation) return;
    Alert.alert('Rename product?', `“${product.name}” → “${trimmed}”`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Rename',
        onPress: () =>
          mutation.mutate(
            {
              input: {
                id: product.id,
                translations: [{ id: translation.id, languageCode: translation.languageCode, name: trimmed }],
              },
            },
            { onSuccess: refresh },
          ),
      },
    ]);
  };

  const dirty = name.trim() !== product.name && name.trim().length > 0;

  return (
    <Section title="Edit" footer="Changes are saved to the server immediately.">
      <View style={[styles.switchRow, { padding: spacing[4], gap: spacing[3] }]}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="bodyMedium">Enabled</Text>
          <Text variant="caption" color="mutedForeground">
            Disabled products are hidden from the storefront.
          </Text>
        </View>
        <Host matchContents>
          <Switch value={enabled} onValueChange={toggleEnabled} disabled={mutation.isPending} />
        </Host>
      </View>
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        <TextField
          label={`Name${translation ? ` (${translation.languageCode})` : ''}`}
          value={name}
          onChangeText={setName}
          returnKeyType="done"
          onSubmitEditing={saveName}
        />
        {mutation.error ? <InlineError message={mutation.error.message} /> : null}
        <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'flex-end' }}>
          {dirty ? <Button title="Reset" variant="ghost" size="sm" onPress={() => setName(product.name)} /> : null}
          <Button title="Save name" size="sm" onPress={saveName} disabled={!dirty} loading={mutation.isPending && dirty} />
        </View>
      </View>
    </Section>
  );
}

function Variants({ product, precision }: { product: Product; precision: number }) {
  const { totalItems, items } = product.variantList;
  return (
    <Section
      title={`Variants (${totalItems})`}
      footer={totalItems > items.length ? `Showing the first ${items.length}.` : undefined}>
      {items.map((v) => {
        const onHand = v.stockLevels.reduce((s, l) => s + l.stockOnHand, 0);
        const allocated = v.stockLevels.reduce((s, l) => s + l.stockAllocated, 0);
        return (
          <ListRow
            key={v.id}
            title={v.name}
            code={v.sku}
            subtitle={`Stock ${onHand}${allocated ? ` · ${allocated} allocated` : ''} · ${formatMoney(v.price, v.currencyCode, precision)} excl. tax`}
            value={formatMoney(v.priceWithTax, v.currencyCode, precision)}
            trailing={v.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />}
          />
        );
      })}
    </Section>
  );
}

function Details({ product }: { product: Product }) {
  const { spacing } = useTheme();
  const description = stripHtml(product.description);
  return (
    <>
      {product.facetValues.length ? (
        <Section title="Facets">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], padding: spacing[4] }}>
            {product.facetValues.map((fv) => (
              <StatusBadge key={fv.id} label={`${fv.facet.name}: ${fv.name}`} tone="neutral" />
            ))}
          </View>
        </Section>
      ) : null}
      {description ? (
        <Section title="Description">
          <Text style={{ padding: spacing[4] }}>{description}</Text>
        </Section>
      ) : null}
      <Section title="Info">
        <ListRow title="Product ID" value={product.id} />
        <ListRow title="Created" value={formatDate(product.createdAt)} />
        <ListRow title="Updated" value={formatDate(product.updatedAt)} />
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center' },
});
