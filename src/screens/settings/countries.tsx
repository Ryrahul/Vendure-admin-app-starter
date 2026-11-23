/**
 * Countries: searchable paginated list (~250 rows), create/edit (code, translated name,
 * enabled, custom fields), delete.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CountryDetailDocument,
  CountryListDocument,
  CreateCountryDocument,
  DeleteCountryDocument,
  UpdateCountryDocument,
} from '@/api/documents/countries';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { useChannelInfo } from '@/api/use-channel-info';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FilterChips, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { CountryDetailQuery, LanguageCode } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

const canCreate = (can: (...p: string[]) => boolean) => can('CreateSettings', 'CreateCountry');

type EnabledFilter = 'all' | 'enabled' | 'disabled';

export function CountryListScreen() {
  const { can } = usePermissions();
  const [filter, setFilter] = useState<EnabledFilter>('all');
  return (
    <EntityListScreen
      document={CountryListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { name: 'ASC' as const },
          filter: {
            ...(filter === 'all' ? {} : { enabled: { eq: filter === 'enabled' } }),
            ...(term ? { _or: [{ name: { contains: term } }, { code: { contains: term } }] } : {}),
          },
        },
      })}
      select={(r) => r.countries}
      noun={['country', 'countries']}
      searchPlaceholder="Search by name or code"
      keyExtra={filter}
      filters={
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'enabled', label: 'Enabled' },
            { value: 'disabled', label: 'Disabled' },
          ]}
        />
      }
      createHref={canCreate(can) ? '/more/countries/new' : undefined}
      row={(c) => ({
        title: c.name,
        code: c.code,
        trailing: c.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />,
        onPress: () => router.push(`/more/countries/${c.id}`),
      })}
    />
  );
}

type Country = NonNullable<CountryDetailQuery['country']>;

export function CountryDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(CountryDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <CountryForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.country} noun="country">
      {(country) => (
        <CountryForm key={country.updatedAt} country={country} refetch={() => void query.refetch()} refreshing={query.isRefetching} />
      )}
    </QueryBoundary>
  );
}

function CountryForm({ country, refetch, refreshing }: { country?: Country; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const { channel } = useChannelInfo();
  // Country custom fields are configured on `Region` in Vendure 3; useCustomFields resolves the alias.
  const defs = useCustomFields('Country');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateCountryDocument);
  const update = useVendureMutation(UpdateCountryDocument);
  const remove = useVendureMutation(DeleteCountryDocument);

  const translation = country?.translations.find((t) => t.languageCode === country.languageCode) ?? country?.translations[0];
  const languageCode = (translation?.languageCode ?? channel?.defaultLanguageCode ?? 'en') as LanguageCode;

  const [code, setCode] = useState(country?.code ?? '');
  const [name, setName] = useState(translation?.name ?? country?.name ?? '');
  const [enabled, setEnabled] = useState(country?.enabled ?? true);
  const [cf, setCf] = useState(() => customFieldValues(defs, country?.customFields, translation as { customFields?: unknown } | undefined));
  const [dirty, setDirty] = useState(false);
  const edit = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };

  const canEdit = country ? can('UpdateSettings', 'UpdateCountry') : canCreate(can);
  const saving = create.isPending || update.isPending;

  const save = async () => {
    const problems: string[] = [];
    if (!code.trim()) problems.push('Code is required.');
    if (!name.trim()) problems.push('Name is required.');
    if (problems.length) return alertError(new Error(problems.join('\n')), 'Check the form');
    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const translations = [
      {
        ...(translation?.id ? { id: translation.id } : {}),
        languageCode,
        name: name.trim(),
        ...(translationCustomFields ? { customFields: translationCustomFields } : {}),
      },
    ];
    try {
      if (country) {
        await update.mutateAsync({ input: { id: country.id, code: code.trim(), enabled, translations, customFields } });
      } else {
        const res = await create.mutateAsync({ input: { code: code.trim(), enabled, translations, customFields } });
        router.replace(`/more/countries/${res.createCountry.id}`);
      }
      setDirty(false);
      await invalidate(CountryListDocument, CountryDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={country?.name ?? 'New country'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={country ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow label={`Name (${languageCode})`} value={name} onChangeText={edit(setName)} readOnly={!canEdit} autoFocus={!country} />
          <TextRow
            label="Code"
            hint="ISO 3166-1 alpha-2, e.g. GB"
            value={code}
            onChangeText={edit(setCode)}
            readOnly={!canEdit}
            autoCapitalize="characters"
            autoCorrect={false}
            mono
          />
          <SwitchRow
            label="Enabled"
            hint="Disabled countries can't be chosen for addresses in the storefront."
            value={enabled}
            disabled={!canEdit}
            onValueChange={edit(setEnabled)}
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
        {country ? (
          <Section title="Info">
            <ValueRow label="ID" value={country.id} mono />
            <ValueRow label="Created" value={formatDate(country.createdAt)} />
            <ValueRow label="Updated" value={formatDate(country.updatedAt)} />
          </Section>
        ) : null}
        {country ? (
          <DeleteSection
            label="Delete country"
            message={`“${country.name}” will be deleted and removed from every zone. Addresses using it may break.`}
            hidden={!can('DeleteSettings', 'DeleteCountry')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: country.id })).deleteCountry);
              await invalidate(CountryListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
