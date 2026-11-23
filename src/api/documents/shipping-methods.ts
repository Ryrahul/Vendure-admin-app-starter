import { graphql } from '@/gql';

export const ShippingMethodListDocument = graphql(`
  query ShippingMethodList($options: ShippingMethodListOptions) {
    shippingMethods(options: $options) {
      items {
        id
        code
        name
        fulfillmentHandlerCode
      }
      totalItems
    }
  }
`);

export const ShippingMethodDetailDocument = graphql(`
  query ShippingMethodDetail($id: ID!) {
    shippingMethod(id: $id) {
      id
      createdAt
      updatedAt
      languageCode
      code
      name
      description
      fulfillmentHandlerCode
      checker {
        code
        args {
          name
          value
        }
      }
      calculator {
        code
        args {
          name
          value
        }
      }
      translations @customFields(entity: "ShippingMethod", locale: true) {
        id
        languageCode
        name
        description
      }
      customFields @customFields(entity: "ShippingMethod")
    }
  }
`);

export const ShippingMethodOperationsDocument = graphql(`
  query ShippingMethodOperations {
    shippingEligibilityCheckers {
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
    shippingCalculators {
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
    fulfillmentHandlers {
      code
      description
    }
  }
`);

export const CreateShippingMethodDocument = graphql(`
  mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
    createShippingMethod(input: $input) {
      id
    }
  }
`);

export const UpdateShippingMethodDocument = graphql(`
  mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
    updateShippingMethod(input: $input) {
      id
    }
  }
`);

export const DeleteShippingMethodDocument = graphql(`
  mutation DeleteShippingMethod($id: ID!) {
    deleteShippingMethod(id: $id) {
      result
      message
    }
  }
`);

export const TestShippingMethodDocument = graphql(`
  query TestShippingMethod($input: TestShippingMethodInput!) {
    testShippingMethod(input: $input) {
      eligible
      quote {
        price
        priceWithTax
        metadata
      }
    }
  }
`);

export const TestEligibleShippingMethodsDocument = graphql(`
  query TestEligibleShippingMethods($input: TestEligibleShippingMethodsInput!) {
    testEligibleShippingMethods(input: $input) {
      id
      code
      name
      price
      priceWithTax
    }
  }
`);
