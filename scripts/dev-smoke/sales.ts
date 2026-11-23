/**
 * Sales write suites (orders, draft orders, customers, customer groups) for the local dev server.
 * Orders are created through draft orders (admin) or through the local Shop API (for an
 * Authorized payment), so the seeded orders are left alone.
 */
import {
  AddItemToDraftOrderDocument,
  AdjustDraftOrderLineDocument,
  ApplyCouponCodeToDraftOrderDocument,
  CreateDraftOrderDocument,
  DeleteDraftOrderDocument,
  DraftOrderDetailDocument,
  DraftOrderVariantsDocument,
  DraftOrderEligibleShippingMethodsDocument,
  RemoveDraftOrderLineDocument,
  SetCustomerForDraftOrderDocument,
  SetDraftOrderBillingAddressDocument,
  SetDraftOrderCustomFieldsDocument,
  SetDraftOrderShippingAddressDocument,
  SetDraftOrderShippingMethodDocument,
  UnsetDraftOrderBillingAddressDocument,
} from '../../src/api/documents/draft-orders';
import {
  AddCustomersToGroupDocument,
  CreateCustomerGroupDocument,
  CustomerGroupDetailDocument,
  CustomerGroupListDocument,
  CustomerGroupMembersDocument,
  DeleteCustomerGroupDocument,
  RemoveCustomersFromGroupDocument,
  UpdateCustomerGroupDocument,
} from '../../src/api/documents/customer-groups';
import {
  AddCustomerNoteDocument,
  CreateCustomerAddressDocument,
  CountryListDocument,
  CreateCustomerDocument,
  CustomerDetailDocument,
  CustomerHistoryDocument,
  CustomerListDocument,
  CustomerOrdersDocument,
  DeleteCustomerAddressDocument,
  DeleteCustomerDocument,
  DeleteCustomerNoteDocument,
  UpdateCustomerAddressDocument,
  UpdateCustomerDocument,
  UpdateCustomerNoteDocument,
  VerifyCustomerAccountDocument,
} from '../../src/api/documents/customers';
import {
  AddManualPaymentDocument,
  AddOrderNoteDocument,
  CancelOrderDocument,
  CancelPaymentDocument,
  DeleteOrderNoteDocument,
  FulfillmentHandlersDocument,
  FulfillOrderDocument,
  ModifyOrderDocument,
  OrderDetailDocument,
  OrderHistoryDocument,
  OrderListDocument,
  OrderPaymentMethodsDocument,
  RefundOrderDocument,
  SetOrderCustomFieldsDocument,
  SettlePaymentDocument,
  SettleRefundDocument,
  TransitionFulfillmentDocument,
  TransitionOrderToStateDocument,
  UpdateOrderNoteDocument,
} from '../../src/api/documents/orders';
import { assertLocal, expect, type SmokeContext } from '../smoke-lib';
import type { Suite } from './index';

type Run = SmokeContext['run'];

/** Throws on an ErrorResult union member, like `unwrapResult()` in the app. */
function ok<T>(result: T, label: string): T {
  const r = result as { errorCode?: string; message?: string; transitionError?: string };
  if (r && typeof r === 'object' && r.errorCode) throw new Error(`✗ ${label}: ${r.message} ${r.transitionError ?? ''}`);
  return result;
}

const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

const ADDRESS = {
  fullName: 'Smoke Tester',
  streetLine1: '1 Smoke Street',
  city: 'Kathmandu',
  postalCode: '44600',
  countryCode: 'NP',
  phoneNumber: '+977 1 5550000',
};

async function someVariantIds(run: Run, n: number) {
  const r = await run(DraftOrderVariantsDocument, { options: { take: 40, filter: { enabled: { eq: true } } } });
  const ids = r.productVariants.items.map((v) => v.id);
  expect(ids.length >= n, 'enough variants');
  return ids.slice(0, n);
}

