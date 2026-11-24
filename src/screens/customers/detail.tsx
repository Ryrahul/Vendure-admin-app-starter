/**
 * Customer detail (create when id === 'new'): general details, account verification, orders,
 * addresses, groups, custom fields, history with notes, info, delete.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AddCustomersToGroupDocument,
  CustomerGroupMembersDocument,
  RemoveCustomersFromGroupDocument,
} from '@/api/documents/customer-groups';
import {
  AddCustomerNoteDocument,
  CreateCustomerDocument,
  CustomerDetailDocument,
  CustomerHistoryDocument,
  CustomerListDocument,
  CustomerOrdersDocument,
  DeleteCustomerDocument,
  DeleteCustomerNoteDocument,
  UpdateCustomerDocument,
  UpdateCustomerNoteDocument,
  VerifyCustomerAccountDocument,
} from '@/api/documents/customers';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, unwrapResult, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { customerGroupPicker } from '@/api/pickers/common';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { OrderRow } from '@/components/order-row';
import { DeleteSection, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import type { CustomerDetailQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { customerName, formatDate } from '@/utils/format';
import { HistoryTimeline } from '@/screens/orders/history';
import { ActionBar, addressLines } from '@/screens/orders/parts';

import { CustomerStatusBadge } from './list';

type Customer = NonNullable<CustomerDetailQuery['customer']>;

export function CustomerDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(CustomerDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <CustomerForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.customer} noun="customer">
      {(customer) => (
        <CustomerForm
          key={customer.updatedAt}
          customer={customer}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function CustomerForm({
  customer,
  refetch,
  refreshing,
}: {
  customer?: Customer;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { can } = usePermissions();
  const defs = useCustomFields('Customer');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateCustomerDocument);
  const update = useVendureMutation(UpdateCustomerDocument);
  const remove = useVendureMutation(DeleteCustomerDocument);

  const [title, setTitle] = useState(customer?.title ?? '');
  const [firstName, setFirstName] = useState(customer?.firstName ?? '');
  const [lastName, setLastName] = useState(customer?.lastName ?? '');
  const [emailAddress, setEmailAddress] = useState(customer?.emailAddress ?? '');
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber ?? '');
  const [password, setPassword] = useState('');
  const [cf, setCf] = useState(() => customFieldValues(defs, customer?.customFields));
  const [dirty, setDirty] = useState(false);
  const edit = (set: (v: string) => void) => (v: string) => {
    set(v);
    setDirty(true);
  };

  const canEdit = customer ? can('UpdateCustomer') : can('CreateCustomer');
  const saving = create.isPending || update.isPending;

  const save = async () => {
    if (!firstName.trim() || !lastName.trim() || !emailAddress.trim()) {
      return alertError(new Error('First name, last name and email are required.'), 'Missing details');
    }
    const input = {
      title: title.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailAddress: emailAddress.trim(),
      phoneNumber: phoneNumber.trim(),
      customFields: customFieldsInput(defs, cf).customFields,
    };
    try {
      if (customer) {
        unwrapResult((await update.mutateAsync({ input: { id: customer.id, ...input } })).updateCustomer);
      } else {
        const res = unwrapResult((await create.mutateAsync({ input, password: password || undefined })).createCustomer);
        if (res.__typename === 'Customer') router.replace(`/customers/${res.id}`);
      }
      setDirty(false);
      await invalidate(CustomerListDocument, CustomerDetailDocument, CustomerHistoryDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={customer ? customerName(customer) : 'New customer'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={customer ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow
            label="First name"
            value={firstName}
            onChangeText={edit(setFirstName)}
            readOnly={!canEdit}
            autoFocus={!customer}
            textContentType="givenName"
          />
          <TextRow
            label="Last name"
            value={lastName}
            onChangeText={edit(setLastName)}
            readOnly={!canEdit}
            textContentType="familyName"
          />
          <TextRow
            label="Email"
            value={emailAddress}
            onChangeText={edit(setEmailAddress)}
            readOnly={!canEdit}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <TextRow
            label="Phone"
            value={phoneNumber}
            onChangeText={edit(setPhoneNumber)}
            readOnly={!canEdit}
            keyboardType="phone-pad"
          />
          <TextRow
            label="Title"
            value={title}
            onChangeText={edit(setTitle)}
            readOnly={!canEdit}
            placeholder="Mr, Ms, Dr…"
          />
          {!customer ? (
            <TextRow
              label="Password (optional)"
              hint="With a password the customer is registered and verified. Without one they are a guest."
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          ) : null}
        </Section>
        {customer ? (
          <>
            <AccountSection customer={customer} canEdit={can('UpdateCustomer')} />
            <OrdersSection customerId={customer.id} />
            <AddressesSection customer={customer} canEdit={can('UpdateCustomer')} />
            <GroupsSection customer={customer} canEdit={can('UpdateCustomerGroup')} />
          </>
        ) : null}
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {customer ? (
          <>
            <CustomerHistory customerId={customer.id} canNote={can('UpdateCustomer')} />
            <Section title="Info">
              <ValueRow label="ID" value={customer.id} mono />
              <ValueRow label="Created" value={formatDate(customer.createdAt)} />
              <ValueRow label="Updated" value={formatDate(customer.updatedAt)} />
            </Section>
            <DeleteSection
              label="Delete customer"
              message={`${customerName(customer)} (${customer.emailAddress}) will be deleted.`}
              hidden={!can('DeleteCustomer')}
              onDelete={async () => {
                assertDeleted((await remove.mutateAsync({ id: customer.id })).deleteCustomer);
                await invalidate(CustomerListDocument);
              }}
            />
          </>
        ) : null}
      </FormScroll>
    </>
  );
}

function AccountSection({ customer, canEdit }: { customer: Customer; canEdit: boolean }) {
  const invalidate = useInvalidate();
  const verify = useVendureMutation(VerifyCustomerAccountDocument);
  const [password, setPassword] = useState('');
  const user = customer.user;
  return (
    <Section title="Account">
      <ListRow
        title={user ? user.identifier : 'Guest'}
        subtitle={
          user
            ? user.lastLogin
              ? `Last login ${formatDate(user.lastLogin)}`
              : 'Never logged in'
            : 'No storefront account'
        }
        trailing={<CustomerStatusBadge user={user} />}
      />
      {user && !user.verified && canEdit ? (
        <View>
          <TextRow
            label="Password"
            hint="Needed when the customer registered without one."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <ActionBar>
            <Button
              title="Verify account"
              size="sm"
              loading={verify.isPending}
              onPress={async () => {
                if (
                  !(await confirm({
                    title: 'Verify account?',
                    message: `${customer.emailAddress} will be able to log in.`,
                    confirmLabel: 'Verify',
                  }))
                )
                  return;
                try {
                  unwrapResult(
                    (await verify.mutateAsync({ id: customer.id, password: password || undefined }))
                      .verifyCustomerAccount,
                  );
                  await invalidate(CustomerDetailDocument, CustomerListDocument, CustomerHistoryDocument);
                } catch (e) {
                  alertError(e, 'Could not verify');
                }
              }}
            />
          </ActionBar>
        </View>
      ) : null}
    </Section>
  );
}

function AddressesSection({ customer, canEdit }: { customer: Customer; canEdit: boolean }) {
  const { spacing } = useTheme();
  const addresses = customer.addresses ?? [];
  return (
    <Section title={`Addresses (${addresses.length})`}>
      {addresses.length === 0 ? (
        <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
          No addresses.
        </Text>
      ) : null}
      {addresses.map((a) => (
        <ListRow
          key={a.id}
          title={a.fullName || a.streetLine1}
          subtitle={addressLines({ ...a, fullName: null, country: a.country.name }).join(', ')}
          trailing={
            a.defaultShippingAddress || a.defaultBillingAddress ? (
              <View style={{ gap: spacing[1], alignItems: 'flex-end' }}>
                {a.defaultShippingAddress ? <StatusBadge label="Shipping" tone="info" /> : null}
                {a.defaultBillingAddress ? <StatusBadge label="Billing" tone="info" /> : null}
              </View>
            ) : undefined
          }
          onPress={() =>
            router.push({ pathname: '/customers/address/[id]', params: { id: a.id, customerId: customer.id } })
          }
        />
      ))}
      {canEdit ? (
        <ActionBar>
          <Button
            title="Add address"
            size="sm"
            variant="secondary"
            onPress={() =>
              router.push({ pathname: '/customers/address/[id]', params: { id: 'new', customerId: customer.id } })
            }
          />
        </ActionBar>
      ) : null}
    </Section>
  );
}

function OrdersSection({ customerId }: { customerId: string }) {
  const { spacing } = useTheme();
  const { precision } = useChannelInfo();
  const [take, setTake] = useState(10);
  const query = useVendureQuery(CustomerOrdersDocument, {
    customerId,
    options: { take, sort: { updatedAt: 'DESC' as const }, filter: { active: { eq: false } } },
  });
  const page = query.data?.customer?.orders;
  if (query.error && !page) return <InlineError message={query.error.message} />;
  return (
    <Section title={`Orders (${page?.totalItems ?? 0})`}>
      {page && page.items.length === 0 ? (
        <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
          No orders yet.
        </Text>
      ) : null}
      {(page?.items ?? []).map((o) => (
        <OrderRow key={o.id} order={o} precision={precision} />
      ))}
      {page && page.items.length < page.totalItems ? (
        <ActionBar>
          <Button title="Show more" size="sm" variant="ghost" onPress={() => setTake((t) => t + 10)} />
        </ActionBar>
      ) : null}
    </Section>
  );
}

function GroupsSection({ customer, canEdit }: { customer: Customer; canEdit: boolean }) {
  const { spacing } = useTheme();
  const invalidate = useInvalidate();
  const add = useVendureMutation(AddCustomersToGroupDocument);
  const remove = useVendureMutation(RemoveCustomersFromGroupDocument);
  const [busy, setBusy] = useState(false);
  const refresh = () => invalidate(CustomerDetailDocument, CustomerHistoryDocument, CustomerGroupMembersDocument);

  return (
    <Section title={`Groups (${customer.groups.length})`}>
      {customer.groups.length === 0 ? (
        <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
          Not in any group.
        </Text>
      ) : null}
      {customer.groups.map((g) => (
        <ListRow
          key={g.id}
          title={g.name}
          onPress={() => router.push(`/customers/groups/${g.id}`)}
          trailing={
            canEdit ? (
              <Button
                title="Remove"
                size="sm"
                variant="ghost"
                onPress={async () => {
                  if (
                    !(await confirm({ title: `Remove from “${g.name}”?`, confirmLabel: 'Remove', destructive: true }))
                  )
                    return;
                  try {
                    await remove.mutateAsync({ customerGroupId: g.id, customerIds: [customer.id] });
                    await refresh();
                  } catch (e) {
                    alertError(e, 'Could not remove from group');
                  }
                }}
              />
            ) : undefined
          }
        />
      ))}
      {canEdit ? (
        <ActionBar>
          <Button
            title="Edit groups"
            size="sm"
            variant="secondary"
            loading={busy}
            onPress={async () => {
              const current = customer.groups.map((g) => g.id);
              const picked = await openPicker({
                title: 'Groups',
                source: customerGroupPicker,
                multiple: true,
                selected: current,
                selectedItems: customer.groups.map((g) => ({ id: g.id, title: g.name })),
              });
              if (!picked) return;
              const pickedIds = picked.map((p) => p.id);
              const added = picked.filter((p) => !current.includes(p.id));
              const removed = customer.groups.filter((g) => !pickedIds.includes(g.id));
              if (!added.length && !removed.length) return;
              if (
                removed.length &&
                !(await confirm({
                  title: `Remove from ${removed.length === 1 ? `“${removed[0].name}”` : `${removed.length} groups`}?`,
                  message: removed.map((g) => g.name).join(', '),
                  confirmLabel: 'Remove',
                  destructive: true,
                }))
              )
                return;
              setBusy(true);
              try {
                for (const g of added) await add.mutateAsync({ customerGroupId: g.id, customerIds: [customer.id] });
                for (const g of removed)
                  await remove.mutateAsync({ customerGroupId: g.id, customerIds: [customer.id] });
                await refresh();
              } catch (e) {
                await refresh();
                alertError(e, 'Could not update groups');
              } finally {
                setBusy(false);
              }
            }}
          />
        </ActionBar>
      ) : null}
    </Section>
  );
}

function CustomerHistory({ customerId, canNote }: { customerId: string; canNote: boolean }) {
  const [take, setTake] = useState(50);
  const history = useVendureQuery(CustomerHistoryDocument, {
    id: customerId,
    options: { take, sort: { createdAt: 'DESC' as const } },
  });
  const invalidate = useInvalidate();
  const add = useVendureMutation(AddCustomerNoteDocument);
  const update = useVendureMutation(UpdateCustomerNoteDocument);
  const remove = useVendureMutation(DeleteCustomerNoteDocument);
  const refresh = () => invalidate(CustomerHistoryDocument);
  const page = history.data?.customer?.history;
  if (history.error && !page) return <InlineError message={history.error.message} />;
  return (
    <HistoryTimeline
      entries={page?.items ?? []}
      totalItems={page?.totalItems ?? 0}
      meId={history.data?.activeAdministrator?.id}
      canNote={canNote}
      onLoadMore={() => setTake((t) => t + 50)}
      onAdd={async (note, isPublic) => {
        await add.mutateAsync({ input: { id: customerId, note, isPublic } });
        await refresh();
      }}
      onUpdate={async (noteId, note) => {
        await update.mutateAsync({ input: { noteId, note } });
        await refresh();
      }}
      onDelete={async (noteId) => {
        assertDeleted((await remove.mutateAsync({ id: noteId })).deleteCustomerNote);
        await refresh();
      }}
    />
  );
}
