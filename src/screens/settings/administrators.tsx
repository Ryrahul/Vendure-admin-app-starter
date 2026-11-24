/**
 * Administrators: list + create/edit form (name, email/identifier, password, roles, custom
 * fields) + delete. The signed-in administrator can't delete themselves.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AdministratorDetailDocument,
  AdministratorListDocument,
  CreateAdministratorDocument,
  DeleteAdministratorDocument,
  UpdateAdministratorDocument,
} from '@/api/documents/administrators';
import { CurrentUserDocument } from '@/api/documents/auth';
import { channelLabel } from '@/api/documents/channels';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { rolePicker } from '@/api/pickers/settings-a';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { AdministratorDetailQuery } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { roleLabel } from './roles';
import { MultiPickRow, useDirty, type Picked } from './settings-a/shared';

const fullName = (a: { firstName: string; lastName: string }) => `${a.firstName} ${a.lastName}`.trim();

export function AdministratorListScreen() {
  const { can } = usePermissions();
  const me = useVendureQuery(CurrentUserDocument);
  const myId = me.data?.activeAdministrator?.id;
  return (
    <EntityListScreen
      document={AdministratorListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { lastName: 'ASC' as const },
          ...(term
            ? {
                filter: {
                  _or: [
                    { emailAddress: { contains: term } },
                    { firstName: { contains: term } },
                    { lastName: { contains: term } },
                  ],
                },
              }
            : {}),
        },
      })}
      select={(r) => r.administrators}
      noun={['administrator', 'administrators']}
      createHref={can('CreateAdministrator') ? '/more/administrators/new' : undefined}
      row={(a) => ({
        title: fullName(a) || a.emailAddress,
        subtitle: [a.emailAddress, a.user.roles.map((r) => roleLabel(r)).join(', ')].filter(Boolean).join(' · '),
        trailing: a.id === myId ? <StatusBadge label="You" tone="info" /> : undefined,
        onPress: () => router.push(`/more/administrators/${a.id}`),
      })}
    />
  );
}

type Administrator = NonNullable<AdministratorDetailQuery['administrator']>;

export function AdministratorDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(AdministratorDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <AdministratorForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.administrator} noun="administrator">
      {(admin) => (
        <AdministratorForm
          key={admin.updatedAt}
          admin={admin}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function AdministratorForm({
  admin,
  refetch,
  refreshing,
}: {
  admin?: Administrator;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { can } = usePermissions();
  const defs = useCustomFields('Administrator');
  const invalidate = useInvalidate();
  const me = useVendureQuery(CurrentUserDocument);
  const create = useVendureMutation(CreateAdministratorDocument);
  const update = useVendureMutation(UpdateAdministratorDocument);
  const remove = useVendureMutation(DeleteAdministratorDocument);
  const { dirty, setDirty, edit } = useDirty();

  const [firstName, setFirstName] = useState(admin?.firstName ?? '');
  const [lastName, setLastName] = useState(admin?.lastName ?? '');
  const [email, setEmail] = useState(admin?.emailAddress ?? '');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<Picked[]>(admin?.user.roles.map((r) => ({ id: r.id, label: roleLabel(r) })) ?? []);
  const [cf, setCf] = useState(() => customFieldValues(defs, admin?.customFields));

  const isMe = !!admin && admin.id === me.data?.activeAdministrator?.id;
  const canEdit = admin ? can('UpdateAdministrator') : can('CreateAdministrator');

  const save = async () => {
    if (!firstName.trim() || !lastName.trim())
      return alertError(new Error('First and last name are required.'), 'Missing name');
    if (!email.trim()) return alertError(new Error('Email address is required.'), 'Missing email');
    if (!admin && !password)
      return alertError(new Error('Set a password for the new administrator.'), 'Missing password');
    const { customFields } = customFieldsInput(defs, cf);
    const base = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailAddress: email.trim(),
      roleIds: roles.map((r) => r.id),
      customFields,
    };
    try {
      if (admin) {
        await update.mutateAsync({ input: { id: admin.id, ...base, ...(password ? { password } : {}) } });
      } else {
        const res = await create.mutateAsync({ input: { ...base, password } });
        router.replace(`/more/administrators/${res.createAdministrator.id}`);
      }
      setPassword('');
      setDirty(false);
      await invalidate(AdministratorListDocument, AdministratorDetailDocument, ...(isMe ? [CurrentUserDocument] : []));
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={admin ? fullName(admin) || admin.emailAddress : 'New administrator'}
        dirty={dirty}
        saving={create.isPending || update.isPending}
        onSave={save}
        label={admin ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow
            label="First name"
            value={firstName}
            onChangeText={edit(setFirstName)}
            readOnly={!canEdit}
            autoFocus={!admin}
          />
          <TextRow label="Last name" value={lastName} onChangeText={edit(setLastName)} readOnly={!canEdit} />
          <TextRow
            label="Email address"
            hint="Also the sign-in identifier."
            value={email}
            onChangeText={edit(setEmail)}
            readOnly={!canEdit}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
          />
          {canEdit ? (
            <TextRow
              label={admin ? 'New password' : 'Password'}
              hint={admin ? 'Leave empty to keep the current password.' : undefined}
              value={password}
              onChangeText={edit(setPassword)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
            />
          ) : null}
        </Section>

        <Section title="Roles" footer={isMe ? 'Removing your own roles can lock you out of this screen.' : undefined}>
          <MultiPickRow
            label="Roles"
            source={rolePicker}
            value={roles}
            disabled={!canEdit}
            emptyLabel="No roles"
            onChange={edit(setRoles)}
          />
          {admin?.user.roles.map((r) => (
            <ValueRow key={r.id} label={roleLabel(r)} value={r.channels.map((c) => channelLabel(c.code)).join(', ')} />
          ))}
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
        {admin ? (
          <Section title="Info">
            <ValueRow label="ID" value={admin.id} mono />
            <ValueRow label="Last sign-in" value={admin.user.lastLogin ? formatDate(admin.user.lastLogin) : 'Never'} />
            <ValueRow label="Created" value={formatDate(admin.createdAt)} />
            <ValueRow label="Updated" value={formatDate(admin.updatedAt)} />
          </Section>
        ) : null}
        {admin ? (
          <DeleteSection
            label="Delete administrator"
            message={`${fullName(admin) || admin.emailAddress} will lose access to this server.`}
            hidden={isMe || !me.data || !can('DeleteAdministrator')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: admin.id })).deleteAdministrator);
              await invalidate(AdministratorListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
