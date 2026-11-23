import { graphql } from '@/gql';

export const AssetListDocument = graphql(`
  query AssetList($options: AssetListOptions) {
    assets(options: $options) {
      items {
        id
        name
        preview
        type
        mimeType
      }
      totalItems
    }
  }
`);

export const AssetDetailDocument = graphql(`
  query AssetDetail($id: ID!) {
    asset(id: $id) {
      id
      createdAt
      updatedAt
      name
      type
      fileSize
      mimeType
      width
      height
      source
      preview
      focalPoint {
        x
        y
      }
      tags {
        id
        value
      }
      customFields @customFields(entity: "Asset")
    }
  }
`);

export const AssetTagsDocument = graphql(`
  query AssetTags($options: TagListOptions) {
    tags(options: $options) {
      items {
        id
        value
      }
      totalItems
    }
  }
`);

export const UpdateAssetDocument = graphql(`
  mutation UpdateAsset($input: UpdateAssetInput!) {
    updateAsset(input: $input) {
      id
      updatedAt
    }
  }
`);

export const DeleteAssetsDocument = graphql(`
  mutation DeleteAssets($input: DeleteAssetsInput!) {
    deleteAssets(input: $input) {
      result
      message
    }
  }
`);

/** Sent as a multipart request by `src/api/upload.ts` (the JSON client can't carry files). */
export const CreateAssetsDocument = graphql(`
  mutation CreateAssets($input: [CreateAssetInput!]!) {
    createAssets(input: $input) {
      ... on Asset {
        __typename
        id
        name
        preview
        mimeType
      }
      ... on MimeTypeError {
        __typename
        errorCode
        message
        fileName
        mimeType
      }
    }
  }
`);
