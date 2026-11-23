import { graphql } from '@/gql';

/**
 * Order operations. `OrderListDocument`, `OrderDetailDocument` and the `OrderListItem`
 * fragment are used by the dashboard and `scripts/smoke.ts`; keep their names stable.
 * Fields stay compatible with Vendure 2.2+ (no `Refund.destination`).
 */

export const OrderListItemFragment = graphql(`
  fragment OrderListItem on Order {
    id
    code
    state
    active
    orderPlacedAt
    updatedAt
    totalWithTax
    currencyCode
    customer {
      id
      firstName
      lastName
      emailAddress
    }
  }
`);

export const OrderListDocument = graphql(`
  query OrderList($options: OrderListOptions) {
    orders(options: $options) {
      items {
        ...OrderListItem
      }
      totalItems
    }
  }
`);

export const OrderDetailDocument = graphql(`
  query OrderDetail($id: ID!) {
    order(id: $id) {
      id
      code
      state
      active
      type
      createdAt
      updatedAt
      orderPlacedAt
      currencyCode
      totalQuantity
      subTotal
      subTotalWithTax
      shipping
      shippingWithTax
      total
      totalWithTax
      nextStates
      couponCodes
      customer {
        id
        firstName
        lastName
        emailAddress
        phoneNumber
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
      lines {
        id
        quantity
        orderPlacedQuantity
        unitPriceWithTax
        proratedUnitPriceWithTax
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
        fulfillmentLines {
          fulfillmentId
          quantity
        }
        customFields @customFields(entity: "OrderLine")
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
      surcharges {
        id
        description
        priceWithTax
      }
      shippingLines {
        id
        priceWithTax
        discountedPriceWithTax
        shippingMethod {
          id
          name
          code
          fulfillmentHandlerCode
        }
      }
      payments {
        id
        method
        amount
        state
        nextStates
        transactionId
        errorMessage
        metadata
        createdAt
        refunds {
          id
          createdAt
          state
          total
          items
          shipping
          adjustment
          reason
          transactionId
          method
          metadata
          lines {
            orderLineId
            quantity
          }
        }
      }
      fulfillments {
        id
        state
        nextStates
        method
        trackingCode
        createdAt
        updatedAt
        lines {
          orderLineId
          quantity
        }
      }
      modifications {
        id
        createdAt
        priceChange
        note
        isSettled
      }
      customFields @customFields(entity: "Order")
    }
  }
`);

export const OrderHistoryDocument = graphql(`
  query OrderHistory($id: ID!, $options: HistoryEntryListOptions) {
    activeAdministrator {
      id
    }
    order(id: $id) {
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

export const AddOrderNoteDocument = graphql(`
  mutation AddOrderNote($input: AddNoteToOrderInput!) {
    addNoteToOrder(input: $input) {
      id
    }
  }
`);

export const UpdateOrderNoteDocument = graphql(`
  mutation UpdateOrderNote($input: UpdateOrderNoteInput!) {
    updateOrderNote(input: $input) {
      id
    }
  }
`);

export const DeleteOrderNoteDocument = graphql(`
  mutation DeleteOrderNote($id: ID!) {
    deleteOrderNote(id: $id) {
      result
      message
    }
  }
`);

export const TransitionOrderToStateDocument = graphql(`
  mutation TransitionOrderToState($id: ID!, $state: String!) {
    transitionOrderToState(id: $id, state: $state) {
      __typename
      ... on Order {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
      ... on OrderStateTransitionError {
        transitionError
      }
    }
  }
`);

export const OrderPaymentMethodsDocument = graphql(`
  query OrderPaymentMethods($options: PaymentMethodListOptions) {
    paymentMethods(options: $options) {
      items {
        id
        name
        code
        enabled
      }
      totalItems
    }
  }
`);

export const AddManualPaymentDocument = graphql(`
  mutation AddManualPayment($input: ManualPaymentInput!) {
    addManualPaymentToOrder(input: $input) {
      __typename
      ... on Order {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const SettlePaymentDocument = graphql(`
  mutation SettlePayment($id: ID!) {
    settlePayment(id: $id) {
      __typename
      ... on Payment {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const CancelPaymentDocument = graphql(`
  mutation CancelPayment($id: ID!) {
    cancelPayment(id: $id) {
      __typename
      ... on Payment {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const TransitionPaymentToStateDocument = graphql(`
  mutation TransitionPaymentToState($id: ID!, $state: String!) {
    transitionPaymentToState(id: $id, state: $state) {
      __typename
      ... on Payment {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const FulfillmentHandlersDocument = graphql(`
  query FulfillmentHandlers {
    fulfillmentHandlers {
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

export const FulfillOrderDocument = graphql(`
  mutation FulfillOrder($input: FulfillOrderInput!) {
    addFulfillmentToOrder(input: $input) {
      __typename
      ... on Fulfillment {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const TransitionFulfillmentDocument = graphql(`
  mutation TransitionFulfillment($id: ID!, $state: String!) {
    transitionFulfillmentToState(id: $id, state: $state) {
      __typename
      ... on Fulfillment {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const CancelOrderDocument = graphql(`
  mutation CancelOrder($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      __typename
      ... on Order {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const RefundOrderDocument = graphql(`
  mutation RefundOrder($input: RefundOrderInput!) {
    refundOrder(input: $input) {
      __typename
      ... on Refund {
        id
        state
        total
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const SettleRefundDocument = graphql(`
  mutation SettleRefund($input: SettleRefundInput!) {
    settleRefund(input: $input) {
      __typename
      ... on Refund {
        id
        state
        transactionId
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const ModifyOrderDocument = graphql(`
  mutation ModifyOrder($input: ModifyOrderInput!) {
    modifyOrder(input: $input) {
      __typename
      ... on Order {
        id
        state
        subTotalWithTax
        shippingWithTax
        totalWithTax
        currencyCode
        lines {
          id
          quantity
          linePriceWithTax
          productVariant {
            id
            name
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const SetOrderCustomFieldsDocument = graphql(`
  mutation SetOrderCustomFields($input: UpdateOrderInput!) {
    setOrderCustomFields(input: $input) {
      id
    }
  }
`);
