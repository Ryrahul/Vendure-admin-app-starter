/**
 * Roles: list + create/edit form (code, description, channels, permission matrix) + delete.
 *
 * The matrix groups `serverConfig.permissions` like the web dashboard: CRUD permissions by
 * resource (Catalog, Product, Settings…) as Create/Read/Update/Delete toggles, and every
 * other assignable permission as a switch with its description. Only assignable
 * permissions are shown. The built-in super-admin and customer roles are read-only.
 */
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { humanize, customFieldsInput, customFieldValues } from '@/api/custom-fields';
import { channelLabel } from '@/api/documents/channels';
import {
  CreateRoleDocument,
  DeleteRoleDocument,
  PickRoleOptionsDocument,
  RoleDetailDocument,
  RoleListDocument,
  UpdateRoleDocument,
} from '@/api/documents/roles';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { channelPicker } from '@/api/pickers/settings-a';
import { useServerConfig, type ServerConfig } from '@/api/session';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import type { Permission, RoleDetailQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { MultiPickRow, TogglePill, useDirty, type Picked } from './settings-a/shared';

export const SUPER_ADMIN_ROLE = '__super_admin_role__';
export const CUSTOMER_ROLE = '__customer_role__';
const BUILT_IN = new Set([SUPER_ADMIN_ROLE, CUSTOMER_ROLE]);

export const roleLabel = (r: { code: string; description?: string | null }) =>
  r.code === SUPER_ADMIN_ROLE ? 'Super admin' : r.code === CUSTOMER_ROLE ? 'Customer' : r.description || r.code;

export function RoleListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={RoleListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { code: 'ASC' as const },
          ...(term ? { filter: { _or: [{ code: { contains: term } }, { description: { contains: term } }] } } : {}),
        },
      })}
      select={(r) => r.roles}
      noun={['role', 'roles']}
      createHref={can('CreateAdministrator') ? '/more/roles/new' : undefined}
      row={(r) => ({
        title: roleLabel(r),
        code: r.code,
        subtitle: `${r.permissions.length} permissions · ${r.channels.map((c) => channelLabel(c.code)).join(', ') || 'No channels'}`,
        trailing: BUILT_IN.has(r.code) ? <StatusBadge label="Built-in" tone="neutral" /> : undefined,
        onPress: () => router.push(`/more/roles/${r.id}`),
      })}
    />
  );
}

type Role = NonNullable<RoleDetailQuery['role']>;

export function RoleDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(RoleDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <RoleForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.role} noun="role">
      {(role) => <RoleForm key={role.updatedAt} role={role} refetch={() => void query.refetch()} refreshing={query.isRefetching} />}
    </QueryBoundary>
  );
}

