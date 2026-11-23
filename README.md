# Vendure Admin App Starter

An open-source **Expo / React Native** starter for a [Vendure](https://vendure.io) admin
mobile app — the mobile counterpart of the Vendure web dashboard. It speaks the standard
**Vendure Admin GraphQL API**, works against any Vendure server, and uses the
[Vendure design system](https://github.com/vendurehq/design) tokens in light and dark mode.

It covers the **whole web admin** on a phone. Every area of `packages/dashboard` is mapped in
[`V2-SCOPE.md`](V2-SCOPE.md):

| Tab | Areas |
|---|---|
| **Insights** | Orders today / this month, 30-day revenue and AOV, daily chart, latest orders |
| **Catalog** | Products (full editor, assets, facet values, variants, channels), product variants (price, tax, stock per location), option groups, collections (tree, filters, move), facets & values, assets (grid, upload from camera/library, tags) |
| **Orders** | State filters + drafts; history & notes, state transitions, payments (settle / cancel / manual), fulfil and fulfillment states, cancel, refund, modify (dry-run preview); draft-order editor |
| **Customers** | Customers (profile, addresses, orders, groups, notes, verify), customer groups and members |
| **More** | Promotions (conditions & actions); sellers, channels, stock locations, administrators, roles (permission matrix), API keys, shipping methods (+ test), payment methods, tax categories, tax rates, countries, zones, global settings, profile; job queue, scheduled tasks, search reindex; channel switcher, sign out |

Every create, edit and delete action follows the admin's permissions on the active channel.
Destructive actions always ask for confirmation.

### Custom fields: automatic, for any server

The app reads the server's custom field config (`serverConfig.entityCustomFields`) at sign-in,
the same way the web dashboard does:

- **Queries** get the configured fields injected at runtime.
- **Edit screens** render a matching input for each one: string (or a select when it has
  `options`), localeString, text, int, float, boolean, datetime, relation (Asset, Product,
  Variant, Customer, …) and lists.
- **Flags** `readonly`, `internal`, `nullable`, `requiresPermission`, labels/descriptions and
  `ui.tab` are respected.
- **Saves** send the values back. Locale fields go in `translations[].customFields`, and
  relations are sent as `<name>Id(s)`.

When a server adds a field, it appears in the app with no code change and no codegen.

## Quick start

```bash
npm install
npx expo start            # dev server; press "a" for Android (needs a dev build, see below)
```

Sign in with any Vendure **administrator** account. The server field starts empty; enter your
Admin API URL (`shop.example.com`, `https://shop.example.com` and `https://shop.example.com/admin-api`
all work). After a successful login the app remembers the last-used server.

To prefill the server field in your own builds, set it at build time:

```bash
EXPO_PUBLIC_VENDURE_ADMIN_API=https://your-host/admin-api npx expo start
```

> Credentials are never stored in the bundle — only the server URL.

### Server requirements

- Vendure 3.x with the Admin API reachable over HTTPS. Tested on 3.8; it sticks to the standard
  API, so 2.2+ should mostly work.
- Bearer-token auth enabled — the default config already has it:
  `authOptions: { tokenMethod: ['bearer', 'cookie'] }`. The app reads the
  `vendure-auth-token` response header and sends `Authorization: Bearer …`.
- For a web build only: CORS must expose `vendure-auth-token` (native apps don't need CORS).
- Optional: the `AdminUiPlugin`'s `metricSummary` query powers the Insights chart. Without it,
  the app computes the same 30-day figures from core `orders`.

## Local test server

[`dev-server/`](dev-server/README.md) is a plain Vendure 3 server with sample data and sample
custom fields of every type. Develop and test destructive flows (delete, cancel, refund) there,
never on a production server:

```bash
cd dev-server && npm install && cp .env.example .env   # fill in Postgres + superadmin
npm run populate && npm start                          # http://127.0.0.1:3300/admin-api
```

## Building an APK locally

No EAS cloud account needed:

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

`app.json` pins `buildToolsVersion` (via `expo-build-properties`) and the NDK version
(via the local `plugins/with-android-ndk-version.js` config plugin) so Gradle uses what is
already installed. Release builds are signed with the debug keystore by default — set up
your own keystore before publishing to the Play Store.

## Architecture

```
src/
├── app/                      # Expo Router routes only (thin: title + screen component)
│   ├── _layout.tsx           # providers, fonts, splash, Stack.Protected auth gate, picker modal
│   ├── login.tsx
│   ├── picker.tsx            # shared searchable picker (openPicker())
│   └── (app)/                # signed-in area: NativeTabs
│       ├── (dashboard)/      # "/": Insights
│       ├── catalog/          # hub + products, variants, option-groups, collections, facets, assets
│       ├── orders/           # list, [id], draft/, fulfil/, cancel/, refund/, modify/, payment/
│       ├── customers/        # list, [id], address/, groups/
│       └── more/             # hub + promotions, settings areas, jobs, scheduled-tasks, profile
├── screens/                  # screen bodies, one folder per area
├── components/
│   ├── form/                 # form rows, CustomFieldsSection, configurable-operation editors
│   ├── screen-kit.tsx        # EntityListScreen, FormScroll, SaveHeader, DeleteSection, QueryBoundary
│   └── …                     # text, button, section, list-row, status-badge, thumbnail, …
├── api/
│   ├── client.ts             # fetch-based GraphQL client (bearer + vendure-token headers)
│   ├── session.tsx           # server URL, token, channel, server config (SecureStore)
│   ├── custom-fields.ts      # @customFields directive expansion + input helpers
│   ├── hooks.ts              # useVendureQuery / useVendureInfiniteList / useVendureMutation
│   ├── permissions.ts        # usePermissions().can(...)
│   ├── upload.ts             # multipart asset upload (createAssets)
│   ├── picker.ts, pickers/   # picker modal + list sources (products, variants, customers, …)
│   └── documents/            # all GraphQL operations, typed by codegen
├── gql/                      # generated by graphql-codegen (do not edit)
├── theme/                    # Vendure design tokens, fonts, useTheme()
└── utils/                    # money/date formatting, confirm(), asset URLs
```

### Data flow

1. **Session** (`src/api/session.tsx`) hydrates the server URL, auth token and channel token
   from SecureStore. The root layout renders nothing until hydration finishes, so the wrong
   screen never flashes.
2. **Login** runs the `login` mutation, takes the bearer token from the `vendure-auth-token`
   header, loads `me.channels`, and picks the default channel (or the previously selected one).
3. **Server config** (custom fields, permission definitions, order process) loads with the user.
   `execute()` expands `@customFields` markers with it before each request.
4. **Queries** go through TanStack Query. Cache keys include the operation name, server URL and
   channel token, so switching channels refetches everything. An expired session (`FORBIDDEN`)
   signs you out automatically.
5. **Money** is in minor units: `value / 10^moneyStrategyPrecision`, formatted with `Intl`
   in the row's `currencyCode`.

### Typed GraphQL (graphql-codegen)

Operations are written with the generated `graphql()` helper and are fully typed:

```ts
import { graphql } from '@/gql';

export const ProductListDocument = graphql(`
  query ProductList($options: ProductListOptions) {
    products(options: $options) { items { id name } totalItems }
  }
`);

const { data } = useVendureQuery(ProductListDocument, { options: { take: 20 } });
//      ^? typed result
```

Custom fields go in with the client-only `@customFields` directive (declared in
`graphql/client-directives.graphql`). It is expanded before the request is sent:

```graphql
product(id: $id) {
  customFields @customFields(entity: "Product")
  translations @customFields(entity: "Product", locale: true) { id languageCode name }
}
```

After editing any document:

```bash
npm run codegen
```

The schema in `graphql/admin-schema.graphql` is the **standard** Vendure Admin API, so the
starter only uses fields every server has. To add your server's custom fields and plugin
queries, introspect your own server and regenerate:

```bash
SCHEMA_URL=https://your-host/admin-api npm run schema:pull
npm run codegen
```

### Theming

`src/theme/tokens.ts` is generated from
[`@vendure-io/design-tokens`](https://github.com/vendurehq/design) — the same tokens the Vendure web
dashboard uses — converted from OKLCH to hex for React Native. Design rules carried over:

- **Neutral by default, tone for state, brand for identity.** `primary` is near-black (light) /
  near-white (dark); Vendure Blue (`brand`) is reserved for identity moments.
- **Status badges** follow the dashboard: routine order states stay neutral; only states that
  need attention get colour (warning, info, critical).
- Fonts: Inter (UI), Public Sans (headings), Geist Mono (codes and SKUs).

Components read tokens through `useTheme()`; screens use components. Avoid hardcoded colours.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Expo dev server |
| `npm run codegen` | Regenerate typed GraphQL documents in `src/gql/` |
| `npm run schema:pull` | Refresh `graphql/admin-schema.graphql` (standard or `SCHEMA_URL`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `expo lint` |
| `npm test` | Formatting/URL helper assertions |
| `npm run smoke` | Live **read-only** smoke test: every area's list + detail queries (see below) |
| `npm run smoke:dev` | Write-path suites (create → update → delete, order flows, uploads) against the local `dev-server/` only |

### Live smoke test

```bash
VENDURE_API=https://your-host/admin-api VENDURE_USER=... VENDURE_PASS=... npm run smoke
# SMOKE_MUTATION=1 also toggles one product's `enabled` flag and restores it

DEV_USER=superadmin DEV_PASS=... npm run smoke:dev            # all write suites, localhost only
DEV_USER=superadmin DEV_PASS=... npm run smoke:dev sales-orders
```

Credentials are read from the environment only. `smoke:dev` refuses to run against any host
other than localhost.

## Extending the starter

- **New area:** copy the tax-categories reference (`src/api/documents/tax-categories.ts`,
  `src/screens/settings/tax-categories.tsx`, `src/app/(app)/more/tax-categories/`). It covers
  the list, create/edit (`id === 'new'`), custom fields, permissions and delete. Add a write suite in
  `scripts/dev-smoke/` and a read entry in `scripts/read-coverage.ts`.
- **Plugin queries:** introspect your server (`SCHEMA_URL=… npm run schema:pull`) to get typed
  documents for your plugins' APIs.
- **Permissions:** `usePermissions().can('UpdateCatalog', 'UpdateProduct')` is true if the admin has
  any of them on the active channel.

## License

MIT
