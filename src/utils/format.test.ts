// Lightweight assertions runnable with `npm test` (npx tsx; no test runner needed).
import { normalizeApiUrl } from '../api/client';
import { formatMoney, humanizeState, stripHtml } from './format';

const assert = {
  equal(actual: unknown, expected: unknown) {
    if (actual !== expected) throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
  },
  match(actual: string, re: RegExp) {
    if (!re.test(actual)) throw new Error(`Expected ${actual} to match ${re}`);
  },
};

assert.equal(normalizeApiUrl('shop.example.com'), 'https://shop.example.com/admin-api');
assert.equal(normalizeApiUrl('http://localhost:3000/'), 'http://localhost:3000/admin-api');
assert.equal(normalizeApiUrl('https://x.io/admin-api/'), 'https://x.io/admin-api');
assert.equal(humanizeState('PaymentSettled'), 'Payment settled');
assert.equal(humanizeState('ArrangingAdditionalPayment'), 'Arranging additional payment');
assert.match(formatMoney(12345, 'USD'), /123\.45/);
assert.equal(stripHtml('<p>Hello&nbsp;<b>world</b></p>'), 'Hello world');
console.log('format tests passed');
