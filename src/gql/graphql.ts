/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type AddItemInput = {
  productVariantId: string;
  quantity: number;
};

export type AddItemToDraftOrderInput = {
  productVariantId: string;
  quantity: number;
};

export type AddNoteToCustomerInput = {
  id: string;
  isPublic: boolean;
  note: string;
};

export type AddNoteToOrderInput = {
  id: string;
  isPublic: boolean;
  note: string;
};

export type AdjustDraftOrderLineInput = {
  orderLineId: string;
  quantity: number;
};

export type AdministratorFilterParameter = {
  _and?: Array<AdministratorFilterParameter> | null | undefined;
  _or?: Array<AdministratorFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  emailAddress?: StringOperators | null | undefined;
  firstName?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  lastName?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type AdministratorListOptions = {
  /** Allows the results to be filtered */
  filter?: AdministratorFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: AdministratorSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type AdministratorRefundInput = {
  /**
   * The amount to be refunded to this particular Payment. This was introduced in
   * v2.2.0 as the preferred way to specify the refund amount. The `lines`, `shipping` and `adjustment`
   * fields will be removed in a future version.
   */
  amount?: number | null | undefined;
  paymentId: string;
  reason?: string | null | undefined;
};

export type AdministratorSortParameter = {
  createdAt?: SortOrder | null | undefined;
  emailAddress?: SortOrder | null | undefined;
  firstName?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  lastName?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ApiKeyFilterParameter = {
  _and?: Array<ApiKeyFilterParameter> | null | undefined;
  _or?: Array<ApiKeyFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  /** Helps you identify unused keys */
  lastUsedAt?: DateOperators | null | undefined;
  /**
   * ID by which we can look up the API-Key.
   * Also helps you identify keys without leaking the underlying secret API-Key.
   */
  lookupId?: StringOperators | null | undefined;
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ApiKeyListOptions = {
  /** Allows the results to be filtered */
  filter?: ApiKeyFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ApiKeySortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ApiKeySortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  /** Helps you identify unused keys */
  lastUsedAt?: SortOrder | null | undefined;
  /**
   * ID by which we can look up the API-Key.
   * Also helps you identify keys without leaking the underlying secret API-Key.
   */
  lookupId?: SortOrder | null | undefined;
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type AssetFilterParameter = {
  _and?: Array<AssetFilterParameter> | null | undefined;
  _or?: Array<AssetFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  fileSize?: NumberOperators | null | undefined;
  height?: NumberOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  mimeType?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  preview?: StringOperators | null | undefined;
  source?: StringOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  width?: NumberOperators | null | undefined;
};

export type AssetListOptions = {
  /** Allows the results to be filtered */
  filter?: AssetFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: AssetSortParameter | null | undefined;
  tags?: Array<string> | null | undefined;
  tagsOperator?: LogicalOperator | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type AssetSortParameter = {
  createdAt?: SortOrder | null | undefined;
  fileSize?: SortOrder | null | undefined;
  height?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  mimeType?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  preview?: SortOrder | null | undefined;
  source?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  width?: SortOrder | null | undefined;
};

export type AssetTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type AssetType =
  | 'BINARY'
  | 'IMAGE'
  | 'VIDEO';

export type AssignProductsToChannelInput = {
  channelId: string;
  priceFactor?: number | null | undefined;
  productIds: Array<string>;
};

/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: boolean | null | undefined;
  isNull?: boolean | null | undefined;
};

export type CancelOrderInput = {
  /** Specify whether the shipping charges should also be cancelled. Defaults to false */
  cancelShipping?: boolean | null | undefined;
  /** Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled */
  lines?: Array<OrderLineInput> | null | undefined;
  /** The id of the order to be cancelled */
  orderId: string;
  reason?: string | null | undefined;
};

export type ChannelFilterParameter = {
  _and?: Array<ChannelFilterParameter> | null | undefined;
  _or?: Array<ChannelFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  currencyCode?: StringOperators | null | undefined;
  defaultCurrencyCode?: StringOperators | null | undefined;
  defaultLanguageCode?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  /** Not yet used - will be implemented in a future release. */
  outOfStockThreshold?: NumberOperators | null | undefined;
  pricesIncludeTax?: BooleanOperators | null | undefined;
  token?: StringOperators | null | undefined;
  /** Not yet used - will be implemented in a future release. */
  trackInventory?: BooleanOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ChannelListOptions = {
  /** Allows the results to be filtered */
  filter?: ChannelFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ChannelSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ChannelSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  /** Not yet used - will be implemented in a future release. */
  outOfStockThreshold?: SortOrder | null | undefined;
  token?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type CollectionFilterParameter = {
  _and?: Array<CollectionFilterParameter> | null | undefined;
  _or?: Array<CollectionFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  inheritFilters?: BooleanOperators | null | undefined;
  isPrivate?: BooleanOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  parentId?: IdOperators | null | undefined;
  position?: NumberOperators | null | undefined;
  productVariantCount?: NumberOperators | null | undefined;
  slug?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CollectionListOptions = {
  /** Allows the results to be filtered */
  filter?: CollectionFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CollectionSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
  topLevelOnly?: boolean | null | undefined;
};

export type CollectionSortParameter = {
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  parentId?: SortOrder | null | undefined;
  position?: SortOrder | null | undefined;
  productVariantCount?: SortOrder | null | undefined;
  slug?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ConfigArgInput = {
  name: string;
  /** A JSON stringified representation of the actual value */
  value: string;
};

export type ConfigurableOperationInput = {
  arguments: Array<ConfigArgInput>;
  code: string;
};

export type CoordinateInput = {
  x: number;
  y: number;
};

export type CountryFilterParameter = {
  _and?: Array<CountryFilterParameter> | null | undefined;
  _or?: Array<CountryFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  parentId?: IdOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CountryListOptions = {
  /** Allows the results to be filtered */
  filter?: CountryFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CountrySortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type CountrySortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  parentId?: SortOrder | null | undefined;
  type?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type CountryTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

/**
 * Input used to create an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type CreateAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode: string;
  customFields?: unknown;
  defaultBillingAddress?: boolean | null | undefined;
  defaultShippingAddress?: boolean | null | undefined;
  fullName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1: string;
  streetLine2?: string | null | undefined;
};

export type CreateAdministratorInput = {
  customFields?: unknown;
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  roleIds: Array<string>;
};

/**
 * There is no User ID because you can only create API-Keys for yourself,
 * which gets determined by the User who does the request.
 */
export type CreateApiKeyInput = {
  customFields?: unknown;
  /**
   * Which roles to attach to this ApiKey.
   * You may only grant roles which you, yourself have.
   */
  roleIds: Array<string>;
  translations: Array<CreateApiKeyTranslationInput>;
};

export type CreateApiKeyTranslationInput = {
  customFields?: unknown;
  languageCode: LanguageCode;
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name: string;
};

export type CreateAssetInput = {
  customFields?: unknown;
  file: unknown;
  tags?: Array<string> | null | undefined;
  translations?: Array<AssetTranslationInput> | null | undefined;
};

export type CreateChannelInput = {
  availableCurrencyCodes?: Array<CurrencyCode> | null | undefined;
  availableLanguageCodes?: Array<LanguageCode> | null | undefined;
  code: string;
  /** @deprecated Use defaultCurrencyCode instead */
  currencyCode?: CurrencyCode | null | undefined;
  customFields?: unknown;
  defaultCurrencyCode?: CurrencyCode | null | undefined;
  defaultLanguageCode: LanguageCode;
  defaultShippingZoneId: string;
  defaultTaxZoneId: string;
  outOfStockThreshold?: number | null | undefined;
  pricesIncludeTax: boolean;
  sellerId?: string | null | undefined;
  token: string;
  trackInventory?: boolean | null | undefined;
};

export type CreateCollectionInput = {
  assetIds?: Array<string> | null | undefined;
  customFields?: unknown;
  featuredAssetId?: string | null | undefined;
  filters: Array<ConfigurableOperationInput>;
  inheritFilters?: boolean | null | undefined;
  isPrivate?: boolean | null | undefined;
  parentId?: string | null | undefined;
  translations: Array<CreateCollectionTranslationInput>;
};

export type CreateCollectionTranslationInput = {
  customFields?: unknown;
  description: string;
  languageCode: LanguageCode;
  name: string;
  slug: string;
};

export type CreateCountryInput = {
  code: string;
  customFields?: unknown;
  enabled: boolean;
  translations: Array<CountryTranslationInput>;
};

export type CreateCustomerGroupInput = {
  customFields?: unknown;
  customerIds?: Array<string> | null | undefined;
  name: string;
};

export type CreateCustomerInput = {
  customFields?: unknown;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

export type CreateFacetInput = {
  code: string;
  customFields?: unknown;
  isPrivate: boolean;
  translations: Array<FacetTranslationInput>;
  values?: Array<CreateFacetValueWithFacetInput> | null | undefined;
};

export type CreateFacetValueInput = {
  code: string;
  customFields?: unknown;
  facetId: string;
  translations: Array<FacetValueTranslationInput>;
};

export type CreateFacetValueWithFacetInput = {
  code: string;
  translations: Array<FacetValueTranslationInput>;
};

export type CreateGroupOptionInput = {
  code: string;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreatePaymentMethodInput = {
  checker?: ConfigurableOperationInput | null | undefined;
  code: string;
  customFields?: unknown;
  enabled: boolean;
  handler: ConfigurableOperationInput;
  translations: Array<PaymentMethodTranslationInput>;
};

export type CreateProductInput = {
  assetIds?: Array<string> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string> | null | undefined;
  featuredAssetId?: string | null | undefined;
  translations: Array<ProductTranslationInput>;
};

export type CreateProductOptionGroupInput = {
  code: string;
  customFields?: unknown;
  options?: Array<CreateGroupOptionInput> | null | undefined;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductOptionInput = {
  code: string;
  customFields?: unknown;
  productOptionGroupId: string;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductVariantInput = {
  assetIds?: Array<string> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string> | null | undefined;
  featuredAssetId?: string | null | undefined;
  optionIds?: Array<string> | null | undefined;
  outOfStockThreshold?: number | null | undefined;
  price?: number | null | undefined;
  prices?: Array<CreateProductVariantPriceInput | null | undefined> | null | undefined;
  productId: string;
  sku: string;
  stockLevels?: Array<StockLevelInput> | null | undefined;
  stockOnHand?: number | null | undefined;
  taxCategoryId?: string | null | undefined;
  trackInventory?: GlobalFlag | null | undefined;
  translations: Array<ProductVariantTranslationInput>;
  useGlobalOutOfStockThreshold?: boolean | null | undefined;
};

export type CreateProductVariantPriceInput = {
  currencyCode: CurrencyCode;
  customFields?: unknown;
  price: number;
};

export type CreatePromotionInput = {
  actions: Array<ConfigurableOperationInput>;
  conditions: Array<ConfigurableOperationInput>;
  couponCode?: string | null | undefined;
  customFields?: unknown;
  enabled: boolean;
  endsAt?: string | null | undefined;
  perCustomerUsageLimit?: number | null | undefined;
  startsAt?: string | null | undefined;
  translations: Array<PromotionTranslationInput>;
  usageLimit?: number | null | undefined;
};

export type CreateRoleInput = {
  channelIds?: Array<string> | null | undefined;
  code: string;
  customFields?: unknown;
  description: string;
  permissions: Array<Permission>;
};

export type CreateSellerInput = {
  customFields?: unknown;
  name: string;
  translations?: Array<SellerTranslationInput> | null | undefined;
};

export type CreateShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  code: string;
  customFields?: unknown;
  fulfillmentHandler: string;
  translations: Array<ShippingMethodTranslationInput>;
};

export type CreateStockLocationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  name: string;
};

export type CreateTaxCategoryInput = {
  customFields?: unknown;
  isDefault?: boolean | null | undefined;
  name: string;
};

export type CreateTaxRateInput = {
  categoryId: string;
  customFields?: unknown;
  customerGroupId?: string | null | undefined;
  enabled: boolean;
  name: string;
  value: number;
  zoneId: string;
};

export type CreateZoneInput = {
  customFields?: unknown;
  memberIds?: Array<string> | null | undefined;
  name: string;
};

/**
 * @description
 * ISO 4217 currency code
 *
 * @docsCategory common
 */
export type CurrencyCode =
  /** United Arab Emirates dirham */
  | 'AED'
  /** Afghan afghani */
  | 'AFN'
  /** Albanian lek */
  | 'ALL'
  /** Armenian dram */
  | 'AMD'
  /** Netherlands Antillean guilder */
  | 'ANG'
  /** Angolan kwanza */
  | 'AOA'
  /** Argentine peso */
  | 'ARS'
  /** Australian dollar */
  | 'AUD'
  /** Aruban florin */
  | 'AWG'
  /** Azerbaijani manat */
  | 'AZN'
  /** Bosnia and Herzegovina convertible mark */
  | 'BAM'
  /** Barbados dollar */
  | 'BBD'
  /** Bangladeshi taka */
  | 'BDT'
  /** Bulgarian lev */
  | 'BGN'
  /** Bahraini dinar */
  | 'BHD'
  /** Burundian franc */
  | 'BIF'
  /** Bermudian dollar */
  | 'BMD'
  /** Brunei dollar */
  | 'BND'
  /** Boliviano */
  | 'BOB'
  /** Brazilian real */
  | 'BRL'
  /** Bahamian dollar */
  | 'BSD'
  /** Bhutanese ngultrum */
  | 'BTN'
  /** Botswana pula */
  | 'BWP'
  /** Belarusian ruble */
  | 'BYN'
  /** Belize dollar */
  | 'BZD'
  /** Canadian dollar */
  | 'CAD'
  /** Congolese franc */
  | 'CDF'
  /** Swiss franc */
  | 'CHF'
  /** Chilean peso */
  | 'CLP'
  /** Renminbi (Chinese) yuan */
  | 'CNY'
  /** Colombian peso */
  | 'COP'
  /** Costa Rican colon */
  | 'CRC'
  /** Cuban convertible peso */
  | 'CUC'
  /** Cuban peso */
  | 'CUP'
  /** Cape Verde escudo */
  | 'CVE'
  /** Czech koruna */
  | 'CZK'
  /** Djiboutian franc */
  | 'DJF'
  /** Danish krone */
  | 'DKK'
  /** Dominican peso */
  | 'DOP'
  /** Algerian dinar */
  | 'DZD'
  /** Egyptian pound */
  | 'EGP'
  /** Eritrean nakfa */
  | 'ERN'
  /** Ethiopian birr */
  | 'ETB'
  /** Euro */
  | 'EUR'
  /** Fiji dollar */
  | 'FJD'
  /** Falkland Islands pound */
  | 'FKP'
  /** Pound sterling */
  | 'GBP'
  /** Georgian lari */
  | 'GEL'
  /** Ghanaian cedi */
  | 'GHS'
  /** Gibraltar pound */
  | 'GIP'
  /** Gambian dalasi */
  | 'GMD'
  /** Guinean franc */
  | 'GNF'
  /** Guatemalan quetzal */
  | 'GTQ'
  /** Guyanese dollar */
  | 'GYD'
  /** Hong Kong dollar */
  | 'HKD'
  /** Honduran lempira */
  | 'HNL'
  /** Croatian kuna */
  | 'HRK'
  /** Haitian gourde */
  | 'HTG'
  /** Hungarian forint */
  | 'HUF'
  /** Indonesian rupiah */
  | 'IDR'
  /** Israeli new shekel */
  | 'ILS'
  /** Indian rupee */
  | 'INR'
  /** Iraqi dinar */
  | 'IQD'
  /** Iranian rial */
  | 'IRR'
  /** Icelandic króna */
  | 'ISK'
  /** Jamaican dollar */
  | 'JMD'
  /** Jordanian dinar */
  | 'JOD'
  /** Japanese yen */
  | 'JPY'
  /** Kenyan shilling */
  | 'KES'
  /** Kyrgyzstani som */
  | 'KGS'
  /** Cambodian riel */
  | 'KHR'
  /** Comoro franc */
  | 'KMF'
  /** North Korean won */
  | 'KPW'
  /** South Korean won */
  | 'KRW'
  /** Kuwaiti dinar */
  | 'KWD'
  /** Cayman Islands dollar */
  | 'KYD'
  /** Kazakhstani tenge */
  | 'KZT'
  /** Lao kip */
  | 'LAK'
  /** Lebanese pound */
  | 'LBP'
  /** Sri Lankan rupee */
  | 'LKR'
  /** Liberian dollar */
  | 'LRD'
  /** Lesotho loti */
  | 'LSL'
  /** Libyan dinar */
  | 'LYD'
  /** Moroccan dirham */
  | 'MAD'
  /** Moldovan leu */
  | 'MDL'
  /** Malagasy ariary */
  | 'MGA'
  /** Macedonian denar */
  | 'MKD'
  /** Myanmar kyat */
  | 'MMK'
  /** Mongolian tögrög */
  | 'MNT'
  /** Macanese pataca */
  | 'MOP'
  /** Mauritanian ouguiya */
  | 'MRU'
  /** Mauritian rupee */
  | 'MUR'
  /** Maldivian rufiyaa */
  | 'MVR'
  /** Malawian kwacha */
  | 'MWK'
  /** Mexican peso */
  | 'MXN'
  /** Malaysian ringgit */
  | 'MYR'
  /** Mozambican metical */
  | 'MZN'
  /** Namibian dollar */
  | 'NAD'
  /** Nigerian naira */
  | 'NGN'
  /** Nicaraguan córdoba */
  | 'NIO'
  /** Norwegian krone */
  | 'NOK'
  /** Nepalese rupee */
  | 'NPR'
  /** New Zealand dollar */
  | 'NZD'
  /** Omani rial */
  | 'OMR'
  /** Panamanian balboa */
  | 'PAB'
  /** Peruvian sol */
  | 'PEN'
  /** Papua New Guinean kina */
  | 'PGK'
  /** Philippine peso */
  | 'PHP'
  /** Pakistani rupee */
  | 'PKR'
  /** Polish złoty */
  | 'PLN'
  /** Paraguayan guaraní */
  | 'PYG'
  /** Qatari riyal */
  | 'QAR'
  /** Romanian leu */
  | 'RON'
  /** Serbian dinar */
  | 'RSD'
  /** Russian ruble */
  | 'RUB'
  /** Rwandan franc */
  | 'RWF'
  /** Saudi riyal */
  | 'SAR'
  /** Solomon Islands dollar */
  | 'SBD'
  /** Seychelles rupee */
  | 'SCR'
  /** Sudanese pound */
  | 'SDG'
  /** Swedish krona/kronor */
  | 'SEK'
  /** Singapore dollar */
  | 'SGD'
  /** Saint Helena pound */
  | 'SHP'
  /** Sierra Leonean leone */
  | 'SLL'
  /** Somali shilling */
  | 'SOS'
  /** Surinamese dollar */
  | 'SRD'
  /** South Sudanese pound */
  | 'SSP'
  /** São Tomé and Príncipe dobra */
  | 'STN'
  /** Salvadoran colón */
  | 'SVC'
  /** Syrian pound */
  | 'SYP'
  /** Swazi lilangeni */
  | 'SZL'
  /** Thai baht */
  | 'THB'
  /** Tajikistani somoni */
  | 'TJS'
  /** Turkmenistan manat */
  | 'TMT'
  /** Tunisian dinar */
  | 'TND'
  /** Tongan paʻanga */
  | 'TOP'
  /** Turkish lira */
  | 'TRY'
  /** Trinidad and Tobago dollar */
  | 'TTD'
  /** New Taiwan dollar */
  | 'TWD'
  /** Tanzanian shilling */
  | 'TZS'
  /** Ukrainian hryvnia */
  | 'UAH'
  /** Ugandan shilling */
  | 'UGX'
  /** United States dollar */
  | 'USD'
  /** Uruguayan peso */
  | 'UYU'
  /** Uzbekistan som */
  | 'UZS'
  /** Venezuelan bolívar soberano */
  | 'VES'
  /** Vietnamese đồng */
  | 'VND'
  /** Vanuatu vatu */
  | 'VUV'
  /** Samoan tala */
  | 'WST'
  /** CFA franc BEAC */
  | 'XAF'
  /** East Caribbean dollar */
  | 'XCD'
  /** CFA franc BCEAO */
  | 'XOF'
  /** CFP franc (franc Pacifique) */
  | 'XPF'
  /** Yemeni rial */
  | 'YER'
  /** South African rand */
  | 'ZAR'
  /** Zambian kwacha */
  | 'ZMW'
  /** Zimbabwean dollar */
  | 'ZWL';

export type CustomerFilterParameter = {
  _and?: Array<CustomerFilterParameter> | null | undefined;
  _or?: Array<CustomerFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  emailAddress?: StringOperators | null | undefined;
  firstName?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  lastName?: StringOperators | null | undefined;
  phoneNumber?: StringOperators | null | undefined;
  postalCode?: StringOperators | null | undefined;
  title?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CustomerGroupFilterParameter = {
  _and?: Array<CustomerGroupFilterParameter> | null | undefined;
  _or?: Array<CustomerGroupFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CustomerGroupListOptions = {
  /** Allows the results to be filtered */
  filter?: CustomerGroupFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CustomerGroupSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type CustomerGroupSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type CustomerListOptions = {
  /** Allows the results to be filtered */
  filter?: CustomerFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CustomerSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type CustomerSortParameter = {
  createdAt?: SortOrder | null | undefined;
  emailAddress?: SortOrder | null | undefined;
  firstName?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  lastName?: SortOrder | null | undefined;
  phoneNumber?: SortOrder | null | undefined;
  title?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

/** Operators for filtering on a DateTime field */
export type DateOperators = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  between?: DateRange | null | undefined;
  eq?: string | null | undefined;
  isNull?: boolean | null | undefined;
};

export type DateRange = {
  end: string;
  start: string;
};

export type DeleteAssetsInput = {
  assetIds: Array<string>;
  deleteFromAllChannels?: boolean | null | undefined;
  force?: boolean | null | undefined;
};

export type DeleteStockLocationInput = {
  id: string;
  transferToLocationId?: string | null | undefined;
};

export type DeletionResult =
  /** The entity was successfully deleted */
  | 'DELETED'
  /** Deletion did not take place, reason given in message */
  | 'NOT_DELETED';

export type ErrorCode =
  | 'ALREADY_REFUNDED_ERROR'
  | 'CANCEL_ACTIVE_ORDER_ERROR'
  | 'CANCEL_PAYMENT_ERROR'
  | 'CHANNEL_DEFAULT_LANGUAGE_ERROR'
  | 'COUPON_CODE_EXPIRED_ERROR'
  | 'COUPON_CODE_INVALID_ERROR'
  | 'COUPON_CODE_LIMIT_ERROR'
  | 'CREATE_FULFILLMENT_ERROR'
  | 'DUPLICATE_ENTITY_ERROR'
  | 'EMAIL_ADDRESS_CONFLICT_ERROR'
  | 'EMPTY_ORDER_LINE_SELECTION_ERROR'
  | 'FACET_IN_USE_ERROR'
  | 'FULFILLMENT_STATE_TRANSITION_ERROR'
  | 'GUEST_CHECKOUT_ERROR'
  | 'INELIGIBLE_SHIPPING_METHOD_ERROR'
  | 'INSUFFICIENT_STOCK_ERROR'
  | 'INSUFFICIENT_STOCK_ON_HAND_ERROR'
  | 'INVALID_CREDENTIALS_ERROR'
  | 'INVALID_FULFILLMENT_HANDLER_ERROR'
  | 'ITEMS_ALREADY_FULFILLED_ERROR'
  | 'LANGUAGE_NOT_AVAILABLE_ERROR'
  | 'MANUAL_PAYMENT_STATE_ERROR'
  | 'MIME_TYPE_ERROR'
  | 'MISSING_CONDITIONS_ERROR'
  | 'MISSING_PASSWORD_ERROR'
  | 'MULTIPLE_ORDER_ERROR'
  | 'NATIVE_AUTH_STRATEGY_ERROR'
  | 'NEGATIVE_QUANTITY_ERROR'
  | 'NOTHING_TO_REFUND_ERROR'
  | 'NO_ACTIVE_ORDER_ERROR'
  | 'NO_CHANGES_SPECIFIED_ERROR'
  | 'ORDER_INTERCEPTOR_ERROR'
  | 'ORDER_LIMIT_ERROR'
  | 'ORDER_MODIFICATION_ERROR'
  | 'ORDER_MODIFICATION_STATE_ERROR'
  | 'ORDER_STATE_TRANSITION_ERROR'
  | 'PASSWORD_ALREADY_SET_ERROR'
  | 'PASSWORD_RESET_TOKEN_EXPIRED_ERROR'
  | 'PASSWORD_RESET_TOKEN_INVALID_ERROR'
  | 'PASSWORD_VALIDATION_ERROR'
  | 'PAYMENT_METHOD_MISSING_ERROR'
  | 'PAYMENT_ORDER_MISMATCH_ERROR'
  | 'PAYMENT_STATE_TRANSITION_ERROR'
  | 'PRODUCT_OPTION_GROUP_IN_USE_ERROR'
  | 'PRODUCT_OPTION_IN_USE_ERROR'
  | 'QUANTITY_TOO_GREAT_ERROR'
  | 'REFUND_AMOUNT_ERROR'
  | 'REFUND_DESTINATION_ERROR'
  | 'REFUND_INCOMPLETE_ERROR'
  | 'REFUND_ORDER_STATE_ERROR'
  | 'REFUND_PAYMENT_ID_MISSING_ERROR'
  | 'REFUND_STATE_TRANSITION_ERROR'
  | 'SETTLE_PAYMENT_ERROR'
  | 'UNKNOWN_ERROR';

export type FacetFilterParameter = {
  _and?: Array<FacetFilterParameter> | null | undefined;
  _or?: Array<FacetFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  isPrivate?: BooleanOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type FacetListOptions = {
  /** Allows the results to be filtered */
  filter?: FacetFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: FacetSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type FacetSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type FacetTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type FacetValueFilterParameter = {
  _and?: Array<FacetValueFilterParameter> | null | undefined;
  _or?: Array<FacetValueFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  facetId?: IdOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type FacetValueListOptions = {
  /** Allows the results to be filtered */
  filter?: FacetValueFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: FacetValueSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type FacetValueSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  facetId?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type FacetValueTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type FulfillOrderInput = {
  handler: ConfigurableOperationInput;
  lines: Array<OrderLineInput>;
};

export type GlobalFlag =
  | 'FALSE'
  | 'INHERIT'
  | 'TRUE';

export type HistoryEntryFilterParameter = {
  _and?: Array<HistoryEntryFilterParameter> | null | undefined;
  _or?: Array<HistoryEntryFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  isPublic?: BooleanOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type HistoryEntryListOptions = {
  /** Allows the results to be filtered */
  filter?: HistoryEntryFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: HistoryEntrySortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type HistoryEntrySortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type HistoryEntryType =
  | 'CUSTOMER_ADDED_TO_GROUP'
  | 'CUSTOMER_ADDRESS_CREATED'
  | 'CUSTOMER_ADDRESS_DELETED'
  | 'CUSTOMER_ADDRESS_UPDATED'
  | 'CUSTOMER_DETAIL_UPDATED'
  | 'CUSTOMER_EMAIL_UPDATE_REQUESTED'
  | 'CUSTOMER_EMAIL_UPDATE_VERIFIED'
  | 'CUSTOMER_NOTE'
  | 'CUSTOMER_PASSWORD_RESET_REQUESTED'
  | 'CUSTOMER_PASSWORD_RESET_VERIFIED'
  | 'CUSTOMER_PASSWORD_UPDATED'
  | 'CUSTOMER_REGISTERED'
  | 'CUSTOMER_REMOVED_FROM_GROUP'
  | 'CUSTOMER_VERIFIED'
  | 'ORDER_CANCELLATION'
  | 'ORDER_COUPON_APPLIED'
  | 'ORDER_COUPON_REMOVED'
  | 'ORDER_CURRENCY_UPDATED'
  | 'ORDER_CUSTOMER_UPDATED'
  | 'ORDER_FULFILLMENT'
  | 'ORDER_FULFILLMENT_TRANSITION'
  | 'ORDER_MODIFIED'
  | 'ORDER_NOTE'
  | 'ORDER_PAYMENT_TRANSITION'
  | 'ORDER_REFUND_TRANSITION'
  | 'ORDER_STATE_TRANSITION';

/** Operators for filtering on an ID field */
export type IdOperators = {
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
};

export type JobFilterParameter = {
  _and?: Array<JobFilterParameter> | null | undefined;
  _or?: Array<JobFilterParameter> | null | undefined;
  attempts?: NumberOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  duration?: NumberOperators | null | undefined;
  id?: IdOperators | null | undefined;
  isSettled?: BooleanOperators | null | undefined;
  progress?: NumberOperators | null | undefined;
  queueName?: StringOperators | null | undefined;
  retries?: NumberOperators | null | undefined;
  settledAt?: DateOperators | null | undefined;
  startedAt?: DateOperators | null | undefined;
  state?: StringOperators | null | undefined;
};

export type JobListOptions = {
  /** Allows the results to be filtered */
  filter?: JobFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: JobSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type JobSortParameter = {
  attempts?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  duration?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  progress?: SortOrder | null | undefined;
  queueName?: SortOrder | null | undefined;
  retries?: SortOrder | null | undefined;
  settledAt?: SortOrder | null | undefined;
  startedAt?: SortOrder | null | undefined;
};

/**
 * @description
 * The state of a Job in the JobQueue
 *
 * @docsCategory common
 */
export type JobState =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'FAILED'
  | 'PENDING'
  | 'RETRYING'
  | 'RUNNING';

/**
 * @description
 * Languages in the form of a ISO 639-1 language code with optional
 * region or script modifier (e.g. de_AT). The selection available is based
 * on the [Unicode CLDR summary list](https://unicode-org.github.io/cldr-staging/charts/37/summary/root.html)
 * and includes the major spoken languages of the world and any widely-used variants.
 *
 * @docsCategory common
 */
export type LanguageCode =
  /** Afrikaans */
  | 'af'
  /** Akan */
  | 'ak'
  /** Amharic */
  | 'am'
  /** Arabic */
  | 'ar'
  /** Assamese */
  | 'as'
  /** Azerbaijani */
  | 'az'
  /** Belarusian */
  | 'be'
  /** Bulgarian */
  | 'bg'
  /** Bambara */
  | 'bm'
  /** Bangla */
  | 'bn'
  /** Tibetan */
  | 'bo'
  /** Breton */
  | 'br'
  /** Bosnian */
  | 'bs'
  /** Catalan */
  | 'ca'
  /** Chechen */
  | 'ce'
  /** Corsican */
  | 'co'
  /** Czech */
  | 'cs'
  /** Church Slavic */
  | 'cu'
  /** Welsh */
  | 'cy'
  /** Danish */
  | 'da'
  /** German */
  | 'de'
  /** Austrian German */
  | 'de_AT'
  /** Swiss High German */
  | 'de_CH'
  /** Dzongkha */
  | 'dz'
  /** Ewe */
  | 'ee'
  /** Greek */
  | 'el'
  /** English */
  | 'en'
  /** Australian English */
  | 'en_AU'
  /** Canadian English */
  | 'en_CA'
  /** British English */
  | 'en_GB'
  /** American English */
  | 'en_US'
  /** Esperanto */
  | 'eo'
  /** Spanish */
  | 'es'
  /** European Spanish */
  | 'es_ES'
  /** Mexican Spanish */
  | 'es_MX'
  /** Estonian */
  | 'et'
  /** Basque */
  | 'eu'
  /** Persian */
  | 'fa'
  /** Dari */
  | 'fa_AF'
  /** Fulah */
  | 'ff'
  /** Finnish */
  | 'fi'
  /** Faroese */
  | 'fo'
  /** French */
  | 'fr'
  /** Canadian French */
  | 'fr_CA'
  /** Swiss French */
  | 'fr_CH'
  /** Western Frisian */
  | 'fy'
  /** Irish */
  | 'ga'
  /** Scottish Gaelic */
  | 'gd'
  /** Galician */
  | 'gl'
  /** Gujarati */
  | 'gu'
  /** Manx */
  | 'gv'
  /** Hausa */
  | 'ha'
  /** Hebrew */
  | 'he'
  /** Hindi */
  | 'hi'
  /** Croatian */
  | 'hr'
  /** Haitian Creole */
  | 'ht'
  /** Hungarian */
  | 'hu'
  /** Armenian */
  | 'hy'
  /** Interlingua */
  | 'ia'
  /** Indonesian */
  | 'id'
  /** Igbo */
  | 'ig'
  /** Sichuan Yi */
  | 'ii'
  /** Icelandic */
  | 'is'
  /** Italian */
  | 'it'
  /** Japanese */
  | 'ja'
  /** Javanese */
  | 'jv'
  /** Georgian */
  | 'ka'
  /** Kikuyu */
  | 'ki'
  /** Kazakh */
  | 'kk'
  /** Kalaallisut */
  | 'kl'
  /** Khmer */
  | 'km'
  /** Kannada */
  | 'kn'
  /** Korean */
  | 'ko'
  /** Kashmiri */
  | 'ks'
  /** Kurdish */
  | 'ku'
  /** Cornish */
  | 'kw'
  /** Kyrgyz */
  | 'ky'
  /** Latin */
  | 'la'
  /** Luxembourgish */
  | 'lb'
  /** Ganda */
  | 'lg'
  /** Lingala */
  | 'ln'
  /** Lao */
  | 'lo'
  /** Lithuanian */
  | 'lt'
  /** Luba-Katanga */
  | 'lu'
  /** Latvian */
  | 'lv'
  /** Malagasy */
  | 'mg'
  /** Maori */
  | 'mi'
  /** Macedonian */
  | 'mk'
  /** Malayalam */
  | 'ml'
  /** Mongolian */
  | 'mn'
  /** Marathi */
  | 'mr'
  /** Malay */
  | 'ms'
  /** Maltese */
  | 'mt'
  /** Burmese */
  | 'my'
  /** Norwegian Bokmål */
  | 'nb'
  /** North Ndebele */
  | 'nd'
  /** Nepali */
  | 'ne'
  /** Dutch */
  | 'nl'
  /** Flemish */
  | 'nl_BE'
  /** Norwegian Nynorsk */
  | 'nn'
  /** Nyanja */
  | 'ny'
  /** Oromo */
  | 'om'
  /** Odia */
  | 'or'
  /** Ossetic */
  | 'os'
  /** Punjabi */
  | 'pa'
  /** Polish */
  | 'pl'
  /** Pashto */
  | 'ps'
  /** Portuguese */
  | 'pt'
  /** Brazilian Portuguese */
  | 'pt_BR'
  /** European Portuguese */
  | 'pt_PT'
  /** Quechua */
  | 'qu'
  /** Romansh */
  | 'rm'
  /** Rundi */
  | 'rn'
  /** Romanian */
  | 'ro'
  /** Moldavian */
  | 'ro_MD'
  /** Russian */
  | 'ru'
  /** Kinyarwanda */
  | 'rw'
  /** Sanskrit */
  | 'sa'
  /** Sindhi */
  | 'sd'
  /** Northern Sami */
  | 'se'
  /** Sango */
  | 'sg'
  /** Sinhala */
  | 'si'
  /** Slovak */
  | 'sk'
  /** Slovenian */
  | 'sl'
  /** Samoan */
  | 'sm'
  /** Shona */
  | 'sn'
  /** Somali */
  | 'so'
  /** Albanian */
  | 'sq'
  /** Serbian */
  | 'sr'
  /** Southern Sotho */
  | 'st'
  /** Sundanese */
  | 'su'
  /** Swedish */
  | 'sv'
  /** Swahili */
  | 'sw'
  /** Congo Swahili */
  | 'sw_CD'
  /** Tamil */
  | 'ta'
  /** Telugu */
  | 'te'
  /** Tajik */
  | 'tg'
  /** Thai */
  | 'th'
  /** Tigrinya */
  | 'ti'
  /** Turkmen */
  | 'tk'
  /** Tongan */
  | 'to'
  /** Turkish */
  | 'tr'
  /** Tatar */
  | 'tt'
  /** Uyghur */
  | 'ug'
  /** Ukrainian */
  | 'uk'
  /** Urdu */
  | 'ur'
  /** Uzbek */
  | 'uz'
  /** Vietnamese */
  | 'vi'
  /** Volapük */
  | 'vo'
  /** Wolof */
  | 'wo'
  /** Xhosa */
  | 'xh'
  /** Yiddish */
  | 'yi'
  /** Yoruba */
  | 'yo'
  /** Chinese */
  | 'zh'
  /** Simplified Chinese */
  | 'zh_Hans'
  /** Traditional Chinese */
  | 'zh_Hant'
  /** Zulu */
  | 'zu';

export type LogicalOperator =
  | 'AND'
  | 'OR';

export type ManualPaymentInput = {
  metadata?: unknown;
  method: string;
  orderId: string;
  transactionId?: string | null | undefined;
};

export type MetricType =
  | 'AverageOrderValue'
  | 'OrderCount'
  | 'OrderTotal';

export type ModifyOrderInput = {
  addItems?: Array<AddItemInput> | null | undefined;
  adjustOrderLines?: Array<OrderLineInput> | null | undefined;
  couponCodes?: Array<string> | null | undefined;
  dryRun: boolean;
  note?: string | null | undefined;
  options?: ModifyOrderOptions | null | undefined;
  orderId: string;
  /**
   * Deprecated in v2.2.0. Use `refunds` instead to allow multiple refunds to be
   * applied in the case that multiple payment methods have been used on the order.
   */
  refund?: AdministratorRefundInput | null | undefined;
  refunds?: Array<AdministratorRefundInput> | null | undefined;
  /** Added in v2.2 */
  shippingMethodIds?: Array<string> | null | undefined;
  surcharges?: Array<SurchargeInput> | null | undefined;
  updateBillingAddress?: UpdateOrderAddressInput | null | undefined;
  updateShippingAddress?: UpdateOrderAddressInput | null | undefined;
};

export type ModifyOrderOptions = {
  freezePromotions?: boolean | null | undefined;
  recalculateShipping?: boolean | null | undefined;
};

export type MoveCollectionInput = {
  collectionId: string;
  index: number;
  parentId: string;
};

/** Operators for filtering on a Int or Float field */
export type NumberOperators = {
  between?: NumberRange | null | undefined;
  eq?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  isNull?: boolean | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
};

export type NumberRange = {
  end: number;
  start: number;
};

export type OrderFilterParameter = {
  _and?: Array<OrderFilterParameter> | null | undefined;
  _or?: Array<OrderFilterParameter> | null | undefined;
  /** An order is active as long as the payment process has not been completed */
  active?: BooleanOperators | null | undefined;
  aggregateOrderId?: IdOperators | null | undefined;
  /** A unique code for the Order */
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  currencyCode?: StringOperators | null | undefined;
  customerLastName?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  /**
   * The date & time that the Order was placed, i.e. the Customer
   * completed the checkout and the Order is no longer "active"
   */
  orderPlacedAt?: DateOperators | null | undefined;
  shipping?: NumberOperators | null | undefined;
  shippingWithTax?: NumberOperators | null | undefined;
  state?: StringOperators | null | undefined;
  /**
   * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
   * discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
   * To get a total of all OrderLines which does not account for prorated discounts, use the
   * sum of `OrderLine.discountedLinePrice` values.
   */
  subTotal?: NumberOperators | null | undefined;
  /** Same as subTotal, but inclusive of tax */
  subTotalWithTax?: NumberOperators | null | undefined;
  /** Equal to subTotal plus shipping */
  total?: NumberOperators | null | undefined;
  totalQuantity?: NumberOperators | null | undefined;
  /** The final payable amount. Equal to subTotalWithTax plus shippingWithTax */
  totalWithTax?: NumberOperators | null | undefined;
  transactionId?: StringOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type OrderLineInput = {
  orderLineId: string;
  quantity: number;
};

export type OrderListOptions = {
  /** Allows the results to be filtered */
  filter?: OrderFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: OrderSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type OrderSortParameter = {
  aggregateOrderId?: SortOrder | null | undefined;
  /** A unique code for the Order */
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  customerLastName?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  /**
   * The date & time that the Order was placed, i.e. the Customer
   * completed the checkout and the Order is no longer "active"
   */
  orderPlacedAt?: SortOrder | null | undefined;
  shipping?: SortOrder | null | undefined;
  shippingWithTax?: SortOrder | null | undefined;
  state?: SortOrder | null | undefined;
  /**
   * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
   * discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
   * To get a total of all OrderLines which does not account for prorated discounts, use the
   * sum of `OrderLine.discountedLinePrice` values.
   */
  subTotal?: SortOrder | null | undefined;
  /** Same as subTotal, but inclusive of tax */
  subTotalWithTax?: SortOrder | null | undefined;
  /** Equal to subTotal plus shipping */
  total?: SortOrder | null | undefined;
  totalQuantity?: SortOrder | null | undefined;
  /** The final payable amount. Equal to subTotalWithTax plus shippingWithTax */
  totalWithTax?: SortOrder | null | undefined;
  transactionId?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type OrderType =
  | 'Aggregate'
  | 'Regular'
  | 'Seller';

export type PaymentMethodFilterParameter = {
  _and?: Array<PaymentMethodFilterParameter> | null | undefined;
  _or?: Array<PaymentMethodFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type PaymentMethodListOptions = {
  /** Allows the results to be filtered */
  filter?: PaymentMethodFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: PaymentMethodSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type PaymentMethodSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type PaymentMethodTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

/**
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * ## Understanding Permission.Owner
 *
 * `Permission.Owner` is a special permission which is used in some Vendure resolvers to indicate that that resolver should only
 * be accessible to the "owner" of that resource.
 *
 * For example, the Shop API `activeCustomer` query resolver should only return the Customer object for the "owner" of that Customer, i.e.
 * based on the activeUserId of the current session. As a result, the resolver code looks like this:
 *
 * @example
 * ```TypeScript
 * \@Query()
 * \@Allow(Permission.Owner)
 * async activeCustomer(\@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
 *   const userId = ctx.activeUserId;
 *   if (userId) {
 *     return this.customerService.findOneByUserId(ctx, userId);
 *   }
 * }
 * ```
 *
 * Here we can see that the "ownership" must be enforced by custom logic inside the resolver. Since "ownership" cannot be defined generally
 * nor statically encoded at build-time, any resolvers using `Permission.Owner` **must** include logic to enforce that only the owner
 * of the resource has access. If not, then it is the equivalent of using `Permission.Public`.
 *
 *
 * @docsCategory common
 */
export type Permission =
  /** Authenticated means simply that the user is logged in */
  | 'Authenticated'
  /** Grants permission to create Administrator */
  | 'CreateAdministrator'
  /** Grants permission to create ApiKey */
  | 'CreateApiKey'
  /** Grants permission to create Asset */
  | 'CreateAsset'
  /** Grants permission to create Products, Facets, Assets, Collections */
  | 'CreateCatalog'
  /** Grants permission to create Channel */
  | 'CreateChannel'
  /** Grants permission to create Collection */
  | 'CreateCollection'
  /** Grants permission to create Country */
  | 'CreateCountry'
  /** Grants permission to create Customer */
  | 'CreateCustomer'
  /** Grants permission to create CustomerGroup */
  | 'CreateCustomerGroup'
  /** Grants permission to create Facet */
  | 'CreateFacet'
  /** Grants permission to create Order */
  | 'CreateOrder'
  /** Grants permission to create PaymentMethod */
  | 'CreatePaymentMethod'
  /** Grants permission to create Product */
  | 'CreateProduct'
  /** Grants permission to create Promotion */
  | 'CreatePromotion'
  /** Grants permission to create Seller */
  | 'CreateSeller'
  /** Grants permission to create PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'CreateSettings'
  /** Grants permission to create ShippingMethod */
  | 'CreateShippingMethod'
  /** Grants permission to create StockLocation */
  | 'CreateStockLocation'
  /** Grants permission to create System */
  | 'CreateSystem'
  /** Grants permission to create Tag */
  | 'CreateTag'
  /** Grants permission to create TaxCategory */
  | 'CreateTaxCategory'
  /** Grants permission to create TaxRate */
  | 'CreateTaxRate'
  /** Grants permission to create Zone */
  | 'CreateZone'
  /** Grants permission to delete Administrator */
  | 'DeleteAdministrator'
  /** Grants permission to delete ApiKey */
  | 'DeleteApiKey'
  /** Grants permission to delete Asset */
  | 'DeleteAsset'
  /** Grants permission to delete Products, Facets, Assets, Collections */
  | 'DeleteCatalog'
  /** Grants permission to delete Channel */
  | 'DeleteChannel'
  /** Grants permission to delete Collection */
  | 'DeleteCollection'
  /** Grants permission to delete Country */
  | 'DeleteCountry'
  /** Grants permission to delete Customer */
  | 'DeleteCustomer'
  /** Grants permission to delete CustomerGroup */
  | 'DeleteCustomerGroup'
  /** Grants permission to delete Facet */
  | 'DeleteFacet'
  /** Grants permission to delete Order */
  | 'DeleteOrder'
  /** Grants permission to delete PaymentMethod */
  | 'DeletePaymentMethod'
  /** Grants permission to delete Product */
  | 'DeleteProduct'
  /** Grants permission to delete Promotion */
  | 'DeletePromotion'
  /** Grants permission to delete Seller */
  | 'DeleteSeller'
  /** Grants permission to delete PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'DeleteSettings'
  /** Grants permission to delete ShippingMethod */
  | 'DeleteShippingMethod'
  /** Grants permission to delete StockLocation */
  | 'DeleteStockLocation'
  /** Grants permission to delete System */
  | 'DeleteSystem'
  /** Grants permission to delete Tag */
  | 'DeleteTag'
  /** Grants permission to delete TaxCategory */
  | 'DeleteTaxCategory'
  /** Grants permission to delete TaxRate */
  | 'DeleteTaxRate'
  /** Grants permission to delete Zone */
  | 'DeleteZone'
  /** Owner means the user owns this entity, e.g. a Customer's own Order */
  | 'Owner'
  /** Public means any unauthenticated user may perform the operation */
  | 'Public'
  /** Grants permission to read Administrator */
  | 'ReadAdministrator'
  /** Grants permission to read ApiKey */
  | 'ReadApiKey'
  /** Grants permission to read Asset */
  | 'ReadAsset'
  /** Grants permission to read Products, Facets, Assets, Collections */
  | 'ReadCatalog'
  /** Grants permission to read Channel */
  | 'ReadChannel'
  /** Grants permission to read Collection */
  | 'ReadCollection'
  /** Grants permission to read Country */
  | 'ReadCountry'
  /** Grants permission to read Customer */
  | 'ReadCustomer'
  /** Grants permission to read CustomerGroup */
  | 'ReadCustomerGroup'
  /** Grants permission to read Facet */
  | 'ReadFacet'
  /** Grants permission to read Order */
  | 'ReadOrder'
  /** Grants permission to read PaymentMethod */
  | 'ReadPaymentMethod'
  /** Grants permission to read Product */
  | 'ReadProduct'
  /** Grants permission to read Promotion */
  | 'ReadPromotion'
  /** Grants permission to read the decrypted value of custom fields and config args marked as `secret` */
  | 'ReadSecret'
  /** Grants permission to read Seller */
  | 'ReadSeller'
  /** Grants permission to read PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'ReadSettings'
  /** Grants permission to read ShippingMethod */
  | 'ReadShippingMethod'
  /** Grants permission to read StockLocation */
  | 'ReadStockLocation'
  /** Grants permission to read System */
  | 'ReadSystem'
  /** Grants permission to read Tag */
  | 'ReadTag'
  /** Grants permission to read TaxCategory */
  | 'ReadTaxCategory'
  /** Grants permission to read TaxRate */
  | 'ReadTaxRate'
  /** Grants permission to read Zone */
  | 'ReadZone'
  /** SuperAdmin has unrestricted access to all operations */
  | 'SuperAdmin'
  /** Grants permission to update Administrator */
  | 'UpdateAdministrator'
  /** Grants permission to update ApiKey */
  | 'UpdateApiKey'
  /** Grants permission to update Asset */
  | 'UpdateAsset'
  /** Grants permission to update Products, Facets, Assets, Collections */
  | 'UpdateCatalog'
  /** Grants permission to update Channel */
  | 'UpdateChannel'
  /** Grants permission to update Collection */
  | 'UpdateCollection'
  /** Grants permission to update Country */
  | 'UpdateCountry'
  /** Grants permission to update Customer */
  | 'UpdateCustomer'
  /** Grants permission to update CustomerGroup */
  | 'UpdateCustomerGroup'
  /** Grants permission to update Facet */
  | 'UpdateFacet'
  /** Grants permission to update GlobalSettings */
  | 'UpdateGlobalSettings'
  /** Grants permission to update Order */
  | 'UpdateOrder'
  /** Grants permission to update PaymentMethod */
  | 'UpdatePaymentMethod'
  /** Grants permission to update Product */
  | 'UpdateProduct'
  /** Grants permission to update Promotion */
  | 'UpdatePromotion'
  /** Grants permission to update Seller */
  | 'UpdateSeller'
  /** Grants permission to update PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'UpdateSettings'
  /** Grants permission to update ShippingMethod */
  | 'UpdateShippingMethod'
  /** Grants permission to update StockLocation */
  | 'UpdateStockLocation'
  /** Grants permission to update System */
  | 'UpdateSystem'
  /** Grants permission to update Tag */
  | 'UpdateTag'
  /** Grants permission to update TaxCategory */
  | 'UpdateTaxCategory'
  /** Grants permission to update TaxRate */
  | 'UpdateTaxRate'
  /** Grants permission to update Zone */
  | 'UpdateZone';

export type ProductFilterParameter = {
  _and?: Array<ProductFilterParameter> | null | undefined;
  _or?: Array<ProductFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  facetValueId?: IdOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  optionGroupId?: IdOperators | null | undefined;
  sku?: StringOperators | null | undefined;
  slug?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ProductListOptions = {
  /** Allows the results to be filtered */
  filter?: ProductFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ProductSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ProductOptionGroupFilterParameter = {
  _and?: Array<ProductOptionGroupFilterParameter> | null | undefined;
  _or?: Array<ProductOptionGroupFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  /** The number of products that use this option group */
  productCount?: NumberOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ProductOptionGroupListOptions = {
  /** Allows the results to be filtered */
  filter?: ProductOptionGroupFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ProductOptionGroupSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ProductOptionGroupSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  /** The number of products that use this option group */
  productCount?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ProductOptionGroupTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type ProductSortParameter = {
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  slug?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ProductTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
  slug?: string | null | undefined;
};

export type ProductVariantFilterParameter = {
  _and?: Array<ProductVariantFilterParameter> | null | undefined;
  _or?: Array<ProductVariantFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  currencyCode?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  facetValueId?: IdOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  outOfStockThreshold?: NumberOperators | null | undefined;
  price?: NumberOperators | null | undefined;
  priceWithTax?: NumberOperators | null | undefined;
  productId?: IdOperators | null | undefined;
  sku?: StringOperators | null | undefined;
  stockAllocated?: NumberOperators | null | undefined;
  stockLevel?: StringOperators | null | undefined;
  stockOnHand?: NumberOperators | null | undefined;
  trackInventory?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  useGlobalOutOfStockThreshold?: BooleanOperators | null | undefined;
};

export type ProductVariantListOptions = {
  /** Allows the results to be filtered */
  filter?: ProductVariantFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ProductVariantSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ProductVariantSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  outOfStockThreshold?: SortOrder | null | undefined;
  price?: SortOrder | null | undefined;
  priceWithTax?: SortOrder | null | undefined;
  productId?: SortOrder | null | undefined;
  sku?: SortOrder | null | undefined;
  stockAllocated?: SortOrder | null | undefined;
  stockLevel?: SortOrder | null | undefined;
  stockOnHand?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ProductVariantTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type PromotionFilterParameter = {
  _and?: Array<PromotionFilterParameter> | null | undefined;
  _or?: Array<PromotionFilterParameter> | null | undefined;
  couponCode?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  endsAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  perCustomerUsageLimit?: NumberOperators | null | undefined;
  startsAt?: DateOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  usageLimit?: NumberOperators | null | undefined;
};

export type PromotionListOptions = {
  /** Allows the results to be filtered */
  filter?: PromotionFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: PromotionSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type PromotionSortParameter = {
  couponCode?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  endsAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  perCustomerUsageLimit?: SortOrder | null | undefined;
  startsAt?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  usageLimit?: SortOrder | null | undefined;
};

export type PromotionTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type RefundOrderInput = {
  /** @deprecated Use the `amount` field instead */
  adjustment?: number | null | undefined;
  /**
   * The amount to be refunded to this particular payment. This was introduced in v2.2.0 as the preferred way to specify the refund amount.
   * Can be as much as the total amount of the payment minus the sum of all previous refunds.
   */
  amount?: number | null | undefined;
  /**
   * Optional refund destination code. When omitted, refunds to the original
   * payment method. Use the `refundDestinations` query to discover available
   * destinations for an order.
   *
   * Ignored when `targets` is specified.
   */
  destination?: string | null | undefined;
  /** @deprecated Use the `amount` field instead */
  lines?: Array<OrderLineInput> | null | undefined;
  paymentId: string;
  reason?: string | null | undefined;
  /** @deprecated Use the `amount` field instead */
  shipping?: number | null | undefined;
  /**
   * Splits the refund across multiple payments and/or refund destinations. The sum of the
   * `amount` of each target is the total amount refunded, and the top-level `amount` and
   * `destination` fields are ignored.
   *
   * All targets are validated before any refund is created, and every target must draw on a
   * Payment in the `Settled` state. If a target fails once earlier targets have already been
   * refunded, the Refunds created for the earlier targets are kept and a `RefundIncompleteError`
   * is returned.
   */
  targets?: Array<RefundTargetInput> | null | undefined;
};

/**
 * Specifies a single portion of a refund: how much to refund, which Payment's refundable
 * balance it is drawn from, and where the funds are directed.
 */
export type RefundTargetInput = {
  /** The amount to refund to this target. */
  amount: number;
  /**
   * Arbitrary configuration passed to the RefundDestinationStrategy's `createRefund()` method,
   * for example an expiry date for a store credit refund. Has no effect when `destination`
   * is omitted.
   */
  arguments?: unknown;
  /**
   * The refund destination code. When omitted, the funds are refunded to the original
   * payment method.
   */
  destination?: string | null | undefined;
  /**
   * The Payment whose refundable balance is drawn on. Defaults to the top-level `paymentId`
   * of the RefundOrderInput when omitted.
   */
  paymentId?: string | null | undefined;
};

export type RemoveProductsFromChannelInput = {
  channelId: string;
  productIds: Array<string>;
};

export type RoleFilterParameter = {
  _and?: Array<RoleFilterParameter> | null | undefined;
  _or?: Array<RoleFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type RoleListOptions = {
  /** Allows the results to be filtered */
  filter?: RoleFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: RoleSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type RoleSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type SellerFilterParameter = {
  _and?: Array<SellerFilterParameter> | null | undefined;
  _or?: Array<SellerFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type SellerListOptions = {
  /** Allows the results to be filtered */
  filter?: SellerFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: SellerSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type SellerSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type SellerTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
};

export type SettleRefundInput = {
  id: string;
  transactionId: string;
};

export type ShippingMethodFilterParameter = {
  _and?: Array<ShippingMethodFilterParameter> | null | undefined;
  _or?: Array<ShippingMethodFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  fulfillmentHandlerCode?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ShippingMethodListOptions = {
  /** Allows the results to be filtered */
  filter?: ShippingMethodFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ShippingMethodSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ShippingMethodSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  fulfillmentHandlerCode?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ShippingMethodTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type SortOrder =
  | 'ASC'
  | 'DESC';

export type StockLevelInput = {
  stockLocationId: string;
  stockOnHand: number;
};

export type StockLocationFilterParameter = {
  _and?: Array<StockLocationFilterParameter> | null | undefined;
  _or?: Array<StockLocationFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type StockLocationListOptions = {
  /** Allows the results to be filtered */
  filter?: StockLocationFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: StockLocationSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type StockLocationSortParameter = {
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

/** Operators for filtering on a String field */
export type StringOperators = {
  contains?: string | null | undefined;
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notContains?: string | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
  regex?: string | null | undefined;
};

export type SurchargeInput = {
  description: string;
  price: number;
  priceIncludesTax: boolean;
  sku?: string | null | undefined;
  taxDescription?: string | null | undefined;
  taxRate?: number | null | undefined;
};

export type TagFilterParameter = {
  _and?: Array<TagFilterParameter> | null | undefined;
  _or?: Array<TagFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  value?: StringOperators | null | undefined;
};

export type TagListOptions = {
  /** Allows the results to be filtered */
  filter?: TagFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: TagSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type TagSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  value?: SortOrder | null | undefined;
};

export type TaxCategoryFilterParameter = {
  _and?: Array<TaxCategoryFilterParameter> | null | undefined;
  _or?: Array<TaxCategoryFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  isDefault?: BooleanOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type TaxCategoryListOptions = {
  /** Allows the results to be filtered */
  filter?: TaxCategoryFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: TaxCategorySortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type TaxCategorySortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type TaxRateFilterParameter = {
  _and?: Array<TaxRateFilterParameter> | null | undefined;
  _or?: Array<TaxRateFilterParameter> | null | undefined;
  categoryId?: IdOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  value?: NumberOperators | null | undefined;
  zoneId?: IdOperators | null | undefined;
};

export type TaxRateListOptions = {
  /** Allows the results to be filtered */
  filter?: TaxRateFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: TaxRateSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type TaxRateSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  value?: SortOrder | null | undefined;
};

export type TestEligibleShippingMethodsInput = {
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodOrderLineInput = {
  productVariantId: string;
  quantity: number;
};

export type UpdateActiveAdministratorInput = {
  customFields?: unknown;
  emailAddress?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  password?: string | null | undefined;
};

/**
 * Input used to update an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type UpdateAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode?: string | null | undefined;
  customFields?: unknown;
  defaultBillingAddress?: boolean | null | undefined;
  defaultShippingAddress?: boolean | null | undefined;
  fullName?: string | null | undefined;
  id: string;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1?: string | null | undefined;
  streetLine2?: string | null | undefined;
};

export type UpdateAdministratorInput = {
  customFields?: unknown;
  emailAddress?: string | null | undefined;
  firstName?: string | null | undefined;
  id: string;
  lastName?: string | null | undefined;
  password?: string | null | undefined;
  roleIds?: Array<string> | null | undefined;
};

export type UpdateApiKeyInput = {
  customFields?: unknown;
  /** ID of the ApiKey */
  id: string;
  /**
   * Which roles to attach to this ApiKey.
   * You may only grant roles which you, yourself have.
   */
  roleIds?: Array<string> | null | undefined;
  translations?: Array<UpdateApiKeyTranslationInput> | null | undefined;
};

export type UpdateApiKeyTranslationInput = {
  customFields?: unknown;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name?: string | null | undefined;
};

export type UpdateAssetInput = {
  customFields?: unknown;
  focalPoint?: CoordinateInput | null | undefined;
  id: string;
  name?: string | null | undefined;
  tags?: Array<string> | null | undefined;
  translations?: Array<AssetTranslationInput> | null | undefined;
};

export type UpdateChannelInput = {
  availableCurrencyCodes?: Array<CurrencyCode> | null | undefined;
  availableLanguageCodes?: Array<LanguageCode> | null | undefined;
  code?: string | null | undefined;
  /** @deprecated Use defaultCurrencyCode instead */
  currencyCode?: CurrencyCode | null | undefined;
  customFields?: unknown;
  defaultCurrencyCode?: CurrencyCode | null | undefined;
  defaultLanguageCode?: LanguageCode | null | undefined;
  defaultShippingZoneId?: string | null | undefined;
  defaultTaxZoneId?: string | null | undefined;
  id: string;
  outOfStockThreshold?: number | null | undefined;
  pricesIncludeTax?: boolean | null | undefined;
  sellerId?: string | null | undefined;
  token?: string | null | undefined;
  trackInventory?: boolean | null | undefined;
};

export type UpdateCollectionInput = {
  assetIds?: Array<string> | null | undefined;
  customFields?: unknown;
  featuredAssetId?: string | null | undefined;
  filters?: Array<ConfigurableOperationInput> | null | undefined;
  id: string;
  inheritFilters?: boolean | null | undefined;
  isPrivate?: boolean | null | undefined;
  parentId?: string | null | undefined;
  translations?: Array<UpdateCollectionTranslationInput> | null | undefined;
};

export type UpdateCollectionTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
  slug?: string | null | undefined;
};

export type UpdateCountryInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  id: string;
  translations?: Array<CountryTranslationInput> | null | undefined;
};

export type UpdateCustomerGroupInput = {
  customFields?: unknown;
  id: string;
  name?: string | null | undefined;
};

export type UpdateCustomerInput = {
  customFields?: unknown;
  emailAddress?: string | null | undefined;
  firstName?: string | null | undefined;
  id: string;
  lastName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

export type UpdateCustomerNoteInput = {
  note: string;
  noteId: string;
};

export type UpdateFacetInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string;
  isPrivate?: boolean | null | undefined;
  translations?: Array<FacetTranslationInput> | null | undefined;
};

export type UpdateFacetValueInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string;
  translations?: Array<FacetValueTranslationInput> | null | undefined;
};

export type UpdateGlobalSettingsInput = {
  availableLanguages?: Array<LanguageCode> | null | undefined;
  customFields?: unknown;
  outOfStockThreshold?: number | null | undefined;
  trackInventory?: boolean | null | undefined;
};

export type UpdateOrderAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode?: string | null | undefined;
  fullName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1?: string | null | undefined;
  streetLine2?: string | null | undefined;
};

export type UpdateOrderInput = {
  customFields?: unknown;
  id: string;
};

export type UpdateOrderNoteInput = {
  isPublic?: boolean | null | undefined;
  note?: string | null | undefined;
  noteId: string;
};

export type UpdatePaymentMethodInput = {
  checker?: ConfigurableOperationInput | null | undefined;
  code?: string | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  handler?: ConfigurableOperationInput | null | undefined;
  id: string;
  translations?: Array<PaymentMethodTranslationInput> | null | undefined;
};

export type UpdateProductInput = {
  assetIds?: Array<string> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string> | null | undefined;
  featuredAssetId?: string | null | undefined;
  id: string;
  translations?: Array<ProductTranslationInput> | null | undefined;
};

export type UpdateProductOptionGroupInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string;
  translations?: Array<ProductOptionGroupTranslationInput> | null | undefined;
};

export type UpdateProductOptionInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string;
  translations?: Array<ProductOptionGroupTranslationInput> | null | undefined;
};

export type UpdateProductVariantInput = {
  assetIds?: Array<string> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string> | null | undefined;
  featuredAssetId?: string | null | undefined;
  id: string;
  optionIds?: Array<string> | null | undefined;
  outOfStockThreshold?: number | null | undefined;
  /** Sets the price for the ProductVariant in the Channel's default currency */
  price?: number | null | undefined;
  /** Allows multiple prices to be set for the ProductVariant in different currencies. */
  prices?: Array<UpdateProductVariantPriceInput> | null | undefined;
  sku?: string | null | undefined;
  stockLevels?: Array<StockLevelInput> | null | undefined;
  stockOnHand?: number | null | undefined;
  taxCategoryId?: string | null | undefined;
  trackInventory?: GlobalFlag | null | undefined;
  translations?: Array<ProductVariantTranslationInput> | null | undefined;
  useGlobalOutOfStockThreshold?: boolean | null | undefined;
};

/**
 * Used to set up update the price of a ProductVariant in a particular Channel.
 * If the `delete` flag is `true`, the price will be deleted for the given Channel.
 */
export type UpdateProductVariantPriceInput = {
  currencyCode: CurrencyCode;
  customFields?: unknown;
  delete?: boolean | null | undefined;
  price: number;
};

export type UpdatePromotionInput = {
  actions?: Array<ConfigurableOperationInput> | null | undefined;
  conditions?: Array<ConfigurableOperationInput> | null | undefined;
  couponCode?: string | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  endsAt?: string | null | undefined;
  id: string;
  perCustomerUsageLimit?: number | null | undefined;
  startsAt?: string | null | undefined;
  translations?: Array<PromotionTranslationInput> | null | undefined;
  usageLimit?: number | null | undefined;
};

export type UpdateRoleInput = {
  channelIds?: Array<string> | null | undefined;
  code?: string | null | undefined;
  customFields?: unknown;
  description?: string | null | undefined;
  id: string;
  permissions?: Array<Permission> | null | undefined;
};

export type UpdateScheduledTaskInput = {
  enabled?: boolean | null | undefined;
  id: string;
};

export type UpdateSellerInput = {
  customFields?: unknown;
  id: string;
  name?: string | null | undefined;
  translations?: Array<SellerTranslationInput> | null | undefined;
};

export type UpdateShippingMethodInput = {
  calculator?: ConfigurableOperationInput | null | undefined;
  checker?: ConfigurableOperationInput | null | undefined;
  code?: string | null | undefined;
  customFields?: unknown;
  fulfillmentHandler?: string | null | undefined;
  id: string;
  translations: Array<ShippingMethodTranslationInput>;
};

export type UpdateStockLocationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id: string;
  name?: string | null | undefined;
};

export type UpdateTaxCategoryInput = {
  customFields?: unknown;
  id: string;
  isDefault?: boolean | null | undefined;
  name?: string | null | undefined;
};

export type UpdateTaxRateInput = {
  categoryId?: string | null | undefined;
  customFields?: unknown;
  customerGroupId?: string | null | undefined;
  enabled?: boolean | null | undefined;
  id: string;
  name?: string | null | undefined;
  value?: number | null | undefined;
  zoneId?: string | null | undefined;
};

export type UpdateZoneInput = {
  customFields?: unknown;
  id: string;
  name?: string | null | undefined;
};

export type ZoneFilterParameter = {
  _and?: Array<ZoneFilterParameter> | null | undefined;
  _or?: Array<ZoneFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ZoneListOptions = {
  /** Allows the results to be filtered */
  filter?: ZoneFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ZoneSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ZoneSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type AdministratorListQueryVariables = Exact<{
  options?: AdministratorListOptions | null | undefined;
}>;


export type AdministratorListQuery = { administrators: { totalItems: number, items: Array<{ id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, roles: Array<{ id: string, code: string }> } }> } };

export type AdministratorDetailQueryVariables = Exact<{
  id: string;
}>;


export type AdministratorDetailQuery = { administrator: { id: string, createdAt: string, updatedAt: string, firstName: string, lastName: string, emailAddress: string, customFields: unknown, user: { id: string, identifier: string, lastLogin: string | null, roles: Array<{ id: string, code: string, description: string, channels: Array<{ id: string, code: string }> }> } } | null };

export type CreateAdministratorMutationVariables = Exact<{
  input: CreateAdministratorInput;
}>;


export type CreateAdministratorMutation = { createAdministrator: { id: string } };

export type UpdateAdministratorMutationVariables = Exact<{
  input: UpdateAdministratorInput;
}>;


export type UpdateAdministratorMutation = { updateAdministrator: { id: string } };

export type DeleteAdministratorMutationVariables = Exact<{
  id: string;
}>;


export type DeleteAdministratorMutation = { deleteAdministrator: { result: DeletionResult, message: string | null } };

export type ApiKeyListQueryVariables = Exact<{
  options?: ApiKeyListOptions | null | undefined;
}>;


export type ApiKeyListQuery = { apiKeys: { totalItems: number, items: Array<{ id: string, name: string, lookupId: string, lastUsedAt: string | null }> } };

export type ApiKeyDetailQueryVariables = Exact<{
  id: string;
}>;


export type ApiKeyDetailQuery = { apiKey: { id: string, createdAt: string, updatedAt: string, lookupId: string, lastUsedAt: string | null, name: string, customFields: unknown, owner: { id: string, identifier: string }, user: { id: string, roles: Array<{ id: string, code: string, description: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } | null };

export type ActiveAdministratorRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveAdministratorRolesQuery = { activeAdministrator: { id: string, user: { id: string, roles: Array<{ id: string, code: string, description: string }> } } | null };

export type CreateApiKeyMutationVariables = Exact<{
  input: CreateApiKeyInput;
}>;


export type CreateApiKeyMutation = { createApiKey: { apiKey: string, entityId: string } };

export type UpdateApiKeyMutationVariables = Exact<{
  input: UpdateApiKeyInput;
}>;


export type UpdateApiKeyMutation = { updateApiKey: { id: string } };

export type RotateApiKeyMutationVariables = Exact<{
  id: string;
}>;


export type RotateApiKeyMutation = { rotateApiKey: { apiKey: string } };

export type DeleteApiKeysMutationVariables = Exact<{
  ids: Array<string> | string;
}>;


export type DeleteApiKeysMutation = { deleteApiKeys: Array<{ result: DeletionResult, message: string | null }> };

export type AssetListQueryVariables = Exact<{
  options?: AssetListOptions | null | undefined;
}>;


export type AssetListQuery = { assets: { totalItems: number, items: Array<{ id: string, name: string, preview: string, type: AssetType, mimeType: string }> } };

export type AssetDetailQueryVariables = Exact<{
  id: string;
}>;


export type AssetDetailQuery = { asset: { id: string, createdAt: string, updatedAt: string, name: string, type: AssetType, fileSize: number, mimeType: string, width: number, height: number, source: string, preview: string, languageCode: LanguageCode, customFields: unknown, focalPoint: { x: number, y: number } | null, tags: Array<{ id: string, value: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } | null };

export type AssetTagsQueryVariables = Exact<{
  options?: TagListOptions | null | undefined;
}>;


export type AssetTagsQuery = { tags: { totalItems: number, items: Array<{ id: string, value: string }> } };

export type UpdateAssetMutationVariables = Exact<{
  input: UpdateAssetInput;
}>;


export type UpdateAssetMutation = { updateAsset: { id: string, updatedAt: string } };

export type DeleteAssetsMutationVariables = Exact<{
  input: DeleteAssetsInput;
}>;


export type DeleteAssetsMutation = { deleteAssets: { result: DeletionResult, message: string | null } };

export type CreateAssetsMutationVariables = Exact<{
  input: Array<CreateAssetInput> | CreateAssetInput;
}>;


export type CreateAssetsMutation = { createAssets: Array<
    | { __typename: 'Asset', id: string, name: string, preview: string, mimeType: string }
    | { __typename: 'MimeTypeError', errorCode: ErrorCode, message: string, fileName: string, mimeType: string }
  > };

export type LoginMutationVariables = Exact<{
  username: string;
  password: string;
  rememberMe?: boolean | null | undefined;
}>;


export type LoginMutation = { login:
    | { __typename: 'CurrentUser', id: string, identifier: string }
    | { __typename: 'InvalidCredentialsError', errorCode: ErrorCode, message: string }
    | { __typename: 'NativeAuthStrategyError', errorCode: ErrorCode, message: string }
   };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { success: boolean } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { me: { id: string, identifier: string, channels: Array<{ id: string, code: string, token: string, permissions: Array<Permission> }> } | null, activeAdministrator: { id: string, firstName: string, lastName: string, emailAddress: string } | null };

export type ActiveChannelQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveChannelQuery = { activeChannel: { id: string, code: string, token: string, defaultCurrencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, pricesIncludeTax: boolean }, globalSettings: { id: string, serverConfig: { moneyStrategyPrecision: number } } };

export type ChannelListQueryVariables = Exact<{
  options?: ChannelListOptions | null | undefined;
}>;


export type ChannelListQuery = { channels: { totalItems: number, items: Array<{ id: string, code: string, defaultLanguageCode: LanguageCode, defaultCurrencyCode: CurrencyCode, pricesIncludeTax: boolean, seller: { id: string, name: string } | null }> } };

export type ChannelDetailQueryVariables = Exact<{
  id: string;
}>;


export type ChannelDetailQuery = { channel: { id: string, createdAt: string, updatedAt: string, code: string, token: string, pricesIncludeTax: boolean, availableCurrencyCodes: Array<CurrencyCode>, availableLanguageCodes: Array<LanguageCode> | null, defaultCurrencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, trackInventory: boolean | null, outOfStockThreshold: number | null, customFields: unknown, defaultShippingZone: { id: string, name: string } | null, defaultTaxZone: { id: string, name: string } | null, seller: { id: string, name: string } | null } | null };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { createChannel:
    | { __typename: 'Channel', id: string }
    | { __typename: 'LanguageNotAvailableError', errorCode: ErrorCode, message: string }
   };

export type UpdateChannelMutationVariables = Exact<{
  input: UpdateChannelInput;
}>;


export type UpdateChannelMutation = { updateChannel:
    | { __typename: 'Channel', id: string }
    | { __typename: 'LanguageNotAvailableError', errorCode: ErrorCode, message: string }
   };

export type DeleteChannelMutationVariables = Exact<{
  id: string;
}>;


export type DeleteChannelMutation = { deleteChannel: { result: DeletionResult, message: string | null } };

export type PickZoneOptionsQueryVariables = Exact<{
  options?: ZoneListOptions | null | undefined;
}>;


export type PickZoneOptionsQuery = { zones: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type CollectionListQueryVariables = Exact<{
  options?: CollectionListOptions | null | undefined;
}>;


export type CollectionListQuery = { collections: { totalItems: number, items: Array<{ id: string, name: string, slug: string, isPrivate: boolean, parentId: string, position: number, productVariantCount: number, featuredAsset: { id: string, preview: string } | null, breadcrumbs: Array<{ id: string, name: string }>, children: Array<{ id: string }> | null }> } };

export type CollectionDetailQueryVariables = Exact<{
  id: string;
}>;


export type CollectionDetailQuery = { collection: { id: string, createdAt: string, updatedAt: string, languageCode: LanguageCode | null, name: string, slug: string, description: string, isPrivate: boolean, inheritFilters: boolean, position: number, parentId: string, customFields: unknown, breadcrumbs: Array<{ id: string, name: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string }> | null, featuredAsset: { id: string, preview: string, name: string } | null, assets: Array<{ id: string, preview: string, name: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }> } | null };

export type CollectionContentsQueryVariables = Exact<{
  id: string;
  options?: ProductVariantListOptions | null | undefined;
}>;


export type CollectionContentsQuery = { collection: { id: string, productVariants: { totalItems: number, items: Array<{ id: string, name: string, sku: string, featuredAsset: { id: string, preview: string } | null, product: { id: string, featuredAsset: { id: string, preview: string } | null } }> } } | null };

export type CollectionFiltersQueryVariables = Exact<{ [key: string]: never; }>;


export type CollectionFiltersQuery = { collectionFilters: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }> };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { createCollection: { id: string } };

export type UpdateCollectionMutationVariables = Exact<{
  input: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { updateCollection: { id: string, updatedAt: string } };

export type MoveCollectionMutationVariables = Exact<{
  input: MoveCollectionInput;
}>;


export type MoveCollectionMutation = { moveCollection: { id: string, parentId: string } };

export type DeleteCollectionMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCollectionMutation = { deleteCollection: { result: DeletionResult, message: string | null } };

export type CountryListQueryVariables = Exact<{
  options?: CountryListOptions | null | undefined;
}>;


export type CountryListQuery = { countries: { totalItems: number, items: Array<{ id: string, code: string, name: string, enabled: boolean }> } };

export type CountryDetailQueryVariables = Exact<{
  id: string;
}>;


export type CountryDetailQuery = { country: { id: string, createdAt: string, updatedAt: string, languageCode: LanguageCode, code: string, name: string, enabled: boolean, customFields: unknown, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateCountryMutationVariables = Exact<{
  input: CreateCountryInput;
}>;


export type CreateCountryMutation = { createCountry: { id: string } };

export type UpdateCountryMutationVariables = Exact<{
  input: UpdateCountryInput;
}>;


export type UpdateCountryMutation = { updateCountry: { id: string } };

export type DeleteCountryMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCountryMutation = { deleteCountry: { result: DeletionResult, message: string | null } };

export type CustomerGroupListQueryVariables = Exact<{
  options?: CustomerGroupListOptions | null | undefined;
}>;


export type CustomerGroupListQuery = { customerGroups: { totalItems: number, items: Array<{ id: string, name: string, customers: { totalItems: number } }> } };

export type CustomerGroupDetailQueryVariables = Exact<{
  id: string;
}>;


export type CustomerGroupDetailQuery = { customerGroup: { id: string, createdAt: string, updatedAt: string, name: string, customFields: unknown } | null };

export type CustomerGroupMembersQueryVariables = Exact<{
  id: string;
  options?: CustomerListOptions | null | undefined;
}>;


export type CustomerGroupMembersQuery = { customerGroup: { id: string, customers: { totalItems: number, items: Array<{ id: string, firstName: string, lastName: string, emailAddress: string }> } } | null };

export type CreateCustomerGroupMutationVariables = Exact<{
  input: CreateCustomerGroupInput;
}>;


export type CreateCustomerGroupMutation = { createCustomerGroup: { id: string } };

export type UpdateCustomerGroupMutationVariables = Exact<{
  input: UpdateCustomerGroupInput;
}>;


export type UpdateCustomerGroupMutation = { updateCustomerGroup: { id: string } };

export type DeleteCustomerGroupMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCustomerGroupMutation = { deleteCustomerGroup: { result: DeletionResult, message: string | null } };

export type AddCustomersToGroupMutationVariables = Exact<{
  customerGroupId: string;
  customerIds: Array<string> | string;
}>;


export type AddCustomersToGroupMutation = { addCustomersToGroup: { id: string } };

export type RemoveCustomersFromGroupMutationVariables = Exact<{
  customerGroupId: string;
  customerIds: Array<string> | string;
}>;


export type RemoveCustomersFromGroupMutation = { removeCustomersFromGroup: { id: string } };

export type CustomerListQueryVariables = Exact<{
  options?: CustomerListOptions | null | undefined;
}>;


export type CustomerListQuery = { customers: { totalItems: number, items: Array<{ id: string, createdAt: string, title: string | null, firstName: string, lastName: string, emailAddress: string, phoneNumber: string | null, user: { id: string, verified: boolean } | null }> } };

export type CustomerAddressFragment = { id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, customFields: unknown, country: { id: string, code: string, name: string } };

export type CustomerDetailQueryVariables = Exact<{
  id: string;
}>;


export type CustomerDetailQuery = { customer: { id: string, createdAt: string, updatedAt: string, title: string | null, firstName: string, lastName: string, phoneNumber: string | null, emailAddress: string, customFields: unknown, groups: Array<{ id: string, name: string }>, user: { id: string, identifier: string, verified: boolean, lastLogin: string | null } | null, addresses: Array<{ id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, customFields: unknown, country: { id: string, code: string, name: string } }> | null } | null };

export type CustomerOrdersQueryVariables = Exact<{
  customerId: string;
  options?: OrderListOptions | null | undefined;
}>;


export type CustomerOrdersQuery = { customer: { id: string, orders: { totalItems: number, items: Array<{ id: string, code: string, state: string, active: boolean, orderPlacedAt: string | null, updatedAt: string, totalWithTax: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string, emailAddress: string } | null }> } } | null };

export type CustomerHistoryQueryVariables = Exact<{
  id: string;
  options?: HistoryEntryListOptions | null | undefined;
}>;


export type CustomerHistoryQuery = { activeAdministrator: { id: string } | null, customer: { id: string, history: { totalItems: number, items: Array<{ id: string, type: HistoryEntryType, createdAt: string, isPublic: boolean, data: unknown, administrator: { id: string, firstName: string, lastName: string } | null }> } } | null };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
  password?: string | null | undefined;
}>;


export type CreateCustomerMutation = { createCustomer:
    | { __typename: 'Customer', id: string }
    | { __typename: 'EmailAddressConflictError', errorCode: ErrorCode, message: string }
    | { __typename: 'PasswordValidationError', errorCode: ErrorCode, message: string }
   };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { updateCustomer:
    | { __typename: 'Customer', id: string }
    | { __typename: 'EmailAddressConflictError', errorCode: ErrorCode, message: string }
   };

export type DeleteCustomerMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCustomerMutation = { deleteCustomer: { result: DeletionResult, message: string | null } };

export type VerifyCustomerAccountMutationVariables = Exact<{
  id: string;
  password?: string | null | undefined;
}>;


export type VerifyCustomerAccountMutation = { verifyCustomerAccount:
    | { __typename: 'Customer', id: string, user: { id: string, verified: boolean } | null }
    | { __typename: 'MissingPasswordError', errorCode: ErrorCode, message: string }
    | { __typename: 'PasswordAlreadySetError', errorCode: ErrorCode, message: string }
    | { __typename: 'PasswordValidationError', errorCode: ErrorCode, message: string }
   };

export type CreateCustomerAddressMutationVariables = Exact<{
  customerId: string;
  input: CreateAddressInput;
}>;


export type CreateCustomerAddressMutation = { createCustomerAddress: { id: string } };

export type UpdateCustomerAddressMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateCustomerAddressMutation = { updateCustomerAddress: { id: string } };

export type DeleteCustomerAddressMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCustomerAddressMutation = { deleteCustomerAddress: { success: boolean } };

export type AddCustomerNoteMutationVariables = Exact<{
  input: AddNoteToCustomerInput;
}>;


export type AddCustomerNoteMutation = { addNoteToCustomer: { id: string } };

export type UpdateCustomerNoteMutationVariables = Exact<{
  input: UpdateCustomerNoteInput;
}>;


export type UpdateCustomerNoteMutation = { updateCustomerNote: { id: string } };

export type DeleteCustomerNoteMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCustomerNoteMutation = { deleteCustomerNote: { result: DeletionResult, message: string | null } };

export type DashboardMetricsQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardMetricsQuery = { metricSummary: Array<{ type: MetricType, title: string, entries: Array<{ label: string, value: number }> }> };

export type DashboardOrdersQueryVariables = Exact<{
  today: string;
  monthStart: string;
}>;


export type DashboardOrdersQuery = { today: { totalItems: number }, month: { totalItems: number }, latest: { items: Array<{ id: string, code: string, state: string, active: boolean, orderPlacedAt: string | null, updatedAt: string, totalWithTax: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string, emailAddress: string } | null }> } };

export type DashboardOrderTotalsQueryVariables = Exact<{
  since: string;
  take: number;
}>;


export type DashboardOrderTotalsQuery = { orders: { totalItems: number, items: Array<{ id: string, orderPlacedAt: string | null, totalWithTax: number }> } };

export type DraftOrderDetailQueryVariables = Exact<{
  id: string;
}>;


export type DraftOrderDetailQuery = { order: { id: string, code: string, state: string, active: boolean, createdAt: string, updatedAt: string, currencyCode: CurrencyCode, totalQuantity: number, subTotalWithTax: number, shippingWithTax: number, total: number, totalWithTax: number, couponCodes: Array<string>, nextStates: Array<string>, customFields: unknown, customer: { id: string, firstName: string, lastName: string, emailAddress: string, addresses: Array<{ id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { id: string, code: string, name: string } }> | null } | null, lines: Array<{ id: string, quantity: number, unitPriceWithTax: number, linePriceWithTax: number, discountedLinePriceWithTax: number, featuredAsset: { id: string, preview: string } | null, productVariant: { id: string, name: string, sku: string } }>, discounts: Array<{ description: string, amountWithTax: number }>, promotions: Array<{ id: string, name: string, couponCode: string | null }>, shippingLines: Array<{ id: string, priceWithTax: number, shippingMethod: { id: string, name: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, countryCode: string | null, phoneNumber: string | null } | null, billingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, countryCode: string | null, phoneNumber: string | null } | null } | null };

export type CreateDraftOrderMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateDraftOrderMutation = { createDraftOrder: { id: string } };

export type DeleteDraftOrderMutationVariables = Exact<{
  orderId: string;
}>;


export type DeleteDraftOrderMutation = { deleteDraftOrder: { result: DeletionResult, message: string | null } };

export type AddItemToDraftOrderMutationVariables = Exact<{
  orderId: string;
  input: AddItemToDraftOrderInput;
}>;


export type AddItemToDraftOrderMutation = { addItemToDraftOrder:
    | { __typename: 'InsufficientStockError', errorCode: ErrorCode, message: string }
    | { __typename: 'NegativeQuantityError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string }
    | { __typename: 'OrderInterceptorError', errorCode: ErrorCode, message: string }
    | { __typename: 'OrderLimitError', errorCode: ErrorCode, message: string }
    | { __typename: 'OrderModificationError', errorCode: ErrorCode, message: string }
   };

export type AdjustDraftOrderLineMutationVariables = Exact<{
  orderId: string;
  input: AdjustDraftOrderLineInput;
}>;


export type AdjustDraftOrderLineMutation = { adjustDraftOrderLine:
    | { __typename: 'InsufficientStockError', errorCode: ErrorCode, message: string }
    | { __typename: 'NegativeQuantityError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string }
    | { __typename: 'OrderInterceptorError', errorCode: ErrorCode, message: string }
    | { __typename: 'OrderLimitError', errorCode: ErrorCode, message: string }
    | { __typename: 'OrderModificationError', errorCode: ErrorCode, message: string }
   };

export type RemoveDraftOrderLineMutationVariables = Exact<{
  orderId: string;
  orderLineId: string;
}>;


export type RemoveDraftOrderLineMutation = { removeDraftOrderLine:
    | { __typename: 'Order', id: string }
    | { __typename: 'OrderInterceptorError', errorCode: ErrorCode, message: string }
    | { __typename: 'OrderModificationError', errorCode: ErrorCode, message: string }
   };

export type SetCustomerForDraftOrderMutationVariables = Exact<{
  orderId: string;
  customerId?: string | null | undefined;
  input?: CreateCustomerInput | null | undefined;
}>;


export type SetCustomerForDraftOrderMutation = { setCustomerForDraftOrder:
    | { __typename: 'EmailAddressConflictError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string, customer: { id: string } | null }
   };

export type SetDraftOrderShippingAddressMutationVariables = Exact<{
  orderId: string;
  input: CreateAddressInput;
}>;


export type SetDraftOrderShippingAddressMutation = { setDraftOrderShippingAddress: { id: string } };

export type SetDraftOrderBillingAddressMutationVariables = Exact<{
  orderId: string;
  input: CreateAddressInput;
}>;


export type SetDraftOrderBillingAddressMutation = { setDraftOrderBillingAddress: { id: string } };

export type UnsetDraftOrderShippingAddressMutationVariables = Exact<{
  orderId: string;
}>;


export type UnsetDraftOrderShippingAddressMutation = { unsetDraftOrderShippingAddress: { id: string } };

export type UnsetDraftOrderBillingAddressMutationVariables = Exact<{
  orderId: string;
}>;


export type UnsetDraftOrderBillingAddressMutation = { unsetDraftOrderBillingAddress: { id: string } };

export type DraftOrderEligibleShippingMethodsQueryVariables = Exact<{
  orderId: string;
}>;


export type DraftOrderEligibleShippingMethodsQuery = { eligibleShippingMethodsForDraftOrder: Array<{ id: string, name: string, code: string, description: string, price: number, priceWithTax: number }> };

export type SetDraftOrderShippingMethodMutationVariables = Exact<{
  orderId: string;
  shippingMethodId: string;
}>;


export type SetDraftOrderShippingMethodMutation = { setDraftOrderShippingMethod:
    | { __typename: 'IneligibleShippingMethodError', errorCode: ErrorCode, message: string }
    | { __typename: 'NoActiveOrderError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string }
    | { __typename: 'OrderModificationError', errorCode: ErrorCode, message: string }
   };

export type ApplyCouponCodeToDraftOrderMutationVariables = Exact<{
  orderId: string;
  couponCode: string;
}>;


export type ApplyCouponCodeToDraftOrderMutation = { applyCouponCodeToDraftOrder:
    | { __typename: 'CouponCodeExpiredError', errorCode: ErrorCode, message: string }
    | { __typename: 'CouponCodeInvalidError', errorCode: ErrorCode, message: string }
    | { __typename: 'CouponCodeLimitError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string, couponCodes: Array<string> }
   };

export type RemoveCouponCodeFromDraftOrderMutationVariables = Exact<{
  orderId: string;
  couponCode: string;
}>;


export type RemoveCouponCodeFromDraftOrderMutation = { removeCouponCodeFromDraftOrder: { id: string, couponCodes: Array<string> } | null };

export type SetDraftOrderCustomFieldsMutationVariables = Exact<{
  orderId: string;
  input: UpdateOrderInput;
}>;


export type SetDraftOrderCustomFieldsMutation = { setDraftOrderCustomFields: { id: string } };

export type DraftOrderVariantsQueryVariables = Exact<{
  options?: ProductVariantListOptions | null | undefined;
}>;


export type DraftOrderVariantsQuery = { productVariants: { totalItems: number, items: Array<{ id: string, name: string, sku: string, stockLevel: string }> } };

export type FacetListQueryVariables = Exact<{
  options?: FacetListOptions | null | undefined;
}>;


export type FacetListQuery = { facets: { totalItems: number, items: Array<{ id: string, code: string, name: string, isPrivate: boolean, valueList: { totalItems: number, items: Array<{ id: string, name: string }> } }> } };

export type FacetDetailQueryVariables = Exact<{
  id: string;
}>;


export type FacetDetailQuery = { facet: { id: string, createdAt: string, updatedAt: string, languageCode: LanguageCode, code: string, name: string, isPrivate: boolean, customFields: unknown, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, values: Array<{ id: string, code: string, name: string, languageCode: LanguageCode, customFields: unknown, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }> } | null };

export type CreateFacetMutationVariables = Exact<{
  input: CreateFacetInput;
}>;


export type CreateFacetMutation = { createFacet: { id: string, values: Array<{ id: string, code: string, translations: Array<{ id: string, languageCode: LanguageCode }> }> } };

export type UpdateFacetMutationVariables = Exact<{
  input: UpdateFacetInput;
}>;


export type UpdateFacetMutation = { updateFacet: { id: string } };

export type DeleteFacetMutationVariables = Exact<{
  id: string;
  force?: boolean | null | undefined;
}>;


export type DeleteFacetMutation = { deleteFacet: { result: DeletionResult, message: string | null } };

export type CreateFacetValuesMutationVariables = Exact<{
  input: Array<CreateFacetValueInput> | CreateFacetValueInput;
}>;


export type CreateFacetValuesMutation = { createFacetValues: Array<{ id: string, code: string, translations: Array<{ id: string, languageCode: LanguageCode }> }> };

export type UpdateFacetValuesMutationVariables = Exact<{
  input: Array<UpdateFacetValueInput> | UpdateFacetValueInput;
}>;


export type UpdateFacetValuesMutation = { updateFacetValues: Array<{ id: string }> };

export type DeleteFacetValuesMutationVariables = Exact<{
  ids: Array<string> | string;
  force?: boolean | null | undefined;
}>;


export type DeleteFacetValuesMutation = { deleteFacetValues: Array<{ result: DeletionResult, message: string | null }> };

export type GlobalSettingsDetailQueryVariables = Exact<{ [key: string]: never; }>;


export type GlobalSettingsDetailQuery = { globalSettings: { id: string, updatedAt: string, availableLanguages: Array<LanguageCode>, trackInventory: boolean, outOfStockThreshold: number, customFields: unknown } };

export type UpdateGlobalSettingsMutationVariables = Exact<{
  input: UpdateGlobalSettingsInput;
}>;


export type UpdateGlobalSettingsMutation = { updateGlobalSettings:
    | { __typename: 'ChannelDefaultLanguageError', errorCode: ErrorCode, message: string }
    | { __typename: 'GlobalSettings', id: string }
   };

export type JobListQueryVariables = Exact<{
  options?: JobListOptions | null | undefined;
}>;


export type JobListQuery = { jobs: { totalItems: number, items: Array<{ id: string, queueName: string, state: JobState, progress: number, createdAt: string, settledAt: string | null, duration: number }> } };

export type JobDetailQueryVariables = Exact<{
  id: string;
}>;


export type JobDetailQuery = { job: { id: string, queueName: string, state: JobState, progress: number, createdAt: string, startedAt: string | null, settledAt: string | null, isSettled: boolean, duration: number, data: unknown, result: unknown, error: unknown, retries: number, attempts: number } | null };

export type JobQueueListQueryVariables = Exact<{ [key: string]: never; }>;


export type JobQueueListQuery = { jobQueues: Array<{ name: string, running: boolean }> };

export type CancelJobMutationVariables = Exact<{
  jobId: string;
}>;


export type CancelJobMutation = { cancelJob: { id: string, state: JobState } };

export type RebuildSearchIndexMutationVariables = Exact<{ [key: string]: never; }>;


export type RebuildSearchIndexMutation = { reindex: { id: string, queueName: string, state: JobState } };

export type ActiveJobCountQueryVariables = Exact<{
  filter?: JobFilterParameter | null | undefined;
}>;


export type ActiveJobCountQuery = { jobs: { totalItems: number } };

export type OptionGroupListQueryVariables = Exact<{
  options?: ProductOptionGroupListOptions | null | undefined;
}>;


export type OptionGroupListQuery = { productOptionGroups: { totalItems: number, items: Array<{ id: string, code: string, name: string, productCount: number, options: Array<{ id: string }> }> } };

export type OptionGroupDetailQueryVariables = Exact<{
  id: string;
}>;


export type OptionGroupDetailQuery = { productOptionGroup: { id: string, createdAt: string, updatedAt: string, languageCode: LanguageCode, code: string, name: string, productCount: number, customFields: unknown, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, options: Array<{ id: string, code: string, name: string, languageCode: LanguageCode, customFields: unknown, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }> } | null };

export type CreateOptionGroupMutationVariables = Exact<{
  input: CreateProductOptionGroupInput;
}>;


export type CreateOptionGroupMutation = { createProductOptionGroup: { id: string, options: Array<{ id: string, code: string, translations: Array<{ id: string, languageCode: LanguageCode }> }> } };

export type UpdateOptionGroupMutationVariables = Exact<{
  input: UpdateProductOptionGroupInput;
}>;


export type UpdateOptionGroupMutation = { updateProductOptionGroup: { id: string } };

export type DeleteOptionGroupMutationVariables = Exact<{
  id: string;
  force?: boolean | null | undefined;
}>;


export type DeleteOptionGroupMutation = { deleteProductOptionGroup: { result: DeletionResult, message: string | null } };

export type CreateProductOptionMutationVariables = Exact<{
  input: CreateProductOptionInput;
}>;


export type CreateProductOptionMutation = { createProductOption: { id: string, code: string, translations: Array<{ id: string, languageCode: LanguageCode }> } };

export type UpdateProductOptionMutationVariables = Exact<{
  input: UpdateProductOptionInput;
}>;


export type UpdateProductOptionMutation = { updateProductOption: { id: string } };

export type DeleteProductOptionMutationVariables = Exact<{
  id: string;
}>;


export type DeleteProductOptionMutation = { deleteProductOption: { result: DeletionResult, message: string | null } };

export type OrderListItemFragment = { id: string, code: string, state: string, active: boolean, orderPlacedAt: string | null, updatedAt: string, totalWithTax: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string, emailAddress: string } | null };

export type OrderListQueryVariables = Exact<{
  options?: OrderListOptions | null | undefined;
}>;


export type OrderListQuery = { orders: { totalItems: number, items: Array<{ id: string, code: string, state: string, active: boolean, orderPlacedAt: string | null, updatedAt: string, totalWithTax: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string, emailAddress: string } | null }> } };

export type OrderDetailQueryVariables = Exact<{
  id: string;
}>;


export type OrderDetailQuery = { order: { id: string, code: string, state: string, active: boolean, type: OrderType, createdAt: string, updatedAt: string, orderPlacedAt: string | null, currencyCode: CurrencyCode, totalQuantity: number, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, nextStates: Array<string>, couponCodes: Array<string>, customFields: unknown, customer: { id: string, firstName: string, lastName: string, emailAddress: string, phoneNumber: string | null } | null, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, countryCode: string | null, phoneNumber: string | null } | null, billingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, countryCode: string | null, phoneNumber: string | null } | null, lines: Array<{ id: string, quantity: number, orderPlacedQuantity: number, unitPriceWithTax: number, proratedUnitPriceWithTax: number, linePriceWithTax: number, discountedLinePriceWithTax: number, customFields: unknown, featuredAsset: { id: string, preview: string } | null, productVariant: { id: string, name: string, sku: string }, fulfillmentLines: Array<{ fulfillmentId: string, quantity: number }> | null }>, discounts: Array<{ description: string, amountWithTax: number }>, promotions: Array<{ id: string, name: string, couponCode: string | null }>, surcharges: Array<{ id: string, description: string, priceWithTax: number }>, shippingLines: Array<{ id: string, priceWithTax: number, discountedPriceWithTax: number, shippingMethod: { id: string, name: string, code: string, fulfillmentHandlerCode: string } }>, payments: Array<{ id: string, method: string, amount: number, state: string, nextStates: Array<string>, transactionId: string | null, errorMessage: string | null, metadata: unknown, createdAt: string, refunds: Array<{ id: string, createdAt: string, state: string, total: number, items: number, shipping: number, adjustment: number, reason: string | null, transactionId: string | null, method: string | null, metadata: unknown, lines: Array<{ orderLineId: string, quantity: number }> }> }> | null, fulfillments: Array<{ id: string, state: string, nextStates: Array<string>, method: string, trackingCode: string | null, createdAt: string, updatedAt: string, lines: Array<{ orderLineId: string, quantity: number }> }> | null, modifications: Array<{ id: string, createdAt: string, priceChange: number, note: string, isSettled: boolean }> } | null };

export type OrderHistoryQueryVariables = Exact<{
  id: string;
  options?: HistoryEntryListOptions | null | undefined;
}>;


export type OrderHistoryQuery = { activeAdministrator: { id: string } | null, order: { id: string, history: { totalItems: number, items: Array<{ id: string, type: HistoryEntryType, createdAt: string, isPublic: boolean, data: unknown, administrator: { id: string, firstName: string, lastName: string } | null }> } } | null };

export type AddOrderNoteMutationVariables = Exact<{
  input: AddNoteToOrderInput;
}>;


export type AddOrderNoteMutation = { addNoteToOrder: { id: string } };

export type UpdateOrderNoteMutationVariables = Exact<{
  input: UpdateOrderNoteInput;
}>;


export type UpdateOrderNoteMutation = { updateOrderNote: { id: string } };

export type DeleteOrderNoteMutationVariables = Exact<{
  id: string;
}>;


export type DeleteOrderNoteMutation = { deleteOrderNote: { result: DeletionResult, message: string | null } };

export type TransitionOrderToStateMutationVariables = Exact<{
  id: string;
  state: string;
}>;


export type TransitionOrderToStateMutation = { transitionOrderToState:
    | { __typename: 'Order', id: string, state: string }
    | { __typename: 'OrderStateTransitionError', errorCode: ErrorCode, message: string, transitionError: string }
   | null };

export type OrderPaymentMethodsQueryVariables = Exact<{
  options?: PaymentMethodListOptions | null | undefined;
}>;


export type OrderPaymentMethodsQuery = { paymentMethods: { totalItems: number, items: Array<{ id: string, name: string, code: string, enabled: boolean }> } };

export type AddManualPaymentMutationVariables = Exact<{
  input: ManualPaymentInput;
}>;


export type AddManualPaymentMutation = { addManualPaymentToOrder:
    | { __typename: 'ManualPaymentStateError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string, state: string }
   };

export type SettlePaymentMutationVariables = Exact<{
  id: string;
}>;


export type SettlePaymentMutation = { settlePayment:
    | { __typename: 'OrderStateTransitionError', errorCode: ErrorCode, message: string }
    | { __typename: 'Payment', id: string, state: string }
    | { __typename: 'PaymentStateTransitionError', errorCode: ErrorCode, message: string }
    | { __typename: 'SettlePaymentError', errorCode: ErrorCode, message: string }
   };

export type CancelPaymentMutationVariables = Exact<{
  id: string;
}>;


export type CancelPaymentMutation = { cancelPayment:
    | { __typename: 'CancelPaymentError', errorCode: ErrorCode, message: string }
    | { __typename: 'Payment', id: string, state: string }
    | { __typename: 'PaymentStateTransitionError', errorCode: ErrorCode, message: string }
   };

export type TransitionPaymentToStateMutationVariables = Exact<{
  id: string;
  state: string;
}>;


export type TransitionPaymentToStateMutation = { transitionPaymentToState:
    | { __typename: 'Payment', id: string, state: string }
    | { __typename: 'PaymentStateTransitionError', errorCode: ErrorCode, message: string }
   };

export type FulfillmentHandlersQueryVariables = Exact<{ [key: string]: never; }>;


export type FulfillmentHandlersQuery = { fulfillmentHandlers: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }> };

export type FulfillOrderMutationVariables = Exact<{
  input: FulfillOrderInput;
}>;


export type FulfillOrderMutation = { addFulfillmentToOrder:
    | { __typename: 'CreateFulfillmentError', errorCode: ErrorCode, message: string }
    | { __typename: 'EmptyOrderLineSelectionError', errorCode: ErrorCode, message: string }
    | { __typename: 'Fulfillment', id: string, state: string }
    | { __typename: 'FulfillmentStateTransitionError', errorCode: ErrorCode, message: string }
    | { __typename: 'InsufficientStockOnHandError', errorCode: ErrorCode, message: string }
    | { __typename: 'InvalidFulfillmentHandlerError', errorCode: ErrorCode, message: string }
    | { __typename: 'ItemsAlreadyFulfilledError', errorCode: ErrorCode, message: string }
   };

export type TransitionFulfillmentMutationVariables = Exact<{
  id: string;
  state: string;
}>;


export type TransitionFulfillmentMutation = { transitionFulfillmentToState:
    | { __typename: 'Fulfillment', id: string, state: string }
    | { __typename: 'FulfillmentStateTransitionError', errorCode: ErrorCode, message: string }
   };

export type CancelOrderMutationVariables = Exact<{
  input: CancelOrderInput;
}>;


export type CancelOrderMutation = { cancelOrder:
    | { __typename: 'CancelActiveOrderError', errorCode: ErrorCode, message: string }
    | { __typename: 'EmptyOrderLineSelectionError', errorCode: ErrorCode, message: string }
    | { __typename: 'MultipleOrderError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string, state: string }
    | { __typename: 'OrderStateTransitionError', errorCode: ErrorCode, message: string }
    | { __typename: 'QuantityTooGreatError', errorCode: ErrorCode, message: string }
   };

export type RefundOrderMutationVariables = Exact<{
  input: RefundOrderInput;
}>;


export type RefundOrderMutation = { refundOrder:
    | { __typename: 'AlreadyRefundedError', errorCode: ErrorCode, message: string }
    | { __typename: 'MultipleOrderError', errorCode: ErrorCode, message: string }
    | { __typename: 'NothingToRefundError', errorCode: ErrorCode, message: string }
    | { __typename: 'OrderStateTransitionError', errorCode: ErrorCode, message: string }
    | { __typename: 'PaymentOrderMismatchError', errorCode: ErrorCode, message: string }
    | { __typename: 'QuantityTooGreatError', errorCode: ErrorCode, message: string }
    | { __typename: 'Refund', id: string, state: string, total: number }
    | { __typename: 'RefundAmountError', errorCode: ErrorCode, message: string }
    | { __typename: 'RefundDestinationError', errorCode: ErrorCode, message: string }
    | { __typename: 'RefundIncompleteError', errorCode: ErrorCode, message: string }
    | { __typename: 'RefundOrderStateError', errorCode: ErrorCode, message: string }
    | { __typename: 'RefundStateTransitionError', errorCode: ErrorCode, message: string }
   };

export type SettleRefundMutationVariables = Exact<{
  input: SettleRefundInput;
}>;


export type SettleRefundMutation = { settleRefund:
    | { __typename: 'Refund', id: string, state: string, transactionId: string | null }
    | { __typename: 'RefundStateTransitionError', errorCode: ErrorCode, message: string }
   };

export type ModifyOrderMutationVariables = Exact<{
  input: ModifyOrderInput;
}>;


export type ModifyOrderMutation = { modifyOrder:
    | { __typename: 'CouponCodeExpiredError', errorCode: ErrorCode, message: string }
    | { __typename: 'CouponCodeInvalidError', errorCode: ErrorCode, message: string }
    | { __typename: 'CouponCodeLimitError', errorCode: ErrorCode, message: string }
    | { __typename: 'IneligibleShippingMethodError', errorCode: ErrorCode, message: string }
    | { __typename: 'InsufficientStockError', errorCode: ErrorCode, message: string }
    | { __typename: 'NegativeQuantityError', errorCode: ErrorCode, message: string }
    | { __typename: 'NoChangesSpecifiedError', errorCode: ErrorCode, message: string }
    | { __typename: 'Order', id: string, state: string, subTotalWithTax: number, shippingWithTax: number, totalWithTax: number, currencyCode: CurrencyCode, lines: Array<{ id: string, quantity: number, linePriceWithTax: number, productVariant: { id: string, name: string } }> }
    | { __typename: 'OrderLimitError', errorCode: ErrorCode, message: string }
    | { __typename: 'OrderModificationStateError', errorCode: ErrorCode, message: string }
    | { __typename: 'PaymentMethodMissingError', errorCode: ErrorCode, message: string }
    | { __typename: 'RefundPaymentIdMissingError', errorCode: ErrorCode, message: string }
   };

export type SetOrderCustomFieldsMutationVariables = Exact<{
  input: UpdateOrderInput;
}>;


export type SetOrderCustomFieldsMutation = { setOrderCustomFields: { id: string } | null };

export type PaymentMethodListQueryVariables = Exact<{
  options?: PaymentMethodListOptions | null | undefined;
}>;


export type PaymentMethodListQuery = { paymentMethods: { totalItems: number, items: Array<{ id: string, code: string, name: string, enabled: boolean, handler: { code: string } }> } };

export type PaymentMethodDetailQueryVariables = Exact<{
  id: string;
}>;


export type PaymentMethodDetailQuery = { paymentMethod: { id: string, createdAt: string, updatedAt: string, code: string, name: string, description: string, enabled: boolean, customFields: unknown, checker: { code: string, args: Array<{ name: string, value: string }> } | null, handler: { code: string, args: Array<{ name: string, value: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> } | null };

export type PaymentMethodOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type PaymentMethodOperationsQuery = { paymentMethodHandlers: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }>, paymentMethodEligibilityCheckers: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }> };

export type CreatePaymentMethodMutationVariables = Exact<{
  input: CreatePaymentMethodInput;
}>;


export type CreatePaymentMethodMutation = { createPaymentMethod: { id: string } };

export type UpdatePaymentMethodMutationVariables = Exact<{
  input: UpdatePaymentMethodInput;
}>;


export type UpdatePaymentMethodMutation = { updatePaymentMethod: { id: string } };

export type DeletePaymentMethodMutationVariables = Exact<{
  id: string;
  force?: boolean | null | undefined;
}>;


export type DeletePaymentMethodMutation = { deletePaymentMethod: { result: DeletionResult, message: string | null } };

export type ProductListQueryVariables = Exact<{
  options?: ProductListOptions | null | undefined;
}>;


export type ProductListQuery = { products: { totalItems: number, items: Array<{ id: string, name: string, slug: string, enabled: boolean, updatedAt: string, featuredAsset: { id: string, preview: string } | null, variantList: { totalItems: number, items: Array<{ id: string, priceWithTax: number, currencyCode: CurrencyCode }> } }> } };

export type ProductDetailQueryVariables = Exact<{
  id: string;
}>;


export type ProductDetailQuery = { product: { id: string, name: string, slug: string, description: string, enabled: boolean, createdAt: string, updatedAt: string, languageCode: LanguageCode, customFields: unknown, featuredAsset: { id: string, preview: string, name: string } | null, assets: Array<{ id: string, preview: string, name: string }>, channels: Array<{ id: string, code: string }>, optionGroups: Array<{ id: string, code: string, name: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, facetValues: Array<{ id: string, name: string, code: string, facet: { id: string, name: string } }>, variantList: { totalItems: number, items: Array<{ id: string, name: string, sku: string, enabled: boolean, price: number, priceWithTax: number, currencyCode: CurrencyCode, featuredAsset: { id: string, preview: string } | null, options: Array<{ id: string, name: string }>, stockLevels: Array<{ id: string, stockOnHand: number, stockAllocated: number }> }> } } | null };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { updateProduct: { id: string, name: string, enabled: boolean, updatedAt: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { createProduct: { id: string, name: string } };

export type DeleteProductMutationVariables = Exact<{
  id: string;
}>;


export type DeleteProductMutation = { deleteProduct: { result: DeletionResult, message: string | null } };

export type AssignProductsToChannelMutationVariables = Exact<{
  input: AssignProductsToChannelInput;
}>;


export type AssignProductsToChannelMutation = { assignProductsToChannel: Array<{ id: string }> };

export type RemoveProductsFromChannelMutationVariables = Exact<{
  input: RemoveProductsFromChannelInput;
}>;


export type RemoveProductsFromChannelMutation = { removeProductsFromChannel: Array<{ id: string }> };

export type ProfileDetailQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileDetailQuery = { activeAdministrator: { id: string, createdAt: string, updatedAt: string, firstName: string, lastName: string, emailAddress: string, customFields: unknown, user: { id: string, identifier: string, lastLogin: string | null, roles: Array<{ id: string, code: string, description: string }> } } | null };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateActiveAdministratorInput;
}>;


export type UpdateProfileMutation = { updateActiveAdministrator: { id: string } };

export type PromotionListQueryVariables = Exact<{
  options?: PromotionListOptions | null | undefined;
}>;


export type PromotionListQuery = { promotions: { totalItems: number, items: Array<{ id: string, name: string, couponCode: string | null, enabled: boolean, startsAt: string | null, endsAt: string | null }> } };

export type PromotionDetailQueryVariables = Exact<{
  id: string;
}>;


export type PromotionDetailQuery = { promotion: { id: string, createdAt: string, updatedAt: string, name: string, description: string, enabled: boolean, couponCode: string | null, perCustomerUsageLimit: number | null, usageLimit: number | null, startsAt: string | null, endsAt: string | null, customFields: unknown, conditions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, actions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> } | null };

export type PromotionOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type PromotionOperationsQuery = { promotionConditions: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }>, promotionActions: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }> };

export type CreatePromotionMutationVariables = Exact<{
  input: CreatePromotionInput;
}>;


export type CreatePromotionMutation = { createPromotion:
    | { errorCode: ErrorCode, message: string }
    | { id: string }
   };

export type UpdatePromotionMutationVariables = Exact<{
  input: UpdatePromotionInput;
}>;


export type UpdatePromotionMutation = { updatePromotion:
    | { errorCode: ErrorCode, message: string }
    | { id: string }
   };

export type DeletePromotionMutationVariables = Exact<{
  id: string;
}>;


export type DeletePromotionMutation = { deletePromotion: { result: DeletionResult, message: string | null } };

export type RoleListQueryVariables = Exact<{
  options?: RoleListOptions | null | undefined;
}>;


export type RoleListQuery = { roles: { totalItems: number, items: Array<{ id: string, code: string, description: string, permissions: Array<Permission>, channels: Array<{ id: string, code: string }> }> } };

export type RoleDetailQueryVariables = Exact<{
  id: string;
}>;


export type RoleDetailQuery = { role: { id: string, createdAt: string, updatedAt: string, code: string, description: string, permissions: Array<Permission>, customFields: unknown, channels: Array<{ id: string, code: string }> } | null };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { createRole: { id: string } };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { updateRole: { id: string } };

export type DeleteRoleMutationVariables = Exact<{
  id: string;
}>;


export type DeleteRoleMutation = { deleteRole: { result: DeletionResult, message: string | null } };

export type PickRoleOptionsQueryVariables = Exact<{
  options?: RoleListOptions | null | undefined;
}>;


export type PickRoleOptionsQuery = { roles: { totalItems: number, items: Array<{ id: string, code: string, description: string }> } };

export type PickChannelOptionsQueryVariables = Exact<{
  options?: ChannelListOptions | null | undefined;
}>;


export type PickChannelOptionsQuery = { channels: { totalItems: number, items: Array<{ id: string, code: string }> } };

export type ScheduledTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type ScheduledTasksQuery = { scheduledTasks: Array<{ id: string, description: string, schedule: string, scheduleDescription: string, timezone: string | null, lastExecutedAt: string | null, nextExecutionAt: string | null, isRunning: boolean, lastResult: unknown, enabled: boolean }> };

export type UpdateScheduledTaskMutationVariables = Exact<{
  input: UpdateScheduledTaskInput;
}>;


export type UpdateScheduledTaskMutation = { updateScheduledTask: { id: string, enabled: boolean } };

export type RunScheduledTaskMutationVariables = Exact<{
  id: string;
}>;


export type RunScheduledTaskMutation = { runScheduledTask: { success: boolean } };

export type SellerListQueryVariables = Exact<{
  options?: SellerListOptions | null | undefined;
}>;


export type SellerListQuery = { sellers: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type SellerDetailQueryVariables = Exact<{
  id: string;
}>;


export type SellerDetailQuery = { seller: { id: string, createdAt: string, updatedAt: string, name: string, customFields: unknown } | null };

export type CreateSellerMutationVariables = Exact<{
  input: CreateSellerInput;
}>;


export type CreateSellerMutation = { createSeller: { id: string } };

export type UpdateSellerMutationVariables = Exact<{
  input: UpdateSellerInput;
}>;


export type UpdateSellerMutation = { updateSeller: { id: string } };

export type DeleteSellerMutationVariables = Exact<{
  id: string;
}>;


export type DeleteSellerMutation = { deleteSeller: { result: DeletionResult, message: string | null } };

export type PickSellerOptionsQueryVariables = Exact<{
  options?: SellerListOptions | null | undefined;
}>;


export type PickSellerOptionsQuery = { sellers: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type ServerConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerConfigQuery = { globalSettings: { id: string, availableLanguages: Array<LanguageCode>, serverConfig: { moneyStrategyPrecision: number, permittedAssetTypes: Array<string>, permissions: Array<{ name: string, description: string, assignable: boolean }>, orderProcess: Array<{ name: string, to: Array<string> }>, entityCustomFields: Array<{ entityName: string, customFields: Array<
          | { __typename: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
          | { __typename: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, datetimeMin: string | null, datetimeMax: string | null, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
          | { __typename: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, floatMin: number | null, floatMax: number | null, floatStep: number | null, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
          | { __typename: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, intMin: number | null, intMax: number | null, intStep: number | null, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
          | { __typename: 'LocaleStringCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, pattern: string | null, length: number | null, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
          | { __typename: 'LocaleTextCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
          | { __typename: 'RelationCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, entity: string, scalarFields: Array<string>, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
          | { __typename: 'StringCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, pattern: string | null, length: number | null, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null, options: Array<{ value: string, label: Array<{ languageCode: LanguageCode, value: string }> | null }> | null }
          | { __typename: 'StructCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null, fields: Array<
              | { name: string, type: string, list: boolean, label: Array<{ languageCode: LanguageCode, value: string }> | null }
              | { name: string, type: string, list: boolean, label: Array<{ languageCode: LanguageCode, value: string }> | null }
              | { name: string, type: string, list: boolean, label: Array<{ languageCode: LanguageCode, value: string }> | null }
              | { name: string, type: string, list: boolean, label: Array<{ languageCode: LanguageCode, value: string }> | null }
              | { name: string, type: string, list: boolean, label: Array<{ languageCode: LanguageCode, value: string }> | null }
              | { name: string, type: string, list: boolean, label: Array<{ languageCode: LanguageCode, value: string }> | null }
            > }
          | { __typename: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly: boolean | null, internal: boolean | null, nullable: boolean | null, requiresPermission: Array<Permission> | null, ui: unknown, label: Array<{ languageCode: LanguageCode, value: string }> | null, description: Array<{ languageCode: LanguageCode, value: string }> | null }
        > }> } } };

export type ShippingMethodListQueryVariables = Exact<{
  options?: ShippingMethodListOptions | null | undefined;
}>;


export type ShippingMethodListQuery = { shippingMethods: { totalItems: number, items: Array<{ id: string, code: string, name: string, fulfillmentHandlerCode: string }> } };

export type ShippingMethodDetailQueryVariables = Exact<{
  id: string;
}>;


export type ShippingMethodDetailQuery = { shippingMethod: { id: string, createdAt: string, updatedAt: string, languageCode: LanguageCode, code: string, name: string, description: string, fulfillmentHandlerCode: string, customFields: unknown, checker: { code: string, args: Array<{ name: string, value: string }> }, calculator: { code: string, args: Array<{ name: string, value: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> } | null };

export type ShippingMethodOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ShippingMethodOperationsQuery = { shippingEligibilityCheckers: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }>, shippingCalculators: Array<{ code: string, description: string, args: Array<{ name: string, type: string, list: boolean, required: boolean, defaultValue: unknown, label: string | null, description: string | null, ui: unknown }> }>, fulfillmentHandlers: Array<{ code: string, description: string }> };

export type CreateShippingMethodMutationVariables = Exact<{
  input: CreateShippingMethodInput;
}>;


export type CreateShippingMethodMutation = { createShippingMethod: { id: string } };

export type UpdateShippingMethodMutationVariables = Exact<{
  input: UpdateShippingMethodInput;
}>;


export type UpdateShippingMethodMutation = { updateShippingMethod: { id: string } };

export type DeleteShippingMethodMutationVariables = Exact<{
  id: string;
}>;


export type DeleteShippingMethodMutation = { deleteShippingMethod: { result: DeletionResult, message: string | null } };

export type TestShippingMethodQueryVariables = Exact<{
  input: TestShippingMethodInput;
}>;


export type TestShippingMethodQuery = { testShippingMethod: { eligible: boolean, quote: { price: number, priceWithTax: number, metadata: unknown } | null } };

export type TestEligibleShippingMethodsQueryVariables = Exact<{
  input: TestEligibleShippingMethodsInput;
}>;


export type TestEligibleShippingMethodsQuery = { testEligibleShippingMethods: Array<{ id: string, code: string, name: string, price: number, priceWithTax: number }> };

export type StockLocationListQueryVariables = Exact<{
  options?: StockLocationListOptions | null | undefined;
}>;


export type StockLocationListQuery = { stockLocations: { totalItems: number, items: Array<{ id: string, name: string, description: string }> } };

export type StockLocationDetailQueryVariables = Exact<{
  id: string;
}>;


export type StockLocationDetailQuery = { stockLocation: { id: string, createdAt: string, updatedAt: string, name: string, description: string, customFields: unknown } | null };

export type CreateStockLocationMutationVariables = Exact<{
  input: CreateStockLocationInput;
}>;


export type CreateStockLocationMutation = { createStockLocation: { id: string } };

export type UpdateStockLocationMutationVariables = Exact<{
  input: UpdateStockLocationInput;
}>;


export type UpdateStockLocationMutation = { updateStockLocation: { id: string } };

export type DeleteStockLocationMutationVariables = Exact<{
  input: DeleteStockLocationInput;
}>;


export type DeleteStockLocationMutation = { deleteStockLocation: { result: DeletionResult, message: string | null } };

export type PickStockLocationOptionsQueryVariables = Exact<{
  options?: StockLocationListOptions | null | undefined;
}>;


export type PickStockLocationOptionsQuery = { stockLocations: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type TaxCategoryListQueryVariables = Exact<{
  options?: TaxCategoryListOptions | null | undefined;
}>;


export type TaxCategoryListQuery = { taxCategories: { totalItems: number, items: Array<{ id: string, name: string, isDefault: boolean }> } };

export type TaxCategoryDetailQueryVariables = Exact<{
  id: string;
}>;


export type TaxCategoryDetailQuery = { taxCategory: { id: string, createdAt: string, updatedAt: string, name: string, isDefault: boolean, customFields: unknown } | null };

export type CreateTaxCategoryMutationVariables = Exact<{
  input: CreateTaxCategoryInput;
}>;


export type CreateTaxCategoryMutation = { createTaxCategory: { id: string } };

export type UpdateTaxCategoryMutationVariables = Exact<{
  input: UpdateTaxCategoryInput;
}>;


export type UpdateTaxCategoryMutation = { updateTaxCategory: { id: string } };

export type DeleteTaxCategoryMutationVariables = Exact<{
  id: string;
}>;


export type DeleteTaxCategoryMutation = { deleteTaxCategory: { result: DeletionResult, message: string | null } };

export type TaxRateListQueryVariables = Exact<{
  options?: TaxRateListOptions | null | undefined;
}>;


export type TaxRateListQuery = { taxRates: { totalItems: number, items: Array<{ id: string, name: string, enabled: boolean, value: number, category: { id: string, name: string }, zone: { id: string, name: string }, customerGroup: { id: string, name: string } | null }> } };

export type TaxRateDetailQueryVariables = Exact<{
  id: string;
}>;


export type TaxRateDetailQuery = { taxRate: { id: string, createdAt: string, updatedAt: string, name: string, enabled: boolean, value: number, customFields: unknown, category: { id: string, name: string }, zone: { id: string, name: string }, customerGroup: { id: string, name: string } | null } | null };

export type TaxRateOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type TaxRateOptionsQuery = { taxCategories: { items: Array<{ id: string, name: string }> }, zones: { items: Array<{ id: string, name: string }> } };

export type CreateTaxRateMutationVariables = Exact<{
  input: CreateTaxRateInput;
}>;


export type CreateTaxRateMutation = { createTaxRate: { id: string } };

export type UpdateTaxRateMutationVariables = Exact<{
  input: UpdateTaxRateInput;
}>;


export type UpdateTaxRateMutation = { updateTaxRate: { id: string } };

export type DeleteTaxRateMutationVariables = Exact<{
  id: string;
}>;


export type DeleteTaxRateMutation = { deleteTaxRate: { result: DeletionResult, message: string | null } };

export type VariantListQueryVariables = Exact<{
  options?: ProductVariantListOptions | null | undefined;
  productId?: string | null | undefined;
}>;


export type VariantListQuery = { productVariants: { totalItems: number, items: Array<{ id: string, name: string, sku: string, enabled: boolean, priceWithTax: number, currencyCode: CurrencyCode, featuredAsset: { id: string, preview: string } | null, product: { id: string, name: string, featuredAsset: { id: string, preview: string } | null }, stockLevels: Array<{ id: string, stockOnHand: number, stockAllocated: number }> }> } };

export type VariantDetailQueryVariables = Exact<{
  id: string;
}>;


export type VariantDetailQuery = { productVariant: { id: string, createdAt: string, updatedAt: string, languageCode: LanguageCode, name: string, sku: string, enabled: boolean, price: number, priceWithTax: number, currencyCode: CurrencyCode, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, customFields: unknown, taxCategory: { id: string, name: string }, stockLevels: Array<{ id: string, stockLocationId: string, stockOnHand: number, stockAllocated: number, stockLocation: { id: string, name: string } }>, options: Array<{ id: string, code: string, name: string, group: { id: string, name: string } }>, facetValues: Array<{ id: string, name: string, code: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, preview: string, name: string } | null, assets: Array<{ id: string, preview: string, name: string }>, product: { id: string, name: string, featuredAsset: { id: string, preview: string } | null }, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } | null };

export type VariantFormDataQueryVariables = Exact<{ [key: string]: never; }>;


export type VariantFormDataQuery = { taxCategories: { items: Array<{ id: string, name: string, isDefault: boolean }> }, stockLocations: { items: Array<{ id: string, name: string }> }, globalSettings: { id: string, trackInventory: boolean, outOfStockThreshold: number } };

export type VariantProductQueryVariables = Exact<{
  id: string;
}>;


export type VariantProductQuery = { product: { id: string, name: string, optionGroups: Array<{ id: string, name: string, options: Array<{ id: string, code: string, name: string }> }> } | null };

export type CreateProductVariantsMutationVariables = Exact<{
  input: Array<CreateProductVariantInput> | CreateProductVariantInput;
}>;


export type CreateProductVariantsMutation = { createProductVariants: Array<{ id: string, name: string, sku: string } | null> };

export type UpdateProductVariantMutationVariables = Exact<{
  input: UpdateProductVariantInput;
}>;


export type UpdateProductVariantMutation = { updateProductVariant: { id: string, updatedAt: string } };

export type DeleteProductVariantMutationVariables = Exact<{
  id: string;
}>;


export type DeleteProductVariantMutation = { deleteProductVariant: { result: DeletionResult, message: string | null } };

export type ZoneListQueryVariables = Exact<{
  options?: ZoneListOptions | null | undefined;
}>;


export type ZoneListQuery = { zones: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type ZoneDetailQueryVariables = Exact<{
  id: string;
}>;


export type ZoneDetailQuery = { zone: { id: string, createdAt: string, updatedAt: string, name: string, customFields: unknown, members: Array<
      | { id: string, code: string, name: string, enabled: boolean }
      | { id: string, code: string, name: string, enabled: boolean }
    > } | null };

export type CreateZoneMutationVariables = Exact<{
  input: CreateZoneInput;
}>;


export type CreateZoneMutation = { createZone: { id: string } };

export type UpdateZoneMutationVariables = Exact<{
  input: UpdateZoneInput;
}>;


export type UpdateZoneMutation = { updateZone: { id: string } };

export type DeleteZoneMutationVariables = Exact<{
  id: string;
}>;


export type DeleteZoneMutation = { deleteZone: { result: DeletionResult, message: string | null } };

export type AddMembersToZoneMutationVariables = Exact<{
  zoneId: string;
  memberIds: Array<string> | string;
}>;


export type AddMembersToZoneMutation = { addMembersToZone: { id: string } };

export type RemoveMembersFromZoneMutationVariables = Exact<{
  zoneId: string;
  memberIds: Array<string> | string;
}>;


export type RemoveMembersFromZoneMutation = { removeMembersFromZone: { id: string } };

export type PickProductsQueryVariables = Exact<{
  options?: ProductListOptions | null | undefined;
}>;


export type PickProductsQuery = { products: { totalItems: number, items: Array<{ id: string, name: string, slug: string, featuredAsset: { id: string, preview: string } | null }> } };

export type PickVariantsQueryVariables = Exact<{
  options?: ProductVariantListOptions | null | undefined;
}>;


export type PickVariantsQuery = { productVariants: { totalItems: number, items: Array<{ id: string, name: string, sku: string, priceWithTax: number, currencyCode: CurrencyCode, featuredAsset: { id: string, preview: string } | null, product: { id: string, featuredAsset: { id: string, preview: string } | null } }> } };

export type PickCustomersQueryVariables = Exact<{
  options?: CustomerListOptions | null | undefined;
}>;


export type PickCustomersQuery = { customers: { totalItems: number, items: Array<{ id: string, firstName: string, lastName: string, emailAddress: string }> } };

export type PickFacetValuesQueryVariables = Exact<{
  options?: FacetValueListOptions | null | undefined;
}>;


export type PickFacetValuesQuery = { facetValues: { totalItems: number, items: Array<{ id: string, name: string, code: string, facet: { id: string, name: string } }> } };

export type PickCustomerGroupsQueryVariables = Exact<{
  options?: CustomerGroupListOptions | null | undefined;
}>;


export type PickCustomerGroupsQuery = { customerGroups: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type PickCollectionsQueryVariables = Exact<{
  options?: CollectionListOptions | null | undefined;
}>;


export type PickCollectionsQuery = { collections: { totalItems: number, items: Array<{ id: string, name: string, slug: string, breadcrumbs: Array<{ id: string, name: string }> }> } };

export type PickAssetsQueryVariables = Exact<{
  options?: AssetListOptions | null | undefined;
}>;


export type PickAssetsQuery = { assets: { totalItems: number, items: Array<{ id: string, name: string, preview: string }> } };

export type PickCountriesQueryVariables = Exact<{
  options?: CountryListOptions | null | undefined;
}>;


export type PickCountriesQuery = { countries: { totalItems: number, items: Array<{ id: string, code: string, name: string, enabled: boolean }> } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const CustomerAddressFragmentDoc = new TypedDocumentString(`
    fragment CustomerAddress on Address {
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
  customFields @customFields(entity: "Address")
}
    `, {"fragmentName":"CustomerAddress"}) as unknown as TypedDocumentString<CustomerAddressFragment, unknown>;
export const OrderListItemFragmentDoc = new TypedDocumentString(`
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
    `, {"fragmentName":"OrderListItem"}) as unknown as TypedDocumentString<OrderListItemFragment, unknown>;
export const AdministratorListDocument = new TypedDocumentString(`
    query AdministratorList($options: AdministratorListOptions) {
  administrators(options: $options) {
    items {
      id
      firstName
      lastName
      emailAddress
      user {
        id
        roles {
          id
          code
        }
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<AdministratorListQuery, AdministratorListQueryVariables>;
export const AdministratorDetailDocument = new TypedDocumentString(`
    query AdministratorDetail($id: ID!) {
  administrator(id: $id) {
    id
    createdAt
    updatedAt
    firstName
    lastName
    emailAddress
    user {
      id
      identifier
      lastLogin
      roles {
        id
        code
        description
        channels {
          id
          code
        }
      }
    }
    customFields @customFields(entity: "Administrator")
  }
}
    `) as unknown as TypedDocumentString<AdministratorDetailQuery, AdministratorDetailQueryVariables>;
export const CreateAdministratorDocument = new TypedDocumentString(`
    mutation CreateAdministrator($input: CreateAdministratorInput!) {
  createAdministrator(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateAdministratorMutation, CreateAdministratorMutationVariables>;
export const UpdateAdministratorDocument = new TypedDocumentString(`
    mutation UpdateAdministrator($input: UpdateAdministratorInput!) {
  updateAdministrator(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateAdministratorMutation, UpdateAdministratorMutationVariables>;
export const DeleteAdministratorDocument = new TypedDocumentString(`
    mutation DeleteAdministrator($id: ID!) {
  deleteAdministrator(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteAdministratorMutation, DeleteAdministratorMutationVariables>;
export const ApiKeyListDocument = new TypedDocumentString(`
    query ApiKeyList($options: ApiKeyListOptions) {
  apiKeys(options: $options) {
    items {
      id
      name
      lookupId
      lastUsedAt
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<ApiKeyListQuery, ApiKeyListQueryVariables>;
export const ApiKeyDetailDocument = new TypedDocumentString(`
    query ApiKeyDetail($id: ID!) {
  apiKey(id: $id) {
    id
    createdAt
    updatedAt
    lookupId
    lastUsedAt
    name
    owner {
      id
      identifier
    }
    user {
      id
      roles {
        id
        code
        description
      }
    }
    translations @customFields(entity: "ApiKey", locale: true) {
      id
      languageCode
      name
    }
    customFields @customFields(entity: "ApiKey")
  }
}
    `) as unknown as TypedDocumentString<ApiKeyDetailQuery, ApiKeyDetailQueryVariables>;
export const ActiveAdministratorRolesDocument = new TypedDocumentString(`
    query ActiveAdministratorRoles {
  activeAdministrator {
    id
    user {
      id
      roles {
        id
        code
        description
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ActiveAdministratorRolesQuery, ActiveAdministratorRolesQueryVariables>;
export const CreateApiKeyDocument = new TypedDocumentString(`
    mutation CreateApiKey($input: CreateApiKeyInput!) {
  createApiKey(input: $input) {
    apiKey
    entityId
  }
}
    `) as unknown as TypedDocumentString<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const UpdateApiKeyDocument = new TypedDocumentString(`
    mutation UpdateApiKey($input: UpdateApiKeyInput!) {
  updateApiKey(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateApiKeyMutation, UpdateApiKeyMutationVariables>;
export const RotateApiKeyDocument = new TypedDocumentString(`
    mutation RotateApiKey($id: ID!) {
  rotateApiKey(id: $id) {
    apiKey
  }
}
    `) as unknown as TypedDocumentString<RotateApiKeyMutation, RotateApiKeyMutationVariables>;
export const DeleteApiKeysDocument = new TypedDocumentString(`
    mutation DeleteApiKeys($ids: [ID!]!) {
  deleteApiKeys(ids: $ids) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteApiKeysMutation, DeleteApiKeysMutationVariables>;
export const AssetListDocument = new TypedDocumentString(`
    query AssetList($options: AssetListOptions) {
  assets(options: $options) {
    items {
      id
      name
      preview
      type
      mimeType
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<AssetListQuery, AssetListQueryVariables>;
export const AssetDetailDocument = new TypedDocumentString(`
    query AssetDetail($id: ID!) {
  asset(id: $id) {
    id
    createdAt
    updatedAt
    name
    type
    fileSize
    mimeType
    width
    height
    source
    preview
    focalPoint {
      x
      y
    }
    languageCode
    tags {
      id
      value
    }
    translations @customFields(entity: "Asset", locale: true) {
      id
      languageCode
      name
    }
    customFields @customFields(entity: "Asset")
  }
}
    `) as unknown as TypedDocumentString<AssetDetailQuery, AssetDetailQueryVariables>;
export const AssetTagsDocument = new TypedDocumentString(`
    query AssetTags($options: TagListOptions) {
  tags(options: $options) {
    items {
      id
      value
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<AssetTagsQuery, AssetTagsQueryVariables>;
export const UpdateAssetDocument = new TypedDocumentString(`
    mutation UpdateAsset($input: UpdateAssetInput!) {
  updateAsset(input: $input) {
    id
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<UpdateAssetMutation, UpdateAssetMutationVariables>;
export const DeleteAssetsDocument = new TypedDocumentString(`
    mutation DeleteAssets($input: DeleteAssetsInput!) {
  deleteAssets(input: $input) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteAssetsMutation, DeleteAssetsMutationVariables>;
export const CreateAssetsDocument = new TypedDocumentString(`
    mutation CreateAssets($input: [CreateAssetInput!]!) {
  createAssets(input: $input) {
    ... on Asset {
      __typename
      id
      name
      preview
      mimeType
    }
    ... on MimeTypeError {
      __typename
      errorCode
      message
      fileName
      mimeType
    }
  }
}
    `) as unknown as TypedDocumentString<CreateAssetsMutation, CreateAssetsMutationVariables>;
export const LoginDocument = new TypedDocumentString(`
    mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {
  login(username: $username, password: $password, rememberMe: $rememberMe) {
    __typename
    ... on CurrentUser {
      id
      identifier
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = new TypedDocumentString(`
    mutation Logout {
  logout {
    success
  }
}
    `) as unknown as TypedDocumentString<LogoutMutation, LogoutMutationVariables>;
export const CurrentUserDocument = new TypedDocumentString(`
    query CurrentUser {
  me {
    id
    identifier
    channels {
      id
      code
      token
      permissions
    }
  }
  activeAdministrator {
    id
    firstName
    lastName
    emailAddress
  }
}
    `) as unknown as TypedDocumentString<CurrentUserQuery, CurrentUserQueryVariables>;
export const ActiveChannelDocument = new TypedDocumentString(`
    query ActiveChannel {
  activeChannel {
    id
    code
    token
    defaultCurrencyCode
    defaultLanguageCode
    pricesIncludeTax
  }
  globalSettings {
    id
    serverConfig {
      moneyStrategyPrecision
    }
  }
}
    `) as unknown as TypedDocumentString<ActiveChannelQuery, ActiveChannelQueryVariables>;
export const ChannelListDocument = new TypedDocumentString(`
    query ChannelList($options: ChannelListOptions) {
  channels(options: $options) {
    items {
      id
      code
      defaultLanguageCode
      defaultCurrencyCode
      pricesIncludeTax
      seller {
        id
        name
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<ChannelListQuery, ChannelListQueryVariables>;
export const ChannelDetailDocument = new TypedDocumentString(`
    query ChannelDetail($id: ID!) {
  channel(id: $id) {
    id
    createdAt
    updatedAt
    code
    token
    pricesIncludeTax
    availableCurrencyCodes
    availableLanguageCodes
    defaultCurrencyCode
    defaultLanguageCode
    trackInventory
    outOfStockThreshold
    defaultShippingZone {
      id
      name
    }
    defaultTaxZone {
      id
      name
    }
    seller {
      id
      name
    }
    customFields @customFields(entity: "Channel")
  }
}
    `) as unknown as TypedDocumentString<ChannelDetailQuery, ChannelDetailQueryVariables>;
export const CreateChannelDocument = new TypedDocumentString(`
    mutation CreateChannel($input: CreateChannelInput!) {
  createChannel(input: $input) {
    __typename
    ... on Channel {
      id
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<CreateChannelMutation, CreateChannelMutationVariables>;
export const UpdateChannelDocument = new TypedDocumentString(`
    mutation UpdateChannel($input: UpdateChannelInput!) {
  updateChannel(input: $input) {
    __typename
    ... on Channel {
      id
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateChannelMutation, UpdateChannelMutationVariables>;
export const DeleteChannelDocument = new TypedDocumentString(`
    mutation DeleteChannel($id: ID!) {
  deleteChannel(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const PickZoneOptionsDocument = new TypedDocumentString(`
    query PickZoneOptions($options: ZoneListOptions) {
  zones(options: $options) {
    items {
      id
      name
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickZoneOptionsQuery, PickZoneOptionsQueryVariables>;
export const CollectionListDocument = new TypedDocumentString(`
    query CollectionList($options: CollectionListOptions) {
  collections(options: $options) {
    items {
      id
      name
      slug
      isPrivate
      parentId
      position
      productVariantCount
      featuredAsset {
        id
        preview
      }
      breadcrumbs {
        id
        name
      }
      children {
        id
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<CollectionListQuery, CollectionListQueryVariables>;
export const CollectionDetailDocument = new TypedDocumentString(`
    query CollectionDetail($id: ID!) {
  collection(id: $id) {
    id
    createdAt
    updatedAt
    languageCode
    name
    slug
    description
    isPrivate
    inheritFilters
    position
    parentId
    breadcrumbs {
      id
      name
    }
    parent {
      id
      name
    }
    children {
      id
      name
    }
    featuredAsset {
      id
      preview
      name
    }
    assets {
      id
      preview
      name
    }
    filters {
      code
      args {
        name
        value
      }
    }
    translations @customFields(entity: "Collection", locale: true) {
      id
      languageCode
      name
      slug
      description
    }
    customFields @customFields(entity: "Collection")
  }
}
    `) as unknown as TypedDocumentString<CollectionDetailQuery, CollectionDetailQueryVariables>;
export const CollectionContentsDocument = new TypedDocumentString(`
    query CollectionContents($id: ID!, $options: ProductVariantListOptions) {
  collection(id: $id) {
    id
    productVariants(options: $options) {
      totalItems
      items {
        id
        name
        sku
        featuredAsset {
          id
          preview
        }
        product {
          id
          featuredAsset {
            id
            preview
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CollectionContentsQuery, CollectionContentsQueryVariables>;
export const CollectionFiltersDocument = new TypedDocumentString(`
    query CollectionFilters {
  collectionFilters {
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
    `) as unknown as TypedDocumentString<CollectionFiltersQuery, CollectionFiltersQueryVariables>;
export const CreateCollectionDocument = new TypedDocumentString(`
    mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const UpdateCollectionDocument = new TypedDocumentString(`
    mutation UpdateCollection($input: UpdateCollectionInput!) {
  updateCollection(input: $input) {
    id
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const MoveCollectionDocument = new TypedDocumentString(`
    mutation MoveCollection($input: MoveCollectionInput!) {
  moveCollection(input: $input) {
    id
    parentId
  }
}
    `) as unknown as TypedDocumentString<MoveCollectionMutation, MoveCollectionMutationVariables>;
export const DeleteCollectionDocument = new TypedDocumentString(`
    mutation DeleteCollection($id: ID!) {
  deleteCollection(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
export const CountryListDocument = new TypedDocumentString(`
    query CountryList($options: CountryListOptions) {
  countries(options: $options) {
    items {
      id
      code
      name
      enabled
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<CountryListQuery, CountryListQueryVariables>;
export const CountryDetailDocument = new TypedDocumentString(`
    query CountryDetail($id: ID!) {
  country(id: $id) {
    id
    createdAt
    updatedAt
    languageCode
    code
    name
    enabled
    translations @customFields(entity: "Country", locale: true) {
      id
      languageCode
      name
    }
    customFields @customFields(entity: "Country")
  }
}
    `) as unknown as TypedDocumentString<CountryDetailQuery, CountryDetailQueryVariables>;
export const CreateCountryDocument = new TypedDocumentString(`
    mutation CreateCountry($input: CreateCountryInput!) {
  createCountry(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateCountryMutation, CreateCountryMutationVariables>;
export const UpdateCountryDocument = new TypedDocumentString(`
    mutation UpdateCountry($input: UpdateCountryInput!) {
  updateCountry(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateCountryMutation, UpdateCountryMutationVariables>;
export const DeleteCountryDocument = new TypedDocumentString(`
    mutation DeleteCountry($id: ID!) {
  deleteCountry(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteCountryMutation, DeleteCountryMutationVariables>;
export const CustomerGroupListDocument = new TypedDocumentString(`
    query CustomerGroupList($options: CustomerGroupListOptions) {
  customerGroups(options: $options) {
    items {
      id
      name
      customers {
        totalItems
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<CustomerGroupListQuery, CustomerGroupListQueryVariables>;
export const CustomerGroupDetailDocument = new TypedDocumentString(`
    query CustomerGroupDetail($id: ID!) {
  customerGroup(id: $id) {
    id
    createdAt
    updatedAt
    name
    customFields @customFields(entity: "CustomerGroup")
  }
}
    `) as unknown as TypedDocumentString<CustomerGroupDetailQuery, CustomerGroupDetailQueryVariables>;
export const CustomerGroupMembersDocument = new TypedDocumentString(`
    query CustomerGroupMembers($id: ID!, $options: CustomerListOptions) {
  customerGroup(id: $id) {
    id
    customers(options: $options) {
      items {
        id
        firstName
        lastName
        emailAddress
      }
      totalItems
    }
  }
}
    `) as unknown as TypedDocumentString<CustomerGroupMembersQuery, CustomerGroupMembersQueryVariables>;
export const CreateCustomerGroupDocument = new TypedDocumentString(`
    mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
  createCustomerGroup(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateCustomerGroupMutation, CreateCustomerGroupMutationVariables>;
export const UpdateCustomerGroupDocument = new TypedDocumentString(`
    mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {
  updateCustomerGroup(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateCustomerGroupMutation, UpdateCustomerGroupMutationVariables>;
export const DeleteCustomerGroupDocument = new TypedDocumentString(`
    mutation DeleteCustomerGroup($id: ID!) {
  deleteCustomerGroup(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteCustomerGroupMutation, DeleteCustomerGroupMutationVariables>;
export const AddCustomersToGroupDocument = new TypedDocumentString(`
    mutation AddCustomersToGroup($customerGroupId: ID!, $customerIds: [ID!]!) {
  addCustomersToGroup(
    customerGroupId: $customerGroupId
    customerIds: $customerIds
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddCustomersToGroupMutation, AddCustomersToGroupMutationVariables>;
export const RemoveCustomersFromGroupDocument = new TypedDocumentString(`
    mutation RemoveCustomersFromGroup($customerGroupId: ID!, $customerIds: [ID!]!) {
  removeCustomersFromGroup(
    customerGroupId: $customerGroupId
    customerIds: $customerIds
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<RemoveCustomersFromGroupMutation, RemoveCustomersFromGroupMutationVariables>;
export const CustomerListDocument = new TypedDocumentString(`
    query CustomerList($options: CustomerListOptions) {
  customers(options: $options) {
    items {
      id
      createdAt
      title
      firstName
      lastName
      emailAddress
      phoneNumber
      user {
        id
        verified
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<CustomerListQuery, CustomerListQueryVariables>;
export const CustomerDetailDocument = new TypedDocumentString(`
    query CustomerDetail($id: ID!) {
  customer(id: $id) {
    id
    createdAt
    updatedAt
    title
    firstName
    lastName
    phoneNumber
    emailAddress
    groups {
      id
      name
    }
    user {
      id
      identifier
      verified
      lastLogin
    }
    addresses {
      ...CustomerAddress
    }
    customFields @customFields(entity: "Customer")
  }
}
    fragment CustomerAddress on Address {
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
  customFields @customFields(entity: "Address")
}`) as unknown as TypedDocumentString<CustomerDetailQuery, CustomerDetailQueryVariables>;
export const CustomerOrdersDocument = new TypedDocumentString(`
    query CustomerOrders($customerId: ID!, $options: OrderListOptions) {
  customer(id: $customerId) {
    id
    orders(options: $options) {
      items {
        ...OrderListItem
      }
      totalItems
    }
  }
}
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
}`) as unknown as TypedDocumentString<CustomerOrdersQuery, CustomerOrdersQueryVariables>;
export const CustomerHistoryDocument = new TypedDocumentString(`
    query CustomerHistory($id: ID!, $options: HistoryEntryListOptions) {
  activeAdministrator {
    id
  }
  customer(id: $id) {
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
    `) as unknown as TypedDocumentString<CustomerHistoryQuery, CustomerHistoryQueryVariables>;
export const CreateCustomerDocument = new TypedDocumentString(`
    mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
  createCustomer(input: $input, password: $password) {
    __typename
    ... on Customer {
      id
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = new TypedDocumentString(`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
  updateCustomer(input: $input) {
    __typename
    ... on Customer {
      id
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = new TypedDocumentString(`
    mutation DeleteCustomer($id: ID!) {
  deleteCustomer(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const VerifyCustomerAccountDocument = new TypedDocumentString(`
    mutation VerifyCustomerAccount($id: ID!, $password: String) {
  verifyCustomerAccount(id: $id, password: $password) {
    __typename
    ... on Customer {
      id
      user {
        id
        verified
      }
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<VerifyCustomerAccountMutation, VerifyCustomerAccountMutationVariables>;
export const CreateCustomerAddressDocument = new TypedDocumentString(`
    mutation CreateCustomerAddress($customerId: ID!, $input: CreateAddressInput!) {
  createCustomerAddress(customerId: $customerId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateCustomerAddressMutation, CreateCustomerAddressMutationVariables>;
export const UpdateCustomerAddressDocument = new TypedDocumentString(`
    mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
  updateCustomerAddress(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateCustomerAddressMutation, UpdateCustomerAddressMutationVariables>;
export const DeleteCustomerAddressDocument = new TypedDocumentString(`
    mutation DeleteCustomerAddress($id: ID!) {
  deleteCustomerAddress(id: $id) {
    success
  }
}
    `) as unknown as TypedDocumentString<DeleteCustomerAddressMutation, DeleteCustomerAddressMutationVariables>;
export const AddCustomerNoteDocument = new TypedDocumentString(`
    mutation AddCustomerNote($input: AddNoteToCustomerInput!) {
  addNoteToCustomer(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddCustomerNoteMutation, AddCustomerNoteMutationVariables>;
export const UpdateCustomerNoteDocument = new TypedDocumentString(`
    mutation UpdateCustomerNote($input: UpdateCustomerNoteInput!) {
  updateCustomerNote(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateCustomerNoteMutation, UpdateCustomerNoteMutationVariables>;
export const DeleteCustomerNoteDocument = new TypedDocumentString(`
    mutation DeleteCustomerNote($id: ID!) {
  deleteCustomerNote(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteCustomerNoteMutation, DeleteCustomerNoteMutationVariables>;
export const DashboardMetricsDocument = new TypedDocumentString(`
    query DashboardMetrics {
  metricSummary(
    input: { interval: Daily, types: [OrderCount, OrderTotal, AverageOrderValue] }
  ) {
    type
    title
    entries {
      label
      value
    }
  }
}
    `) as unknown as TypedDocumentString<DashboardMetricsQuery, DashboardMetricsQueryVariables>;
export const DashboardOrdersDocument = new TypedDocumentString(`
    query DashboardOrders($today: DateTime!, $monthStart: DateTime!) {
  today: orders(
    options: {
      take: 0
      filter: {
        active: { eq: false }
        orderPlacedAt: { after: $today }
        state: { notIn: ["Draft", "Cancelled"] }
      }
    }
  ) {
    totalItems
  }
  month: orders(
    options: {
      take: 0
      filter: {
        active: { eq: false }
        orderPlacedAt: { after: $monthStart }
        state: { notIn: ["Draft", "Cancelled"] }
      }
    }
  ) {
    totalItems
  }
  latest: orders(
    options: {
      take: 6
      sort: { orderPlacedAt: DESC }
      filter: { active: { eq: false }, state: { notIn: ["Draft"] } }
    }
  ) {
    items {
      ...OrderListItem
    }
  }
}
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
}`) as unknown as TypedDocumentString<DashboardOrdersQuery, DashboardOrdersQueryVariables>;
export const DashboardOrderTotalsDocument = new TypedDocumentString(`
    query DashboardOrderTotals($since: DateTime!, $take: Int!) {
  orders(
    options: {
      take: $take
      sort: { orderPlacedAt: DESC }
      filter: {
        active: { eq: false }
        orderPlacedAt: { after: $since }
        state: { notIn: ["Draft", "Cancelled"] }
      }
    }
  ) {
    totalItems
    items {
      id
      orderPlacedAt
      totalWithTax
    }
  }
}
    `) as unknown as TypedDocumentString<DashboardOrderTotalsQuery, DashboardOrderTotalsQueryVariables>;
export const DraftOrderDetailDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<DraftOrderDetailQuery, DraftOrderDetailQueryVariables>;
export const CreateDraftOrderDocument = new TypedDocumentString(`
    mutation CreateDraftOrder {
  createDraftOrder {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateDraftOrderMutation, CreateDraftOrderMutationVariables>;
export const DeleteDraftOrderDocument = new TypedDocumentString(`
    mutation DeleteDraftOrder($orderId: ID!) {
  deleteDraftOrder(orderId: $orderId) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteDraftOrderMutation, DeleteDraftOrderMutationVariables>;
export const AddItemToDraftOrderDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<AddItemToDraftOrderMutation, AddItemToDraftOrderMutationVariables>;
export const AdjustDraftOrderLineDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<AdjustDraftOrderLineMutation, AdjustDraftOrderLineMutationVariables>;
export const RemoveDraftOrderLineDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<RemoveDraftOrderLineMutation, RemoveDraftOrderLineMutationVariables>;
export const SetCustomerForDraftOrderDocument = new TypedDocumentString(`
    mutation SetCustomerForDraftOrder($orderId: ID!, $customerId: ID, $input: CreateCustomerInput) {
  setCustomerForDraftOrder(
    orderId: $orderId
    customerId: $customerId
    input: $input
  ) {
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
    `) as unknown as TypedDocumentString<SetCustomerForDraftOrderMutation, SetCustomerForDraftOrderMutationVariables>;
export const SetDraftOrderShippingAddressDocument = new TypedDocumentString(`
    mutation SetDraftOrderShippingAddress($orderId: ID!, $input: CreateAddressInput!) {
  setDraftOrderShippingAddress(orderId: $orderId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<SetDraftOrderShippingAddressMutation, SetDraftOrderShippingAddressMutationVariables>;
export const SetDraftOrderBillingAddressDocument = new TypedDocumentString(`
    mutation SetDraftOrderBillingAddress($orderId: ID!, $input: CreateAddressInput!) {
  setDraftOrderBillingAddress(orderId: $orderId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<SetDraftOrderBillingAddressMutation, SetDraftOrderBillingAddressMutationVariables>;
export const UnsetDraftOrderShippingAddressDocument = new TypedDocumentString(`
    mutation UnsetDraftOrderShippingAddress($orderId: ID!) {
  unsetDraftOrderShippingAddress(orderId: $orderId) {
    id
  }
}
    `) as unknown as TypedDocumentString<UnsetDraftOrderShippingAddressMutation, UnsetDraftOrderShippingAddressMutationVariables>;
export const UnsetDraftOrderBillingAddressDocument = new TypedDocumentString(`
    mutation UnsetDraftOrderBillingAddress($orderId: ID!) {
  unsetDraftOrderBillingAddress(orderId: $orderId) {
    id
  }
}
    `) as unknown as TypedDocumentString<UnsetDraftOrderBillingAddressMutation, UnsetDraftOrderBillingAddressMutationVariables>;
export const DraftOrderEligibleShippingMethodsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<DraftOrderEligibleShippingMethodsQuery, DraftOrderEligibleShippingMethodsQueryVariables>;
export const SetDraftOrderShippingMethodDocument = new TypedDocumentString(`
    mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {
  setDraftOrderShippingMethod(
    orderId: $orderId
    shippingMethodId: $shippingMethodId
  ) {
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
    `) as unknown as TypedDocumentString<SetDraftOrderShippingMethodMutation, SetDraftOrderShippingMethodMutationVariables>;
export const ApplyCouponCodeToDraftOrderDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<ApplyCouponCodeToDraftOrderMutation, ApplyCouponCodeToDraftOrderMutationVariables>;
export const RemoveCouponCodeFromDraftOrderDocument = new TypedDocumentString(`
    mutation RemoveCouponCodeFromDraftOrder($orderId: ID!, $couponCode: String!) {
  removeCouponCodeFromDraftOrder(orderId: $orderId, couponCode: $couponCode) {
    id
    couponCodes
  }
}
    `) as unknown as TypedDocumentString<RemoveCouponCodeFromDraftOrderMutation, RemoveCouponCodeFromDraftOrderMutationVariables>;
export const SetDraftOrderCustomFieldsDocument = new TypedDocumentString(`
    mutation SetDraftOrderCustomFields($orderId: ID!, $input: UpdateOrderInput!) {
  setDraftOrderCustomFields(orderId: $orderId, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<SetDraftOrderCustomFieldsMutation, SetDraftOrderCustomFieldsMutationVariables>;
export const DraftOrderVariantsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<DraftOrderVariantsQuery, DraftOrderVariantsQueryVariables>;
export const FacetListDocument = new TypedDocumentString(`
    query FacetList($options: FacetListOptions) {
  facets(options: $options) {
    items {
      id
      code
      name
      isPrivate
      valueList(options: { take: 5 }) {
        totalItems
        items {
          id
          name
        }
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<FacetListQuery, FacetListQueryVariables>;
export const FacetDetailDocument = new TypedDocumentString(`
    query FacetDetail($id: ID!) {
  facet(id: $id) {
    id
    createdAt
    updatedAt
    languageCode
    code
    name
    isPrivate
    translations @customFields(entity: "Facet", locale: true) {
      id
      languageCode
      name
    }
    customFields @customFields(entity: "Facet")
    values {
      id
      code
      name
      languageCode
      translations @customFields(entity: "FacetValue", locale: true) {
        id
        languageCode
        name
      }
      customFields @customFields(entity: "FacetValue")
    }
  }
}
    `) as unknown as TypedDocumentString<FacetDetailQuery, FacetDetailQueryVariables>;
export const CreateFacetDocument = new TypedDocumentString(`
    mutation CreateFacet($input: CreateFacetInput!) {
  createFacet(input: $input) {
    id
    values {
      id
      code
      translations {
        id
        languageCode
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CreateFacetMutation, CreateFacetMutationVariables>;
export const UpdateFacetDocument = new TypedDocumentString(`
    mutation UpdateFacet($input: UpdateFacetInput!) {
  updateFacet(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateFacetMutation, UpdateFacetMutationVariables>;
export const DeleteFacetDocument = new TypedDocumentString(`
    mutation DeleteFacet($id: ID!, $force: Boolean) {
  deleteFacet(id: $id, force: $force) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteFacetMutation, DeleteFacetMutationVariables>;
export const CreateFacetValuesDocument = new TypedDocumentString(`
    mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
  createFacetValues(input: $input) {
    id
    code
    translations {
      id
      languageCode
    }
  }
}
    `) as unknown as TypedDocumentString<CreateFacetValuesMutation, CreateFacetValuesMutationVariables>;
export const UpdateFacetValuesDocument = new TypedDocumentString(`
    mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {
  updateFacetValues(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateFacetValuesMutation, UpdateFacetValuesMutationVariables>;
export const DeleteFacetValuesDocument = new TypedDocumentString(`
    mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {
  deleteFacetValues(ids: $ids, force: $force) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteFacetValuesMutation, DeleteFacetValuesMutationVariables>;
export const GlobalSettingsDetailDocument = new TypedDocumentString(`
    query GlobalSettingsDetail {
  globalSettings {
    id
    updatedAt
    availableLanguages
    trackInventory
    outOfStockThreshold
    customFields @customFields(entity: "GlobalSettings")
  }
}
    `) as unknown as TypedDocumentString<GlobalSettingsDetailQuery, GlobalSettingsDetailQueryVariables>;
export const UpdateGlobalSettingsDocument = new TypedDocumentString(`
    mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {
  updateGlobalSettings(input: $input) {
    __typename
    ... on GlobalSettings {
      id
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateGlobalSettingsMutation, UpdateGlobalSettingsMutationVariables>;
export const JobListDocument = new TypedDocumentString(`
    query JobList($options: JobListOptions) {
  jobs(options: $options) {
    items {
      id
      queueName
      state
      progress
      createdAt
      settledAt
      duration
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<JobListQuery, JobListQueryVariables>;
export const JobDetailDocument = new TypedDocumentString(`
    query JobDetail($id: ID!) {
  job(jobId: $id) {
    id
    queueName
    state
    progress
    createdAt
    startedAt
    settledAt
    isSettled
    duration
    data
    result
    error
    retries
    attempts
  }
}
    `) as unknown as TypedDocumentString<JobDetailQuery, JobDetailQueryVariables>;
export const JobQueueListDocument = new TypedDocumentString(`
    query JobQueueList {
  jobQueues {
    name
    running
  }
}
    `) as unknown as TypedDocumentString<JobQueueListQuery, JobQueueListQueryVariables>;
export const CancelJobDocument = new TypedDocumentString(`
    mutation CancelJob($jobId: ID!) {
  cancelJob(jobId: $jobId) {
    id
    state
  }
}
    `) as unknown as TypedDocumentString<CancelJobMutation, CancelJobMutationVariables>;
export const RebuildSearchIndexDocument = new TypedDocumentString(`
    mutation RebuildSearchIndex {
  reindex {
    id
    queueName
    state
  }
}
    `) as unknown as TypedDocumentString<RebuildSearchIndexMutation, RebuildSearchIndexMutationVariables>;
export const ActiveJobCountDocument = new TypedDocumentString(`
    query ActiveJobCount($filter: JobFilterParameter) {
  jobs(options: { take: 1, filter: $filter }) {
    totalItems
  }
}
    `) as unknown as TypedDocumentString<ActiveJobCountQuery, ActiveJobCountQueryVariables>;
export const OptionGroupListDocument = new TypedDocumentString(`
    query OptionGroupList($options: ProductOptionGroupListOptions) {
  productOptionGroups(options: $options) {
    items {
      id
      code
      name
      productCount
      options {
        id
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<OptionGroupListQuery, OptionGroupListQueryVariables>;
export const OptionGroupDetailDocument = new TypedDocumentString(`
    query OptionGroupDetail($id: ID!) {
  productOptionGroup(id: $id) {
    id
    createdAt
    updatedAt
    languageCode
    code
    name
    productCount
    translations @customFields(entity: "ProductOptionGroup", locale: true) {
      id
      languageCode
      name
    }
    customFields @customFields(entity: "ProductOptionGroup")
    options {
      id
      code
      name
      languageCode
      translations @customFields(entity: "ProductOption", locale: true) {
        id
        languageCode
        name
      }
      customFields @customFields(entity: "ProductOption")
    }
  }
}
    `) as unknown as TypedDocumentString<OptionGroupDetailQuery, OptionGroupDetailQueryVariables>;
export const CreateOptionGroupDocument = new TypedDocumentString(`
    mutation CreateOptionGroup($input: CreateProductOptionGroupInput!) {
  createProductOptionGroup(input: $input) {
    id
    options {
      id
      code
      translations {
        id
        languageCode
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CreateOptionGroupMutation, CreateOptionGroupMutationVariables>;
export const UpdateOptionGroupDocument = new TypedDocumentString(`
    mutation UpdateOptionGroup($input: UpdateProductOptionGroupInput!) {
  updateProductOptionGroup(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateOptionGroupMutation, UpdateOptionGroupMutationVariables>;
export const DeleteOptionGroupDocument = new TypedDocumentString(`
    mutation DeleteOptionGroup($id: ID!, $force: Boolean) {
  deleteProductOptionGroup(id: $id, force: $force) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteOptionGroupMutation, DeleteOptionGroupMutationVariables>;
export const CreateProductOptionDocument = new TypedDocumentString(`
    mutation CreateProductOption($input: CreateProductOptionInput!) {
  createProductOption(input: $input) {
    id
    code
    translations {
      id
      languageCode
    }
  }
}
    `) as unknown as TypedDocumentString<CreateProductOptionMutation, CreateProductOptionMutationVariables>;
export const UpdateProductOptionDocument = new TypedDocumentString(`
    mutation UpdateProductOption($input: UpdateProductOptionInput!) {
  updateProductOption(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateProductOptionMutation, UpdateProductOptionMutationVariables>;
export const DeleteProductOptionDocument = new TypedDocumentString(`
    mutation DeleteProductOption($id: ID!) {
  deleteProductOption(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteProductOptionMutation, DeleteProductOptionMutationVariables>;
export const OrderListDocument = new TypedDocumentString(`
    query OrderList($options: OrderListOptions) {
  orders(options: $options) {
    items {
      ...OrderListItem
    }
    totalItems
  }
}
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
}`) as unknown as TypedDocumentString<OrderListQuery, OrderListQueryVariables>;
export const OrderDetailDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<OrderDetailQuery, OrderDetailQueryVariables>;
export const OrderHistoryDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<OrderHistoryQuery, OrderHistoryQueryVariables>;
export const AddOrderNoteDocument = new TypedDocumentString(`
    mutation AddOrderNote($input: AddNoteToOrderInput!) {
  addNoteToOrder(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddOrderNoteMutation, AddOrderNoteMutationVariables>;
export const UpdateOrderNoteDocument = new TypedDocumentString(`
    mutation UpdateOrderNote($input: UpdateOrderNoteInput!) {
  updateOrderNote(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateOrderNoteMutation, UpdateOrderNoteMutationVariables>;
export const DeleteOrderNoteDocument = new TypedDocumentString(`
    mutation DeleteOrderNote($id: ID!) {
  deleteOrderNote(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteOrderNoteMutation, DeleteOrderNoteMutationVariables>;
export const TransitionOrderToStateDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<TransitionOrderToStateMutation, TransitionOrderToStateMutationVariables>;
export const OrderPaymentMethodsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<OrderPaymentMethodsQuery, OrderPaymentMethodsQueryVariables>;
export const AddManualPaymentDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<AddManualPaymentMutation, AddManualPaymentMutationVariables>;
export const SettlePaymentDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<SettlePaymentMutation, SettlePaymentMutationVariables>;
export const CancelPaymentDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<CancelPaymentMutation, CancelPaymentMutationVariables>;
export const TransitionPaymentToStateDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<TransitionPaymentToStateMutation, TransitionPaymentToStateMutationVariables>;
export const FulfillmentHandlersDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<FulfillmentHandlersQuery, FulfillmentHandlersQueryVariables>;
export const FulfillOrderDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<FulfillOrderMutation, FulfillOrderMutationVariables>;
export const TransitionFulfillmentDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<TransitionFulfillmentMutation, TransitionFulfillmentMutationVariables>;
export const CancelOrderDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<CancelOrderMutation, CancelOrderMutationVariables>;
export const RefundOrderDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<RefundOrderMutation, RefundOrderMutationVariables>;
export const SettleRefundDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<SettleRefundMutation, SettleRefundMutationVariables>;
export const ModifyOrderDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<ModifyOrderMutation, ModifyOrderMutationVariables>;
export const SetOrderCustomFieldsDocument = new TypedDocumentString(`
    mutation SetOrderCustomFields($input: UpdateOrderInput!) {
  setOrderCustomFields(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<SetOrderCustomFieldsMutation, SetOrderCustomFieldsMutationVariables>;
export const PaymentMethodListDocument = new TypedDocumentString(`
    query PaymentMethodList($options: PaymentMethodListOptions) {
  paymentMethods(options: $options) {
    items {
      id
      code
      name
      enabled
      handler {
        code
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PaymentMethodListQuery, PaymentMethodListQueryVariables>;
export const PaymentMethodDetailDocument = new TypedDocumentString(`
    query PaymentMethodDetail($id: ID!) {
  paymentMethod(id: $id) {
    id
    createdAt
    updatedAt
    code
    name
    description
    enabled
    checker {
      code
      args {
        name
        value
      }
    }
    handler {
      code
      args {
        name
        value
      }
    }
    translations @customFields(entity: "PaymentMethod", locale: true) {
      id
      languageCode
      name
      description
    }
    customFields @customFields(entity: "PaymentMethod")
  }
}
    `) as unknown as TypedDocumentString<PaymentMethodDetailQuery, PaymentMethodDetailQueryVariables>;
export const PaymentMethodOperationsDocument = new TypedDocumentString(`
    query PaymentMethodOperations {
  paymentMethodHandlers {
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
  paymentMethodEligibilityCheckers {
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
    `) as unknown as TypedDocumentString<PaymentMethodOperationsQuery, PaymentMethodOperationsQueryVariables>;
export const CreatePaymentMethodDocument = new TypedDocumentString(`
    mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
  createPaymentMethod(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreatePaymentMethodMutation, CreatePaymentMethodMutationVariables>;
export const UpdatePaymentMethodDocument = new TypedDocumentString(`
    mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
  updatePaymentMethod(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdatePaymentMethodMutation, UpdatePaymentMethodMutationVariables>;
export const DeletePaymentMethodDocument = new TypedDocumentString(`
    mutation DeletePaymentMethod($id: ID!, $force: Boolean) {
  deletePaymentMethod(id: $id, force: $force) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>;
export const ProductListDocument = new TypedDocumentString(`
    query ProductList($options: ProductListOptions) {
  products(options: $options) {
    items {
      id
      name
      slug
      enabled
      updatedAt
      featuredAsset {
        id
        preview
      }
      variantList(options: { take: 1 }) {
        totalItems
        items {
          id
          priceWithTax
          currencyCode
        }
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<ProductListQuery, ProductListQueryVariables>;
export const ProductDetailDocument = new TypedDocumentString(`
    query ProductDetail($id: ID!) {
  product(id: $id) {
    id
    name
    slug
    description
    enabled
    createdAt
    updatedAt
    languageCode
    featuredAsset {
      id
      preview
      name
    }
    assets {
      id
      preview
      name
    }
    channels {
      id
      code
    }
    optionGroups {
      id
      code
      name
    }
    customFields @customFields(entity: "Product")
    translations @customFields(entity: "Product", locale: true) {
      id
      languageCode
      name
      slug
      description
    }
    facetValues {
      id
      name
      code
      facet {
        id
        name
      }
    }
    variantList(options: { take: 50 }) {
      totalItems
      items {
        id
        name
        sku
        enabled
        price
        priceWithTax
        currencyCode
        featuredAsset {
          id
          preview
        }
        options {
          id
          name
        }
        stockLevels {
          id
          stockOnHand
          stockAllocated
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ProductDetailQuery, ProductDetailQueryVariables>;
export const UpdateProductDocument = new TypedDocumentString(`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    id
    name
    enabled
    updatedAt
    translations {
      id
      languageCode
      name
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateProductMutation, UpdateProductMutationVariables>;
export const CreateProductDocument = new TypedDocumentString(`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
  }
}
    `) as unknown as TypedDocumentString<CreateProductMutation, CreateProductMutationVariables>;
export const DeleteProductDocument = new TypedDocumentString(`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteProductMutation, DeleteProductMutationVariables>;
export const AssignProductsToChannelDocument = new TypedDocumentString(`
    mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {
  assignProductsToChannel(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AssignProductsToChannelMutation, AssignProductsToChannelMutationVariables>;
export const RemoveProductsFromChannelDocument = new TypedDocumentString(`
    mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {
  removeProductsFromChannel(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<RemoveProductsFromChannelMutation, RemoveProductsFromChannelMutationVariables>;
export const ProfileDetailDocument = new TypedDocumentString(`
    query ProfileDetail {
  activeAdministrator {
    id
    createdAt
    updatedAt
    firstName
    lastName
    emailAddress
    user {
      id
      identifier
      lastLogin
      roles {
        id
        code
        description
      }
    }
    customFields @customFields(entity: "Administrator")
  }
}
    `) as unknown as TypedDocumentString<ProfileDetailQuery, ProfileDetailQueryVariables>;
export const UpdateProfileDocument = new TypedDocumentString(`
    mutation UpdateProfile($input: UpdateActiveAdministratorInput!) {
  updateActiveAdministrator(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const PromotionListDocument = new TypedDocumentString(`
    query PromotionList($options: PromotionListOptions) {
  promotions(options: $options) {
    items {
      id
      name
      couponCode
      enabled
      startsAt
      endsAt
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PromotionListQuery, PromotionListQueryVariables>;
export const PromotionDetailDocument = new TypedDocumentString(`
    query PromotionDetail($id: ID!) {
  promotion(id: $id) {
    id
    createdAt
    updatedAt
    name
    description
    enabled
    couponCode
    perCustomerUsageLimit
    usageLimit
    startsAt
    endsAt
    conditions {
      code
      args {
        name
        value
      }
    }
    actions {
      code
      args {
        name
        value
      }
    }
    translations @customFields(entity: "Promotion", locale: true) {
      id
      languageCode
      name
      description
    }
    customFields @customFields(entity: "Promotion")
  }
}
    `) as unknown as TypedDocumentString<PromotionDetailQuery, PromotionDetailQueryVariables>;
export const PromotionOperationsDocument = new TypedDocumentString(`
    query PromotionOperations {
  promotionConditions {
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
  promotionActions {
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
    `) as unknown as TypedDocumentString<PromotionOperationsQuery, PromotionOperationsQueryVariables>;
export const CreatePromotionDocument = new TypedDocumentString(`
    mutation CreatePromotion($input: CreatePromotionInput!) {
  createPromotion(input: $input) {
    ... on Promotion {
      id
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<CreatePromotionMutation, CreatePromotionMutationVariables>;
export const UpdatePromotionDocument = new TypedDocumentString(`
    mutation UpdatePromotion($input: UpdatePromotionInput!) {
  updatePromotion(input: $input) {
    ... on Promotion {
      id
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
    `) as unknown as TypedDocumentString<UpdatePromotionMutation, UpdatePromotionMutationVariables>;
export const DeletePromotionDocument = new TypedDocumentString(`
    mutation DeletePromotion($id: ID!) {
  deletePromotion(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeletePromotionMutation, DeletePromotionMutationVariables>;
export const RoleListDocument = new TypedDocumentString(`
    query RoleList($options: RoleListOptions) {
  roles(options: $options) {
    items {
      id
      code
      description
      permissions
      channels {
        id
        code
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<RoleListQuery, RoleListQueryVariables>;
export const RoleDetailDocument = new TypedDocumentString(`
    query RoleDetail($id: ID!) {
  role(id: $id) {
    id
    createdAt
    updatedAt
    code
    description
    permissions
    channels {
      id
      code
    }
    customFields @customFields(entity: "Role")
  }
}
    `) as unknown as TypedDocumentString<RoleDetailQuery, RoleDetailQueryVariables>;
export const CreateRoleDocument = new TypedDocumentString(`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = new TypedDocumentString(`
    mutation UpdateRole($input: UpdateRoleInput!) {
  updateRole(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = new TypedDocumentString(`
    mutation DeleteRole($id: ID!) {
  deleteRole(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const PickRoleOptionsDocument = new TypedDocumentString(`
    query PickRoleOptions($options: RoleListOptions) {
  roles(options: $options) {
    items {
      id
      code
      description
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickRoleOptionsQuery, PickRoleOptionsQueryVariables>;
export const PickChannelOptionsDocument = new TypedDocumentString(`
    query PickChannelOptions($options: ChannelListOptions) {
  channels(options: $options) {
    items {
      id
      code
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickChannelOptionsQuery, PickChannelOptionsQueryVariables>;
export const ScheduledTasksDocument = new TypedDocumentString(`
    query ScheduledTasks {
  scheduledTasks {
    id
    description
    schedule
    scheduleDescription
    timezone
    lastExecutedAt
    nextExecutionAt
    isRunning
    lastResult
    enabled
  }
}
    `) as unknown as TypedDocumentString<ScheduledTasksQuery, ScheduledTasksQueryVariables>;
export const UpdateScheduledTaskDocument = new TypedDocumentString(`
    mutation UpdateScheduledTask($input: UpdateScheduledTaskInput!) {
  updateScheduledTask(input: $input) {
    id
    enabled
  }
}
    `) as unknown as TypedDocumentString<UpdateScheduledTaskMutation, UpdateScheduledTaskMutationVariables>;
export const RunScheduledTaskDocument = new TypedDocumentString(`
    mutation RunScheduledTask($id: String!) {
  runScheduledTask(id: $id) {
    success
  }
}
    `) as unknown as TypedDocumentString<RunScheduledTaskMutation, RunScheduledTaskMutationVariables>;
export const SellerListDocument = new TypedDocumentString(`
    query SellerList($options: SellerListOptions) {
  sellers(options: $options) {
    items {
      id
      name
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<SellerListQuery, SellerListQueryVariables>;
export const SellerDetailDocument = new TypedDocumentString(`
    query SellerDetail($id: ID!) {
  seller(id: $id) {
    id
    createdAt
    updatedAt
    name
    customFields @customFields(entity: "Seller")
  }
}
    `) as unknown as TypedDocumentString<SellerDetailQuery, SellerDetailQueryVariables>;
export const CreateSellerDocument = new TypedDocumentString(`
    mutation CreateSeller($input: CreateSellerInput!) {
  createSeller(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateSellerMutation, CreateSellerMutationVariables>;
export const UpdateSellerDocument = new TypedDocumentString(`
    mutation UpdateSeller($input: UpdateSellerInput!) {
  updateSeller(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateSellerMutation, UpdateSellerMutationVariables>;
export const DeleteSellerDocument = new TypedDocumentString(`
    mutation DeleteSeller($id: ID!) {
  deleteSeller(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteSellerMutation, DeleteSellerMutationVariables>;
export const PickSellerOptionsDocument = new TypedDocumentString(`
    query PickSellerOptions($options: SellerListOptions) {
  sellers(options: $options) {
    items {
      id
      name
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickSellerOptionsQuery, PickSellerOptionsQueryVariables>;
export const ServerConfigDocument = new TypedDocumentString(`
    query ServerConfig {
  globalSettings {
    id
    availableLanguages
    serverConfig {
      moneyStrategyPrecision
      permittedAssetTypes
      permissions {
        name
        description
        assignable
      }
      orderProcess {
        name
        to
      }
      entityCustomFields {
        entityName
        customFields {
          __typename
          ... on CustomField {
            name
            type
            list
            readonly
            internal
            nullable
            requiresPermission
            ui
            label {
              languageCode
              value
            }
            description {
              languageCode
              value
            }
          }
          ... on StringCustomFieldConfig {
            pattern
            length
            options {
              value
              label {
                languageCode
                value
              }
            }
          }
          ... on LocaleStringCustomFieldConfig {
            pattern
            length
          }
          ... on IntCustomFieldConfig {
            intMin: min
            intMax: max
            intStep: step
          }
          ... on FloatCustomFieldConfig {
            floatMin: min
            floatMax: max
            floatStep: step
          }
          ... on DateTimeCustomFieldConfig {
            datetimeMin: min
            datetimeMax: max
          }
          ... on RelationCustomFieldConfig {
            entity
            scalarFields
          }
          ... on StructCustomFieldConfig {
            fields {
              ... on StructField {
                name
                type
                list
                label {
                  languageCode
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ServerConfigQuery, ServerConfigQueryVariables>;
export const ShippingMethodListDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<ShippingMethodListQuery, ShippingMethodListQueryVariables>;
export const ShippingMethodDetailDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<ShippingMethodDetailQuery, ShippingMethodDetailQueryVariables>;
export const ShippingMethodOperationsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<ShippingMethodOperationsQuery, ShippingMethodOperationsQueryVariables>;
export const CreateShippingMethodDocument = new TypedDocumentString(`
    mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
  createShippingMethod(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateShippingMethodMutation, CreateShippingMethodMutationVariables>;
export const UpdateShippingMethodDocument = new TypedDocumentString(`
    mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
  updateShippingMethod(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateShippingMethodMutation, UpdateShippingMethodMutationVariables>;
export const DeleteShippingMethodDocument = new TypedDocumentString(`
    mutation DeleteShippingMethod($id: ID!) {
  deleteShippingMethod(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteShippingMethodMutation, DeleteShippingMethodMutationVariables>;
export const TestShippingMethodDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<TestShippingMethodQuery, TestShippingMethodQueryVariables>;
export const TestEligibleShippingMethodsDocument = new TypedDocumentString(`
    query TestEligibleShippingMethods($input: TestEligibleShippingMethodsInput!) {
  testEligibleShippingMethods(input: $input) {
    id
    code
    name
    price
    priceWithTax
  }
}
    `) as unknown as TypedDocumentString<TestEligibleShippingMethodsQuery, TestEligibleShippingMethodsQueryVariables>;
export const StockLocationListDocument = new TypedDocumentString(`
    query StockLocationList($options: StockLocationListOptions) {
  stockLocations(options: $options) {
    items {
      id
      name
      description
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<StockLocationListQuery, StockLocationListQueryVariables>;
export const StockLocationDetailDocument = new TypedDocumentString(`
    query StockLocationDetail($id: ID!) {
  stockLocation(id: $id) {
    id
    createdAt
    updatedAt
    name
    description
    customFields @customFields(entity: "StockLocation")
  }
}
    `) as unknown as TypedDocumentString<StockLocationDetailQuery, StockLocationDetailQueryVariables>;
export const CreateStockLocationDocument = new TypedDocumentString(`
    mutation CreateStockLocation($input: CreateStockLocationInput!) {
  createStockLocation(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateStockLocationMutation, CreateStockLocationMutationVariables>;
export const UpdateStockLocationDocument = new TypedDocumentString(`
    mutation UpdateStockLocation($input: UpdateStockLocationInput!) {
  updateStockLocation(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateStockLocationMutation, UpdateStockLocationMutationVariables>;
export const DeleteStockLocationDocument = new TypedDocumentString(`
    mutation DeleteStockLocation($input: DeleteStockLocationInput!) {
  deleteStockLocation(input: $input) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteStockLocationMutation, DeleteStockLocationMutationVariables>;
export const PickStockLocationOptionsDocument = new TypedDocumentString(`
    query PickStockLocationOptions($options: StockLocationListOptions) {
  stockLocations(options: $options) {
    items {
      id
      name
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickStockLocationOptionsQuery, PickStockLocationOptionsQueryVariables>;
export const TaxCategoryListDocument = new TypedDocumentString(`
    query TaxCategoryList($options: TaxCategoryListOptions) {
  taxCategories(options: $options) {
    items {
      id
      name
      isDefault
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<TaxCategoryListQuery, TaxCategoryListQueryVariables>;
export const TaxCategoryDetailDocument = new TypedDocumentString(`
    query TaxCategoryDetail($id: ID!) {
  taxCategory(id: $id) {
    id
    createdAt
    updatedAt
    name
    isDefault
    customFields @customFields(entity: "TaxCategory")
  }
}
    `) as unknown as TypedDocumentString<TaxCategoryDetailQuery, TaxCategoryDetailQueryVariables>;
export const CreateTaxCategoryDocument = new TypedDocumentString(`
    mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
  createTaxCategory(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateTaxCategoryMutation, CreateTaxCategoryMutationVariables>;
export const UpdateTaxCategoryDocument = new TypedDocumentString(`
    mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {
  updateTaxCategory(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateTaxCategoryMutation, UpdateTaxCategoryMutationVariables>;
export const DeleteTaxCategoryDocument = new TypedDocumentString(`
    mutation DeleteTaxCategory($id: ID!) {
  deleteTaxCategory(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteTaxCategoryMutation, DeleteTaxCategoryMutationVariables>;
export const TaxRateListDocument = new TypedDocumentString(`
    query TaxRateList($options: TaxRateListOptions) {
  taxRates(options: $options) {
    items {
      id
      name
      enabled
      value
      category {
        id
        name
      }
      zone {
        id
        name
      }
      customerGroup {
        id
        name
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<TaxRateListQuery, TaxRateListQueryVariables>;
export const TaxRateDetailDocument = new TypedDocumentString(`
    query TaxRateDetail($id: ID!) {
  taxRate(id: $id) {
    id
    createdAt
    updatedAt
    name
    enabled
    value
    category {
      id
      name
    }
    zone {
      id
      name
    }
    customerGroup {
      id
      name
    }
    customFields @customFields(entity: "TaxRate")
  }
}
    `) as unknown as TypedDocumentString<TaxRateDetailQuery, TaxRateDetailQueryVariables>;
export const TaxRateOptionsDocument = new TypedDocumentString(`
    query TaxRateOptions {
  taxCategories(options: { take: 100, sort: { name: ASC } }) {
    items {
      id
      name
    }
  }
  zones(options: { take: 100, sort: { name: ASC } }) {
    items {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<TaxRateOptionsQuery, TaxRateOptionsQueryVariables>;
export const CreateTaxRateDocument = new TypedDocumentString(`
    mutation CreateTaxRate($input: CreateTaxRateInput!) {
  createTaxRate(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateTaxRateMutation, CreateTaxRateMutationVariables>;
export const UpdateTaxRateDocument = new TypedDocumentString(`
    mutation UpdateTaxRate($input: UpdateTaxRateInput!) {
  updateTaxRate(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateTaxRateMutation, UpdateTaxRateMutationVariables>;
export const DeleteTaxRateDocument = new TypedDocumentString(`
    mutation DeleteTaxRate($id: ID!) {
  deleteTaxRate(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteTaxRateMutation, DeleteTaxRateMutationVariables>;
export const VariantListDocument = new TypedDocumentString(`
    query VariantList($options: ProductVariantListOptions, $productId: ID) {
  productVariants(options: $options, productId: $productId) {
    items {
      id
      name
      sku
      enabled
      priceWithTax
      currencyCode
      featuredAsset {
        id
        preview
      }
      product {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
      stockLevels {
        id
        stockOnHand
        stockAllocated
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<VariantListQuery, VariantListQueryVariables>;
export const VariantDetailDocument = new TypedDocumentString(`
    query VariantDetail($id: ID!) {
  productVariant(id: $id) {
    id
    createdAt
    updatedAt
    languageCode
    name
    sku
    enabled
    price
    priceWithTax
    currencyCode
    trackInventory
    outOfStockThreshold
    useGlobalOutOfStockThreshold
    taxCategory {
      id
      name
    }
    stockLevels {
      id
      stockLocationId
      stockOnHand
      stockAllocated
      stockLocation {
        id
        name
      }
    }
    options {
      id
      code
      name
      group {
        id
        name
      }
    }
    facetValues {
      id
      name
      code
      facet {
        id
        name
      }
    }
    featuredAsset {
      id
      preview
      name
    }
    assets {
      id
      preview
      name
    }
    product {
      id
      name
      featuredAsset {
        id
        preview
      }
    }
    translations @customFields(entity: "ProductVariant", locale: true) {
      id
      languageCode
      name
    }
    customFields @customFields(entity: "ProductVariant")
  }
}
    `) as unknown as TypedDocumentString<VariantDetailQuery, VariantDetailQueryVariables>;
export const VariantFormDataDocument = new TypedDocumentString(`
    query VariantFormData {
  taxCategories(options: { take: 100 }) {
    items {
      id
      name
      isDefault
    }
  }
  stockLocations(options: { take: 100 }) {
    items {
      id
      name
    }
  }
  globalSettings {
    id
    trackInventory
    outOfStockThreshold
  }
}
    `) as unknown as TypedDocumentString<VariantFormDataQuery, VariantFormDataQueryVariables>;
export const VariantProductDocument = new TypedDocumentString(`
    query VariantProduct($id: ID!) {
  product(id: $id) {
    id
    name
    optionGroups {
      id
      name
      options {
        id
        code
        name
      }
    }
  }
}
    `) as unknown as TypedDocumentString<VariantProductQuery, VariantProductQueryVariables>;
export const CreateProductVariantsDocument = new TypedDocumentString(`
    mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
  createProductVariants(input: $input) {
    id
    name
    sku
  }
}
    `) as unknown as TypedDocumentString<CreateProductVariantsMutation, CreateProductVariantsMutationVariables>;
export const UpdateProductVariantDocument = new TypedDocumentString(`
    mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
  updateProductVariant(input: $input) {
    id
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>;
export const DeleteProductVariantDocument = new TypedDocumentString(`
    mutation DeleteProductVariant($id: ID!) {
  deleteProductVariant(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteProductVariantMutation, DeleteProductVariantMutationVariables>;
export const ZoneListDocument = new TypedDocumentString(`
    query ZoneList($options: ZoneListOptions) {
  zones(options: $options) {
    items {
      id
      name
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<ZoneListQuery, ZoneListQueryVariables>;
export const ZoneDetailDocument = new TypedDocumentString(`
    query ZoneDetail($id: ID!) {
  zone(id: $id) {
    id
    createdAt
    updatedAt
    name
    members {
      id
      code
      name
      enabled
    }
    customFields @customFields(entity: "Zone")
  }
}
    `) as unknown as TypedDocumentString<ZoneDetailQuery, ZoneDetailQueryVariables>;
export const CreateZoneDocument = new TypedDocumentString(`
    mutation CreateZone($input: CreateZoneInput!) {
  createZone(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateZoneMutation, CreateZoneMutationVariables>;
export const UpdateZoneDocument = new TypedDocumentString(`
    mutation UpdateZone($input: UpdateZoneInput!) {
  updateZone(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateZoneMutation, UpdateZoneMutationVariables>;
export const DeleteZoneDocument = new TypedDocumentString(`
    mutation DeleteZone($id: ID!) {
  deleteZone(id: $id) {
    result
    message
  }
}
    `) as unknown as TypedDocumentString<DeleteZoneMutation, DeleteZoneMutationVariables>;
export const AddMembersToZoneDocument = new TypedDocumentString(`
    mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {
  addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddMembersToZoneMutation, AddMembersToZoneMutationVariables>;
export const RemoveMembersFromZoneDocument = new TypedDocumentString(`
    mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {
  removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {
    id
  }
}
    `) as unknown as TypedDocumentString<RemoveMembersFromZoneMutation, RemoveMembersFromZoneMutationVariables>;
export const PickProductsDocument = new TypedDocumentString(`
    query PickProducts($options: ProductListOptions) {
  products(options: $options) {
    items {
      id
      name
      slug
      featuredAsset {
        id
        preview
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickProductsQuery, PickProductsQueryVariables>;
export const PickVariantsDocument = new TypedDocumentString(`
    query PickVariants($options: ProductVariantListOptions) {
  productVariants(options: $options) {
    items {
      id
      name
      sku
      priceWithTax
      currencyCode
      featuredAsset {
        id
        preview
      }
      product {
        id
        featuredAsset {
          id
          preview
        }
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickVariantsQuery, PickVariantsQueryVariables>;
export const PickCustomersDocument = new TypedDocumentString(`
    query PickCustomers($options: CustomerListOptions) {
  customers(options: $options) {
    items {
      id
      firstName
      lastName
      emailAddress
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickCustomersQuery, PickCustomersQueryVariables>;
export const PickFacetValuesDocument = new TypedDocumentString(`
    query PickFacetValues($options: FacetValueListOptions) {
  facetValues(options: $options) {
    items {
      id
      name
      code
      facet {
        id
        name
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickFacetValuesQuery, PickFacetValuesQueryVariables>;
export const PickCustomerGroupsDocument = new TypedDocumentString(`
    query PickCustomerGroups($options: CustomerGroupListOptions) {
  customerGroups(options: $options) {
    items {
      id
      name
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickCustomerGroupsQuery, PickCustomerGroupsQueryVariables>;
export const PickCollectionsDocument = new TypedDocumentString(`
    query PickCollections($options: CollectionListOptions) {
  collections(options: $options) {
    items {
      id
      name
      slug
      breadcrumbs {
        id
        name
      }
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickCollectionsQuery, PickCollectionsQueryVariables>;
export const PickAssetsDocument = new TypedDocumentString(`
    query PickAssets($options: AssetListOptions) {
  assets(options: $options) {
    items {
      id
      name
      preview
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickAssetsQuery, PickAssetsQueryVariables>;
export const PickCountriesDocument = new TypedDocumentString(`
    query PickCountries($options: CountryListOptions) {
  countries(options: $options) {
    items {
      id
      code
      name
      enabled
    }
    totalItems
  }
}
    `) as unknown as TypedDocumentString<PickCountriesQuery, PickCountriesQueryVariables>;