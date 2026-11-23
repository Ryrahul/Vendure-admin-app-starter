/** Address form rows (customer addresses and draft-order addresses), with a searchable country picker. */
import { openPicker } from '@/api/picker';
import { countryPicker } from '@/api/pickers/sales';
import { LinkRow, TextRow } from '@/components/form/fields';

export interface AddressValue {
  fullName: string;
  company: string;
  streetLine1: string;
  streetLine2: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string;
}

export const emptyAddress: AddressValue = {
  fullName: '',
  company: '',
  streetLine1: '',
  streetLine2: '',
  city: '',
  province: '',
  postalCode: '',
  countryCode: '',
  countryName: '',
  phoneNumber: '',
};

type Source = Partial<Record<Exclude<keyof AddressValue, 'countryName' | 'countryCode'>, string | null>> & {
  country?: { code: string; name: string } | string | null;
  countryCode?: string | null;
};

/** From an `Address` (country object) or an `OrderAddress` (country name + countryCode). */
export function toAddressValue(a: Source | null | undefined): AddressValue {
  if (!a) return { ...emptyAddress };
  const country = typeof a.country === 'object' && a.country ? a.country : null;
  return {
    fullName: a.fullName ?? '',
    company: a.company ?? '',
    streetLine1: a.streetLine1 ?? '',
    streetLine2: a.streetLine2 ?? '',
    city: a.city ?? '',
    province: a.province ?? '',
    postalCode: a.postalCode ?? '',
    phoneNumber: a.phoneNumber ?? '',
    countryCode: country?.code ?? a.countryCode ?? '',
    countryName: country?.name ?? (typeof a.country === 'string' ? a.country : ''),
  };
}

/** `CreateAddressInput` fields (without defaults / custom fields). */
export function toAddressInput(v: AddressValue) {
  return {
    fullName: v.fullName.trim(),
    company: v.company.trim(),
    streetLine1: v.streetLine1.trim(),
    streetLine2: v.streetLine2.trim(),
    city: v.city.trim(),
    province: v.province.trim(),
    postalCode: v.postalCode.trim(),
    countryCode: v.countryCode,
    phoneNumber: v.phoneNumber.trim(),
  };
}

export function addressProblem(v: AddressValue): string | null {
  if (!v.streetLine1.trim()) return 'Street line 1 is required.';
  if (!v.countryCode) return 'Choose a country.';
  return null;
}

/**
 * Address rows as a keyed array, so a surrounding <Section> draws separators between them:
 * `<Section>{addressRows({ value, onChange })}</Section>`.
 */
export function addressRows({
  value,
  onChange,
  readOnly,
}: {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  readOnly?: boolean;
}) {
  const set = (key: keyof AddressValue) => (text: string) => onChange({ ...value, [key]: text });
  return [
      <TextRow key="fullName" label="Full name" value={value.fullName} onChangeText={set('fullName')} readOnly={readOnly} textContentType="name" />,
      <TextRow key="company" label="Company" value={value.company} onChangeText={set('company')} readOnly={readOnly} />,
      <TextRow key="streetLine1" label="Street line 1" value={value.streetLine1} onChangeText={set('streetLine1')} readOnly={readOnly} textContentType="streetAddressLine1" />,
      <TextRow key="streetLine2" label="Street line 2" value={value.streetLine2} onChangeText={set('streetLine2')} readOnly={readOnly} textContentType="streetAddressLine2" />,
      <TextRow key="city" label="City" value={value.city} onChangeText={set('city')} readOnly={readOnly} textContentType="addressCity" />,
      <TextRow key="province" label="Province / state" value={value.province} onChangeText={set('province')} readOnly={readOnly} textContentType="addressState" />,
      <TextRow key="postalCode" label="Postal code" value={value.postalCode} onChangeText={set('postalCode')} readOnly={readOnly} textContentType="postalCode" />,
      <LinkRow
        key="country"
        label="Country"
        value={value.countryName || value.countryCode}
        disabled={readOnly}
        onPress={async () => {
          const picked = await openPicker({ title: 'Country', source: countryPicker });
          const c = picked?.[0];
          if (c) onChange({ ...value, countryCode: c.code ?? '', countryName: c.title });
        }}
      />,
      <TextRow key="phoneNumber" label="Phone" value={value.phoneNumber} onChangeText={set('phoneNumber')} readOnly={readOnly} keyboardType="phone-pad" textContentType="telephoneNumber" />
  ];
}
