/**
 * Dev-server write suites for Settings-B, Marketing and System: shipping methods, payment
 * methods, tax rates, countries, zones, promotions, the job queue and scheduled tasks.
 * Every suite creates its own "Smoke …" entities and deletes them; seeded data is untouched.
 */
import {
  CountryDetailDocument,
  CountryListDocument,
  CreateCountryDocument,
  DeleteCountryDocument,
  UpdateCountryDocument,
} from '../../src/api/documents/countries';
import {
  ActiveJobCountDocument,
  JobDetailDocument,
  JobListDocument,
  JobQueueListDocument,
  RebuildSearchIndexDocument,
} from '../../src/api/documents/jobs';
import {
  CreatePaymentMethodDocument,
  DeletePaymentMethodDocument,
  PaymentMethodDetailDocument,
  PaymentMethodListDocument,
  PaymentMethodOperationsDocument,
  UpdatePaymentMethodDocument,
} from '../../src/api/documents/payment-methods';
import {
  CreatePromotionDocument,
  DeletePromotionDocument,
  PromotionDetailDocument,
  PromotionListDocument,
  PromotionOperationsDocument,
  UpdatePromotionDocument,
} from '../../src/api/documents/promotions';
import {
  RunScheduledTaskDocument,
  ScheduledTasksDocument,
  UpdateScheduledTaskDocument,
} from '../../src/api/documents/scheduled-tasks';
import {
  CreateShippingMethodDocument,
  DeleteShippingMethodDocument,
  ShippingMethodDetailDocument,
  ShippingMethodListDocument,
  ShippingMethodOperationsDocument,
  TestEligibleShippingMethodsDocument,
  TestShippingMethodDocument,
  UpdateShippingMethodDocument,
} from '../../src/api/documents/shipping-methods';
import {
  CreateTaxRateDocument,
  DeleteTaxRateDocument,
  TaxRateDetailDocument,
  TaxRateListDocument,
  TaxRateOptionsDocument,
  UpdateTaxRateDocument,
} from '../../src/api/documents/tax-rates';
import {
  AddMembersToZoneDocument,
  CreateZoneDocument,
  DeleteZoneDocument,
  RemoveMembersFromZoneDocument,
  UpdateZoneDocument,
  ZoneDetailDocument,
  ZoneListDocument,
} from '../../src/api/documents/zones';
import type { TypedDocumentString } from '../../src/gql/graphql';
import { expect, type SmokeContext } from '../smoke-lib';
import type { Suite } from './index';

// The picker modules import expo-router, so these suites use small raw documents instead.
const raw = <R,>(query: string) => ({ toString: () => query }) as unknown as TypedDocumentString<R, Record<string, never>>;
const FirstVariant = raw<{ productVariants: { items: { id: string }[] } }>('query SmokeFirstVariant { productVariants(options: { take: 1 }) { items { id } } }');
const FirstCustomerGroup = raw<{ customerGroups: { items: { id: string }[] } }>('query SmokeFirstGroup { customerGroups(options: { take: 1 }) { items { id } } }');

type Op = { code: string; arguments: { name: string; value: string }[] };
type Def = { code: string; args: { name: string; type: string; list: boolean; required: boolean; defaultValue?: unknown }[] };

// Node-safe copies of defaultOperation / missingArgs from src/components/form/configurable-operation.tsx
// (that module imports React Native, which can't load under tsx).
function defaultOperation(def: Def): Op {
  return {
    code: def.code,
    arguments: def.args.map((a) => ({
      name: a.name,
      value:
        a.defaultValue == null
          ? a.list
            ? '[]'
            : a.type === 'boolean'
              ? 'false'
              : ''
          : typeof a.defaultValue === 'string'
            ? a.defaultValue
            : JSON.stringify(a.defaultValue),
    })),
  };
}

function missingArgs(op: Op, defs: Def[]): string[] {
  const def = defs.find((d) => d.code === op.code);
  if (!def) return [];
  return def.args
    .filter((a) => a.required && ['', '[]'].includes(op.arguments.find((x) => x.name === a.name)?.value ?? ''))
    .map((a) => a.name);
}

const stamp = () => `${Date.now()}`.slice(-7);

