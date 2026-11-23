/**
 * Promise-based item picker presented as a modal route (`/picker`).
 *
 *   const picked = await openPicker({ title: 'Customer', source: customerPicker });
 *   if (picked) setCustomer(picked[0]);
 *
 * A source is a typed list query plus a mapper to PickerItem, so any paginated
 * Vendure list can back a picker. Static `options` work too (filtered client-side).
 */
import { router } from 'expo-router';

import type { TypedDocumentString } from '@/gql/graphql';

export interface PickerItem {
  id: string;
  title: string;
  subtitle?: string;
  code?: string;
  preview?: string | null;
}

export interface PickerSource<R = any, V = any> {
  document: TypedDocumentString<R, V>;
  variables: (term: string, skip: number, take: number) => V;
  select: (result: R) => { items: PickerItem[]; totalItems: number };
}

export interface PickerRequest {
  title: string;
  multiple?: boolean;
  /** Ids selected when the picker opens (multi-select). */
  selected?: string[];
  source?: PickerSource;
  options?: PickerItem[];
  searchPlaceholder?: string;
}

interface Pending {
  request: PickerRequest;
  resolve: (items: PickerItem[] | null) => void;
}

const pending = new Map<string, Pending>();
let counter = 0;

export function openPicker(request: PickerRequest): Promise<PickerItem[] | null> {
  const id = String(++counter);
  return new Promise((resolve) => {
    pending.set(id, { request, resolve });
    router.push({ pathname: '/picker', params: { id } });
  });
}

/** Used by the picker route. */
export function getPickerRequest(id: string) {
  return pending.get(id)?.request;
}

export function settlePicker(id: string, items: PickerItem[] | null) {
  const p = pending.get(id);
  if (!p) return;
  pending.delete(id);
  p.resolve(items);
}

/** Helper for typed sources. */
export function pickerSource<R, V>(source: PickerSource<R, V>): PickerSource<R, V> {
  return source;
}