/** Draft order → customer → 2 lines → addresses → shipping → ArrangingPayment. Returns the order id. */
async function placeDraftOrder(run: Run, opts: { lines?: number; quantity?: number } = {}) {
  const { createDraftOrder } = await run(CreateDraftOrderDocument);
  const orderId = createDraftOrder.id;
  const s = stamp();
  const setCustomer = await run(SetCustomerForDraftOrderDocument, {
    orderId,
    input: { firstName: 'Smoke', lastName: `Order ${s}`, emailAddress: `smoke.order.${s}@example.com` },
  });
  ok(setCustomer.setCustomerForDraftOrder, 'set customer');
  for (const id of await someVariantIds(run, opts.lines ?? 2)) {
    ok(
      (await run(AddItemToDraftOrderDocument, { orderId, input: { productVariantId: id, quantity: opts.quantity ?? 2 } }))
        .addItemToDraftOrder,
      'add item',
    );
  }
  await run(SetDraftOrderShippingAddressDocument, { orderId, input: ADDRESS });
  await run(SetDraftOrderBillingAddressDocument, { orderId, input: ADDRESS });
  const methods = await run(DraftOrderEligibleShippingMethodsDocument, { orderId });
  expect(methods.eligibleShippingMethodsForDraftOrder.length > 0, 'eligible shipping methods');
  ok(
    (await run(SetDraftOrderShippingMethodDocument, { orderId, shippingMethodId: methods.eligibleShippingMethodsForDraftOrder[0].id }))
      .setDraftOrderShippingMethod,
    'set shipping method',
  );
  ok((await run(TransitionOrderToStateDocument, { id: orderId, state: 'ArrangingPayment' })).transitionOrderToState, 'complete draft');
  return orderId;
}

async function payManually(run: Run, orderId: string) {
  const methods = await run(OrderPaymentMethodsDocument, { options: { take: 50 } });
  const method = methods.paymentMethods.items.find((m) => m.enabled)?.code ?? 'standard-payment';
  const r = await run(AddManualPaymentDocument, {
    input: { orderId, method, transactionId: `smoke-${stamp()}`, metadata: { note: 'smoke manual payment' } },
  });
  return ok(r.addManualPaymentToOrder, 'add manual payment');
}

/** A GraphQL client for the local Shop API (keeps its own session token). */
function shopClient(ctx: SmokeContext) {
  const shopApi = ctx.state.apiUrl.replace(/admin-api\/?$/, 'shop-api');
  assertLocal(shopApi);
  let token: string | null = null;
  return async (query: string, variables: Record<string, unknown> = {}) => {
    const res = await fetch(shopApi, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ query, variables }),
    });
    token = res.headers.get('vendure-auth-token') ?? token;
    const json = (await res.json()) as { data?: any; errors?: { message: string }[] };
    if (json.errors?.length) throw new Error(`shop-api: ${json.errors[0].message}`);
    return json.data;
  };
}

/** Places an order through the local Shop API so its payment is Authorized (not settled). */
async function placeShopOrder(ctx: SmokeContext, run: Run) {
  const gql = shopClient(ctx);
  for (const id of await someVariantIds(run, 2)) {
    await gql(`mutation($id:ID!){ addItemToOrder(productVariantId:$id, quantity:2){ __typename } }`, { id });
  }
  const s = stamp();
  await gql(`mutation($i:CreateCustomerInput!){ setCustomerForOrder(input:$i){ __typename } }`, {
    i: { firstName: 'Smoke', lastName: `Shop ${s}`, emailAddress: `smoke.shop.${s}@example.com` },
  });
  await gql(`mutation($i:CreateAddressInput!){ setOrderShippingAddress(input:$i){ __typename } }`, { i: ADDRESS });
  const ship = await gql(`{ eligibleShippingMethods { id } }`);
  await gql(`mutation($id:[ID!]!){ setOrderShippingMethod(shippingMethodId:$id){ __typename } }`, {
    id: [ship.eligibleShippingMethods[0].id],
  });
  await gql(`mutation { transitionOrderToState(state:"ArrangingPayment"){ __typename } }`);
  const pay = await gql(
    `mutation { addPaymentToOrder(input:{method:"standard-payment", metadata:{}}){ __typename ... on Order { id state } ... on ErrorResult { message } } }`,
  );
  expect(pay.addPaymentToOrder.state === 'PaymentAuthorized', `shop order authorized (${pay.addPaymentToOrder.message ?? pay.addPaymentToOrder.state})`);
  return pay.addPaymentToOrder.id as string;
}