/** Sets one argument on an operation input. */
const withArg = (op: Op, name: string, value: string) => ({
  ...op,
  arguments: [...op.arguments.filter((a) => a.name !== name), { name, value }],
});

async function shippingMethods({ run, ok }: SmokeContext) {
  const list = await run(ShippingMethodListDocument, { options: { take: 50 } });
  const ops = await run(ShippingMethodOperationsDocument);
  expect(ops.shippingEligibilityCheckers.length && ops.shippingCalculators.length && ops.fulfillmentHandlers.length, 'operation definitions');

  const checkerDef = ops.shippingEligibilityCheckers.find((c) => c.code === 'default-shipping-eligibility-checker') ?? ops.shippingEligibilityCheckers[0];
  const calcDef = ops.shippingCalculators.find((c) => c.code === 'default-shipping-calculator') ?? ops.shippingCalculators[0];
  let checker = defaultOperation(checkerDef);
  let calculator = defaultOperation(calcDef);
  expect(missingArgs(withArg(calculator, 'rate', ''), ops.shippingCalculators).length > 0, 'missingArgs flags an empty required arg');
  checker = withArg(checker, 'orderMinimum', '0');
  calculator = withArg(withArg(withArg(calculator, 'rate', '750'), 'includesTax', 'exclude'), 'taxRate', '0');
  expect(missingArgs(calculator, ops.shippingCalculators).length === 0, 'calculator args complete');

  const s = stamp();
  const { createShippingMethod } = await run(CreateShippingMethodDocument, {
    input: {
      code: `smoke-ship-${s}`,
      fulfillmentHandler: ops.fulfillmentHandlers[0].code,
      checker,
      calculator,
      translations: [{ languageCode: 'en', name: `Smoke shipping ${s}`, description: 'Smoke test' }],
    },
  });
  const id = createShippingMethod.id;
  try {
    let detail = (await run(ShippingMethodDetailDocument, { id })).shippingMethod;
    expect(detail?.calculator.args.find((a) => a.name === 'rate')?.value === '750', 'calculator args stored');
    const tr = detail!.translations[0];
    await run(UpdateShippingMethodDocument, {
      input: {
        id,
        calculator: withArg(calculator, 'rate', '900'),
        translations: [{ id: tr.id, languageCode: tr.languageCode, name: `Smoke shipping ${s} (edited)` }],
      },
    });
    detail = (await run(ShippingMethodDetailDocument, { id })).shippingMethod;
    expect(detail?.name === `Smoke shipping ${s} (edited)`, 'shipping method renamed');
    expect(detail?.calculator.args.find((a) => a.name === 'rate')?.value === '900', 'calculator updated');

    // Test calculator against a sample order.
    const variant = (await run(FirstVariant)).productVariants.items[0];
    const country = (await run(CountryListDocument, { options: { take: 1, filter: { enabled: { eq: true } } } })).countries.items[0];
    expect(variant && country, 'variant + country for test');
    const address = { streetLine1: 'Test street', countryCode: country.code };
    const lines = [{ productVariantId: variant.id, quantity: 2 }];
    const test = await run(TestShippingMethodDocument, {
      input: { checker, calculator: withArg(calculator, 'rate', '900'), shippingAddress: address, lines },
    });
    expect(test.testShippingMethod.eligible && test.testShippingMethod.quote?.price === 900, 'testShippingMethod quote');
    const notEligible = await run(TestShippingMethodDocument, {
      input: { checker: withArg(checker, 'orderMinimum', '999999999'), calculator, shippingAddress: address, lines },
    });
    expect(!notEligible.testShippingMethod.eligible, 'testShippingMethod not eligible above minimum');
    const eligible = await run(TestEligibleShippingMethodsDocument, { input: { shippingAddress: address, lines } });
    expect(eligible.testEligibleShippingMethods.some((m) => m.id === id), 'testEligibleShippingMethods includes new method');
    ok(
      'shipping methods',
      `${list.shippingMethods.totalItems} listed; create → update → test (${test.testShippingMethod.quote?.price}, ${eligible.testEligibleShippingMethods.length} eligible) → delete`,
    );
  } finally {
    const del = await run(DeleteShippingMethodDocument, { id });
    expect(del.deleteShippingMethod.result === 'DELETED', 'shipping method deleted');
  }
}

