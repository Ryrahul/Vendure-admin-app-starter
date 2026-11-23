/**
 * Read-only coverage: for every admin area, run its list query and the detail query of the
 * first item, exactly as the app sends them (custom fields expanded). Safe on production:
 * queries only, never mutations.
 */
import { AdministratorDetailDocument, AdministratorListDocument } from '../src/api/documents/administrators';
import { ApiKeyDetailDocument, ApiKeyListDocument } from '../src/api/documents/api-keys';
import { AssetDetailDocument, AssetListDocument, AssetTagsDocument } from '../src/api/documents/assets';
import { ChannelDetailDocument, ChannelListDocument } from '../src/api/documents/channels';
import { CollectionContentsDocument, CollectionDetailDocument, CollectionFiltersDocument, CollectionListDocument } from '../src/api/documents/collections';
import { CountryDetailDocument, CountryListDocument } from '../src/api/documents/countries';
import { FacetDetailDocument, FacetListDocument } from '../src/api/documents/facets';
import { GlobalSettingsDetailDocument } from '../src/api/documents/global-settings';
import { JobDetailDocument, JobListDocument, JobQueueListDocument } from '../src/api/documents/jobs';
import { OptionGroupDetailDocument, OptionGroupListDocument } from '../src/api/documents/option-groups';
import { PaymentMethodDetailDocument, PaymentMethodListDocument, PaymentMethodOperationsDocument } from '../src/api/documents/payment-methods';
import { ProfileDetailDocument } from '../src/api/documents/profile';
import { PromotionDetailDocument, PromotionListDocument, PromotionOperationsDocument } from '../src/api/documents/promotions';
import { RoleDetailDocument, RoleListDocument } from '../src/api/documents/roles';
import { ScheduledTasksDocument } from '../src/api/documents/scheduled-tasks';
import { SellerDetailDocument, SellerListDocument } from '../src/api/documents/sellers';
import { ShippingMethodDetailDocument, ShippingMethodListDocument, ShippingMethodOperationsDocument } from '../src/api/documents/shipping-methods';
import { StockLocationDetailDocument, StockLocationListDocument } from '../src/api/documents/stock-locations';
import { TaxCategoryDetailDocument, TaxCategoryListDocument } from '../src/api/documents/tax-categories';
import { TaxRateDetailDocument, TaxRateListDocument, TaxRateOptionsDocument } from '../src/api/documents/tax-rates';
import { VariantDetailDocument, VariantFormDataDocument, VariantListDocument } from '../src/api/documents/variants';
import { ZoneDetailDocument, ZoneListDocument } from '../src/api/documents/zones';
import { VendureApiError } from '../src/api/client';
import type { SmokeContext } from './smoke-lib';
import { extraAreas } from './read-coverage-sales';

type AnyDoc = { toString(): string };
export interface Area {
  label: string;
  list?: AnyDoc;
  /** Picks `{ items, totalItems }` from the list result. */
  pick?: (r: any) => { items: { id: string }[]; totalItems: number };
  detail?: AnyDoc;
  /** Single queries without variables (config / settings screens). */
  singles?: AnyDoc[];
}

const first = (key: string) => (r: any) => r[key];

const AREAS: Area[] = [
  { label: 'variants', list: VariantListDocument, pick: first('productVariants'), detail: VariantDetailDocument, singles: [VariantFormDataDocument] },
  { label: 'option groups', list: OptionGroupListDocument, pick: first('productOptionGroups'), detail: OptionGroupDetailDocument },
  { label: 'collections', list: CollectionListDocument, pick: first('collections'), detail: CollectionDetailDocument, singles: [CollectionFiltersDocument] },
  { label: 'facets', list: FacetListDocument, pick: first('facets'), detail: FacetDetailDocument },
  { label: 'assets', list: AssetListDocument, pick: first('assets'), detail: AssetDetailDocument, singles: [AssetTagsDocument] },
  { label: 'sellers', list: SellerListDocument, pick: first('sellers'), detail: SellerDetailDocument },
  { label: 'channels', list: ChannelListDocument, pick: first('channels'), detail: ChannelDetailDocument },
  { label: 'stock locations', list: StockLocationListDocument, pick: first('stockLocations'), detail: StockLocationDetailDocument },
  { label: 'administrators', list: AdministratorListDocument, pick: first('administrators'), detail: AdministratorDetailDocument },
  { label: 'roles', list: RoleListDocument, pick: first('roles'), detail: RoleDetailDocument },
  { label: 'api keys', list: ApiKeyListDocument, pick: first('apiKeys'), detail: ApiKeyDetailDocument },
  { label: 'shipping methods', list: ShippingMethodListDocument, pick: first('shippingMethods'), detail: ShippingMethodDetailDocument, singles: [ShippingMethodOperationsDocument] },
  { label: 'payment methods', list: PaymentMethodListDocument, pick: first('paymentMethods'), detail: PaymentMethodDetailDocument, singles: [PaymentMethodOperationsDocument] },
  { label: 'tax categories', list: TaxCategoryListDocument, pick: first('taxCategories'), detail: TaxCategoryDetailDocument },
  { label: 'tax rates', list: TaxRateListDocument, pick: first('taxRates'), detail: TaxRateDetailDocument, singles: [TaxRateOptionsDocument] },
  { label: 'countries', list: CountryListDocument, pick: first('countries'), detail: CountryDetailDocument },
  { label: 'zones', list: ZoneListDocument, pick: first('zones'), detail: ZoneDetailDocument },
  { label: 'promotions', list: PromotionListDocument, pick: first('promotions'), detail: PromotionDetailDocument, singles: [PromotionOperationsDocument] },
  { label: 'jobs', list: JobListDocument, pick: first('jobs'), detail: JobDetailDocument, singles: [JobQueueListDocument] },
  { label: 'settings & profile', singles: [GlobalSettingsDetailDocument, ProfileDetailDocument, ScheduledTasksDocument] },
  ...extraAreas,
];

export async function readCoverage({ run, ok }: SmokeContext) {
  let skipped = 0;
  for (const area of AREAS) {
    try {
      const parts: string[] = [];
      if (area.list && area.pick) {
        const list = area.pick(await run(area.list as any, { options: { take: 3 } }));
        parts.push(`${list.totalItems} listed`);
        const item = list.items[0];
        if (item && area.detail) {
          await run(area.detail as any, { id: item.id });
          parts.push(`detail #${item.id}`);
        }
      }
      for (const single of area.singles ?? []) await run(single as any);
      if (area.singles?.length) parts.push(`${area.singles.length} config quer${area.singles.length === 1 ? 'y' : 'ies'}`);
      ok(area.label, parts.join(', '));
    } catch (e) {
      if (e instanceof VendureApiError && (e.isAuthError || e.code === 'FORBIDDEN')) {
        skipped++;
        console.log(`– ${area.label.padEnd(24)} skipped (no permission)`);
        continue;
      }
      throw new Error(`${area.label}: ${(e as Error).message}`);
    }
  }
  return { areas: AREAS.length, skipped };
}
