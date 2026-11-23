import { graphql } from '@/gql';

export const GlobalSettingsDetailDocument = graphql(`
  query GlobalSettingsDetail {
    globalSettings {
      id
      updatedAt
      availableLanguages
      trackInventory
      outOfStockThreshold
      customFields @customFields(entity: "GlobalSettings")
    }
  }
`);

export const UpdateGlobalSettingsDocument = graphql(`
  mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {
    updateGlobalSettings(input: $input) {
      __typename
      ... on GlobalSettings {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);
