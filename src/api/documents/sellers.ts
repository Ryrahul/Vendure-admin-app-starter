import { graphql } from '@/gql';

export const SellerListDocument = graphql(`
  query SellerList($options: SellerListOptions) {
    sellers(options: $options) {
      items {
        id
        name
      }
      totalItems
    }
  }
`);

export const SellerDetailDocument = graphql(`
  query SellerDetail($id: ID!) {
    seller(id: $id) {
      id
      createdAt
      updatedAt
      name
      customFields @customFields(entity: "Seller")
    }
  }
`);

export const CreateSellerDocument = graphql(`
  mutation CreateSeller($input: CreateSellerInput!) {
    createSeller(input: $input) {
      id
    }
  }
`);

export const UpdateSellerDocument = graphql(`
  mutation UpdateSeller($input: UpdateSellerInput!) {
    updateSeller(input: $input) {
      id
    }
  }
`);

export const DeleteSellerDocument = graphql(`
  mutation DeleteSeller($id: ID!) {
    deleteSeller(id: $id) {
      result
      message
    }
  }
`);

export const PickSellerOptionsDocument = graphql(`
  query PickSellerOptions($options: SellerListOptions) {
    sellers(options: $options) {
      items {
        id
        name
      }
      totalItems
    }
  }
`);
