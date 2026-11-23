import { graphql } from '@/gql';

export const ApiKeyListDocument = graphql(`
  query ApiKeyList($options: ApiKeyListOptions) {
    apiKeys(options: $options) {
      items {
        id
        name
        lookupId
        lastUsedAt
      }
      totalItems
    }
  }
`);

export const ApiKeyDetailDocument = graphql(`
  query ApiKeyDetail($id: ID!) {
    apiKey(id: $id) {
      id
      createdAt
      updatedAt
      lookupId
      lastUsedAt
      name
      owner {
        id
        identifier
      }
      user {
        id
        roles {
          id
          code
          description
        }
      }
      translations @customFields(entity: "ApiKey", locale: true) {
        id
        languageCode
        name
      }
      customFields @customFields(entity: "ApiKey")
    }
  }
`);

/** Roles a non-SuperAdmin may grant to an API key (only their own). */
export const ActiveAdministratorRolesDocument = graphql(`
  query ActiveAdministratorRoles {
    activeAdministrator {
      id
      user {
        id
        roles {
          id
          code
          description
        }
      }
    }
  }
`);

/** The secret in `apiKey` is returned once; never log or cache it. */
export const CreateApiKeyDocument = graphql(`
  mutation CreateApiKey($input: CreateApiKeyInput!) {
    createApiKey(input: $input) {
      apiKey
      entityId
    }
  }
`);

export const UpdateApiKeyDocument = graphql(`
  mutation UpdateApiKey($input: UpdateApiKeyInput!) {
    updateApiKey(input: $input) {
      id
    }
  }
`);

export const RotateApiKeyDocument = graphql(`
  mutation RotateApiKey($id: ID!) {
    rotateApiKey(id: $id) {
      apiKey
    }
  }
`);

export const DeleteApiKeysDocument = graphql(`
  mutation DeleteApiKeys($ids: [ID!]!) {
    deleteApiKeys(ids: $ids) {
      result
      message
    }
  }
`);
