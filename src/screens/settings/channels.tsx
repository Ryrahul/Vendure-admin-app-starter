/**
 * Channels: list + create/edit form (code, token, seller, languages, currencies, tax, default
 * zones, stock settings, custom fields) + delete. The default channel can't be deleted.
 *
 * The session loads the admin's channel list at sign-in, so a channel created or deleted
 * here only shows up in the More tab's channel switcher after signing in again.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  ChannelDetailDocument,
  ChannelListDocument,
  channelLabel,
  CreateChannelDocument,
  DEFAULT_CHANNEL_CODE,
  DeleteChannelDocument,
  UpdateChannelDocument,
} from '@/api/documents/channels';
import { GlobalSettingsDetailDocument } from '@/api/documents/global-settings';
import { PickChannelOptionsDocument } from '@/api/documents/roles';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, unwrapResult, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { sellerPicker, zonePicker } from '@/api/pickers/settings-a';
import { useServerConfig } from '@/api/session';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { NumberRow, SelectRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { ChannelDetailQuery, CurrencyCode, LanguageCode } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { currencyName, currencyOptions, languageName, languageOptions } from './settings-a/codes';
import { MultiPickRow, PickRow, useDirty, type Picked } from './settings-a/shared';

const RELOGIN_HINT = 'Sign out and in again to see the change in the channel switcher.';

export function ChannelListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={ChannelListDocument}
      variables={(term, skip, take) => ({
        options: { skip, take, sort: { code: 'ASC' as const }, ...(term ? { filter: { code: { contains: term } } } : {}) },
      })}
      select={(r) => r.channels}
      noun={['channel', 'channels']}
      createHref={can('CreateChannel') ? '/more/channels/new' : undefined}
      row={(c) => ({
        title: channelLabel(c.code),
        subtitle: [c.seller?.name, c.defaultCurrencyCode, c.defaultLanguageCode.toUpperCase(), c.pricesIncludeTax ? 'incl. tax' : null]
          .filter(Boolean)
          .join(' · '),
        trailing: c.code === DEFAULT_CHANNEL_CODE ? <StatusBadge label="Default" tone="info" /> : undefined,
        onPress: () => router.push(`/more/channels/${c.id}`),
      })}
    />
  );
}

type Channel = NonNullable<ChannelDetailQuery['channel']>;

export function ChannelDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(ChannelDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <ChannelForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.channel} noun="channel">
      {(channel) => (
        <ChannelForm key={channel.updatedAt} channel={channel} refetch={() => void query.refetch()} refreshing={query.isRefetching} />
      )}
    </QueryBoundary>
  );
}

const randomToken = () =>
  Array.from({ length: 20 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

const zone = (z?: { id: string; name: string } | null): Picked | null => (z ? { id: z.id, label: z.name } : null);

function ChannelForm({ channel, refetch, refreshing }: { channel?: Channel; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('Channel');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateChannelDocument);
  const update = useVendureMutation(UpdateChannelDocument);
  const remove = useVendureMutation(DeleteChannelDocument);
  const { dirty, setDirty, edit } = useDirty();
  const serverConfig = useServerConfig();
  const settings = useVendureQuery(GlobalSettingsDetailDocument);
  const globalLanguages: string[] = settings.data?.globalSettings.availableLanguages ?? serverConfig?.availableLanguages ?? ['en'];

  const [code, setCode] = useState(channel?.code ?? '');
  const [token, setToken] = useState(channel?.token ?? randomToken());
  const [seller, setSeller] = useState<Picked | null>(channel?.seller ? { id: channel.seller.id, label: channel.seller.name } : null);
  const [defaultLanguage, setDefaultLanguage] = useState<string>(channel?.defaultLanguageCode ?? globalLanguages[0] ?? 'en');
  const [languages, setLanguages] = useState<string[]>(
    channel?.availableLanguageCodes ?? [channel?.defaultLanguageCode ?? globalLanguages[0] ?? 'en'],
  );
  const [defaultCurrency, setDefaultCurrency] = useState<string | null>(channel?.defaultCurrencyCode ?? null);
  const [currencies, setCurrencies] = useState<string[]>(channel?.availableCurrencyCodes ?? []);
  const [pricesIncludeTax, setPricesIncludeTax] = useState(channel?.pricesIncludeTax ?? false);
  const [shippingZone, setShippingZone] = useState(zone(channel?.defaultShippingZone));
  const [taxZone, setTaxZone] = useState(zone(channel?.defaultTaxZone));
  const [trackInventory, setTrackInventory] = useState(channel?.trackInventory ?? false);
  const [threshold, setThreshold] = useState<number | null>(channel?.outOfStockThreshold ?? 0);
  const [cf, setCf] = useState(() => customFieldValues(defs, channel?.customFields));

  const isDefault = channel?.code === DEFAULT_CHANNEL_CODE;
  const canEdit = channel ? can('UpdateChannel') : can('CreateChannel');
  const languageChoices = [...new Set([...globalLanguages, ...languages])];

  const save = async () => {
    if (!code.trim()) return alertError(new Error('Code is required.'), 'Missing code');
    if (!token.trim()) return alertError(new Error('Token is required.'), 'Missing token');
    if (!defaultCurrency) return alertError(new Error('Choose a default currency.'), 'Missing currency');
    if (!taxZone || !shippingZone) return alertError(new Error('Choose the default tax and shipping zones.'), 'Missing zones');
    const { customFields } = customFieldsInput(defs, cf);
    const input = {
      code: code.trim(),
      token: token.trim(),
      defaultLanguageCode: defaultLanguage as LanguageCode,
      availableLanguageCodes: [...new Set([defaultLanguage, ...languages])] as LanguageCode[],
      defaultCurrencyCode: defaultCurrency as CurrencyCode,
      availableCurrencyCodes: [...new Set([defaultCurrency, ...currencies])] as CurrencyCode[],
      pricesIncludeTax,
      trackInventory,
      outOfStockThreshold: threshold ?? 0,
      defaultTaxZoneId: taxZone.id,
      defaultShippingZoneId: shippingZone.id,
      sellerId: seller?.id,
      customFields,
    };
    try {
      if (channel) {
        unwrapResult((await update.mutateAsync({ input: { id: channel.id, ...input } })).updateChannel);
      } else {
        const res = unwrapResult((await create.mutateAsync({ input })).createChannel);
        if (res.__typename !== 'Channel') throw new Error('Unexpected result');
        router.replace(`/more/channels/${res.id}`);
        Alert.alert('Channel created', RELOGIN_HINT);
      }
      setDirty(false);
      await invalidate(ChannelListDocument, ChannelDetailDocument, PickChannelOptionsDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={channel ? channelLabel(channel.code) : 'New channel'}
        dirty={dirty}
        saving={create.isPending || update.isPending}
        onSave={save}
        label={channel ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General" footer={channel ? undefined : 'New channels appear in the channel switcher after you sign in again.'}>
          <TextRow
            label="Code"
            value={code}
            onChangeText={edit(setCode)}
            readOnly={!canEdit || isDefault}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={!channel}
          />
          <TextRow
            label="Token"
            hint="Sent as the vendure-token header to select this channel."
            value={token}
            onChangeText={edit(setToken)}
            readOnly={!canEdit}
            autoCapitalize="none"
            autoCorrect={false}
            mono
          />
          <PickRow label="Seller" value={seller} onChange={edit(setSeller)} source={sellerPicker} disabled={!canEdit} />
        </Section>

        <Section title="Languages">
          <SelectRow
            label="Default language"
            value={defaultLanguage}
            disabled={!canEdit}
            options={languageChoices.map((l) => ({ value: l, label: languageName(l) }))}
            onChange={(v) => {
              if (!v) return;
              setDefaultLanguage(v);
              setLanguages((prev) => (prev.includes(v) ? prev : [...prev, v]));
              setDirty(true);
            }}
          />
          <MultiPickRow
            label="Available languages"
            hint="Limited to the languages enabled in Global settings."
            disabled={!canEdit}
            options={languageOptions(globalLanguages)}
            value={languages.map((l) => ({ id: l, label: languageName(l) }))}
            onChange={(v) => {
              setLanguages(v.map((x) => x.id));
              setDirty(true);
            }}
          />
        </Section>

        <Section title="Currencies & tax">
          <PickRow
            label="Default currency"
            value={defaultCurrency ? { id: defaultCurrency, label: `${currencyName(defaultCurrency)} (${defaultCurrency})` } : null}
            disabled={!canEdit}
            options={currencyOptions()}
            onChange={(v) => {
              if (!v) return;
              setDefaultCurrency(v.id);
              setCurrencies((prev) => (prev.includes(v.id) ? prev : [...prev, v.id]));
              setDirty(true);
            }}
          />
          <MultiPickRow
            label="Available currencies"
            disabled={!canEdit}
            options={currencyOptions()}
            value={currencies.map((c) => ({ id: c, label: c }))}
            onChange={(v) => {
              setCurrencies(v.map((x) => x.id));
              setDirty(true);
            }}
          />
          <SwitchRow
            label="Prices include tax"
            hint="For the default tax zone."
            value={pricesIncludeTax}
            disabled={!canEdit}
            onValueChange={edit(setPricesIncludeTax)}
          />
        </Section>

        <Section title="Defaults">
          <PickRow label="Default shipping zone" value={shippingZone} onChange={edit(setShippingZone)} source={zonePicker} disabled={!canEdit} />
          <PickRow label="Default tax zone" value={taxZone} onChange={edit(setTaxZone)} source={zonePicker} disabled={!canEdit} />
        </Section>

        <Section title="Stock">
          <SwitchRow label="Track inventory" value={trackInventory} disabled={!canEdit} onValueChange={edit(setTrackInventory)} />
          <NumberRow label="Out-of-stock threshold" integer value={threshold} readOnly={!canEdit} onChange={edit(setThreshold)} />
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
        {channel ? (
          <Section title="Info">
            <ValueRow label="ID" value={channel.id} mono />
            <ValueRow label="Created" value={formatDate(channel.createdAt)} />
            <ValueRow label="Updated" value={formatDate(channel.updatedAt)} />
          </Section>
        ) : null}
        {channel ? (
          <DeleteSection
            label="Delete channel"
            message={`“${channel.code}” and its channel-specific data (prices, assignments) will be deleted.`}
            hidden={isDefault || !can('DeleteChannel')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: channel.id })).deleteChannel);
              await invalidate(ChannelListDocument, PickChannelOptionsDocument);
              Alert.alert('Channel deleted', RELOGIN_HINT);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