async function detail(run: Run, id: string) {
  const r = await run(OrderDetailDocument, { id });
  expect(r.order, `order ${id} exists`);
  return r.order;
}

const salesOrders: Suite = async (ctx) => {
  const { run } = ctx;
  const list = await run(OrderListDocument, { options: { take: 5, filter: { state: { eq: 'Draft' } } } });

  // 1. Draft-made order: manual payment → fulfil → Shipped → Delivered.
  const orderId = await placeDraftOrder(run);
  await payManually(run, orderId);
  let order = await detail(run, orderId);
  expect(order.state === 'PaymentSettled', `manual payment settles order (${order.state})`);
  const handlers = await run(FulfillmentHandlersDocument);
  const handler = handlers.fulfillmentHandlers.find((h) => h.code === 'manual-fulfillment') ?? handlers.fulfillmentHandlers[0];
  const fulfil = await run(FulfillOrderDocument, {
    input: {
      lines: order.lines.map((l) => ({ orderLineId: l.id, quantity: l.quantity })),
      handler: {
        code: handler.code,
        arguments: [
          { name: 'method', value: 'Courier' },
          { name: 'trackingCode', value: `TRK-${stamp()}` },
        ],
      },
    },
  });
  const fulfillment = ok(fulfil.addFulfillmentToOrder, 'fulfil');
  expect(fulfillment.__typename === 'Fulfillment', 'fulfillment created');
  for (const state of ['Shipped', 'Delivered']) {
    const t = await run(TransitionFulfillmentDocument, { id: fulfillment.id, state });
    ok(t.transitionFulfillmentToState, `fulfillment → ${state}`);
  }
  order = await detail(run, orderId);
  expect(order.state === 'Delivered', `order delivered (${order.state})`);

  // Notes: add → update → delete; custom fields.
  await run(AddOrderNoteDocument, { input: { id: orderId, note: 'Smoke note', isPublic: false } });
  const history = await run(OrderHistoryDocument, {
    id: orderId,
    options: { take: 100, sort: { createdAt: 'DESC' as const }, filter: { type: { eq: 'ORDER_NOTE' } } },
  });
  const note = history.order?.history.items.find((h) => (h.data as { note?: string }).note === 'Smoke note');
  expect(note, 'note added');
  await run(UpdateOrderNoteDocument, { input: { noteId: note.id, note: 'Smoke note (edited)', isPublic: true } });
  const edited = await run(OrderHistoryDocument, { id: orderId, options: { take: 100, filter: { type: { eq: 'ORDER_NOTE' } } } });
  const editedNote = edited.order?.history.items.find((h) => h.id === note.id);
  expect((editedNote?.data as { note?: string })?.note === 'Smoke note (edited)' && editedNote?.isPublic, 'note updated');
  const delNote = await run(DeleteOrderNoteDocument, { id: note.id });
  expect(delNote.deleteOrderNote.result === 'DELETED', 'note deleted');
  if (ctx.customFields.get('Order')?.some((d) => d.name === 'giftMessage')) {
    await run(SetOrderCustomFieldsDocument, { input: { id: orderId, customFields: { giftMessage: 'Smoke gift' } } });
    const cf = await detail(run, orderId);
    expect((cf.customFields as { giftMessage?: string }).giftMessage === 'Smoke gift', 'order custom field saved');
  }

  // 2. Shop order (Authorized): settle → refund one item + shipping → settle refund.
  const shopId = await placeShopOrder(ctx, run);
  let shop = await detail(run, shopId);
  const payment = shop.payments?.[0];
  expect(payment?.state === 'Authorized', 'payment authorized');
  ok((await run(SettlePaymentDocument, { id: payment.id })).settlePayment, 'settle payment');
  shop = await detail(run, shopId);
  expect(shop.state === 'PaymentSettled', `order settled (${shop.state})`);
  const line = shop.lines[0];
  const shippingLine = shop.shippingLines[0];
  const amount = line.proratedUnitPriceWithTax + (shippingLine?.discountedPriceWithTax ?? 0);
  ok(
    (
      await run(CancelOrderDocument, {
        input: { orderId: shopId, lines: [{ orderLineId: line.id, quantity: 1 }], reason: 'Smoke refund', cancelShipping: true },
      })
    ).cancelOrder,
    'cancel refunded line',
  );
  const refund = ok(
    (
      await run(RefundOrderDocument, {
        input: {
          paymentId: payment.id,
          lines: [{ orderLineId: line.id, quantity: 1 }],
          shipping: 0,
          adjustment: 0,
          amount,
          reason: 'Smoke refund',
        },
      })
    ).refundOrder,
    'refund',
  );
  expect(refund.__typename === 'Refund' && refund.total === amount, `refund total ${amount}`);
  if (refund.__typename === 'Refund' && refund.state === 'Pending') {
    ok((await run(SettleRefundDocument, { input: { id: refund.id, transactionId: `rf-${stamp()}` } })).settleRefund, 'settle refund');
  }
  shop = await detail(run, shopId);
  const refundState = shop.payments?.[0].refunds[0]?.state;
  expect(refundState === 'Settled', `refund settled (${refundState})`);

  // 3. Shop order: cancel the Authorized payment, then cancel the whole order.
  const cancelId = await placeShopOrder(ctx, run);
  const toCancel = await detail(run, cancelId);
  ok((await run(CancelPaymentDocument, { id: toCancel.payments![0].id })).cancelPayment, 'cancel payment');
  ok((await run(CancelOrderDocument, { input: { orderId: cancelId, reason: 'Smoke cancel', cancelShipping: true } })).cancelOrder, 'cancel order');
  const cancelled = await detail(run, cancelId);
  expect(cancelled.state === 'Cancelled', `order cancelled (${cancelled.state})`);

  // 4. Modify: +1 on the first line, dry run then apply, additional payment.
  const modId = await placeDraftOrder(run, { lines: 1, quantity: 1 });
  await payManually(run, modId);
  let mod = await detail(run, modId);
  ok((await run(TransitionOrderToStateDocument, { id: modId, state: 'Modifying' })).transitionOrderToState, '→ Modifying');
  const input = { orderId: modId, adjustOrderLines: [{ orderLineId: mod.lines[0].id, quantity: 2 }], note: 'Smoke modify' };
  const preview = ok((await run(ModifyOrderDocument, { input: { ...input, dryRun: true } })).modifyOrder, 'modify dry run');
  expect(preview.__typename === 'Order' && preview.totalWithTax > mod.totalWithTax, 'dry run total increases');
  const unchanged = await detail(run, modId);
  expect(unchanged.lines[0].quantity === 1, 'dry run did not persist');
  ok((await run(ModifyOrderDocument, { input: { ...input, dryRun: false } })).modifyOrder, 'modify apply');
  ok(
    (await run(TransitionOrderToStateDocument, { id: modId, state: 'ArrangingAdditionalPayment' })).transitionOrderToState,
    '→ ArrangingAdditionalPayment',
  );
  await payManually(run, modId);
  ok((await run(TransitionOrderToStateDocument, { id: modId, state: 'PaymentSettled' })).transitionOrderToState, '→ PaymentSettled');
  mod = await detail(run, modId);
  expect(mod.lines[0].quantity === 2 && mod.state === 'PaymentSettled', `order modified (${mod.state})`);

  ctx.ok(
    'sales-orders',
    `${list.orders.totalItems} drafts; pay → fulfil → shipped → delivered; notes; settle → refund → settle refund; cancel; modify`,
  );
};