async function paymentMethods({ run, ok }: SmokeContext) {
  const list = await run(PaymentMethodListDocument, { options: { take: 50 } });
  const ops = await run(PaymentMethodOperationsDocument);
  const handlerDef = ops.paymentMethodHandlers[0];
  expect(handlerDef, 'payment handler definitions');
  const handler = defaultOperation(handlerDef);
  const s = stamp();
  const { createPaymentMethod } = await run(CreatePaymentMethodDocument, {
    input: {
      code: `smoke-pay-${s}`,
      enabled: false,
      handler,
      translations: [{ languageCode: 'en', name: `Smoke payment ${s}`, description: '' }],
    },
  });
  const id = createPaymentMethod.id;
  try {
    let detail = (await run(PaymentMethodDetailDocument, { id })).paymentMethod;
    expect(detail?.handler.code === handlerDef.code && !detail.enabled, 'payment method created');
    const tr = detail!.translations[0];
    await run(UpdatePaymentMethodDocument, {
      input: {
        id,
        enabled: true,
        checker: null,
        handler: handlerDef.args.some((a) => a.name === 'automaticSettle') ? withArg(handler, 'automaticSettle', 'true') : handler,
        translations: [{ id: tr.id, languageCode: tr.languageCode, name: `Smoke payment ${s} (edited)` }],
      },
    });
    detail = (await run(PaymentMethodDetailDocument, { id })).paymentMethod;
    expect(detail?.enabled && detail.name.endsWith('(edited)'), 'payment method updated');
    ok('payment methods', `${list.paymentMethods.totalItems} listed; create → update → delete`);
  } finally {
    const del = await run(DeletePaymentMethodDocument, { id, force: true });
    expect(del.deletePaymentMethod.result === 'DELETED', 'payment method deleted');
  }
}

async function taxRates({ run, ok }: SmokeContext) {
  const list = await run(TaxRateListDocument, { options: { take: 5 } });
  const opts = await run(TaxRateOptionsDocument);
  const category = opts.taxCategories.items[0];
  const zone = opts.zones.items[0];
  expect(category && zone, 'tax categories + zones to choose from');
  const group = (await run(FirstCustomerGroup)).customerGroups.items[0];
  const s = stamp();
  const { createTaxRate } = await run(CreateTaxRateDocument, {
    input: { name: `Smoke rate ${s}`, enabled: false, value: 7.5, categoryId: category.id, zoneId: zone.id, customerGroupId: group?.id },
  });
  const id = createTaxRate.id;
  try {
    await run(UpdateTaxRateDocument, { input: { id, value: 12.25, enabled: true, name: `Smoke rate ${s} (edited)` } });
    const detail = (await run(TaxRateDetailDocument, { id })).taxRate;
    expect(detail?.value === 12.25 && detail.enabled && detail.category.id === category.id && detail.zone.id === zone.id, 'tax rate updated');
    if (group) expect(detail?.customerGroup?.id === group.id, 'customer group kept');
    ok('tax rates', `${list.taxRates.totalItems} listed; create → update → delete${group ? ' (with customer group)' : ''}`);
  } finally {
    const del = await run(DeleteTaxRateDocument, { id });
    expect(del.deleteTaxRate.result === 'DELETED', 'tax rate deleted');
  }
}

