# PROGRESS — Vendure Admin App Starter

_Last updated: 2026-11-23_

## State
- [x] Lane setup: git + credential helper, relay live, expo plugin, vendure-docs MCP
- [x] Expo SDK 58 scaffold (create-expo-app default template)
- [ ] Epic + sub-issues on GitHub
- [ ] Theme (Vendure tokens), GraphQL client + codegen, auth, dashboard, products, orders
- [ ] README, verification, APK, Firebase distribution, relay handoff

## Live API smoke tests (default server)
- 2026-11-23: `login` as superadmin → CurrentUser, 20 channels; bearer via `vendure-auth-token` header
  (exposed in CORS). `products` totalItems 1030 (with preview images), `orders` totalItems 632,
  `metricSummary` available.
