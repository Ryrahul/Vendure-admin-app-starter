/** Picker sources for the Settings-A areas (sellers, channels, roles, zones, stock locations). */
import { channelLabel, PickZoneOptionsDocument } from '@/api/documents/channels';
import { PickChannelOptionsDocument, PickRoleOptionsDocument } from '@/api/documents/roles';
import { PickSellerOptionsDocument } from '@/api/documents/sellers';
import { pickerSource } from '@/api/picker';

export const sellerPicker = pickerSource({
  document: PickSellerOptionsDocument,
  variables: (term, skip, take) => ({
    options: { skip, take, sort: { name: 'ASC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
  }),
  select: (r) => ({ totalItems: r.sellers.totalItems, items: r.sellers.items.map((s) => ({ id: s.id, title: s.name })) }),
});

export const zonePicker = pickerSource({
  document: PickZoneOptionsDocument,
  variables: (term, skip, take) => ({
    options: { skip, take, sort: { name: 'ASC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
  }),
  select: (r) => ({ totalItems: r.zones.totalItems, items: r.zones.items.map((z) => ({ id: z.id, title: z.name })) }),
});

/** Roles an administrator or API key can hold (the customer role is excluded). */
export const rolePicker = pickerSource({
  document: PickRoleOptionsDocument,
  variables: (term, skip, take) => ({
    options: {
      skip,
      take,
      sort: { code: 'ASC' as const },
      filter: {
        code: { notEq: '__customer_role__' },
        ...(term ? { _or: [{ code: { contains: term } }, { description: { contains: term } }] } : {}),
      },
    },
  }),
  select: (r) => ({
    totalItems: r.roles.totalItems,
    items: r.roles.items.map((role) => ({ id: role.id, title: role.description || role.code, code: role.code })),
  }),
});

export const channelPicker = pickerSource({
  document: PickChannelOptionsDocument,
  variables: (term, skip, take) => ({
    options: { skip, take, sort: { code: 'ASC' as const }, ...(term ? { filter: { code: { contains: term } } } : {}) },
  }),
  select: (r) => ({
    totalItems: r.channels.totalItems,
    items: r.channels.items.map((c) => ({ id: c.id, title: channelLabel(c.code), code: c.code })),
  }),
});


