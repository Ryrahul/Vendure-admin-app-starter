import { graphql } from '@/gql';

export const VariantListDocument = graphql(`
  query VariantList($options: ProductVariantListOptions, $productId: ID) {
    productVariants(options: $options, productId: $productId) {
      items {
        id
        name
        sku
        enabled
        priceWithTax
        currencyCode
        featuredAsset {
          id
          preview
        }
        product {
          id
          name
          featuredAsset {
            id
            preview
          }
        }
        stockLevels {
          id
          stockOnHand
          stockAllocated
        }
      }
      totalItems
    }
  }
`);

export const VariantDetailDocument = graphql(`
  query VariantDetail($id: ID!) {
    productVariant(id: $id) {
      id
      createdAt
      updatedAt
      languageCode
      name
      sku
      enabled
      price
      priceWithTax
      currencyCode
      trackInventory
      outOfStockThreshold
      useGlobalOutOfStockThreshold
      taxCategory {
        id
        name
      }
      stockLevels {
        id
        stockLocationId
        stockOnHand
        stockAllocated
        stockLocation {
          id
          name
        }
      }
      options {
        id
        code
        name
        group {
          id
          name
        }
      }
      facetValues {
        id
        name
        code
        facet {
          id
          name
        }
      }
      featuredAsset {
        id
        preview
        name
      }
      assets {
        id
        preview
        name
      }
      product {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
      translations @customFields(entity: "ProductVariant", locale: true) {
        id
        languageCode
        name
      }
      customFields @customFields(entity: "ProductVariant")
    }
  }
`);

/** Reference data for the variant form: tax categories, stock locations and the global stock settings. */
export const VariantFormDataDocument = graphql(`
  query VariantFormData {
    taxCategories(options: { take: 100 }) {
      items {
        id
        name
        isDefault
      }
    }
    stockLocations(options: { take: 100 }) {
      items {
        id
        name
      }
    }
    globalSettings {
      id
      trackInventory
      outOfStockThreshold
    }
  }
`);

/** The product a new variant belongs to, with its option groups (one option per group is required). */
export const VariantProductDocument = graphql(`
  query VariantProduct($id: ID!) {
    product(id: $id) {
      id
      name
      optionGroups {
        id
        name
        options {
          id
          code
          name
        }
      }
    }
  }
`);

export const CreateProductVariantsDocument = graphql(`
  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
    createProductVariants(input: $input) {
      id
      name
      sku
    }
  }
`);

export const UpdateProductVariantDocument = graphql(`
  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      id
      updatedAt
    }
  }
`);

export const DeleteProductVariantDocument = graphql(`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id) {
      result
      message
    }
  }
`);