const salesDraftOrders: Suite = async (ctx) => {
  const { run } = ctx;
  const { createDraftOrder } = await run(CreateDraftOrderDocument);
  const orderId = createDraftOrder.id;
  const s = stamp();
  const cust = ok(
    (
      await run(CreateCustomerDocument, {
        input: { firstName: 'Smoke', lastName: `Draft ${s}`, emailAddress: `smoke.draft.${s}@example.com` },
      })
    ).createCustomer,
    'create customer',
  );
  expect(cust.__typename === 'Customer', 'customer created');
  ok((await run(SetCustomerForDraftOrderDocument, { orderId, customerId: cust.id })).setCustomerForDraftOrder, 'set existing customer');
  const [a, b] = await someVariantIds(run, 2);
  ok((await run(AddItemToDraftOrderDocument, { orderId, input: { productVariantId: a, quantity: 1 } })).addItemToDraftOrder, 'add a');
  ok((await run(AddItemToDraftOrderDocument, { orderId, input: { productVariantId: b, quantity: 1 } })).addItemToDraftOrder, 'add b');
  let draft = (await run(DraftOrderDetailDocument, { id: orderId })).order!;
  expect(draft.state === 'Draft' && draft.lines.length === 2, 'draft has 2 lines');
  ok(
    (await run(AdjustDraftOrderLineDocument, { orderId, input: { orderLineId: draft.lines[0].id, quantity: 3 } })).adjustDraftOrderLine,
    'adjust line',
  );
  ok((await run(RemoveDraftOrderLineDocument, { orderId, orderLineId: draft.lines[1].id })).removeDraftOrderLine, 'remove line');
  await run(SetDraftOrderShippingAddressDocument, { orderId, input: ADDRESS });
  await run(SetDraftOrderBillingAddressDocument, { orderId, input: { ...ADDRESS, fullName: 'Billing Person' } });
  await run(UnsetDraftOrderBillingAddressDocument, { orderId });
  await run(SetDraftOrderBillingAddressDocument, { orderId, input: ADDRESS });
  const coupon = (await run(ApplyCouponCodeToDraftOrderDocument, { orderId, couponCode: `NOPE-${s}` })).applyCouponCodeToDraftOrder;
  expect(coupon.__typename !== 'Order', 'invalid coupon rejected');
  const methods = await run(DraftOrderEligibleShippingMethodsDocument, { orderId });
  const express = methods.eligibleShippingMethodsForDraftOrder.find((m) => /express/i.test(m.name)) ?? methods.eligibleShippingMethodsForDraftOrder[0];
  ok((await run(SetDraftOrderShippingMethodDocument, { orderId, shippingMethodId: express.id })).setDraftOrderShippingMethod, 'shipping');
  if (ctx.customFields.get('Order')?.some((d) => d.name === 'giftMessage')) {
    await run(SetDraftOrderCustomFieldsDocument, { orderId, input: { id: orderId, customFields: { giftMessage: 'Draft gift' } } });
  }
  draft = (await run(DraftOrderDetailDocument, { id: orderId })).order!;
  expect(draft.lines.length === 1 && draft.lines[0].quantity === 3, 'line adjusted, other removed');
  expect(draft.shippingLines[0]?.shippingMethod.id === express.id, 'shipping method set');
  expect(draft.billingAddress?.fullName === ADDRESS.fullName, 'billing address re-set');
  ok((await run(TransitionOrderToStateDocument, { id: orderId, state: 'ArrangingPayment' })).transitionOrderToState, 'complete draft');
  const done = (await run(DraftOrderDetailDocument, { id: orderId })).order!;
  expect(done.state === 'ArrangingPayment', `draft completed (${done.state})`);

  // Delete an empty draft.
  const extra = (await run(CreateDraftOrderDocument)).createDraftOrder.id;
  const del = await run(DeleteDraftOrderDocument, { orderId: extra });
  expect(del.deleteDraftOrder.result === 'DELETED', 'draft deleted');
  ctx.ok('sales-draft-orders', `draft ${done.code}: customer → lines → addresses → ${express.name} → ArrangingPayment; delete draft`);
};

