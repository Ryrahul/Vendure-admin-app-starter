import { graphql } from '@/gql';

export const TaxCategoryListDocument = graphql(`
  query TaxCategoryList($options: TaxCategoryListOptions) {
    taxCategories(options: $options) {
      items {
        id
        name
        isDefault
      }
      totalItems
    }
  }
`);

export const TaxCategoryDetailDocument = graphql(`
  query TaxCategoryDetail($id: ID!) {
    taxCategory(id: $id) {
      id
      createdAt
      updatedAt
      name
      isDefault
      customFields @customFields(entity: "TaxCategory")
    }
  }
`);

export const CreateTaxCategoryDocument = graphql(`
  mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
    createTaxCategory(input: $input) {
      id
    }
  }
`);

export const UpdateTaxCategoryDocument = graphql(`
  mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {
    updateTaxCategory(input: $input) {
      id
    }
  }
`);

export const DeleteTaxCategoryDocument = graphql(`
  mutation DeleteTaxCategory($id: ID!) {
    deleteTaxCategory(id: $id) {
      result
      message
    }
  }
`);
