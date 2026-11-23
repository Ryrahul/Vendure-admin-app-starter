/**
 * Hub screens for the Catalog and More tabs: grouped rows linking to every admin area,
 * shown only when the admin may read that area (same permissions as the web dashboard's nav).
 */
import { router, type Href } from 'expo-router';
import { ScrollView } from 'react-native';

import { usePermissions } from '@/api/permissions';
import { Icon, type IconProps } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { useTheme } from '@/theme';

export interface HubLink {
  title: string;
  subtitle?: string;
  href: Href;
  icon: Pick<IconProps, 'ios' | 'android'>;
  /** Visible when the admin has any of these permissions. */
  permissions: string[];
}

export interface HubGroup {
  title: string;
  links: HubLink[];
}

export const CATALOG_HUB: HubGroup[] = [
  {
    title: 'Catalog',
    links: [
      { title: 'Products', href: '/catalog/products', icon: { ios: 'tag', android: 'sell' }, permissions: ['ReadCatalog', 'ReadProduct'] },
      { title: 'Product variants', href: '/catalog/variants', icon: { ios: 'square.stack.3d.up', android: 'stacks' }, permissions: ['ReadCatalog', 'ReadProduct'] },
      { title: 'Option groups', href: '/catalog/option-groups', icon: { ios: 'slider.horizontal.3', android: 'tune' }, permissions: ['ReadCatalog', 'ReadProduct'] },
      { title: 'Collections', href: '/catalog/collections', icon: { ios: 'folder', android: 'folder' }, permissions: ['ReadCatalog', 'ReadCollection'] },
      { title: 'Facets', href: '/catalog/facets', icon: { ios: 'line.3.horizontal.decrease.circle', android: 'filter_list' }, permissions: ['ReadCatalog', 'ReadFacet'] },
      { title: 'Assets', href: '/catalog/assets', icon: { ios: 'photo.on.rectangle', android: 'photo_library' }, permissions: ['ReadCatalog', 'ReadAsset'] },
    ],
  },
];

export const MORE_HUB: HubGroup[] = [
  {
    title: 'Marketing',
    links: [
      { title: 'Promotions', href: '/more/promotions', icon: { ios: 'percent', android: 'percent' }, permissions: ['ReadPromotion'] },
    ],
  },
  {
    title: 'Settings',
    links: [
      { title: 'Sellers', href: '/more/sellers', icon: { ios: 'storefront', android: 'storefront' }, permissions: ['ReadSeller'] },
      { title: 'Channels', href: '/more/channels', icon: { ios: 'point.3.connected.trianglepath.dotted', android: 'hub' }, permissions: ['ReadChannel'] },
      { title: 'Stock locations', href: '/more/stock-locations', icon: { ios: 'shippingbox', android: 'warehouse' }, permissions: ['ReadStockLocation'] },
      { title: 'Administrators', href: '/more/administrators', icon: { ios: 'person.2', android: 'group' }, permissions: ['ReadAdministrator'] },
      { title: 'Roles', href: '/more/roles', icon: { ios: 'person.badge.key', android: 'admin_panel_settings' }, permissions: ['ReadAdministrator'] },
      { title: 'API keys', href: '/more/api-keys', icon: { ios: 'key', android: 'key' }, permissions: ['ReadApiKey'] },
      { title: 'Shipping methods', href: '/more/shipping-methods', icon: { ios: 'truck.box', android: 'local_shipping' }, permissions: ['ReadShippingMethod', 'ReadSettings'] },
      { title: 'Payment methods', href: '/more/payment-methods', icon: { ios: 'creditcard', android: 'credit_card' }, permissions: ['ReadPaymentMethod', 'ReadSettings'] },
      { title: 'Tax categories', href: '/more/tax-categories', icon: { ios: 'folder.badge.gearshape', android: 'category' }, permissions: ['ReadTaxCategory', 'ReadSettings'] },
      { title: 'Tax rates', href: '/more/tax-rates', icon: { ios: 'percent', android: 'request_quote' }, permissions: ['ReadTaxRate', 'ReadSettings'] },
      { title: 'Countries', href: '/more/countries', icon: { ios: 'flag', android: 'flag' }, permissions: ['ReadCountry', 'ReadSettings'] },
      { title: 'Zones', href: '/more/zones', icon: { ios: 'globe', android: 'public' }, permissions: ['ReadZone', 'ReadSettings'] },
      { title: 'Global settings', href: '/more/global-settings', icon: { ios: 'gearshape.2', android: 'settings_applications' }, permissions: ['ReadSettings', 'UpdateGlobalSettings'] },
    ],
  },
  {
    title: 'System',
    links: [
      { title: 'Job queue', href: '/more/jobs', icon: { ios: 'list.bullet.rectangle', android: 'pending_actions' }, permissions: ['ReadSystem', 'ReadSettings'] },
      { title: 'Scheduled tasks', href: '/more/scheduled-tasks', icon: { ios: 'clock.arrow.circlepath', android: 'schedule' }, permissions: ['ReadSystem', 'ReadSettings'] },
    ],
  },
];

export function HubSections({ groups }: { groups: HubGroup[] }) {
  const { can } = usePermissions();
  return groups.map((group) => {
    const links = group.links.filter((l) => can(...l.permissions));
    if (!links.length) return null;
    return (
      <Section key={group.title} title={group.title}>
        {links.map((l) => (
          <ListRow
            key={l.title}
            leading={<Icon {...l.icon} size={20} color="foreground" />}
            title={l.title}
            subtitle={l.subtitle}
            onPress={() => router.push(l.href)}
          />
        ))}
      </Section>
    );
  });
}

export function CatalogHubScreen() {
  const { spacing } = useTheme();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: spacing[4], gap: spacing[6] }}>
      <HubSections groups={CATALOG_HUB} />
    </ScrollView>
  );
}
