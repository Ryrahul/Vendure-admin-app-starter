import { graphql } from '@/gql';

export const ProfileDetailDocument = graphql(`
  query ProfileDetail {
    activeAdministrator {
      id
      createdAt
      updatedAt
      firstName
      lastName
      emailAddress
      user {
        id
        identifier
        lastLogin
        roles {
          id
          code
          description
        }
      }
      customFields @customFields(entity: "Administrator")
    }
  }
`);

export const UpdateProfileDocument = graphql(`
  mutation UpdateProfile($input: UpdateActiveAdministratorInput!) {
    updateActiveAdministrator(input: $input) {
      id
    }
  }
`);
