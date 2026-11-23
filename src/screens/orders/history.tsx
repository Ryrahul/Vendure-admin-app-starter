/**
 * History timeline with notes, shared by orders and customers. Entries are shown newest first
 * with human-readable titles (mirroring the dashboard's order/customer history labels). Admins
 * can add notes, and edit or delete the notes they wrote.
 */
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { SwitchRow, TextRow } from '@/components/form/fields';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { formatDate, humanizeState } from '@/utils/format';

export interface HistoryItem {
  id: string;
  type: string;
  createdAt: string;
  isPublic: boolean;
  data: unknown;
  administrator?: { id: string; firstName: string; lastName: string } | null;
}

type Data = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
const state = (v: unknown) => (typeof v === 'string' && v ? humanizeState(v) : '');

export function describeHistoryEntry(entry: HistoryItem): { title: string; detail?: string } {
  const d = (entry.data ?? {}) as Data;
  const to = str(d.to);
  const transition = d.from || d.to ? `${state(d.from)} → ${state(d.to)}` : undefined;
  switch (entry.type) {
    case 'ORDER_STATE_TRANSITION':
      if (d.from === 'Created') return { title: 'Order created', detail: transition };
      if (to === 'Delivered') return { title: 'Order delivered', detail: transition };
      if (to === 'Cancelled') return { title: 'Order cancelled', detail: transition };
      if (to === 'Shipped') return { title: 'Order shipped', detail: transition };
      if (to === 'PaymentAuthorized' || to === 'PaymentSettled') return { title: 'Order placed', detail: transition };
      return { title: 'Order state changed', detail: transition };
    case 'ORDER_PAYMENT_TRANSITION': {
      const title =
        to === 'Settled'
          ? 'Payment settled'
          : to === 'Authorized'
            ? 'Payment authorized'
            : to === 'Declined' || to === 'Cancelled'
              ? 'Payment failed'
              : 'Payment state changed';
      return { title, detail: [transition, d.paymentId ? `Payment #${str(d.paymentId)}` : ''].filter(Boolean).join(' · ') };
    }
    case 'ORDER_REFUND_TRANSITION':
      return {
        title: to === 'Settled' ? 'Refund settled' : 'Refund state changed',
        detail: [transition, d.reason ? str(d.reason) : ''].filter(Boolean).join(' · '),
      };
    case 'ORDER_FULFILLMENT':
      return { title: 'Fulfillment created', detail: d.fulfillmentId ? `Fulfillment #${str(d.fulfillmentId)}` : undefined };
    case 'ORDER_FULFILLMENT_TRANSITION':
      return {
        title: to === 'Shipped' ? 'Fulfillment shipped' : to === 'Delivered' ? 'Fulfillment delivered' : 'Fulfillment state changed',
        detail: transition,
      };
    case 'ORDER_CANCELLATION': {
      const lines = Array.isArray(d.lines) ? d.lines : [];
      return {
        title: lines.length ? 'Items cancelled' : 'Order cancelled',
        detail: [lines.length ? `${lines.length} line(s)` : '', d.shippingCancelled ? 'shipping cancelled' : '', str(d.reason)]
          .filter(Boolean)
          .join(' · '),
      };
    }
    case 'ORDER_MODIFIED':
      return { title: 'Order modified', detail: str(d.note) || undefined };
    case 'ORDER_COUPON_APPLIED':
      return { title: 'Coupon applied', detail: str(d.couponCode) };
    case 'ORDER_COUPON_REMOVED':
      return { title: 'Coupon removed', detail: str(d.couponCode) };
    case 'ORDER_CUSTOMER_UPDATED':
      return { title: 'Customer changed' };
    case 'ORDER_CURRENCY_UPDATED':
      return { title: 'Currency changed', detail: [str(d.previousCurrencyCode), str(d.currencyCode)].filter(Boolean).join(' → ') };
    case 'ORDER_NOTE':
    case 'CUSTOMER_NOTE':
      return { title: 'Note', detail: str(d.note) };
    case 'CUSTOMER_REGISTERED':
      return { title: 'Registered', detail: d.strategy ? `via ${str(d.strategy)}` : undefined };
    case 'CUSTOMER_VERIFIED':
      return { title: 'Account verified', detail: d.strategy ? `via ${str(d.strategy)}` : undefined };
    case 'CUSTOMER_DETAIL_UPDATED': {
      const input = (d.input ?? {}) as Data;
      const keys = Object.keys(input).filter((k) => k !== 'id');
      return { title: 'Details updated', detail: keys.length ? keys.join(', ') : undefined };
    }
    case 'CUSTOMER_ADDED_TO_GROUP':
      return { title: 'Added to group', detail: str(d.groupName) };
    case 'CUSTOMER_REMOVED_FROM_GROUP':
      return { title: 'Removed from group', detail: str(d.groupName) };
    case 'CUSTOMER_ADDRESS_CREATED':
      return { title: 'Address created', detail: str(d.address) };
    case 'CUSTOMER_ADDRESS_UPDATED':
      return { title: 'Address updated', detail: str(d.address) };
    case 'CUSTOMER_ADDRESS_DELETED':
      return { title: 'Address deleted', detail: str(d.address) };
    case 'CUSTOMER_PASSWORD_UPDATED':
      return { title: 'Password updated' };
    case 'CUSTOMER_PASSWORD_RESET_REQUESTED':
      return { title: 'Password reset requested' };
    case 'CUSTOMER_PASSWORD_RESET_VERIFIED':
      return { title: 'Password reset' };
    case 'CUSTOMER_EMAIL_UPDATE_REQUESTED':
      return { title: 'Email change requested', detail: [str(d.oldEmailAddress), str(d.newEmailAddress)].filter(Boolean).join(' → ') };
    case 'CUSTOMER_EMAIL_UPDATE_VERIFIED':
      return { title: 'Email changed', detail: [str(d.oldEmailAddress), str(d.newEmailAddress)].filter(Boolean).join(' → ') };
    default: {
      const t = entry.type.replace(/_/g, ' ').toLowerCase();
      return { title: t.charAt(0).toUpperCase() + t.slice(1) };
    }
  }
}

