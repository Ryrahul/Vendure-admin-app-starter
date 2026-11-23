/** Picker sources shared across areas. Area-specific sources live next to this file. */
import { pickerSource } from '@/api/picker';
import { graphql } from '@/gql';

const contains = (term: string, ...fields: string[]) =>
  term ? { _or: fields.map((f) => ({ [f]: { contains: term } })) } : undefined;

export const PickProductsDocument = graphql(`
  query PickProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
      }
      totalItems
    }
  }
`);

export const productPicker = pickerSource({
  document: PickProductsDocument,
  variables: (term, skip, take) => ({ options: { skip, take, filter: contains(term, 'name', 'slug', 'sku') } }),
  select: (r) => ({
    totalItems: r.products.totalItems,
    items: r.products.items.map((p) => ({ id: p.id, title: p.name, code: p.slug, preview: p.featuredAsset?.preview })),
  }),
});

export const PickVariantsDocument = graphql(`
  query PickVariants($options: ProductVariantListOptions) {
    productVariants(options: $options) {
      items {
        id
        name
        sku
        priceWithTax
        currencyCode
        featuredAsset {
          id
          preview
        }
        product {
          id
          featuredAsset {
            id
            preview
          }
        }
      }
      totalItems
    }
  }
`);

export const variantPicker = pickerSource({
  document: PickVariantsDocument,
  variables: (term, skip, take) => ({ options: { skip, take, filter: contains(term, 'name', 'sku') } }),
  select: (r) => ({
    totalItems: r.productVariants.totalItems,
    items: r.productVariants.items.map((v) => ({
      id: v.id,
      title: v.name,
      code: v.sku,
      preview: v.featuredAsset?.preview ?? v.product.featuredAsset?.preview,
    })),
  }),
});

export const PickCustomersDocument = graphql(`
  query PickCustomers($options: CustomerListOptions) {
    customers(options: $options) {
      items {
        id
        firstName
        lastName
        emailAddress
      }
      totalItems
    }
  }
`);

export const customerPicker = pickerSource({
  document: PickCustomersDocument,
  variables: (term, skip, take) => ({
    options: { skip, take, filter: contains(term, 'emailAddress', 'lastName', 'firstName') },
  }),
  select: (r) => ({
    totalItems: r.customers.totalItems,
    items: r.customers.items.map((c) => ({
      id: c.id,
      title: `${c.firstName} ${c.lastName}`.trim() || c.emailAddress,
      subtitle: c.emailAddress,
    })),
  }),
});

export const PickFacetValuesDocument = graphql(`
  query PickFacetValues($options: FacetValueListOptions) {
    facetValues(options: $options) {
      items {
        id
        name
        code
        facet {
          id
          name
        }
      }
      totalItems
    }
  }
`);

export const facetValuePicker = pickerSource({
  document: PickFacetValuesDocument,
  variables: (term, skip, take) => ({ options: { skip, take, filter: contains(term, 'name', 'code') } }),
  select: (r) => ({
    totalItems: r.facetValues.totalItems,
    items: r.facetValues.items.map((v) => ({ id: v.id, title: v.name, subtitle: v.facet.name, code: v.code })),
  }),
});

export const PickCustomerGroupsDocument = graphql(`
  query PickCustomerGroups($options: CustomerGroupListOptions) {
    customerGroups(options: $options) {
      items {
        id
        name
      }
      totalItems
    }
  }
`);

export const customerGroupPicker = pickerSource({
  document: PickCustomerGroupsDocument,
  variables: (term, skip, take) => ({ options: { skip, take, filter: contains(term, 'name') } }),
  select: (r) => ({
    totalItems: r.customerGroups.totalItems,
    items: r.customerGroups.items.map((g) => ({ id: g.id, title: g.name })),
  }),
});

export const PickCollectionsDocument = graphql(`
  query PickCollections($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        name
        slug
        breadcrumbs {
          id
          name
        }
      }
      totalItems
    }
  }
`);

export const collectionPicker = pickerSource({
  document: PickCollectionsDocument,
  variables: (term, skip, take) => ({ options: { skip, take, filter: contains(term, 'name', 'slug') } }),
  select: (r) => ({
    totalItems: r.collections.totalItems,
    items: r.collections.items.map((c) => ({
      id: c.id,
      title: c.name,
      subtitle: c.breadcrumbs
        .slice(1, -1)
        .map((b) => b.name)
        .join(' › '),
    })),
  }),
});

export const PickAssetsDocument = graphql(`
  query PickAssets($options: AssetListOptions) {
    assets(options: $options) {
      items {
        id
        name
        preview
      }
      totalItems
    }
  }
`);

export const assetPicker = pickerSource({
  document: PickAssetsDocument,
  variables: (term, skip, take) => ({ options: { skip, take, sort: { createdAt: 'DESC' as const }, filter: contains(term, 'name') } }),
  select: (r) => ({
    totalItems: r.assets.totalItems,
    items: r.assets.items.map((a) => ({ id: a.id, title: a.name, preview: a.preview })),
  }),
});
