/* Run: npm test */
import { buildCustomFieldsMap, customFieldsInput, customFieldValues, expandCustomFields } from './custom-fields';

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(`✗ ${msg}`);
  console.log(`✓ ${msg}`);
}

const label = (value: string) => [{ languageCode: 'en', value }];
const base = { list: false, readonly: false, internal: false, nullable: true, requiresPermission: [], ui: null, description: null };
const map = buildCustomFieldsMap([
  {
    entityName: 'Product',
    customFields: [
      { __typename: 'StringCustomFieldConfig', name: 'brand', type: 'string', ...base, label: label('Brand') },
      { __typename: 'LocaleStringCustomFieldConfig', name: 'subtitle', type: 'localeString', ...base, label: null },
      { __typename: 'RelationCustomFieldConfig', name: 'sizeChart', type: 'relation', ...base, label: null, entity: 'Asset', scalarFields: ['id', 'name'] },
      { __typename: 'StringCustomFieldConfig', name: 'secret', type: 'string', ...base, internal: true, label: null },
      { __typename: 'StringCustomFieldConfig', name: 'legacyId', type: 'string', ...base, readonly: true, label: null },
    ],
  },
] as never);

const q = `query P { product(id: "1") { id customFields @customFields(entity: "Product") translations @customFields(entity: "Product", locale: true) { languageCode name } } collection(id: "1") { id customFields @customFields(entity: "Collection") } }`;
const out = expandCustomFields(q, map).replace(/\s+/g, ' ');
assert(!out.includes('@customFields'), 'directives removed');
assert(out.includes('customFields { brand subtitle sizeChart { id name } legacyId }'), 'entity custom fields selected, relation scalars, internal hidden');
assert(out.includes('translations { languageCode name customFields { subtitle } }'), 'locale fields under translations');
assert(!/collection\(id: "1"\) \{ id customFields/.test(out), 'entity without custom fields: field dropped');
assert(expandCustomFields(q, map) === expandCustomFields(q, map), 'memoized');
assert(expandCustomFields('{ a }', undefined) === '{ a }', 'documents without the directive untouched');

const defs = map.get('Product')!;
assert(defs.find((d) => d.name === 'brand')?.label === 'Brand' && defs.find((d) => d.name === 'sizeChart')?.label === 'Size Chart', 'labels: localized or humanized');
const values = customFieldValues(defs, { brand: 'Acme', sizeChart: { id: '7' }, legacyId: 'L1' }, { customFields: { subtitle: 'Hi' } });
assert(values.subtitle === 'Hi' && values.brand === 'Acme', 'values merged from entity + translation');
const input = customFieldsInput(defs, values);
assert(JSON.stringify(input.customFields) === '{"brand":"Acme","sizeChartId":"7"}', 'input: relation → Id, readonly skipped');
assert(JSON.stringify(input.translationCustomFields) === '{"subtitle":"Hi"}', 'input: locale fields go to translation');