const salesCustomers: Suite = async (ctx) => {
  const { run } = ctx;
  const list = await run(CustomerListDocument, { options: { take: 5 } });
  const s = stamp();
  const created = ok(
    (
      await run(CreateCustomerDocument, {
        input: { title: 'Dr', firstName: 'Smoke', lastName: `Customer ${s}`, emailAddress: `smoke.customer.${s}@example.com` },
        password: `Pw-${s}`,
      })
    ).createCustomer,
    'create customer',
  );
  expect(created.__typename === 'Customer', 'customer created');
  const id = created.id;
  const cfDefs = ctx.customFields.get('Customer') ?? [];
  ok(
    (
      await run(UpdateCustomerDocument, {
        input: {
          id,
          lastName: `Customer ${s} (edited)`,
          phoneNumber: '+977 9800000000',
          ...(cfDefs.some((d) => d.name === 'loyaltyPoints') ? { customFields: { loyaltyPoints: 42 } } : {}),
        },
      })
    ).updateCustomer,
    'update customer',
  );
  let c = (await run(CustomerDetailDocument, { id })).customer!;
  expect(c.lastName.endsWith('(edited)') && c.phoneNumber, 'customer updated');
  expect(c.user, 'created with a password → registered');

  // Verify: register through the Shop API (unverified), then verify as admin.
  const regEmail = `smoke.register.${s}@example.com`;
  const reg = await shopClient(ctx)(
    `mutation($i:RegisterCustomerInput!){ registerCustomerAccount(input:$i){ __typename ... on ErrorResult { message } } }`,
    { i: { emailAddress: regEmail, firstName: 'Smoke', lastName: `Register ${s}` } },
  );
  expect(reg.registerCustomerAccount.__typename === 'Success', `registered (${reg.registerCustomerAccount.message ?? ''})`);
  const regList = await run(CustomerListDocument, { options: { filter: { emailAddress: { eq: regEmail } } } });
  const registered = regList.customers.items[0];
  expect(registered?.user && !registered.user.verified, 'registered, unverified');
  const verified = ok((await run(VerifyCustomerAccountDocument, { id: registered.id, password: `Pw-${s}` })).verifyCustomerAccount, 'verify');
  expect(verified.__typename === 'Customer' && verified.user?.verified, 'customer verified');
  await run(DeleteCustomerDocument, { id: registered.id });

  // Addresses: create → update (default flags) → delete.
  const countries = await run(CountryListDocument, { options: { take: 1, filter: { code: { eq: 'NP' } } } });
  expect(countries.countries.items.length === 1, 'country NP exists');
  const addr = await run(CreateCustomerAddressDocument, { customerId: id, input: { ...ADDRESS, defaultShippingAddress: true } });
  await run(UpdateCustomerAddressDocument, { input: { id: addr.createCustomerAddress.id, city: 'Lalitpur', defaultBillingAddress: true } });
  c = (await run(CustomerDetailDocument, { id })).customer!;
  const a = c.addresses?.find((x) => x.id === addr.createCustomerAddress.id);
  expect(a?.city === 'Lalitpur' && a.defaultBillingAddress && a.defaultShippingAddress, 'address updated');
  const delAddr = await run(DeleteCustomerAddressDocument, { id: a.id });
  expect(delAddr.deleteCustomerAddress.success, 'address deleted');

  // Notes: add → update → delete.
  await run(AddCustomerNoteDocument, { input: { id, note: 'Smoke customer note', isPublic: false } });
  const h = await run(CustomerHistoryDocument, { id, options: { take: 50, filter: { type: { eq: 'CUSTOMER_NOTE' } } } });
  const note = h.customer?.history.items[0];
  expect(note && h.activeAdministrator?.id && note.administrator?.id === h.activeAdministrator.id, 'note added by me');
  await run(UpdateCustomerNoteDocument, { input: { noteId: note.id, note: 'Smoke customer note (edited)' } });
  const h2 = await run(CustomerHistoryDocument, { id, options: { take: 50, filter: { type: { eq: 'CUSTOMER_NOTE' } } } });
  expect((h2.customer?.history.items[0].data as { note?: string }).note?.endsWith('(edited)'), 'note updated');
  expect((await run(DeleteCustomerNoteDocument, { id: note.id })).deleteCustomerNote.result === 'DELETED', 'note deleted');

  const orders = await run(CustomerOrdersDocument, { customerId: id, options: { take: 5 } });
  const del = await run(DeleteCustomerDocument, { id });
  expect(del.deleteCustomer.result === 'DELETED', 'customer deleted');
  ctx.ok('sales-customers', `${list.customers.totalItems} listed; create → update → verify → address CRUD → notes → delete (${orders.customer?.orders.totalItems} orders)`);
};

