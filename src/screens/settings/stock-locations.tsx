/** Stock locations: list + create/edit form + delete (optionally transferring stock). */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateStockLocationDocument,
  DeleteStockLocationDocument,
  PickStockLocationOptionsDocument,
  StockLocationDetailDocument,
  StockLocationListDocument,
  UpdateStockLocationDocument,
} from '@/api/documents/stock-locations';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { SelectRow, TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import type { StockLocationDetailQuery } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate, stripHtml } from '@/utils/format';

import { useDirty } from './settings-a/shared';

export function StockLocationListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={StockLocationListDocument}
      variables={(term, skip, take) => ({
        options: { skip, take, sort: { name: 'ASC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
      })}
      select={(r) => r.stockLocations}
      noun={['stock location', 'stock locations']}
      createHref={can('CreateStockLocation') ? '/more/stock-locations/new' : undefined}
      row={(l) => ({
        title: l.name,
        subtitle: stripHtml(l.description) || undefined,
        onPress: () => router.push(`/more/stock-locations/${l.id}`),
      })}
    />
  );
}

type StockLocation = NonNullable<StockLocationDetailQuery['stockLocation']>;

export function StockLocationDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(StockLocationDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <StockLocationForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.stockLocation} noun="stock location">
      {(location) => (
        <StockLocationForm
          key={location.updatedAt}
          location={location}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function StockLocationForm({
  location,
  refetch,
  refreshing,
}: {
  location?: StockLocation;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { can } = usePermissions();
  const defs = useCustomFields('StockLocation');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateStockLocationDocument);
  const update = useVendureMutation(UpdateStockLocationDocument);
  const remove = useVendureMutation(DeleteStockLocationDocument);
  const { dirty, setDirty, edit } = useDirty();
  const canDelete = !!location && can('DeleteStockLocation');
  const others = useVendureQuery(
    PickStockLocationOptionsDocument,
    { options: { take: 100, sort: { name: 'ASC' as const } } },
    { enabled: canDelete },
  );
  const otherLocations = (others.data?.stockLocations.items ?? []).filter((l) => l.id !== location?.id);

  const [name, setName] = useState(location?.name ?? '');
  const [description, setDescription] = useState(location?.description ?? '');
  const [cf, setCf] = useState(() => customFieldValues(defs, location?.customFields));
  const [transferTo, setTransferTo] = useState<string | null>(null);

  const canEdit = location ? can('UpdateStockLocation') : can('CreateStockLocation');
  const transferName = otherLocations.find((l) => l.id === transferTo)?.name;

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const { customFields } = customFieldsInput(defs, cf);
    try {
      if (location) {
        await update.mutateAsync({ input: { id: location.id, name: name.trim(), description, customFields } });
      } else {
        const res = await create.mutateAsync({ input: { name: name.trim(), description, customFields } });
        router.replace(`/more/stock-locations/${res.createStockLocation.id}`);
      }
      setDirty(false);
      await invalidate(StockLocationListDocument, StockLocationDetailDocument, PickStockLocationOptionsDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={location?.name ?? 'New stock location'}
        dirty={dirty}
        saving={create.isPending || update.isPending}
        onSave={save}
        label={location ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow label="Name" value={name} onChangeText={edit(setName)} readOnly={!canEdit} autoFocus={!location} />
          <TextRow
            label="Description"
            value={description}
            onChangeText={edit(setDescription)}
            readOnly={!canEdit}
            multiline
          />
        </Section>
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {location ? (
          <Section title="Info">
            <ValueRow label="ID" value={location.id} mono />
            <ValueRow label="Created" value={formatDate(location.createdAt)} />
            <ValueRow label="Updated" value={formatDate(location.updatedAt)} />
          </Section>
        ) : null}
        {canDelete && otherLocations.length ? (
          <Section title="Before deleting" footer="Stock held here can be moved to another location when you delete it.">
            <SelectRow
              label="Transfer stock to"
              value={transferTo}
              allowEmpty
              emptyLabel="Don’t transfer"
              options={otherLocations.map((l) => ({ value: l.id, label: l.name }))}
              onChange={setTransferTo}
            />
          </Section>
        ) : null}
        {location ? (
          <DeleteSection
            label="Delete stock location"
            message={
              transferName
                ? `“${location.name}” will be deleted and its stock moved to “${transferName}”.`
                : `“${location.name}” will be deleted together with its stock levels.`
            }
            hidden={!canDelete}
            onDelete={async () => {
              const res = await remove.mutateAsync({
                input: { id: location.id, ...(transferTo ? { transferToLocationId: transferTo } : {}) },
              });
              assertDeleted(res.deleteStockLocation);
              await invalidate(StockLocationListDocument, PickStockLocationOptionsDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