async function countries({ run, ok }: SmokeContext) {
  const list = await run(CountryListDocument, { options: { take: 20, sort: { name: 'ASC' } } });
  const page2 = await run(CountryListDocument, { options: { skip: 20, take: 20, sort: { name: 'ASC' } } });
  expect(list.countries.totalItems > 20 && page2.countries.items[0]?.id !== list.countries.items[0]?.id, 'countries paginate');
  const search = await run(CountryListDocument, {
    options: { take: 5, filter: { _or: [{ name: { contains: 'united' } }, { code: { contains: 'united' } }] } },
  });
  expect(search.countries.totalItems > 0, 'country search');
  const s = stamp();
  const code = `Z${s.slice(-3)}`;
  const { createCountry } = await run(CreateCountryDocument, {
    input: { code, enabled: false, translations: [{ languageCode: 'en', name: `Smoke country ${s}` }] },
  });
  const id = createCountry.id;
  try {
    const before = (await run(CountryDetailDocument, { id })).country;
    const tr = before!.translations[0];
    await run(UpdateCountryDocument, {
      input: { id, enabled: true, translations: [{ id: tr.id, languageCode: tr.languageCode, name: `Smoke country ${s} (edited)` }] },
    });
    const detail = (await run(CountryDetailDocument, { id })).country;
    expect(detail?.enabled && detail.name === `Smoke country ${s} (edited)`, 'country updated');
    ok('countries', `${list.countries.totalItems} listed (paginated, search ok); create → update → delete`);
  } finally {
    const del = await run(DeleteCountryDocument, { id });
    expect(del.deleteCountry.result === 'DELETED', 'country deleted');
  }
}

async function zones({ run, ok }: SmokeContext) {
  const list = await run(ZoneListDocument, { options: { take: 50 } });
  const cs = (await run(CountryListDocument, { options: { take: 3, sort: { name: 'ASC' } } })).countries.items;
  expect(cs.length === 3, 'three countries to use as members');
  const s = stamp();
  const { createZone } = await run(CreateZoneDocument, { input: { name: `Smoke zone ${s}`, memberIds: [cs[0].id, cs[1].id] } });
  const id = createZone.id;
  try {
    await run(AddMembersToZoneDocument, { zoneId: id, memberIds: [cs[2].id] });
    await run(RemoveMembersFromZoneDocument, { zoneId: id, memberIds: [cs[0].id] });
    await run(UpdateZoneDocument, { input: { id, name: `Smoke zone ${s} (edited)` } });
    const detail = (await run(ZoneDetailDocument, { id })).zone;
    const ids = new Set(detail?.members.map((m) => m.id));
    expect(detail?.name.endsWith('(edited)') && ids.size === 2 && ids.has(cs[1].id) && ids.has(cs[2].id), 'zone members updated');
    ok('zones', `${list.zones.totalItems} listed; create (2 members) → add → remove → rename → delete`);
  } finally {
    const del = await run(DeleteZoneDocument, { id });
    expect(del.deleteZone.result === 'DELETED', 'zone deleted');
  }
}

async function promotions({ run, ok }: SmokeContext) {
  const list = await run(PromotionListDocument, { options: { take: 10, sort: { createdAt: 'DESC' } } });
  const enabledOnly = await run(PromotionListDocument, { options: { take: 10, filter: { enabled: { eq: true } } } });
  const ops = await run(PromotionOperationsDocument);
  const condDef = ops.promotionConditions.find((c) => c.code === 'minimum_order_amount');
  const actDef = ops.promotionActions.find((a) => a.code === 'order_percentage_discount');
  expect(condDef && actDef, 'promotion condition/action definitions');
  const blankCondition = defaultOperation(condDef);
  expect(missingArgs(withArg(blankCondition, 'amount', ''), ops.promotionConditions).length > 0, 'missingArgs flags an empty amount');
  const condition = withArg(withArg(blankCondition, 'amount', '10000'), 'taxInclusive', 'false');
  const action = withArg(defaultOperation(actDef), 'discount', '10');
  const s = stamp();
  const translations = [{ languageCode: 'en' as const, name: `Smoke promo ${s}`, description: 'Smoke test' }];

  // No conditions and no coupon → MissingConditionsError (surfaced via unwrapResult in the app).
  const missing = await run(CreatePromotionDocument, { input: { enabled: false, conditions: [], actions: [action], translations } });
  expect('errorCode' in missing.createPromotion && missing.createPromotion.errorCode === 'MISSING_CONDITIONS_ERROR', 'MissingConditionsError returned');

  const startsAt = new Date(Date.now() + 86_400_000).toISOString();
  const created = await run(CreatePromotionDocument, {
    input: {
      enabled: false,
      couponCode: `SMOKE${s}`,
      perCustomerUsageLimit: 1,
      usageLimit: 10,
      startsAt,
      conditions: [condition],
      actions: [action],
      translations,
    },
  });
  expect('id' in created.createPromotion, 'promotion created');
  const id = (created.createPromotion as { id: string }).id;
  try {
    const before = (await run(PromotionDetailDocument, { id })).promotion;
    expect(before?.couponCode === `SMOKE${s}` && before.conditions[0]?.code === 'minimum_order_amount', 'promotion stored');
    const tr = before!.translations[0];
    const updated = await run(UpdatePromotionDocument, {
      input: {
        id,
        enabled: true,
        usageLimit: null,
        endsAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
        actions: [withArg(action, 'discount', '15')],
        translations: [{ id: tr.id, languageCode: tr.languageCode, name: `Smoke promo ${s} (edited)` }],
      },
    });
    expect('id' in updated.updatePromotion, 'promotion updated');
    const after = (await run(PromotionDetailDocument, { id })).promotion;
    expect(
      after?.enabled && after.usageLimit == null && after.endsAt && after.actions[0]?.args.find((a) => a.name === 'discount')?.value === '15',
      'promotion fields updated',
    );
    ok('promotions', `${list.promotions.totalItems} listed (${enabledOnly.promotions.totalItems} enabled); validation → create → update → delete`);
  } finally {
    const del = await run(DeletePromotionDocument, { id });
    expect(del.deletePromotion.result === 'DELETED', 'promotion deleted');
  }
}

