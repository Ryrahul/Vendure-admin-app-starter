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
        name
      }
      assets {
        id
        preview
        name
      }
      channels {
        id
        code
      }
      optionGroups {
        id
        code
        name
      }
      customFields @customFields(entity: "Product")
      translations @customFields(entity: "Product", locale: true) {
        id
        languageCode
        name
        slug
        description
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
          featuredAsset {
            id
            preview
          }
          options {
            id
            name
          }
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

export const CreateProductDocument = graphql(`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
    }
  }
`);

export const DeleteProductDocument = graphql(`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      result
      message
    }
  }
`);

export const AssignProductsToChannelDocument = graphql(`
  mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {
    assignProductsToChannel(input: $input) {
      id
    }
  }
`);

export const RemoveProductsFromChannelDocument = graphql(`
  mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {
    removeProductsFromChannel(input: $input) {
      id
    }
  }
`);
