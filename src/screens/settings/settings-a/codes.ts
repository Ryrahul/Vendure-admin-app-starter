/**
 * Static option lists for the schema's `CurrencyCode` and `LanguageCode` enums (codegen emits
 * them as types only). Generated from graphql/admin-schema.graphql.
 */
import type { PickerItem } from '@/api/picker';
import type { CurrencyCode, LanguageCode } from '@/gql/graphql';

export const CURRENCY_CODES: readonly CurrencyCode[] = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL'];

export const LANGUAGE_CODES: readonly LanguageCode[] = ['af', 'ak', 'sq', 'am', 'ar', 'hy', 'as', 'az', 'bm', 'bn', 'eu', 'be', 'bs', 'br', 'bg', 'my', 'ca', 'ce', 'zh', 'zh_Hans', 'zh_Hant', 'cu', 'kw', 'co', 'hr', 'cs', 'da', 'nl', 'nl_BE', 'dz', 'en', 'en_AU', 'en_CA', 'en_GB', 'en_US', 'eo', 'et', 'ee', 'fo', 'fi', 'fr', 'fr_CA', 'fr_CH', 'ff', 'gl', 'lg', 'ka', 'de', 'de_AT', 'de_CH', 'el', 'gu', 'ht', 'ha', 'he', 'hi', 'hu', 'is', 'ig', 'id', 'ia', 'ga', 'it', 'ja', 'jv', 'kl', 'kn', 'ks', 'kk', 'km', 'ki', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'ln', 'lt', 'lu', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'gv', 'mi', 'mr', 'mn', 'ne', 'nd', 'se', 'nb', 'nn', 'ny', 'or', 'om', 'os', 'ps', 'fa', 'fa_AF', 'pl', 'pt', 'pt_BR', 'pt_PT', 'pa', 'qu', 'ro', 'ro_MD', 'rm', 'rn', 'ru', 'sm', 'sg', 'sa', 'gd', 'sr', 'sn', 'ii', 'sd', 'si', 'sk', 'sl', 'so', 'st', 'es', 'es_ES', 'es_MX', 'su', 'sw', 'sw_CD', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'bo', 'ti', 'to', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'vo', 'cy', 'fy', 'wo', 'xh', 'yi', 'yo', 'zu'];

const formatters = new Map<string, Intl.DisplayNames | null>();
const names = new Map<string, string>();

function displayName(type: 'language' | 'currency', code: string): string {
  const key = `${type}:${code}`;
  const hit = names.get(key);
  if (hit) return hit;
  let name = code;
  try {
    // Hermes may lack Intl.DisplayNames; fall back to the bare code.
    if (!formatters.has(type)) {
      const DN = (Intl as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames;
      formatters.set(type, DN ? new DN(['en'], { type }) : null);
    }
    const out = formatters.get(type)?.of(type === 'language' ? code.replace('_', '-') : code);
    if (out) name = out;
  } catch {
    // Unknown code for this runtime: keep the code.
  }
  names.set(key, name);
  return name;
}

export const languageName = (code: string) => displayName('language', code);
export const currencyName = (code: string) => displayName('currency', code);

export const languageOptions = (codes: readonly string[] = LANGUAGE_CODES): PickerItem[] =>
  codes.map((c) => ({ id: c, title: languageName(c), code: c }));

let allCurrencies: PickerItem[] | undefined;
export const currencyOptions = (): PickerItem[] =>
  (allCurrencies ??= CURRENCY_CODES.map((c) => ({ id: c, title: currencyName(c), code: c })));

/** "English, German +3" style summary for multi-value rows. */
export function summarize(labels: string[], max = 2): string {
  if (!labels.length) return '';
  return labels.length <= max ? labels.join(', ') : `${labels.slice(0, max).join(', ')} +${labels.length - max}`;
}
