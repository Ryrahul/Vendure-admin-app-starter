/**
 * API keys: list + create/edit form (name, roles, custom fields), rotate and delete.
 *
 * The secret returned by create/rotate is shown once (with a copy button) and then dropped.
 * It's held only in memory and never logged. Non-SuperAdmins may only grant their own roles.
 */
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  ActiveAdministratorRolesDocument,
  ApiKeyDetailDocument,
  ApiKeyListDocument,
  CreateApiKeyDocument,
  DeleteApiKeysDocument,
  RotateApiKeyDocument,
  UpdateApiKeyDocument,
} from '@/api/documents/api-keys';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { rolePicker } from '@/api/pickers/settings-a';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import type { ApiKeyDetailQuery, LanguageCode } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { roleLabel } from './roles';
import { MultiPickRow, SecretSection, useDirty, type Picked } from './settings-a/shared';

/** One-shot hand-off of a new key's secret from the create form to its detail screen. */
const freshSecrets = new Map<string, string>();

export function ApiKeyListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={ApiKeyListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { createdAt: 'DESC' as const },
          ...(term ? { filter: { _or: [{ name: { contains: term } }, { lookupId: { contains: term } }] } } : {}),
        },
      })}
      select={(r) => r.apiKeys}
      noun={['API key', 'API keys']}
      createHref={can('CreateApiKey') ? '/more/api-keys/new' : undefined}
      row={(k) => ({
        title: k.name,
        code: k.lookupId,
        subtitle: k.lastUsedAt ? `Last used ${formatDate(k.lastUsedAt)}` : 'Never used',
        onPress: () => router.push(`/more/api-keys/${k.id}`),
      })}
    />
  );
}

type ApiKey = NonNullable<ApiKeyDetailQuery['apiKey']>;

export function ApiKeyDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(ApiKeyDetailDocument, { id }, { enabled: id !== 'new' });
  // Lives above the (re-keyed) form so a refetch after rotating doesn't drop it.
  const [secret, setSecret] = useState<string | null>(() => freshSecrets.get(id) ?? null);
  useEffect(() => {
    freshSecrets.delete(id);
  }, [id]);

  if (id === 'new') return <ApiKeyForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.apiKey} noun="API key">
      {(apiKey) => (
        <ApiKeyForm
          key={apiKey.updatedAt}
          apiKey={apiKey}
          secret={secret}
          onSecret={setSecret}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function ApiKeyForm({
  apiKey,
  secret,
  onSecret,
  refetch,
  refreshing,
}: {
  apiKey?: ApiKey;
  secret?: string | null;
  onSecret?: (secret: string | null) => void;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { spacing } = useTheme();
  const { can } = usePermissions();
  const isSuperAdmin = can('SuperAdmin');
  const defs = useCustomFields('ApiKey');
  const invalidate = useInvalidate();
  const { channel } = useChannelInfo();
  const ownRoles = useVendureQuery(ActiveAdministratorRolesDocument, undefined, { enabled: !isSuperAdmin });
  const create = useVendureMutation(CreateApiKeyDocument);
  const update = useVendureMutation(UpdateApiKeyDocument);
  const rotate = useVendureMutation(RotateApiKeyDocument);
  const remove = useVendureMutation(DeleteApiKeysDocument);
  const { dirty, setDirty, edit } = useDirty();

  const language = (channel?.defaultLanguageCode ?? 'en') as LanguageCode;
  const translation = apiKey?.translations.find((t) => t.languageCode === language) ?? apiKey?.translations[0];

  const [name, setName] = useState(translation?.name ?? apiKey?.name ?? '');
  const [roles, setRoles] = useState<Picked[]>(apiKey?.user.roles.map((r) => ({ id: r.id, label: roleLabel(r) })) ?? []);
  const [cf, setCf] = useState(() => customFieldValues(defs, apiKey?.customFields));

  const canEdit = apiKey ? can('UpdateApiKey') : can('CreateApiKey');
  const roleOptions = isSuperAdmin
    ? undefined
    : (ownRoles.data?.activeAdministrator?.user.roles ?? []).map((r) => ({ id: r.id, title: roleLabel(r), code: r.code }));

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const { customFields } = customFieldsInput(defs, cf);
    const roleIds = roles.map((r) => r.id);
    try {
      if (apiKey) {
        const lang = (translation?.languageCode ?? language) as LanguageCode;
        await update.mutateAsync({
          input: { id: apiKey.id, roleIds, customFields, translations: [{ id: translation?.id, languageCode: lang, name: name.trim() }] },
        });
      } else {
        const res = await create.mutateAsync({
          input: { roleIds, customFields, translations: [{ languageCode: language, name: name.trim() }] },
        });
        freshSecrets.set(res.createApiKey.entityId, res.createApiKey.apiKey);
        router.replace(`/more/api-keys/${res.createApiKey.entityId}`);
      }
      setDirty(false);
      await invalidate(ApiKeyListDocument, ApiKeyDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  const doRotate = async () => {
    if (!apiKey || !onSecret) return;
    const ok = await confirm({
      title: 'Rotate API key?',
      message: 'A new secret is generated and the current one stops working immediately.',
      confirmLabel: 'Rotate',
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await rotate.mutateAsync({ id: apiKey.id });
      onSecret(res.rotateApiKey.apiKey);
      await invalidate(ApiKeyListDocument, ApiKeyDetailDocument);
    } catch (e) {
      alertError(e, 'Could not rotate');
    }
  };

  return (
    <>
      <SaveHeader
        title={apiKey?.name ?? 'New API key'}
        dirty={dirty}
        saving={create.isPending || update.isPending}
        onSave={save}
        label={apiKey ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        {secret && onSecret ? <SecretSection secret={secret} onDone={() => onSecret(null)} /> : null}
        <Section
          title="General"
          footer={apiKey ? undefined : 'The key’s secret is shown once, right after it is created.'}>
          <TextRow label="Name" value={name} onChangeText={edit(setName)} readOnly={!canEdit} autoFocus={!apiKey} />
        </Section>
        <Section title="Roles" footer={isSuperAdmin ? undefined : 'Only roles assigned to your account are available.'}>
          <MultiPickRow
            label="Roles"
            source={roleOptions ? undefined : rolePicker}
            options={roleOptions}
            value={roles}
            disabled={!canEdit}
            emptyLabel="No roles"
            onChange={edit(setRoles)}
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
        {apiKey ? (
          <Section title="Info">
            <ValueRow label="Lookup ID" value={apiKey.lookupId} mono />
            <ValueRow label="Created by" value={apiKey.owner.identifier} />
            <ValueRow label="Last used" value={apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt) : 'Never'} />
            <ValueRow label="Created" value={formatDate(apiKey.createdAt)} />
            <ValueRow label="Updated" value={formatDate(apiKey.updatedAt)} />
          </Section>
        ) : null}
        {apiKey && can('UpdateApiKey') ? (
          <Section footer="Rotating replaces the secret. Clients using the old key must be updated.">
            <View style={{ padding: spacing[3] }}>
              <Button title="Rotate key" variant="secondary" loading={rotate.isPending} onPress={doRotate} />
            </View>
          </Section>
        ) : null}
        {apiKey ? (
          <DeleteSection
            label="Delete API key"
            message={`“${apiKey.name}” will stop working immediately.`}
            hidden={!can('DeleteApiKey')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ ids: [apiKey.id] })).deleteApiKeys);
              await invalidate(ApiKeyListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
