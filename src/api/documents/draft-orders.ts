import { graphql } from '@/gql';

/** Draft orders: created by an administrator, edited line by line, then completed into ArrangingPayment. */

export const DraftOrderDetailDocument = graphql(`
  query DraftOrderDetail($id: ID!) {
    order(id: $id) {
      id
      code
      state
      active
      createdAt
      updatedAt
      currencyCode
      totalQuantity
      subTotalWithTax
      shippingWithTax
      total
      totalWithTax
      couponCodes
      nextStates
      customer {
        id
        firstName
        lastName
        emailAddress
        addresses {
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
        }
      }
      lines {
        id
        quantity
        unitPriceWithTax
        linePriceWithTax
        discountedLinePriceWithTax
        featuredAsset {
          id
          preview
        }
        productVariant {
          id
          name
          sku
        }
      }
      discounts {
        description
        amountWithTax
      }
      promotions {
        id
        name
        couponCode
      }
      shippingLines {
        id
        priceWithTax
        shippingMethod {
          id
          name
        }
      }
      shippingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        countryCode
        phoneNumber
      }
      billingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        countryCode
        phoneNumber
      }
      customFields @customFields(entity: "Order")
    }
  }
`);

export const CreateDraftOrderDocument = graphql(`
  mutation CreateDraftOrder {
    createDraftOrder {
      id
    }
  }
`);

export const DeleteDraftOrderDocument = graphql(`
  mutation DeleteDraftOrder($orderId: ID!) {
    deleteDraftOrder(orderId: $orderId) {
      result
      message
    }
  }
`);

export const AddItemToDraftOrderDocument = graphql(`
  mutation AddItemToDraftOrder($orderId: ID!, $input: AddItemToDraftOrderInput!) {
    addItemToDraftOrder(orderId: $orderId, input: $input) {
      __typename
      ... on Order {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const AdjustDraftOrderLineDocument = graphql(`
  mutation AdjustDraftOrderLine($orderId: ID!, $input: AdjustDraftOrderLineInput!) {
    adjustDraftOrderLine(orderId: $orderId, input: $input) {
      __typename
      ... on Order {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const RemoveDraftOrderLineDocument = graphql(`
  mutation RemoveDraftOrderLine($orderId: ID!, $orderLineId: ID!) {
    removeDraftOrderLine(orderId: $orderId, orderLineId: $orderLineId) {
      __typename
      ... on Order {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const SetCustomerForDraftOrderDocument = graphql(`
  mutation SetCustomerForDraftOrder($orderId: ID!, $customerId: ID, $input: CreateCustomerInput) {
    setCustomerForDraftOrder(orderId: $orderId, customerId: $customerId, input: $input) {
      __typename
      ... on Order {
        id
        customer {
          id
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const SetDraftOrderShippingAddressDocument = graphql(`
  mutation SetDraftOrderShippingAddress($orderId: ID!, $input: CreateAddressInput!) {
    setDraftOrderShippingAddress(orderId: $orderId, input: $input) {
      id
    }
  }
`);

export const SetDraftOrderBillingAddressDocument = graphql(`
  mutation SetDraftOrderBillingAddress($orderId: ID!, $input: CreateAddressInput!) {
    setDraftOrderBillingAddress(orderId: $orderId, input: $input) {
      id
    }
  }
`);

export const UnsetDraftOrderShippingAddressDocument = graphql(`
  mutation UnsetDraftOrderShippingAddress($orderId: ID!) {
    unsetDraftOrderShippingAddress(orderId: $orderId) {
      id
    }
  }
`);

export const UnsetDraftOrderBillingAddressDocument = graphql(`
  mutation UnsetDraftOrderBillingAddress($orderId: ID!) {
    unsetDraftOrderBillingAddress(orderId: $orderId) {
      id
    }
  }
`);

export const DraftOrderEligibleShippingMethodsDocument = graphql(`
  query DraftOrderEligibleShippingMethods($orderId: ID!) {
    eligibleShippingMethodsForDraftOrder(orderId: $orderId) {
      id
      name
      code
      description
      price
      priceWithTax
    }
  }
`);

export const SetDraftOrderShippingMethodDocument = graphql(`
  mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {
    setDraftOrderShippingMethod(orderId: $orderId, shippingMethodId: $shippingMethodId) {
      __typename
      ... on Order {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const ApplyCouponCodeToDraftOrderDocument = graphql(`
  mutation ApplyCouponCodeToDraftOrder($orderId: ID!, $couponCode: String!) {
    applyCouponCodeToDraftOrder(orderId: $orderId, couponCode: $couponCode) {
      __typename
      ... on Order {
        id
        couponCodes
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const RemoveCouponCodeFromDraftOrderDocument = graphql(`
  mutation RemoveCouponCodeFromDraftOrder($orderId: ID!, $couponCode: String!) {
    removeCouponCodeFromDraftOrder(orderId: $orderId, couponCode: $couponCode) {
      id
      couponCodes
    }
  }
`);

export const SetDraftOrderCustomFieldsDocument = graphql(`
  mutation SetDraftOrderCustomFields($orderId: ID!, $input: UpdateOrderInput!) {
    setDraftOrderCustomFields(orderId: $orderId, input: $input) {
      id
    }
  }
`);

/** A few purchasable variants (used by the dev-server smoke suites to build orders). */
export const DraftOrderVariantsDocument = graphql(`
  query DraftOrderVariants($options: ProductVariantListOptions) {
    productVariants(options: $options) {
      items {
        id
        name
        sku
        stockLevel
      }
      totalItems
    }
  }
`);
