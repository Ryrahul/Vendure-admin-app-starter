import { graphql } from '@/gql';

export const CustomerGroupListDocument = graphql(`
  query CustomerGroupList($options: CustomerGroupListOptions) {
    customerGroups(options: $options) {
      items {
        id
        name
        customers {
          totalItems
        }
      }
      totalItems
    }
  }
`);

export const CustomerGroupDetailDocument = graphql(`
  query CustomerGroupDetail($id: ID!) {
    customerGroup(id: $id) {
      id
      createdAt
      updatedAt
      name
      customFields @customFields(entity: "CustomerGroup")
    }
  }
`);

export const CustomerGroupMembersDocument = graphql(`
  query CustomerGroupMembers($id: ID!, $options: CustomerListOptions) {
    customerGroup(id: $id) {
      id
      customers(options: $options) {
        items {
          id
          firstName
          lastName
          emailAddress
        }
        totalItems
      }
    }
  }
`);

export const CreateCustomerGroupDocument = graphql(`
  mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
    createCustomerGroup(input: $input) {
      id
    }
  }
`);

export const UpdateCustomerGroupDocument = graphql(`
  mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {
    updateCustomerGroup(input: $input) {
      id
    }
  }
`);

export const DeleteCustomerGroupDocument = graphql(`
  mutation DeleteCustomerGroup($id: ID!) {
    deleteCustomerGroup(id: $id) {
      result
      message
    }
  }
`);

export const AddCustomersToGroupDocument = graphql(`
  mutation AddCustomersToGroup($customerGroupId: ID!, $customerIds: [ID!]!) {
    addCustomersToGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {
      id
    }
  }
`);

export const RemoveCustomersFromGroupDocument = graphql(`
  mutation RemoveCustomersFromGroup($customerGroupId: ID!, $customerIds: [ID!]!) {
    removeCustomersFromGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {
      id
    }
  }
`);