async function jobs({ run, ok }: SmokeContext) {
  const queues = await run(JobQueueListDocument);
  expect(queues.jobQueues.length > 0, 'job queues listed');
  const { reindex } = await run(RebuildSearchIndexDocument, {});
  expect(reindex.queueName === 'update-search-index', 'reindex job queued');
  const newest = await run(JobListDocument, { options: { take: 5, sort: { createdAt: 'DESC' } } });
  expect(newest.jobs.items.some((j) => j.id === reindex.id), 'reindex job in newest-first list');
  const filtered = await run(JobListDocument, {
    options: { take: 5, filter: { queueName: { eq: 'update-search-index' }, state: { in: ['PENDING', 'RUNNING', 'COMPLETED', 'RETRYING'] } } },
  });
  expect(filtered.jobs.items.every((j) => j.queueName === 'update-search-index'), 'queue filter');
  await run(ActiveJobCountDocument, { filter: { isSettled: { eq: false } } });
  // Wait (up to ~20s) for the reindex to settle so the detail has a result.
  let job = (await run(JobDetailDocument, { id: reindex.id })).job;
  for (let i = 0; i < 20 && job && !job.isSettled; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    job = (await run(JobDetailDocument, { id: reindex.id })).job;
  }
  expect(job, 'job detail');
  ok('jobs', `${queues.jobQueues.length} queues, ${newest.jobs.totalItems} jobs; reindex #${reindex.id} → ${job.state} (${job.duration} ms)`);
}

async function scheduledTasks({ run, ok }: SmokeContext) {
  const { scheduledTasks: tasks } = await run(ScheduledTasksDocument);
  expect(tasks.length > 0, 'scheduled tasks listed');
  const task = tasks.find((t) => t.id === 'clean-sessions') ?? tasks[0];
  const original = task.enabled;
  try {
    const toggled = await run(UpdateScheduledTaskDocument, { input: { id: task.id, enabled: !original } });
    expect(toggled.updateScheduledTask.enabled === !original, 'task toggled');
  } finally {
    const restored = await run(UpdateScheduledTaskDocument, { input: { id: task.id, enabled: original } });
    expect(restored.updateScheduledTask.enabled === original, 'task restored');
  }
  const ran = await run(RunScheduledTaskDocument, { id: task.id });
  expect(ran.runScheduledTask.success, 'run now');
  ok('scheduled tasks', `${tasks.length} tasks; toggle → restore → run "${task.id}"`);
}

/** Dev-server write suites for this area group: name → suite. */
export const settingsBSuites: Record<string, Suite> = {
  'settings-shipping-methods': shippingMethods,
  'settings-payment-methods': paymentMethods,
  'settings-tax-rates': taxRates,
  'settings-countries': countries,
  'settings-zones': zones,
  'marketing-promotions': promotions,
  'system-jobs': jobs,
  'system-scheduled-tasks': scheduledTasks,
};
