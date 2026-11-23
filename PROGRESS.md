# PROGRESS — Vendure Admin App Starter

_Last updated: 2026-11-23_

## State: v2.0.0 shipped to testers. PR #20 is open, stacked on #10, and not merged.
- Scope: `V2-SCOPE.md`. Epic #11 with sub-issues #12–#19.
- **What's done:**
  - Every web-dashboard area is in the app: catalog, sales (orders: full actions + drafts; customers, groups), promotions, all settings areas, job queue, scheduled tasks, reindex.
  - Dynamic custom fields (#19): the `@customFields` directive is expanded at runtime from `serverConfig.entityCustomFields`, with inputs per type and save support.
  - Insights works without AdminUiPlugin: it falls back to computing the figures from core `orders`.
- **Local test server:** `dev-server/`, Vendure 3.8.2 on 127.0.0.1:3300, running in tmux window `vendure:dev-server`.
  - **Postgres db/role `vendure_starter`.** Creds are in `~/.config/vendure-app-starter/postgres.env` (chmod 600). Include it in backups.
  - The superadmin creds are in `~/.config/vendure-app-starter/dev-server-admin-creds`.
- **Verification:**
  - tsc, eslint and unit tests are clean. expo-doctor passes 20/20.
  - `smoke:dev` passes all 27 write suites (localhost-only guard).
  - `smoke` (read-only) covers 23 areas and passes on both dev-server and Sastodeal. No mutations were sent to Sastodeal.
  - An independent review found 20 bugs, all fixed (ad6be02).
  - **The UI has not been exercised on a device**: there's no emulator on the VM.
- **APK:** `dist/vendure-admin-starter-2.0.0.apk`, 105,314,130 B, sha256 `c576ef4821c8df07179ec519783d320355e99d48db175398746f98b58083c8e1`.
  - versionCode 2, 4 ABIs, debug keystore.
  - The bundle has the default URL and no credentials.
- **Firebase:** release 2.0.0 (2) distributed with `--groups testers`.
- **v2 follow-ups:**
  - Custom fields: relation editing only for known entities (Asset, Product, Variant, Customer, CustomerGroup, FacetValue, Collection); struct fields are read-only.
  - Not done: multi-language translation editing, option-group based variant generation, drag-and-drop ordering, focal point.

## v1 record: 1.0.0 shipped to testers (PR #10)

- [x] Lane setup: git + repo-local credential helper, relay live (gigs), expo plugin (project scope), vendure-docs MCP
- [x] Expo SDK 58 scaffold (create-expo-app), Expo Router, NativeTabs
- [x] Epic #1 + sub-issues #2–#9
- [x] Theme: Vendure design tokens (vendurehq/design → hex), light + dark, Inter / Public Sans / Geist Mono (#2)
- [x] GraphQL: fetch client + TanStack Query + graphql-codegen (client preset, string documents) against the standard Admin API schema (#3)
- [x] Auth: server URL (persisted), login, bearer token in SecureStore, channel switcher, logout, Stack.Protected (#4)
- [x] Insights: metricSummary (revenue / orders / AOV, 30 days), daily chart, today / month counts, latest orders (#5)
- [x] Products: search (name/slug/SKU), paginated list with images, detail (variants, prices, stock, facets), toggle enabled + rename (#6)
- [x] Orders: state filters, search, state badges, detail (lines, totals, customer, addresses, payments, fulfillments) (#7)
- [x] README with setup, architecture, codegen and theming notes (#8)
- [x] Verification, local release APK, Firebase App Distribution (#9)

## Verification (no emulator on this VM — this is the ceiling)
- `npx tsc --noEmit` clean · `npx expo lint` clean · `npm test` pass · `npx expo-doctor` 20/20
- `npx expo export --platform android` OK (Hermes bundle 3.2 MB)
- `./gradlew assembleRelease` OK (13m20s first run; buildTools 36.0.0, NDK 28.2.13676358)
- NOT verified: on-device UI rendering/interaction (no emulator). The APK has not been launched by me.

## Live API smoke tests (`npm run smoke`, default server sastodeal-admin.hyperce.io)
- login → bearer token; `me` 20 channels, default `__default_channel__`; activeChannel NPR, precision 2
- metricSummary: OrderCount/OrderTotal/AverageOrderValue, 30 daily entries each
- dashboard orders: today 0, this month 35, latest 6
- products: 1030 total, 5/5 sampled with images; asset `?preset=thumb|medium` → 200 image/jpeg
- search "Ilam" → 1; product detail #52 OK
- orders: 522 placed; order detail A2C5KBXB8ZA9UL63 OK
- mutation (SMOKE_MUTATION=1): updateProduct #52 enabled true → false → true (restored)
- Found + fixed: `totalQuantity` on order *lists* fails on this server (needs lines join) → only selected on order detail

## Artifact
- `dist/vendure-admin-starter-1.0.0.apk` (git-excluded)
- size 104,100,751 bytes · sha256 `81d7b4c4e3e925093648ca585074f9fd31fdb598f7634d237f7bd10f324a4dcd`
- package `io.hyperce.vendureadmin`, versionCode 1, minSdk 24, ABIs arm64-v8a/armeabi-v7a/x86/x86_64
- signed with the **debug keystore** (testing only) — real keystore needed before Play Store

## Firebase App Distribution
- project `vendure-admin-starter-hyperce`, app id `1:231970696218:android:6ae5d20d42f581ead635a3`
- group `testers` = caulirahul6@gmail.com (per updated TASK.md), release 1.0.0 (1) distributed with `--groups testers`

## Follow-ups
- Release keystore + Play Store config
- Split APK per ABI / AAB to cut the 104 MB universal APK
- Order state transitions, customers, promotions (web dashboard parity)
- i18n (dashboard uses Lingui with 28 locales)
