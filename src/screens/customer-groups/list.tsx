import { router } from 'expo-router';

import { CustomerGroupListDocument } from '@/api/documents/customer-groups';
import { usePermissions } from '@/api/permissions';
import { EntityListScreen } from '@/components/screen-kit';

export function CustomerGroupListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={CustomerGroupListDocument}
      variables={(term, skip, take) => ({
        options: { skip, take, sort: { name: 'ASC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
      })}
      select={(r) => r.customerGroups}
      noun={['customer group', 'customer groups']}
      createHref={can('CreateCustomerGroup') ? '/customers/groups/new' : undefined}
      row={(g) => ({
        title: g.name,
        subtitle: `${g.customers.totalItems} member${g.customers.totalItems === 1 ? '' : 's'}`,
        onPress: () => router.push(`/customers/groups/${g.id}`),
      })}
    />
  );
}
