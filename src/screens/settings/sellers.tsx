/** Sellers: list + create/edit form (name, custom fields) + delete. */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateSellerDocument,
  DeleteSellerDocument,
  SellerDetailDocument,
  SellerListDocument,
  UpdateSellerDocument,
} from '@/api/documents/sellers';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import type { SellerDetailQuery } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { useDirty } from './settings-a/shared';

export function SellerListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={SellerListDocument}
      variables={(term, skip, take) => ({
        options: { skip, take, sort: { name: 'ASC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
      })}
      select={(r) => r.sellers}
      noun={['seller', 'sellers']}
      createHref={can('CreateSeller') ? '/more/sellers/new' : undefined}
      row={(s) => ({ title: s.name, onPress: () => router.push(`/more/sellers/${s.id}`) })}
    />
  );
}

type Seller = NonNullable<SellerDetailQuery['seller']>;

export function SellerDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(SellerDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <SellerForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.seller} noun="seller">
      {(seller) => (
        <SellerForm key={seller.updatedAt} seller={seller} refetch={() => void query.refetch()} refreshing={query.isRefetching} />
      )}
    </QueryBoundary>
  );
}

function SellerForm({ seller, refetch, refreshing }: { seller?: Seller; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('Seller');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateSellerDocument);
  const update = useVendureMutation(UpdateSellerDocument);
  const remove = useVendureMutation(DeleteSellerDocument);
  const { dirty, setDirty, edit } = useDirty();

  const [name, setName] = useState(seller?.name ?? '');
  const [cf, setCf] = useState(() => customFieldValues(defs, seller?.customFields));

  const canEdit = seller ? can('UpdateSeller') : can('CreateSeller');

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const { customFields } = customFieldsInput(defs, cf);
    try {
      if (seller) {
        await update.mutateAsync({ input: { id: seller.id, name: name.trim(), customFields } });
      } else {
        const res = await create.mutateAsync({ input: { name: name.trim(), customFields } });
        router.replace(`/more/sellers/${res.createSeller.id}`);
      }
      setDirty(false);
      await invalidate(SellerListDocument, SellerDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={seller?.name ?? 'New seller'}
        dirty={dirty}
        saving={create.isPending || update.isPending}
        onSave={save}
        label={seller ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General" footer="Sellers own channels. Multi-vendor setups use one seller per vendor.">
          <TextRow label="Name" value={name} onChangeText={edit(setName)} readOnly={!canEdit} autoFocus={!seller} />
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
        {seller ? (
          <Section title="Info">
            <ValueRow label="ID" value={seller.id} mono />
            <ValueRow label="Created" value={formatDate(seller.createdAt)} />
            <ValueRow label="Updated" value={formatDate(seller.updatedAt)} />
          </Section>
        ) : null}
        {seller ? (
          <DeleteSection
            label="Delete seller"
            message={`“${seller.name}” will be deleted. Channels assigned to it must be moved first.`}
            hidden={!can('DeleteSeller')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: seller.id })).deleteSeller);
              await invalidate(SellerListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
