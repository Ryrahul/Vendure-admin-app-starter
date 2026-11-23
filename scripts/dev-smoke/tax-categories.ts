import {
  CreateTaxCategoryDocument,
  DeleteTaxCategoryDocument,
  TaxCategoryDetailDocument,
  TaxCategoryListDocument,
  UpdateTaxCategoryDocument,
} from '../../src/api/documents/tax-categories';
import { expect, type SmokeContext } from '../smoke-lib';

export default async function taxCategories({ run, ok }: SmokeContext) {
  const list = await run(TaxCategoryListDocument, { options: { take: 50 } });
  const name = `Smoke ${Date.now()}`;
  const { createTaxCategory } = await run(CreateTaxCategoryDocument, { input: { name } });
  await run(UpdateTaxCategoryDocument, { input: { id: createTaxCategory.id, name: `${name} (edited)` } });
  const detail = await run(TaxCategoryDetailDocument, { id: createTaxCategory.id });
  expect(detail.taxCategory?.name === `${name} (edited)`, 'tax category updated');
  const del = await run(DeleteTaxCategoryDocument, { id: createTaxCategory.id });
  expect(del.deleteTaxCategory.result === 'DELETED', 'tax category deleted');
  ok('tax categories', `${list.taxCategories.totalItems} listed; create → update → delete`);
}
