/**
 * Server the login screen is prefilled with. Empty by default, so every install starts
 * with a blank server field; set EXPO_PUBLIC_VENDURE_ADMIN_API at build time to prefill one.
 * After a successful login the last-used URL is remembered (SecureStore) and used instead.
 * Only the URL lives here — never put credentials in the app bundle.
 */
export const DEFAULT_SERVER_URL = process.env.EXPO_PUBLIC_VENDURE_ADMIN_API ?? '';

/** Page size for list screens. */
export const PAGE_SIZE = 20;
