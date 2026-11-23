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
      <NativeTabs.Trigger name="products">
        <NativeTabs.Trigger.Icon sf="tag" md="sell" />
        <NativeTabs.Trigger.Label>Products</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Icon sf="bag" md="shopping_bag" />
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
