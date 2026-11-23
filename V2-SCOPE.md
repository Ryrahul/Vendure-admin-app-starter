# v2 scope: full admin parity

Goal: every area of the Vendure web dashboard (`vendurehq/vendure` → `packages/dashboard`,
snapshot `3482d08`, 2026-11-22), available in the mobile app. Standard Admin API only, so it
works against any Vendure 3.x server.

This file maps each dashboard route to its operations and the mobile screens that cover it.
Sub-issues in the v2 epic follow the phases below.

## Rules

- **Same patterns as v1:**
  - Routes go in `src/app`, screen bodies in `src/screens`, operations in `src/api/documents`, all typed by codegen.
  - Tokens are read through `useTheme()`.
- **Permissions:** every create, update and delete action is gated on the active channel's
  permissions (`Create*`, `Update*`, `Delete*`), the same way the web dashboard does it.
- **Destructive flows** (delete, cancel, refund, transitions, channel removal) are built and tested
  against the **local seeded Vendure server** (`dev-server/`, 127.0.0.1:3300, db `vendure_starter`).
  - Against Sastodeal, only reads and reversible edits are allowed.
  - Smoke mutations against Sastodeal are always round-tripped.
- **Error results:** mutations that return `ErrorResult` unions surface `message` inline.
  `DeletionResponse.result === NOT_DELETED` shows the server's `message`.
- **Translations:** edit the active content language (the channel default). Other languages are
  shown as read-only chips; full multi-language editing is out of scope.
