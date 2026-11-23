import { graphql } from '@/gql';

export const RoleListDocument = graphql(`
  query RoleList($options: RoleListOptions) {
    roles(options: $options) {
      items {
        id
        code
        description
        permissions
        channels {
          id
          code
        }
      }
      totalItems
    }
  }
`);

export const RoleDetailDocument = graphql(`
  query RoleDetail($id: ID!) {
    role(id: $id) {
      id
      createdAt
      updatedAt
      code
      description
      permissions
      channels {
        id
        code
      }
      customFields @customFields(entity: "Role")
    }
  }
`);

export const CreateRoleDocument = graphql(`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
    }
  }
`);

export const UpdateRoleDocument = graphql(`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      id
    }
  }
`);

export const DeleteRoleDocument = graphql(`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      result
      message
    }
  }
`);

export const PickRoleOptionsDocument = graphql(`
  query PickRoleOptions($options: RoleListOptions) {
    roles(options: $options) {
      items {
        id
        code
        description
      }
      totalItems
    }
  }
`);

export const PickChannelOptionsDocument = graphql(`
  query PickChannelOptions($options: ChannelListOptions) {
    channels(options: $options) {
      items {
        id
        code
      }
      totalItems
    }
  }
`);
