import { graphql } from '@/gql';

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
        phoneNumber
      }
      billingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
      }
      lines {
        id
        quantity
        unitPriceWithTax
        linePriceWithTax
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
      shippingLines {
        id
        priceWithTax
        shippingMethod {
          id
          name
        }
      }
      payments {
        id
        method
        amount
        state
        transactionId
        createdAt
      }
      fulfillments {
        id
        state
        method
        trackingCode
        createdAt
      }
    }
  }
`);
