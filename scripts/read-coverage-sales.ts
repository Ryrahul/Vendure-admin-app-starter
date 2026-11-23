import { CustomerGroupDetailDocument, CustomerGroupListDocument, CustomerGroupMembersDocument } from '../src/api/documents/customer-groups';
import { CustomerDetailDocument, CustomerHistoryDocument, CustomerListDocument, CustomerOrdersDocument } from '../src/api/documents/customers';
import {
  FulfillmentHandlersDocument,
  OrderHistoryDocument,
  OrderListDocument,
  OrderPaymentMethodsDocument,
} from '../src/api/documents/orders';
import type { Area } from './read-coverage';

/** Sales areas: customers, customer groups, order history + order action config. */
export const extraAreas: Area[] = [
  {
    label: 'customers',
    list: CustomerListDocument,
    pick: (r) => r.customers,
    detail: CustomerDetailDocument,
    related: [
      { doc: CustomerOrdersDocument, vars: (id) => ({ customerId: id, options: { take: 5 } }) },
      { doc: CustomerHistoryDocument, vars: (id) => ({ id, options: { take: 5 } }) },
    ],
  },
  {
    label: 'customer groups',
    list: CustomerGroupListDocument,
    pick: (r) => r.customerGroups,
    detail: CustomerGroupDetailDocument,
    related: [{ doc: CustomerGroupMembersDocument, vars: (id) => ({ id, options: { take: 5 } }) }],
  },
  {
    label: 'order history & actions',
    list: OrderListDocument,
    pick: (r) => r.orders,
    related: [{ doc: OrderHistoryDocument, vars: (id) => ({ id, options: { take: 10 } }) }],
    singles: [FulfillmentHandlersDocument, OrderPaymentMethodsDocument],
  },
];
