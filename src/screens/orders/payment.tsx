/** Add a manual payment (ArrangingPayment / ArrangingAdditionalPayment): method, transaction ID, note. */
import { router } from 'expo-router';
import { useState } from 'react';

import { AddManualPaymentDocument, OrderDetailDocument, OrderPaymentMethodsDocument } from '@/api/documents/orders';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { unwrapResult, useInvalidate } from '@/api/mutations';
import { useChannelInfo } from '@/api/use-channel-info';
import { SelectRow, TextRow, ValueRow } from '@/components/form/fields';
import { FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { alertError } from '@/utils/confirm';
import { formatMoney } from '@/utils/format';

import { ORDER_DOCS } from './detail';
import { paidAmount, type OrderDetail } from './parts';

export function AddPaymentScreen({ id }: { id: string }) {
  const query = useVendureQuery(OrderDetailDocument, { id });
  return (
    <QueryBoundary query={query} pick={(d) => d.order} noun="order">
      {(order) => <PaymentForm order={order} />}
    </QueryBoundary>
  );
}

function PaymentForm({ order }: { order: OrderDetail }) {
  const { precision } = useChannelInfo();
  const invalidate = useInvalidate();
  const methods = useVendureQuery(OrderPaymentMethodsDocument, { options: { take: 100 } });
  const add = useVendureMutation(AddManualPaymentDocument);
  const options = (methods.data?.paymentMethods.items ?? []).filter((m) => m.enabled).map((m) => ({ value: m.code, label: m.name }));
  const [method, setMethod] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');
  const chosen = method ?? options[0]?.value ?? null;
  const outstanding = order.totalWithTax - paidAmount(order);

  const submit = async () => {
    if (!chosen) return alertError(new Error('Choose a payment method.'), 'Missing method');
    try {
      unwrapResult(
        (
          await add.mutateAsync({
            input: {
              orderId: order.id,
              method: chosen,
              transactionId: transactionId.trim() || undefined,
              metadata: note.trim() ? { note: note.trim() } : {},
            },
          })
        ).addManualPaymentToOrder,
      );
      await invalidate(...ORDER_DOCS);
      router.back();
    } catch (e) {
      alertError(e, 'Could not add payment');
    }
  };

  return (
    <>
      <SaveHeader title="Add payment" dirty={!!chosen} saving={add.isPending} onSave={submit} label="Add" />
      <FormScroll>
        <Section title="Payment" footer="A manual payment is recorded as settled for the outstanding amount.">
          <ValueRow label="Amount" value={formatMoney(outstanding, order.currencyCode, precision)} />
          <SelectRow label="Method" value={chosen} options={options} onChange={setMethod} disabled={!options.length} />
          <TextRow label="Transaction ID" value={transactionId} onChangeText={setTransactionId} autoCapitalize="none" />
          <TextRow label="Note" value={note} onChangeText={setNote} multiline placeholder="Stored in the payment metadata" />
        </Section>
      </FormScroll>
    </>
  );
}
