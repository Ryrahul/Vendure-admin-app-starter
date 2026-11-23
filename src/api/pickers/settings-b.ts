/** Picker sources for the Settings-B areas (zones, shipping-method test). */
import { pickerSource } from '@/api/picker';
import { graphql } from '@/gql';

export const PickCountriesDocument = graphql(`
  query PickCountries($options: CountryListOptions) {
    countries(options: $options) {
      items {
        id
        code
        name
        enabled
      }
      totalItems
    }
  }
`);

export const countryPicker = pickerSource({
  document: PickCountriesDocument,
  variables: (term, skip, take) => ({
    options: {
      skip,
      take,
      sort: { name: 'ASC' as const },
      ...(term ? { filter: { name: { contains: term }, code: { contains: term } }, filterOperator: 'OR' as const } : {}),
    },
  }),
  select: (r) => ({
    totalItems: r.countries.totalItems,
    items: r.countries.items.map((c) => ({ id: c.id, title: c.name, code: c.code, subtitle: c.enabled ? undefined : 'Disabled' })),
  }),
});
