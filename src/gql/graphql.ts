/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: boolean | null | undefined;
  isNull?: boolean | null | undefined;
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

/** Operators for filtering on an ID field */
export type IdOperators = {
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
};

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

export type MetricType =
  | 'AverageOrderValue'
  | 'OrderCount'
  | 'OrderTotal';

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

export type SortOrder =
  | 'ASC'
  | 'DESC';

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

export type UpdateProductInput = {
  assetIds?: Array<string> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string> | null | undefined;
  featuredAssetId?: string | null | undefined;
  id: string;
  translations?: Array<ProductTranslationInput> | null | undefined;
};

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

export type DashboardMetricsQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardMetricsQuery = { metricSummary: Array<{ type: MetricType, title: string, entries: Array<{ label: string, value: number }> }> };

export type DashboardOrdersQueryVariables = Exact<{
  today: string;
  monthStart: string;
}>;


export type DashboardOrdersQuery = { today: { totalItems: number }, month: { totalItems: number }, latest: { items: Array<{ id: string, code: string, state: string, active: boolean, orderPlacedAt: string | null, updatedAt: string, totalWithTax: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string, emailAddress: string } | null }> } };

export type OrderListItemFragment = { id: string, code: string, state: string, active: boolean, orderPlacedAt: string | null, updatedAt: string, totalWithTax: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string, emailAddress: string } | null };

export type OrderListQueryVariables = Exact<{
  options?: OrderListOptions | null | undefined;
}>;


export type OrderListQuery = { orders: { totalItems: number, items: Array<{ id: string, code: string, state: string, active: boolean, orderPlacedAt: string | null, updatedAt: string, totalWithTax: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string, emailAddress: string } | null }> } };

export type OrderDetailQueryVariables = Exact<{
  id: string;
}>;


export type OrderDetailQuery = { order: { id: string, code: string, state: string, active: boolean, type: OrderType, createdAt: string, updatedAt: string, orderPlacedAt: string | null, currencyCode: CurrencyCode, totalQuantity: number, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, nextStates: Array<string>, customer: { id: string, firstName: string, lastName: string, emailAddress: string, phoneNumber: string | null } | null, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, billingAddress: { fullName: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null } | null, lines: Array<{ id: string, quantity: number, unitPriceWithTax: number, linePriceWithTax: number, featuredAsset: { id: string, preview: string } | null, productVariant: { id: string, name: string, sku: string } }>, discounts: Array<{ description: string, amountWithTax: number }>, shippingLines: Array<{ id: string, priceWithTax: number, shippingMethod: { id: string, name: string } }>, payments: Array<{ id: string, method: string, amount: number, state: string, transactionId: string | null, createdAt: string }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, createdAt: string }> | null } | null };

export type ProductListQueryVariables = Exact<{
  options?: ProductListOptions | null | undefined;
}>;


export type ProductListQuery = { products: { totalItems: number, items: Array<{ id: string, name: string, slug: string, enabled: boolean, updatedAt: string, featuredAsset: { id: string, preview: string } | null, variantList: { totalItems: number, items: Array<{ id: string, priceWithTax: number, currencyCode: CurrencyCode }> } }> } };

export type ProductDetailQueryVariables = Exact<{
  id: string;
}>;


export type ProductDetailQuery = { product: { id: string, name: string, slug: string, description: string, enabled: boolean, createdAt: string, updatedAt: string, languageCode: LanguageCode, featuredAsset: { id: string, preview: string } | null, assets: Array<{ id: string, preview: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facetValues: Array<{ id: string, name: string, facet: { id: string, name: string } }>, variantList: { totalItems: number, items: Array<{ id: string, name: string, sku: string, enabled: boolean, price: number, priceWithTax: number, currencyCode: CurrencyCode, stockLevels: Array<{ id: string, stockOnHand: number, stockAllocated: number }> }> } } | null };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { updateProduct: { id: string, name: string, enabled: boolean, updatedAt: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } };

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
    `) as unknown as TypedDocumentString<OrderDetailQuery, OrderDetailQueryVariables>;
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
    }
    assets {
      id
      preview
    }
    translations {
      id
      languageCode
      name
    }
    facetValues {
      id
      name
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