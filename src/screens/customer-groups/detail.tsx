/** Customer group detail (create when id === 'new'): name, custom fields, members (add / remove), delete. */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AddCustomersToGroupDocument,
  CreateCustomerGroupDocument,
  CustomerGroupDetailDocument,
  CustomerGroupListDocument,
  CustomerGroupMembersDocument,
  DeleteCustomerGroupDocument,
  RemoveCustomersFromGroupDocument,
  UpdateCustomerGroupDocument,
} from '@/api/documents/customer-groups';
import { CustomerDetailDocument } from '@/api/documents/customers';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { customerPicker } from '@/api/pickers/common';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { DeleteSection, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import type { CustomerGroupDetailQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { customerName, formatDate } from '@/utils/format';
import { ActionBar } from '@/screens/orders/parts';

type Group = NonNullable<CustomerGroupDetailQuery['customerGroup']>;

export function CustomerGroupDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(CustomerGroupDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <GroupForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.customerGroup} noun="customer group">
      {(group) => (
        <GroupForm
          key={group.updatedAt}
          group={group}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function GroupForm({ group, refetch, refreshing }: { group?: Group; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('CustomerGroup');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateCustomerGroupDocument);
  const update = useVendureMutation(UpdateCustomerGroupDocument);
  const remove = useVendureMutation(DeleteCustomerGroupDocument);

  const [name, setName] = useState(group?.name ?? '');
  const [cf, setCf] = useState(() => customFieldValues(defs, group?.customFields));
  const [dirty, setDirty] = useState(false);
  const canEdit = group ? can('UpdateCustomerGroup') : can('CreateCustomerGroup');

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const { customFields } = customFieldsInput(defs, cf);
    try {
      if (group) {
        await update.mutateAsync({ input: { id: group.id, name: name.trim(), customFields } });
      } else {
        const res = await create.mutateAsync({ input: { name: name.trim(), customFields } });
        router.replace(`/customers/groups/${res.createCustomerGroup.id}`);
      }
      setDirty(false);
      await invalidate(CustomerGroupListDocument, CustomerGroupDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={group?.name ?? 'New customer group'}
        dirty={dirty}
        saving={create.isPending || update.isPending}
        onSave={save}
        label={group ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow
            label="Name"
            value={name}
            onChangeText={(v) => {
              setName(v);
              setDirty(true);
            }}
            readOnly={!canEdit}
            autoFocus={!group}
          />
        </Section>
        {group ? <Members groupId={group.id} canEdit={can('UpdateCustomerGroup')} /> : null}
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {group ? (
          <Section title="Info">
            <ValueRow label="ID" value={group.id} mono />
            <ValueRow label="Created" value={formatDate(group.createdAt)} />
            <ValueRow label="Updated" value={formatDate(group.updatedAt)} />
          </Section>
        ) : null}
        {group ? (
          <DeleteSection
            label="Delete customer group"
            message={`“${group.name}” will be deleted. Its members stay as customers.`}
            hidden={!can('DeleteCustomerGroup')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: group.id })).deleteCustomerGroup);
              await invalidate(CustomerGroupListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}

function Members({ groupId, canEdit }: { groupId: string; canEdit: boolean }) {
  const { spacing } = useTheme();
  const [take, setTake] = useState(50);
  const query = useVendureQuery(CustomerGroupMembersDocument, {
    id: groupId,
    options: { take, sort: { lastName: 'ASC' as const } },
  });
  const invalidate = useInvalidate();
  const add = useVendureMutation(AddCustomersToGroupDocument);
  const remove = useVendureMutation(RemoveCustomersFromGroupDocument);
  const page = query.data?.customerGroup?.customers;
  const refresh = () => invalidate(CustomerGroupMembersDocument, CustomerGroupListDocument, CustomerDetailDocument);

  if (query.error && !page) return <InlineError message={query.error.message} />;
  return (
    <Section title={`Members (${page?.totalItems ?? 0})`}>
      {page && page.items.length === 0 ? (
        <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
          No members yet.
        </Text>
      ) : null}
      {(page?.items ?? []).map((c) => (
        <ListRow
          key={c.id}
          title={customerName(c)}
          subtitle={c.emailAddress}
          onPress={() => router.push(`/customers/${c.id}`)}
          trailing={
            canEdit ? (
              <Button
                title="Remove"
                size="sm"
                variant="ghost"
                onPress={async () => {
                  if (
                    !(await confirm({
                      title: `Remove ${customerName(c)}?`,
                      message: 'They stay a customer, just not in this group.',
                      confirmLabel: 'Remove',
                      destructive: true,
                    }))
                  )
                    return;
                  try {
                    await remove.mutateAsync({ customerGroupId: groupId, customerIds: [c.id] });
                    await refresh();
                  } catch (e) {
                    alertError(e, 'Could not remove member');
                  }
                }}
              />
            ) : undefined
          }
        />
      ))}
      {canEdit || (page && page.items.length < page.totalItems) ? (
        <ActionBar>
          {canEdit ? (
            <Button
              title="Add members"
              size="sm"
              variant="secondary"
              loading={add.isPending}
              onPress={async () => {
                const picked = await openPicker({ title: 'Add members', source: customerPicker, multiple: true });
                const existing = new Set((page?.items ?? []).map((c) => c.id));
                const ids = (picked ?? []).map((p) => p.id).filter((pid) => !existing.has(pid));
                if (!ids.length) return;
                try {
                  await add.mutateAsync({ customerGroupId: groupId, customerIds: ids });
                  await refresh();
                } catch (e) {
                  alertError(e, 'Could not add members');
                }
              }}
            />
          ) : null}
          {page && page.items.length < page.totalItems ? (
            <Button title="Show more" size="sm" variant="ghost" onPress={() => setTake((t) => t + 50)} />
          ) : null}
        </ActionBar>
      ) : null}
    </Section>
  );
}
