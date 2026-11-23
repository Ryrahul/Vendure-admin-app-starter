import { graphql } from '@/gql';

export const TaxRateListDocument = graphql(`
  query TaxRateList($options: TaxRateListOptions) {
    taxRates(options: $options) {
      items {
        id
        name
        enabled
        value
        category {
          id
          name
        }
        zone {
          id
          name
        }
        customerGroup {
          id
          name
        }
      }
      totalItems
    }
  }
`);

export const TaxRateDetailDocument = graphql(`
  query TaxRateDetail($id: ID!) {
    taxRate(id: $id) {
      id
      createdAt
      updatedAt
      name
      enabled
      value
      category {
        id
        name
      }
      zone {
        id
        name
      }
      customerGroup {
        id
        name
      }
      customFields @customFields(entity: "TaxRate")
    }
  }
`);

/** Options for the category and zone selects (both are short lists). */
export const TaxRateOptionsDocument = graphql(`
  query TaxRateOptions {
    taxCategories(options: { take: 100, sort: { name: ASC } }) {
      items {
        id
        name
      }
    }
    zones(options: { take: 100, sort: { name: ASC } }) {
      items {
        id
        name
      }
    }
  }
`);

export const CreateTaxRateDocument = graphql(`
  mutation CreateTaxRate($input: CreateTaxRateInput!) {
    createTaxRate(input: $input) {
      id
    }
  }
`);

export const UpdateTaxRateDocument = graphql(`
  mutation UpdateTaxRate($input: UpdateTaxRateInput!) {
    updateTaxRate(input: $input) {
      id
    }
  }
`);

export const DeleteTaxRateDocument = graphql(`
  mutation DeleteTaxRate($id: ID!) {
    deleteTaxRate(id: $id) {
      result
      message
    }
  }
`);
