import { useActiveChannel } from '@/api/session';

/**
 * Permission checks for the active channel, like the web dashboard's `PermissionGuard`.
 *
 *   const { can } = usePermissions();
 *   can('UpdateCatalog', 'UpdateProduct')   // true if the admin has ANY of them
 */
export function usePermissions() {
  const channel = useActiveChannel();
  const granted = new Set(channel?.permissions ?? []);
  const can = (...permissions: string[]) =>
    granted.has('SuperAdmin') || permissions.some((p) => granted.has(p));
  return { can, permissions: granted };
}
