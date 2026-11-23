import { graphql } from '@/gql';

export const ProductListDocument = graphql(`
  query ProductList($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        enabled
        updatedAt
        featuredAsset {
          id
          preview
        }
        variantList(options: { take: 1 }) {
          totalItems
          items {
            id
            priceWithTax
            currencyCode
          }
        }
      }
      totalItems
    }
  }
`);

export const ProductDetailDocument = graphql(`
  query ProductDetail($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      enabled
      createdAt
      updatedAt
      languageCode
      featuredAsset {
        id
        preview
      }
      assets {
        id
        preview
      }
      customFields @customFields(entity: "Product")
      translations @customFields(entity: "Product", locale: true) {
        id
        languageCode
        name
      }
      facetValues {
        id
        name
        facet {
          id
          name
        }
      }
      variantList(options: { take: 50 }) {
        totalItems
        items {
          id
          name
          sku
          enabled
          price
          priceWithTax
          currencyCode
          stockLevels {
            id
            stockOnHand
            stockAllocated
          }
        }
      }
    }
  }
`);

/** Sends only changed fields, like the web dashboard does. */
export const UpdateProductDocument = graphql(`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      enabled
      updatedAt
      translations {
        id
        languageCode
        name
      }
    }
  }
`);
