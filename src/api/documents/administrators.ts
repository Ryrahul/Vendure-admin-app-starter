import { graphql } from '@/gql';

export const AdministratorListDocument = graphql(`
  query AdministratorList($options: AdministratorListOptions) {
    administrators(options: $options) {
      items {
        id
        firstName
        lastName
        emailAddress
        user {
          id
          roles {
            id
            code
          }
        }
      }
      totalItems
    }
  }
`);

export const AdministratorDetailDocument = graphql(`
  query AdministratorDetail($id: ID!) {
    administrator(id: $id) {
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
          channels {
            id
            code
          }
        }
      }
      customFields @customFields(entity: "Administrator")
    }
  }
`);

export const CreateAdministratorDocument = graphql(`
  mutation CreateAdministrator($input: CreateAdministratorInput!) {
    createAdministrator(input: $input) {
      id
    }
  }
`);

export const UpdateAdministratorDocument = graphql(`
  mutation UpdateAdministrator($input: UpdateAdministratorInput!) {
    updateAdministrator(input: $input) {
      id
    }
  }
`);

export const DeleteAdministratorDocument = graphql(`
  mutation DeleteAdministrator($id: ID!) {
    deleteAdministrator(id: $id) {
      result
      message
    }
  }
`);
