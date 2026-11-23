import { graphql } from '@/gql';

export const CollectionListDocument = graphql(`
  query CollectionList($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        name
        slug
        isPrivate
        parentId
        position
        productVariantCount
        featuredAsset {
          id
          preview
        }
        breadcrumbs {
          id
          name
        }
        children {
          id
        }
      }
      totalItems
    }
  }
`);

export const CollectionDetailDocument = graphql(`
  query CollectionDetail($id: ID!) {
    collection(id: $id) {
      id
      createdAt
      updatedAt
      languageCode
      name
      slug
      description
      isPrivate
      inheritFilters
      position
      parentId
      breadcrumbs {
        id
        name
      }
      parent {
        id
        name
      }
      children {
        id
        name
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
      filters {
        code
        args {
          name
          value
        }
      }
      translations @customFields(entity: "Collection", locale: true) {
        id
        languageCode
        name
        slug
        description
      }
      customFields @customFields(entity: "Collection")
    }
  }
`);

/** Read-only preview of what the collection's filters match. */
export const CollectionContentsDocument = graphql(`
  query CollectionContents($id: ID!, $options: ProductVariantListOptions) {
    collection(id: $id) {
      id
      productVariants(options: $options) {
        totalItems
        items {
          id
          name
          sku
          featuredAsset {
            id
            preview
          }
          product {
            id
            featuredAsset {
              id
              preview
            }
          }
        }
      }
    }
  }
`);

export const CollectionFiltersDocument = graphql(`
  query CollectionFilters {
    collectionFilters {
      code
      description
      args {
        name
        type
        list
        required
        defaultValue
        label
        description
        ui
      }
    }
  }
`);

export const CreateCollectionDocument = graphql(`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
    }
  }
`);

export const UpdateCollectionDocument = graphql(`
  mutation UpdateCollection($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
      id
      updatedAt
    }
  }
`);

export const MoveCollectionDocument = graphql(`
  mutation MoveCollection($input: MoveCollectionInput!) {
    moveCollection(input: $input) {
      id
      parentId
    }
  }
`);

export const DeleteCollectionDocument = graphql(`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(id: $id) {
      result
      message
    }
  }
`);
