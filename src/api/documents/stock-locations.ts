import { graphql } from '@/gql';

export const StockLocationListDocument = graphql(`
  query StockLocationList($options: StockLocationListOptions) {
    stockLocations(options: $options) {
      items {
        id
        name
        description
      }
      totalItems
    }
  }
`);

export const StockLocationDetailDocument = graphql(`
  query StockLocationDetail($id: ID!) {
    stockLocation(id: $id) {
      id
      createdAt
      updatedAt
      name
      description
      customFields @customFields(entity: "StockLocation")
    }
  }
`);

export const CreateStockLocationDocument = graphql(`
  mutation CreateStockLocation($input: CreateStockLocationInput!) {
    createStockLocation(input: $input) {
      id
    }
  }
`);

export const UpdateStockLocationDocument = graphql(`
  mutation UpdateStockLocation($input: UpdateStockLocationInput!) {
    updateStockLocation(input: $input) {
      id
    }
  }
`);

export const DeleteStockLocationDocument = graphql(`
  mutation DeleteStockLocation($input: DeleteStockLocationInput!) {
    deleteStockLocation(input: $input) {
      result
      message
    }
  }
`);

export const PickStockLocationOptionsDocument = graphql(`
  query PickStockLocationOptions($options: StockLocationListOptions) {
    stockLocations(options: $options) {
      items {
        id
        name
      }
      totalItems
    }
  }
`);
