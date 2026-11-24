import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { CurrentUserDocument } from '@/api/documents/auth';
import { useVendureQuery } from '@/api/hooks';
import { useSession } from '@/api/session';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { HubSections, MORE_HUB } from '@/screens/hubs';
import { useTheme } from '@/theme';

const DEFAULT_CHANNEL = '__default_channel__';
const COLLAPSED_CHANNELS = 5;

/** More tab: account, every Marketing/Settings/System area, server + channel, sign out. */
export function SettingsScreen() {
  const { spacing, dark } = useTheme();
  const { state, logout, setChannel } = useSession();
  const me = useVendureQuery(CurrentUserDocument);
  const { channel } = useChannelInfo();
  const [showAllChannels, setShowAllChannels] = useState(false);

  const admin = me.data?.activeAdministrator;
  const channels = state.channels;
  const visible = showAllChannels ? channels : channels.slice(0, COLLAPSED_CHANNELS);

  const confirmLogout = () =>
    Alert.alert('Sign out?', 'You will need to sign in again to manage this server.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: spacing[4], gap: spacing[6], paddingBottom: spacing[12] }}>
      <Section title="Account">
        <ListRow
          leading={<Icon ios="person.crop.circle" android="account_circle" size={28} />}
          title={
            admin
              ? `${admin.firstName} ${admin.lastName}`.trim() || state.identifier || 'Administrator'
              : (state.identifier ?? '…')
          }
          subtitle={admin?.emailAddress ?? state.identifier}
          onPress={() => router.push('/more/profile')}
        />
      </Section>

      <HubSections groups={MORE_HUB} />

      <Section title="Server" footer="To use another Vendure server, sign out and enter its Admin API URL.">
        <ListRow title="Admin API" subtitle={state.apiUrl} />
        {channel ? (
          <ListRow
            title="Channel currency"
            value={`${channel.defaultCurrencyCode}${channel.pricesIncludeTax ? ' · incl. tax' : ''}`}
          />
        ) : null}
      </Section>

      {channels.length > 1 ? (
        <Section
          title={`Channel (${channels.length})`}
          footer="All screens show data for the selected channel."
          action={
            channels.length > COLLAPSED_CHANNELS ? (
              <Button
                size="sm"
                variant="ghost"
                title={showAllChannels ? 'Show less' : 'Show all'}
                onPress={() => setShowAllChannels((v) => !v)}
              />
            ) : undefined
          }>
          {visible.map((c) => (
            <ListRow
              key={c.id}
              title={c.code === DEFAULT_CHANNEL ? 'Default channel' : c.code}
              onPress={c.token === state.channelToken ? undefined : () => setChannel(c.token)}
              chevron={false}
              trailing={
                c.token === state.channelToken ? (
                  <Icon ios="checkmark" android="check" size={18} color="foreground" />
                ) : undefined
              }
            />
          ))}
        </Section>
      ) : null}

      <Section title="App">
        <ListRow title="Appearance" value={`${dark ? 'Dark' : 'Light'} (follows system)`} />
        <ListRow title="Version" value={Constants.expoConfig?.version ?? '—'} />
      </Section>

      <Section>
        <View style={{ padding: spacing[3] }}>
          <Button title="Sign out" variant="destructive" onPress={confirmLogout} />
        </View>
      </Section>
    </ScrollView>
  );
}
