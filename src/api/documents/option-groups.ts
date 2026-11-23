import { graphql } from '@/gql';

export const OptionGroupListDocument = graphql(`
  query OptionGroupList($options: ProductOptionGroupListOptions) {
    productOptionGroups(options: $options) {
      items {
        id
        code
        name
        productCount
        options {
          id
        }
      }
      totalItems
    }
  }
`);

export const OptionGroupDetailDocument = graphql(`
  query OptionGroupDetail($id: ID!) {
    productOptionGroup(id: $id) {
      id
      createdAt
      updatedAt
      languageCode
      code
      name
      productCount
      translations @customFields(entity: "ProductOptionGroup", locale: true) {
        id
        languageCode
        name
      }
      customFields @customFields(entity: "ProductOptionGroup")
      options {
        id
        code
        name
        languageCode
        translations @customFields(entity: "ProductOption", locale: true) {
          id
          languageCode
          name
        }
        customFields @customFields(entity: "ProductOption")
      }
    }
  }
`);

export const CreateOptionGroupDocument = graphql(`
  mutation CreateOptionGroup($input: CreateProductOptionGroupInput!) {
    createProductOptionGroup(input: $input) {
      id
    }
  }
`);

export const UpdateOptionGroupDocument = graphql(`
  mutation UpdateOptionGroup($input: UpdateProductOptionGroupInput!) {
    updateProductOptionGroup(input: $input) {
      id
    }
  }
`);

export const DeleteOptionGroupDocument = graphql(`
  mutation DeleteOptionGroup($id: ID!, $force: Boolean) {
    deleteProductOptionGroup(id: $id, force: $force) {
      result
      message
    }
  }
`);

export const CreateProductOptionDocument = graphql(`
  mutation CreateProductOption($input: CreateProductOptionInput!) {
    createProductOption(input: $input) {
      id
    }
  }
`);

export const UpdateProductOptionDocument = graphql(`
  mutation UpdateProductOption($input: UpdateProductOptionInput!) {
    updateProductOption(input: $input) {
      id
    }
  }
`);

export const DeleteProductOptionDocument = graphql(`
  mutation DeleteProductOption($id: ID!) {
    deleteProductOption(id: $id) {
      result
      message
    }
  }
`);
