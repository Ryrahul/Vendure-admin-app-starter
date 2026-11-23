/**
 * Places sample orders through the Shop API so the app has orders in every early state.
 * Run after `npm run populate` while the server is running:  npm run seed:orders
 */
const base = `http://${process.env.APP_HOST ?? '127.0.0.1'}:${process.env.APP_PORT ?? 3300}`;

const PEOPLE = [
  ['Hayden', 'Zieme'], ['Marques', 'Sawayn'], ['Trevor', 'Donnelly'], ['Ava', 'Patel'],
  ['Liam', 'Okafor'], ['Mia', 'Kowalski'], ['Noah', 'Fernandes'], ['Zoe', 'Lindqvist'],
  ['Ethan', 'Moreau'], ['Isla', 'Tanaka'], ['Omar', 'Haddad'], ['Lucia', 'Romano'],
];

async function gql(token: string | null, query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(`${base}/shop-api`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: any; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return { data: json.data, token: res.headers.get('vendure-auth-token') ?? token };
}

const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

async function placeOrder([firstName, lastName]: string[], i: number) {
  let token: string | null = null;
  const products = await gql(null, `{ products(options:{take:54}) { items { variants { id } } } }`);
  const variants: string[] = products.data.products.items.flatMap((p: any) => p.variants.map((v: any) => v.id));
  for (let n = 0; n < 1 + (i % 3); n++) {
    const r = await gql(token, `mutation($id:ID!,$q:Int!){ addItemToOrder(productVariantId:$id, quantity:$q){ __typename ... on ErrorResult { message } } }`, { id: pick(variants), q: 1 + (n % 2) });
    token = r.token;
  }
  const email = `${firstName}.${lastName}@example.com`.toLowerCase();
  await gql(token, `mutation($i:CreateCustomerInput!){ setCustomerForOrder(input:$i){ __typename } }`, { i: { firstName, lastName, emailAddress: email } });
  await gql(token, `mutation($i:CreateAddressInput!){ setOrderShippingAddress(input:$i){ __typename } }`, {
    i: { fullName: `${firstName} ${lastName}`, streetLine1: `${10 + i} Market Street`, city: 'Kathmandu', postalCode: '44600', countryCode: 'NP', phoneNumber: '+977 1 5550000' },
  });
  const ship = await gql(token, `{ eligibleShippingMethods { id } }`);
  await gql(token, `mutation($id:[ID!]!){ setOrderShippingMethod(shippingMethodId:$id){ __typename } }`, { id: [ship.data.eligibleShippingMethods[i % 2].id] });
  if (i % 6 === 5) return `${email}: left active (cart)`;
  await gql(token, `mutation { transitionOrderToState(state:"ArrangingPayment"){ __typename ... on OrderStateTransitionError { message } } }`);
  const pay = await gql(token, `{ eligiblePaymentMethods { code } }`);
  const r = await gql(token, `mutation($m:String!){ addPaymentToOrder(input:{method:$m, metadata:{}}){ __typename ... on Order { code state } ... on ErrorResult { message } } }`, { m: pay.data.eligiblePaymentMethods[0].code });
  return `${email}: ${r.data.addPaymentToOrder.code ?? ''} ${r.data.addPaymentToOrder.state ?? r.data.addPaymentToOrder.message}`;
}

(async () => {
  for (const [i, person] of PEOPLE.entries()) console.log(await placeOrder(person, i));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
