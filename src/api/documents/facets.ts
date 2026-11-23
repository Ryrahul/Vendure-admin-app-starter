import { graphql } from '@/gql';

export const FacetListDocument = graphql(`
  query FacetList($options: FacetListOptions) {
    facets(options: $options) {
      items {
        id
        code
        name
        isPrivate
        valueList(options: { take: 5 }) {
          totalItems
          items {
            id
            name
          }
        }
      }
      totalItems
    }
  }
`);

export const FacetDetailDocument = graphql(`
  query FacetDetail($id: ID!) {
    facet(id: $id) {
      id
      createdAt
      updatedAt
      languageCode
      code
      name
      isPrivate
      translations @customFields(entity: "Facet", locale: true) {
        id
        languageCode
        name
      }
      customFields @customFields(entity: "Facet")
      values {
        id
        code
        name
        languageCode
        translations @customFields(entity: "FacetValue", locale: true) {
          id
          languageCode
          name
        }
        customFields @customFields(entity: "FacetValue")
      }
    }
  }
`);

export const CreateFacetDocument = graphql(`
  mutation CreateFacet($input: CreateFacetInput!) {
    createFacet(input: $input) {
      id
    }
  }
`);

export const UpdateFacetDocument = graphql(`
  mutation UpdateFacet($input: UpdateFacetInput!) {
    updateFacet(input: $input) {
      id
    }
  }
`);

export const DeleteFacetDocument = graphql(`
  mutation DeleteFacet($id: ID!, $force: Boolean) {
    deleteFacet(id: $id, force: $force) {
      result
      message
    }
  }
`);

export const CreateFacetValuesDocument = graphql(`
  mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
    createFacetValues(input: $input) {
      id
    }
  }
`);

export const UpdateFacetValuesDocument = graphql(`
  mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {
    updateFacetValues(input: $input) {
      id
    }
  }
`);

export const DeleteFacetValuesDocument = graphql(`
  mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {
    deleteFacetValues(ids: $ids, force: $force) {
      result
      message
    }
  }
`);