function RoleForm({ role, refetch, refreshing }: { role?: Role; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('Role');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateRoleDocument);
  const update = useVendureMutation(UpdateRoleDocument);
  const remove = useVendureMutation(DeleteRoleDocument);
  const { dirty, setDirty, edit } = useDirty();

  const [code, setCode] = useState(role?.code ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [channels, setChannels] = useState<Picked[]>(role?.channels.map((c) => ({ id: c.id, label: channelLabel(c.code) })) ?? []);
  const [permissions, setPermissions] = useState<Set<string>>(() => new Set(role?.permissions ?? []));
  const [cf, setCf] = useState(() => customFieldValues(defs, role?.customFields));

  const builtIn = !!role && BUILT_IN.has(role.code);
  const canEdit = !builtIn && (role ? can('UpdateAdministrator') : can('CreateAdministrator'));

  const save = async () => {
    if (!code.trim()) return alertError(new Error('Code is required.'), 'Missing code');
    if (!description.trim()) return alertError(new Error('Description is required.'), 'Missing description');
    const { customFields } = customFieldsInput(defs, cf);
    const input = {
      code: code.trim(),
      description: description.trim(),
      permissions: [...permissions] as Permission[],
      channelIds: channels.map((c) => c.id),
      customFields,
    };
    try {
      if (role) {
        await update.mutateAsync({ input: { id: role.id, ...input } });
      } else {
        const res = await create.mutateAsync({ input });
        router.replace(`/more/roles/${res.createRole.id}`);
      }
      setDirty(false);
      await invalidate(RoleListDocument, RoleDetailDocument, PickRoleOptionsDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={role ? roleLabel(role) : 'New role'}
        dirty={dirty}
        saving={create.isPending || update.isPending}
        onSave={save}
        label={role ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General" footer={builtIn ? 'Built-in roles can’t be changed.' : undefined}>
          <TextRow
            label="Code"
            value={code}
            onChangeText={edit(setCode)}
            readOnly={!canEdit}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={!role}
          />
          <TextRow label="Description" value={description} onChangeText={edit(setDescription)} readOnly={!canEdit} />
          <MultiPickRow
            label="Channels"
            hint="The permissions apply in these channels."
            source={channelPicker}
            value={channels}
            disabled={!canEdit}
            onChange={edit(setChannels)}
          />
        </Section>

        <PermissionMatrix
          value={permissions}
          readOnly={!canEdit}
          onChange={(next) => {
            setPermissions(next);
            setDirty(true);
          }}
        />

        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {role ? (
          <Section title="Info">
            <ValueRow label="ID" value={role.id} mono />
            <ValueRow label="Created" value={formatDate(role.createdAt)} />
            <ValueRow label="Updated" value={formatDate(role.updatedAt)} />
          </Section>
        ) : null}
        {role ? (
          <DeleteSection
            label="Delete role"
            message={`“${role.code}” will be deleted and removed from every administrator and API key that has it.`}
            hidden={builtIn || !can('DeleteAdministrator')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: role.id })).deleteRole);
              await invalidate(RoleListDocument, PickRoleOptionsDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}

type PermissionDef = ServerConfig['permissions'][number];
const CRUD = ['Create', 'Read', 'Update', 'Delete'] as const;
const CRUD_RE = /^(Create|Read|Update|Delete)([A-Za-z]+)$/;

interface CrudGroup {
  resource: string;
  description: string;
  byOp: Partial<Record<(typeof CRUD)[number], PermissionDef>>;
}

/** Groups assignable permissions the way the web dashboard's `useGroupedPermissions` does. */
export function groupPermissions(defs: PermissionDef[]) {
  const groups = new Map<string, CrudGroup>();
  const other: PermissionDef[] = [];
  for (const def of defs) {
    if (!def.assignable) continue;
    const m = CRUD_RE.exec(def.name);
    if (m) {
      const op = m[1] as (typeof CRUD)[number];
      const g = groups.get(m[2]) ?? {
        resource: m[2],
        description: def.description.replace(/Grants permission to \w+/, 'Grants permissions on'),
        byOp: {},
      };
      g.byOp[op] = def;
      groups.set(m[2], g);
    } else other.push(def);
  }
  return {
    crud: [...groups.values()].sort((a, b) => a.resource.localeCompare(b.resource)),
    other: other.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function PermissionMatrix({
  value,
  onChange,
  readOnly,
}: {
  value: Set<string>;
  onChange: (next: Set<string>) => void;
  readOnly?: boolean;
}) {
  const { spacing } = useTheme();
  const serverConfig = useServerConfig();
  const { crud, other } = useMemo(() => groupPermissions(serverConfig?.permissions ?? []), [serverConfig?.permissions]);

  const toggle = (name: string) => {
    const next = new Set(value);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onChange(next);
  };
  const setMany = (names: string[], on: boolean) => {
    const next = new Set(value);
    for (const n of names) {
      if (on) next.add(n);
      else next.delete(n);
    }
    onChange(next);
  };
  const allNames = [...crud.flatMap((g) => Object.values(g.byOp).map((d) => d!.name)), ...other.map((d) => d.name)];
  const granted = allNames.filter((n) => value.has(n)).length;

  if (!serverConfig) {
    return (
      <Section title="Permissions">
        <ValueRow label="Permissions" value={`${value.size} granted`} />
      </Section>
    );
  }

  return (
    <>
      <Section
        title={`Permissions (${granted}/${allNames.length})`}
        action={
          readOnly ? undefined : (
            <Button
              size="sm"
              variant="ghost"
              title={granted === allNames.length ? 'Clear all' : 'Grant all'}
              onPress={() => setMany(allNames, granted !== allNames.length)}
            />
          )
        }>
        {crud.map((g) => {
          const names = Object.values(g.byOp).map((d) => d!.name);
          const all = names.every((n) => value.has(n));
          return (
            <View key={g.resource} style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[2] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium">{humanize(g.resource)}</Text>
                  <Text variant="caption" color="mutedForeground" numberOfLines={2}>
                    {g.description}
                  </Text>
                </View>
                {readOnly ? null : (
                  <Button size="sm" variant="ghost" title={all ? 'None' : 'All'} onPress={() => setMany(names, !all)} />
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                {CRUD.map((op) => {
                  const def = g.byOp[op];
                  if (!def) return <View key={op} style={{ flex: 1 }} />;
                  return (
                    <TogglePill
                      key={op}
                      label={op}
                      accessibilityLabel={def.name}
                      value={value.has(def.name)}
                      disabled={readOnly}
                      onToggle={() => toggle(def.name)}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </Section>
      {other.length ? (
        <Section title="Other permissions">
          {other.map((d) => (
            <SwitchRow
              key={d.name}
              label={humanize(d.name)}
              hint={d.description}
              value={value.has(d.name)}
              disabled={readOnly}
              onValueChange={() => toggle(d.name)}
            />
          ))}
        </Section>
      ) : null}
    </>
  );
}