const salesCustomerGroups: Suite = async (ctx) => {
  const { run } = ctx;
  const list = await run(CustomerGroupListDocument, { options: { take: 5 } });
  const s = stamp();
  const ids: string[] = [];
  for (const n of [1, 2]) {
    const r = ok(
      (
        await run(CreateCustomerDocument, {
          input: { firstName: 'Smoke', lastName: `Member ${n} ${s}`, emailAddress: `smoke.member${n}.${s}@example.com` },
        })
      ).createCustomer,
      'create member',
    );
    if (r.__typename === 'Customer') ids.push(r.id);
  }
  const { createCustomerGroup } = await run(CreateCustomerGroupDocument, { input: { name: `Smoke group ${s}` } });
  const groupId = createCustomerGroup.id;
  await run(UpdateCustomerGroupDocument, { input: { id: groupId, name: `Smoke group ${s} (edited)` } });
  const detailRes = await run(CustomerGroupDetailDocument, { id: groupId });
  expect(detailRes.customerGroup?.name.endsWith('(edited)'), 'group updated');
  await run(AddCustomersToGroupDocument, { customerGroupId: groupId, customerIds: ids });
  let members = await run(CustomerGroupMembersDocument, { id: groupId, options: { take: 50 } });
  expect(members.customerGroup?.customers.totalItems === 2, 'two members');
  await run(RemoveCustomersFromGroupDocument, { customerGroupId: groupId, customerIds: [ids[0]] });
  members = await run(CustomerGroupMembersDocument, { id: groupId, options: { take: 50 } });
  expect(members.customerGroup?.customers.items.map((m) => m.id).join() === ids[1], 'one member removed');
  const cust = (await run(CustomerDetailDocument, { id: ids[1] })).customer!;
  expect(cust.groups.some((g) => g.id === groupId), 'customer shows group');
  const del = await run(DeleteCustomerGroupDocument, { id: groupId });
  expect(del.deleteCustomerGroup.result === 'DELETED', 'group deleted');
  for (const id of ids) await run(DeleteCustomerDocument, { id });
  ctx.ok('sales-customer-groups', `${list.customerGroups.totalItems} listed; create → update → add 2 → remove 1 → delete`);
};

/** Dev-server write suites for this area group: name → suite. */
export const salesSuites: Record<string, Suite> = {
  'sales-orders': salesOrders,
  'sales-draft-orders': salesDraftOrders,
  'sales-customers': salesCustomers,
  'sales-customer-groups': salesCustomerGroups,
};
