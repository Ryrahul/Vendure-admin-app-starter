import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/theme';

export default function AppTabs() {
  const { colors } = useTheme();
  return (
    <NativeTabs
      backgroundColor={colors.surfaceRaised}
      indicatorColor={colors.accent}
      iconColor={{ default: colors.mutedForeground, selected: colors.foreground }}
      labelStyle={{ default: { color: colors.mutedForeground }, selected: { color: colors.foreground } }}>
      <NativeTabs.Trigger name="(dashboard)">
        <NativeTabs.Trigger.Icon sf="chart.xyaxis.line" md="monitoring" />
        <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="catalog">
        <NativeTabs.Trigger.Icon sf="tag" md="sell" />
        <NativeTabs.Trigger.Label>Catalog</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Icon sf="bag" md="shopping_bag" />
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="customers">
        <NativeTabs.Trigger.Icon sf="person.2" md="group" />
        <NativeTabs.Trigger.Label>Customers</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Icon sf="ellipsis.circle" md="more_horiz" />
        <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
