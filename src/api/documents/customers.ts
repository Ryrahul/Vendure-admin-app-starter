import { graphql } from '@/gql';

export const CustomerListDocument = graphql(`
  query CustomerList($options: CustomerListOptions) {
    customers(options: $options) {
      items {
        id
        createdAt
        title
        firstName
        lastName
        emailAddress
        phoneNumber
        user {
          id
          verified
        }
      }
      totalItems
    }
  }
`);

export const CustomerAddressFragment = graphql(`
  fragment CustomerAddress on Address {
    id
    fullName
    company
    streetLine1
    streetLine2
    city
    province
    postalCode
    phoneNumber
    defaultShippingAddress
    defaultBillingAddress
    country {
      id
      code
      name
    }
    customFields @customFields(entity: "Address")
  }
`);

export const CustomerDetailDocument = graphql(`
  query CustomerDetail($id: ID!) {
    customer(id: $id) {
      id
      createdAt
      updatedAt
      title
      firstName
      lastName
      phoneNumber
      emailAddress
      groups {
        id
        name
      }
      user {
        id
        identifier
        verified
        lastLogin
      }
      addresses {
        ...CustomerAddress
      }
      customFields @customFields(entity: "Customer")
    }
  }
`);

export const CustomerOrdersDocument = graphql(`
  query CustomerOrders($customerId: ID!, $options: OrderListOptions) {
    customer(id: $customerId) {
      id
      orders(options: $options) {
        items {
          ...OrderListItem
        }
        totalItems
      }
    }
  }
`);

export const CustomerHistoryDocument = graphql(`
  query CustomerHistory($id: ID!, $options: HistoryEntryListOptions) {
    activeAdministrator {
      id
    }
    customer(id: $id) {
      id
      history(options: $options) {
        totalItems
        items {
          id
          type
          createdAt
          isPublic
          data
          administrator {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`);

export const CreateCustomerDocument = graphql(`
  mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
    createCustomer(input: $input, password: $password) {
      __typename
      ... on Customer {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const UpdateCustomerDocument = graphql(`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      __typename
      ... on Customer {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const DeleteCustomerDocument = graphql(`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      result
      message
    }
  }
`);

export const VerifyCustomerAccountDocument = graphql(`
  mutation VerifyCustomerAccount($id: ID!, $password: String) {
    verifyCustomerAccount(id: $id, password: $password) {
      __typename
      ... on Customer {
        id
        user {
          id
          verified
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const CreateCustomerAddressDocument = graphql(`
  mutation CreateCustomerAddress($customerId: ID!, $input: CreateAddressInput!) {
    createCustomerAddress(customerId: $customerId, input: $input) {
      id
    }
  }
`);

export const UpdateCustomerAddressDocument = graphql(`
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      id
    }
  }
`);

export const DeleteCustomerAddressDocument = graphql(`
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
    }
  }
`);

export const AddCustomerNoteDocument = graphql(`
  mutation AddCustomerNote($input: AddNoteToCustomerInput!) {
    addNoteToCustomer(input: $input) {
      id
    }
  }
`);

export const UpdateCustomerNoteDocument = graphql(`
  mutation UpdateCustomerNote($input: UpdateCustomerNoteInput!) {
    updateCustomerNote(input: $input) {
      id
    }
  }
`);

export const DeleteCustomerNoteDocument = graphql(`
  mutation DeleteCustomerNote($id: ID!) {
    deleteCustomerNote(id: $id) {
      result
      message
    }
  }
`);

/** Countries for address forms (also backs `countryPicker`). */
export const CountryListDocument = graphql(`
  query CountryList($options: CountryListOptions) {
    countries(options: $options) {
      items {
        id
        code
        name
        enabled
      }
      totalItems
    }
  }
`);
