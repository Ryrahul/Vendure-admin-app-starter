/**
 * Server the login screen is prefilled with. Point it at your own Vendure instance,
 * or override at build time with EXPO_PUBLIC_VENDURE_ADMIN_API.
 * Only the URL lives here — never put credentials in the app bundle.
 */
export const DEFAULT_SERVER_URL =
  process.env.EXPO_PUBLIC_VENDURE_ADMIN_API ?? 'https://sastodeal-admin.hyperce.io/admin-api';

/** Page size for list screens. */
export const PAGE_SIZE = 20;
