/** Create / edit / delete one customer address (id === 'new' creates). */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateCustomerAddressDocument,
  CustomerDetailDocument,
  CustomerHistoryDocument,
  DeleteCustomerAddressDocument,
  UpdateCustomerAddressDocument,
} from '@/api/documents/customers';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { SwitchRow } from '@/components/form/fields';
import { DeleteSection, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { ErrorState } from '@/components/screen-state';
import { Section } from '@/components/section';
import type { CustomerDetailQuery } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';

import { addressProblem, addressRows, emptyAddress, toAddressInput, toAddressValue } from './address-fields';

type Address = NonNullable<NonNullable<CustomerDetailQuery['customer']>['addresses']>[number];

export function CustomerAddressScreen({ id, customerId }: { id: string; customerId: string }) {
  const query = useVendureQuery(CustomerDetailDocument, { id: customerId });
  return (
    <QueryBoundary query={query} pick={(d) => d.customer} noun="customer">
      {(customer) => {
        const address = customer.addresses?.find((a) => a.id === id);
        if (id !== 'new' && !address) return <ErrorState error={new Error('This address no longer exists.')} />;
        return <AddressForm key={id} customerId={customer.id} address={address} />;
      }}
    </QueryBoundary>
  );
}

function AddressForm({ customerId, address }: { customerId: string; address?: Address }) {
  const { can } = usePermissions();
  const canEdit = can('UpdateCustomer');
  const defs = useCustomFields('Address');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateCustomerAddressDocument);
  const update = useVendureMutation(UpdateCustomerAddressDocument);
  const remove = useVendureMutation(DeleteCustomerAddressDocument);

  const [value, setValue] = useState(() => (address ? toAddressValue(address) : { ...emptyAddress }));
  const [defaultShipping, setDefaultShipping] = useState(address?.defaultShippingAddress ?? false);
  const [defaultBilling, setDefaultBilling] = useState(address?.defaultBillingAddress ?? false);
  const [cf, setCf] = useState(() => customFieldValues(defs, address?.customFields));
  const [dirty, setDirty] = useState(false);
  const mark = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };

  const save = async () => {
    const problem = addressProblem(value);
    if (problem) return alertError(new Error(problem), 'Incomplete address');
    const fields = {
      ...toAddressInput(value),
      defaultShippingAddress: defaultShipping,
      defaultBillingAddress: defaultBilling,
      customFields: customFieldsInput(defs, cf).customFields,
    };
    try {
      if (address) await update.mutateAsync({ input: { id: address.id, ...fields } });
      else await create.mutateAsync({ customerId, input: fields });
      await invalidate(CustomerDetailDocument, CustomerHistoryDocument);
      router.back();
    } catch (e) {
      alertError(e, 'Could not save address');
    }
  };

  return (
    <>
      <SaveHeader dirty={dirty} saving={create.isPending || update.isPending} onSave={save} label={address ? 'Save' : 'Create'} hidden={!canEdit} />
      <FormScroll>
        <Section title="Address">{addressRows({ value, onChange: mark(setValue), readOnly: !canEdit })}</Section>
        <Section title="Defaults">
          <SwitchRow label="Default shipping address" value={defaultShipping} disabled={!canEdit} onValueChange={mark(setDefaultShipping)} />
          <SwitchRow label="Default billing address" value={defaultBilling} disabled={!canEdit} onValueChange={mark(setDefaultBilling)} />
        </Section>
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {address ? (
          <DeleteSection
            label="Delete address"
            message="This address will be removed from the customer."
            hidden={!canEdit}
            onDelete={async () => {
              const r = await remove.mutateAsync({ id: address.id });
              if (!r.deleteCustomerAddress.success) throw new Error('The server did not delete the address.');
              await invalidate(CustomerDetailDocument, CustomerHistoryDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