const isNote = (e: HistoryItem) => e.type === 'ORDER_NOTE' || e.type === 'CUSTOMER_NOTE';

export function HistoryTimeline({
  entries,
  totalItems,
  meId,
  canNote,
  withVisibility,
  onAdd,
  onUpdate,
  onDelete,
  onLoadMore,
}: {
  entries: HistoryItem[];
  totalItems: number;
  /** The active administrator, whose notes can be edited and deleted. */
  meId?: string;
  canNote: boolean;
  /** Offer the private/public toggle (order notes). */
  withVisibility?: boolean;
  onAdd: (note: string, isPublic: boolean) => Promise<unknown>;
  onUpdate: (id: string, note: string, isPublic: boolean) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onLoadMore?: () => void;
}) {
  const { spacing } = useTheme();
  const [note, setNote] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await onAdd(note.trim(), isPublic);
      setNote('');
      setIsPublic(false);
    } catch (e) {
      alertError(e, 'Could not add note');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: spacing[3] }}>
      {canNote ? (
        <Section title="Add note">
          <TextRow label="Note" value={note} onChangeText={setNote} multiline placeholder="Write a note…" />
          {withVisibility ? (
            <SwitchRow label="Visible to customer" hint="Public notes can be shown in the storefront." value={isPublic} onValueChange={setIsPublic} />
          ) : null}
          <View style={{ padding: spacing[3] }}>
            <Button title="Add note" size="sm" loading={busy} disabled={!note.trim()} onPress={add} />
          </View>
        </Section>
      ) : null}
      <Section title={`History (${totalItems})`}>
        {entries.length === 0 ? (
          <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
            No history yet.
          </Text>
        ) : null}
        {entries.map((e) => (
          <HistoryRow
            key={e.id}
            entry={e}
            editable={canNote && isNote(e) && !!meId && e.administrator?.id === meId}
            withVisibility={withVisibility}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
        {entries.length < totalItems && onLoadMore ? (
          <View style={{ padding: spacing[3] }}>
            <Button title="Show older entries" size="sm" variant="ghost" onPress={onLoadMore} />
          </View>
        ) : null}
      </Section>
    </View>
  );
}

function HistoryRow({
  entry,
  editable,
  withVisibility,
  onUpdate,
  onDelete,
}: {
  entry: HistoryItem;
  editable: boolean;
  withVisibility?: boolean;
  onUpdate: (id: string, note: string, isPublic: boolean) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}) {
  const { spacing } = useTheme();
  const { title, detail } = describeHistoryEntry(entry);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(detail ?? '');
  const [pub, setPub] = useState(entry.isPublic);
  const [busy, setBusy] = useState(false);
  const who = entry.administrator ? `${entry.administrator.firstName} ${entry.administrator.lastName}`.trim() : '';

  if (editing) {
    return (
      <View>
        <TextRow label="Edit note" value={text} onChangeText={setText} multiline autoFocus />
        {withVisibility ? <SwitchRow label="Visible to customer" value={pub} onValueChange={setPub} /> : null}
        <View style={{ flexDirection: 'row', gap: spacing[2], padding: spacing[3] }}>
          <Button
            title="Save"
            size="sm"
            loading={busy}
            disabled={!text.trim()}
            onPress={async () => {
              setBusy(true);
              try {
                await onUpdate(entry.id, text.trim(), pub);
                setEditing(false);
              } catch (e) {
                alertError(e, 'Could not update note');
              } finally {
                setBusy(false);
              }
            }}
          />
          <Button title="Cancel" size="sm" variant="ghost" onPress={() => setEditing(false)} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[1] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          {title}
        </Text>
        {isNote(entry) ? <StatusBadge label={entry.isPublic ? 'Public' : 'Private'} tone={entry.isPublic ? 'info' : 'neutral'} /> : null}
      </View>
      {detail ? <Text variant={isNote(entry) ? 'body' : 'caption'} color={isNote(entry) ? 'foreground' : 'mutedForeground'}>{detail}</Text> : null}
      <Text variant="caption" color="mutedForeground">
        {[formatDate(entry.createdAt), who].filter(Boolean).join(' · ')}
      </Text>
      {editable ? (
        <View style={{ flexDirection: 'row', gap: spacing[2], paddingTop: spacing[1] }}>
          <Button
            title="Edit"
            size="sm"
            variant="secondary"
            onPress={() => {
              setText(detail ?? '');
              setPub(entry.isPublic);
              setEditing(true);
            }}
          />
          <Button
            title="Delete"
            size="sm"
            variant="ghost"
            loading={busy}
            onPress={async () => {
              if (!(await confirm({ title: 'Delete note?', message: 'This note will be removed from the history.', confirmLabel: 'Delete', destructive: true }))) return;
              setBusy(true);
              try {
                await onDelete(entry.id);
              } catch (e) {
                alertError(e, 'Could not delete note');
                setBusy(false);
              }
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