- **Custom fields: dynamic, never hardcoded** (#19, Rahul #37). The app reads
  `serverConfig.entityCustomFields` and injects `customFields { … }` selections into detail
  documents at runtime. It renders type-appropriate inputs that respect the readonly, internal,
  nullable, permission and label flags, and sends editable values in update mutations.
  Any server's new custom field shows up with no code change.

## Navigation (5 tabs)

| Tab | Root | Contains |
|---|---|---|
| Insights | dashboard (v1) | metrics, latest orders |
| Catalog | hub | Products, Variants, Collections, Facets, Option groups, Assets |
| Orders | order list (v1) | orders, draft orders |
| Customers | customer list | customers, customer groups |
| More | hub | Marketing (Promotions); Settings (Sellers, Channels, Stock locations, Administrators, Roles, API keys, Shipping methods, Payment methods, Tax categories, Tax rates, Countries, Zones, Global settings); System (Job queue, Scheduled tasks); Profile; Sign out |

The v1 Settings tab (channel switcher, account) moves into **More**.

## Area map

`Q` = query, `M` = mutation (dashboard document names).

### P1: Catalog

| Area | Dashboard ops | Mobile |
|---|---|---|
| Products | Q ProductList, ProductDetail(WithVariants), GetProductsWithFacetValuesByIds · M CreateProduct, UpdateProduct(s), DeleteProduct(s), Assign/RemoveProductsToChannel, Add/RemoveOptionGroupToProduct, CreateProductVariants, Reindex | list (v1) + filters (enabled, facet); detail: edit name/slug/description, enabled, assets (pick/reorder/featured), facet values, variants; create product (simple, or with options → variants); delete; channel assign/remove |
| Product variants | Q ProductVariantList, ProductVariantDetail, StockLocations, TaxRates, ProductVariantGlobalStockSettings · M CreateProductVariant, UpdateProductVariant(s), DeleteProductVariant(s), Assign/Remove…ToChannel | variant list (search by SKU); detail: name, SKU, enabled, price(s), tax category, stock on hand per location, track inventory, out-of-stock threshold, facet values, options, assets |
| Option groups | Q OptionGroupList, ProductOptionGroupDetail, ProductOptionList, ProductsByOptionGroup · M Create/UpdateProductOptionGroup, Create/Update/DeleteProductOption, DeleteOptionGroups | list, detail with options, add/edit/delete option |
| Collections | Q CollectionList, CollectionDetail, CollectionContentsList, GetCollectionFilters, PreviewCollectionContents, CollectionListForMove · M Create/Update/DeleteCollection(s), MoveCollection, Assign/Remove… | tree list (expand children); detail: name/slug/description, private, assets, **filters** (configurable-operation editor), contents preview; create; move (pick parent); delete |
| Facets | Q FacetList, FacetDetail, FacetValueList, FacetValueDetail · M Create/Update/DeleteFacet(s), Create/Update/DeleteFacetValue(s), Assign/Remove… | list; detail: name/code/private, values CRUD |
| Assets | Q AssetList, AssetDetail, TagList · M createAssets (upload), AssetUpdate, DeleteAssets, Create/Update/DeleteTag | grid; upload from photo library or camera (multipart `Upload`); detail: name, focal point (stretch), tags; delete |

### P2: Sales

| Area | Dashboard ops | Mobile |
|---|---|---|
| Orders | Q GetOrders, GetOrder, GetOrderHistory, GetSellerOrders, GetPaymentMethods, GetFulfillmentHandlers, RefundDestinations · M TransitionOrderToState, Add/Update/DeleteOrderNote, FulfillOrder, TransitionFulfillmentToState, SettlePayment, CancelPayment, TransitionPaymentToState, AddManualPaymentToOrder, CancelOrder, RefundOrder, SettleRefund, ModifyOrder | detail (v1) + **history timeline & notes**, state transition menu (`nextStates`), fulfill (handler + args, line quantities), fulfillment transitions, settle/cancel payment, add manual payment, cancel (lines/whole), refund (lines + shipping + adjustment), settle refund. *Modify order*: limited to quantity edits + recalc preview (`dryRun`) |
| Draft orders | M CreateDraftOrder, AddItemToDraftOrder, AdjustDraftOrderLine, RemoveDraftOrderLine, SetCustomerForDraftOrder, Set/UnsetDraftOrder{Shipping,Billing}Address, SetDraftOrderShippingMethod, Apply/RemoveCouponCode…, DeleteDraftOrder · Q DraftOrderEligibleShippingMethods, CouponCodeSelectorPromotionList, GetCustomerAddresses | "New draft order" flow: customer → variants (search) → addresses → shipping method → coupon → complete (transition to `ArrangingPayment`); delete draft |
| Customers | Q GetCustomerList, GetCustomerDetail, GetCustomerOrderList, GetCustomerHistory · M Create/Update/DeleteCustomer(s), Create/Update/DeleteCustomerAddress, Add/Update/DeleteCustomerNote, Add/RemoveCustomerFromGroup, VerifyCustomerAccount | list (search name/email, filter verified); detail: profile edit, addresses CRUD (default shipping/billing), orders, groups, history + notes; create; delete |
| Customer groups | Q CustomerGroupList, CustomerGroup, CustomerGroupMemberList · M Create/Update/DeleteCustomerGroup(s), Add/RemoveCustomersToGroup | list, detail with members, add/remove members, CRUD |

### P3: Marketing

| Area | Dashboard ops | Mobile |
|---|---|---|
| Promotions | Q PromotionList, PromotionDetail, GetPromotionConditions, GetPromotionActions · M Create/Update/DeletePromotion(s), Assign/Remove… | list (enabled, dates); detail: name, description, enabled, coupon code, per-customer/usage limits, starts/ends, **conditions & actions** (configurable-operation editor) |

### P4: Settings

| Area | Dashboard ops | Mobile |
|---|---|---|
| Sellers | SellerList/Detail · Create/Update/Delete | list + form |
| Channels | ChannelList/Detail · Create/Update/Delete | list + form (code, token, seller, default languages/currency, available currencies/languages, prices incl. tax, default zones) |
| Stock locations | StockLocationList/Detail · CRUD, Assign/Remove | list + form |
| Administrators | AdministratorList/Detail, RolesById · CRUD | list + form (name, email, password, roles) |
| Roles | RoleList/Detail · CRUD | list + form (code, description, channels, **permission matrix** from `serverConfig.permissions`) |
| API keys | ApiKeyList/Detail, ActiveAdministratorRoles · Create/Update/Rotate/Delete | list + form; created/rotated key shown **once** with copy |
| Shipping methods | ShippingMethodList/Detail, GetShippingEligibilityCheckers, GetShippingCalculators, GetFulfillmentHandlers, TestShippingMethod, TestEligibleShippingMethods · CRUD | list + form (code, name, description, fulfillment handler, checker + calculator via configurable-operation editor); test calculator |
| Payment methods | PaymentMethodList/Detail, GetPaymentHandlers, GetPaymentEligibilityCheckers · CRUD | list + form (handler + checker editors) |
| Tax categories | TaxCategoryList/Detail · CRUD | list + form |
| Tax rates | TaxRateList/Detail · CRUD | list + form (category, zone, customer group, value) |
| Countries | CountriesList/Detail · CRUD | list + form |
| Zones | ZoneList/Detail, ZoneMembers · CRUD, Add/RemoveMembersToZone | list + form + members |
| Global settings | GlobalSettings · UpdateGlobalSettings | languages, stock settings |
| Profile | ActiveAdministrator · UpdateActiveAdministrator | name, email, password |

### P5: System

| Area | Dashboard ops | Mobile |
|---|---|---|
| Job queue | JobList, JobQueueList · CancelJob | list with queue/state filters, detail (data/result/error), cancel |
| Scheduled tasks | ScheduledTasks · UpdateScheduledTask, RunScheduledTask | list, enable/disable, run now |
| Search index | Reindex | "Rebuild search index" action (More → System) |

### Not ported (web-only or no mobile value)

- Data-table column configuration, saved views and bulk-selection UI. Bulk deletes become
  per-item actions.
- The dashboard extension API (`defineDashboardExtension`), custom form inputs and the plugin pages.
- Rich-text editing. Descriptions are edited as plain text; existing HTML is preserved unless edited.
- `SettingsStoreFieldDefinitions` (plugin-defined settings store).
- Multi-language translation editing (see Rules).

## Phases → sub-issues

| # | Phase | Contents |
|---|---|---|
| P0 | Foundations | `dev-server/` (local seeded Vendure 3.x, port 3300, db `vendure_starter`); form kit (text, multiline, number, money, switch, select, multi-select, date, entity picker); configurable-operation editor; `usePermissions()`; ErrorResult/deletion helpers; confirm-destructive sheet; 5-tab nav + hubs |
| P1 | Catalog | products (full), variants, option groups, collections, facets, assets + upload |
| P2 | Sales | orders (history, notes, transitions, fulfil, payments, cancel, refund, modify), draft orders, customers, customer groups |
| P3 | Marketing | promotions |
| P4 | Settings | sellers, channels, stock locations, administrators, roles, API keys, shipping, payment, tax categories, tax rates, countries, zones, global settings, profile |
| P5 | System | job queue, scheduled tasks, reindex |
| P6 | Ship v2 | smoke test coverage (read ops against Sastodeal, all write ops against dev-server), README, local APK 2.0.0, Firebase release to testers |
| CF | Custom fields (#19) | runtime query extension + typed inputs + mutations; spans P1–P4 (built right after P0) |
| P7 | Stretch | relation custom-field editing, focal point, multi-language translations |
