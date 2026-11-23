import { graphql } from '@/gql';

export const PaymentMethodListDocument = graphql(`
  query PaymentMethodList($options: PaymentMethodListOptions) {
    paymentMethods(options: $options) {
      items {
        id
        code
        name
        enabled
        handler {
          code
        }
      }
      totalItems
    }
  }
`);

export const PaymentMethodDetailDocument = graphql(`
  query PaymentMethodDetail($id: ID!) {
    paymentMethod(id: $id) {
      id
      createdAt
      updatedAt
      code
      name
      description
      enabled
      checker {
        code
        args {
          name
          value
        }
      }
      handler {
        code
        args {
          name
          value
        }
      }
      translations @customFields(entity: "PaymentMethod", locale: true) {
        id
        languageCode
        name
        description
      }
      customFields @customFields(entity: "PaymentMethod")
    }
  }
`);

export const PaymentMethodOperationsDocument = graphql(`
  query PaymentMethodOperations {
    paymentMethodHandlers {
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
    paymentMethodEligibilityCheckers {
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

export const CreatePaymentMethodDocument = graphql(`
  mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
    createPaymentMethod(input: $input) {
      id
    }
  }
`);

export const UpdatePaymentMethodDocument = graphql(`
  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
    updatePaymentMethod(input: $input) {
      id
    }
  }
`);

export const DeletePaymentMethodDocument = graphql(`
  mutation DeletePaymentMethod($id: ID!, $force: Boolean) {
    deletePaymentMethod(id: $id, force: $force) {
      result
      message
    }
  }
`);
