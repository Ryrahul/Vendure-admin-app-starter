/** Picker sources for the Sales area (orders, customers). */
import { pickerSource } from '@/api/picker';
import { CountryListDocument } from '@/api/documents/customers';

/** Enabled countries; `PickerItem.code` is the ISO code used by address inputs. */
export const countryPicker = pickerSource({
  document: CountryListDocument,
  variables: (term, skip, take) => ({
    options: {
      skip,
      take,
      sort: { name: 'ASC' as const },
      filter: {
        enabled: { eq: true },
        ...(term ? { _or: [{ name: { contains: term } }, { code: { contains: term } }] } : {}),
      },
    },
  }),
  select: (r) => ({
    totalItems: r.countries.totalItems,
    items: r.countries.items.map((c) => ({ id: c.id, title: c.name, code: c.code })),
  }),
});
