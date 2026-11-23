import { graphql } from '@/gql';

export const CountryListDocument = graphql(`
  query CountryList($options: CountryListOptions) {
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

export const CountryDetailDocument = graphql(`
  query CountryDetail($id: ID!) {
    country(id: $id) {
      id
      createdAt
      updatedAt
      languageCode
      code
      name
      enabled
      translations @customFields(entity: "Country", locale: true) {
        id
        languageCode
        name
      }
      customFields @customFields(entity: "Country")
    }
  }
`);

export const CreateCountryDocument = graphql(`
  mutation CreateCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
      id
    }
  }
`);

export const UpdateCountryDocument = graphql(`
  mutation UpdateCountry($input: UpdateCountryInput!) {
    updateCountry(input: $input) {
      id
    }
  }
`);

export const DeleteCountryDocument = graphql(`
  mutation DeleteCountry($id: ID!) {
    deleteCountry(id: $id) {
      result
      message
    }
  }
`);
