/**
 * Dev-server write suites for Settings-A: sellers, channels, stock locations, administrators,
 * roles, API keys, global settings and profile.
 *
 * Safety: every entity created here is prefixed "Smoke " / "smoke-" and deleted again. The
 * superadmin, the default channel/seller/role are never changed (except the profile suite,
 * which renames the superadmin and restores it). Global settings are restored exactly.
 * API key secrets are only checked for presence, never printed.
 */
import {
  ApiKeyDetailDocument,
  ApiKeyListDocument,
  CreateApiKeyDocument,
  DeleteApiKeysDocument,
  RotateApiKeyDocument,
  UpdateApiKeyDocument,
} from '../../src/api/documents/api-keys';
import {
  AdministratorDetailDocument,
  AdministratorListDocument,
  CreateAdministratorDocument,
  DeleteAdministratorDocument,
  UpdateAdministratorDocument,
} from '../../src/api/documents/administrators';
import {
  ChannelDetailDocument,
  ChannelListDocument,
  CreateChannelDocument,
  DEFAULT_CHANNEL_CODE,
  DeleteChannelDocument,
  PickZoneOptionsDocument,
  UpdateChannelDocument,
} from '../../src/api/documents/channels';
import { GlobalSettingsDetailDocument, UpdateGlobalSettingsDocument } from '../../src/api/documents/global-settings';
import { ProfileDetailDocument, UpdateProfileDocument } from '../../src/api/documents/profile';
import {
  CreateRoleDocument,
  DeleteRoleDocument,
  PickChannelOptionsDocument,
  PickRoleOptionsDocument,
  RoleDetailDocument,
  RoleListDocument,
  UpdateRoleDocument,
} from '../../src/api/documents/roles';
import {
  CreateSellerDocument,
  DeleteSellerDocument,
  PickSellerOptionsDocument,
  SellerDetailDocument,
  SellerListDocument,
  UpdateSellerDocument,
} from '../../src/api/documents/sellers';
import {
  CreateStockLocationDocument,
  DeleteStockLocationDocument,
  PickStockLocationOptionsDocument,
  StockLocationDetailDocument,
  StockLocationListDocument,
  UpdateStockLocationDocument,
} from '../../src/api/documents/stock-locations';
import { expect, type SmokeContext } from '../smoke-lib';
import type { Suite } from './index';

const stamp = () => `${Date.now()}`;

/** Local copy of `unwrapResult` (src/api/mutations pulls in React Native modules). */
function unwrapResult<T>(result: T): Exclude<T, { errorCode: string }> {
  const r = result as { errorCode?: string; message?: string };
  if (r && r.errorCode) throw new Error(`${r.errorCode}: ${r.message}`);
  return result as Exclude<T, { errorCode: string }>;
}

async function sellers({ run, ok }: SmokeContext) {
  const list = await run(SellerListDocument, { options: { take: 50 } });
  await run(PickSellerOptionsDocument, { options: { take: 5 } });
  const name = `Smoke seller ${stamp()}`;
  const { createSeller } = await run(CreateSellerDocument, { input: { name } });
  try {
    await run(UpdateSellerDocument, { input: { id: createSeller.id, name: `${name} (edited)` } });
    const detail = await run(SellerDetailDocument, { id: createSeller.id });
    expect(detail.seller?.name === `${name} (edited)`, 'seller updated');
  } finally {
    const del = await run(DeleteSellerDocument, { id: createSeller.id });
    expect(del.deleteSeller.result === 'DELETED', 'seller deleted');
  }
  ok('sellers', `${list.sellers.totalItems} listed; create → update → delete`);
}

async function channels({ run, ok }: SmokeContext) {
  const list = await run(ChannelListDocument, { options: { take: 50 } });
  const zones = await run(PickZoneOptionsDocument, { options: { take: 2 } });
  const zone = zones.zones.items[0];
  expect(zone, 'a zone exists');
  const def = list.channels.items.find((c) => c.code === DEFAULT_CHANNEL_CODE);
  expect(def, 'default channel listed');
  const code = `smoke-${stamp()}`;
  const created = unwrapResult(
    (
      await run(CreateChannelDocument, {
        input: {
          code,
          token: `${code}-token`,
          defaultLanguageCode: def.defaultLanguageCode,
          availableLanguageCodes: [def.defaultLanguageCode],
          defaultCurrencyCode: def.defaultCurrencyCode,
          availableCurrencyCodes: [def.defaultCurrencyCode],
          pricesIncludeTax: false,
          defaultTaxZoneId: zone.id,
          defaultShippingZoneId: zone.id,
        },
      })
    ).createChannel,
  );
  expect(created.__typename === 'Channel', 'channel created');
  try {
    unwrapResult(
      (await run(UpdateChannelDocument, { input: { id: created.id, pricesIncludeTax: true, outOfStockThreshold: 3 } }))
        .updateChannel,
    );
    const detail = await run(ChannelDetailDocument, { id: created.id });
    expect(detail.channel?.pricesIncludeTax === true, 'channel updated');
    expect(detail.channel?.defaultTaxZone?.id === zone.id, 'channel default tax zone');
  } finally {
    const del = await run(DeleteChannelDocument, { id: created.id });
    expect(del.deleteChannel.result === 'DELETED', 'channel deleted');
  }
  ok('channels', `${list.channels.totalItems} listed; create → update → delete`);
}

async function stockLocations({ run, ok }: SmokeContext) {
  const list = await run(StockLocationListDocument, { options: { take: 50 } });
  await run(PickStockLocationOptionsDocument, { options: { take: 5 } });
  const target = list.stockLocations.items[0];
  expect(target, 'an existing stock location');
  const name = `Smoke location ${stamp()}`;
  const { createStockLocation } = await run(CreateStockLocationDocument, { input: { name, description: 'smoke' } });
  try {
    await run(UpdateStockLocationDocument, { input: { id: createStockLocation.id, description: 'smoke (edited)' } });
    const detail = await run(StockLocationDetailDocument, { id: createStockLocation.id });
    expect(detail.stockLocation?.description === 'smoke (edited)', 'stock location updated');
  } finally {
    const del = await run(DeleteStockLocationDocument, {
      input: { id: createStockLocation.id, transferToLocationId: target.id },
    });
    expect(del.deleteStockLocation.result === 'DELETED', 'stock location deleted');
  }
  ok('stock locations', `${list.stockLocations.totalItems} listed; create → update → delete (transfer)`);
}

async function createSmokeRole(run: SmokeContext['run'], channelId: string) {
  const { createRole } = await run(CreateRoleDocument, {
    input: { code: `smoke-role-${stamp()}`, description: 'Smoke role', permissions: ['ReadCatalog'], channelIds: [channelId] },
  });
  return createRole.id;
}

async function defaultChannelId(run: SmokeContext['run']) {
  const channels = await run(PickChannelOptionsDocument, { options: { take: 50 } });
  const def = channels.channels.items.find((c) => c.code === DEFAULT_CHANNEL_CODE);
  expect(def, 'default channel');
  return def.id;
}

async function roles({ run, ok }: SmokeContext) {
  const list = await run(RoleListDocument, { options: { take: 50 } });
  const picked = await run(PickRoleOptionsDocument, { options: { take: 50, filter: { code: { notEq: '__customer_role__' } } } });
  expect(!picked.roles.items.some((r) => r.code === '__customer_role__'), 'role picker excludes customer role');
  const roleId = await createSmokeRole(run, await defaultChannelId(run));
  try {
    await run(UpdateRoleDocument, {
      input: { id: roleId, description: 'Smoke role (edited)', permissions: ['ReadCatalog', 'UpdateCatalog', 'ReadOrder'] },
    });
    const detail = await run(RoleDetailDocument, { id: roleId });
    expect(detail.role?.description === 'Smoke role (edited)', 'role updated');
    const perms = new Set(detail.role?.permissions);
    expect(perms.has('UpdateCatalog') && perms.has('ReadOrder'), 'role permissions saved');
    expect(detail.role?.channels.length === 1, 'role channel kept');
  } finally {
    const del = await run(DeleteRoleDocument, { id: roleId });
    expect(del.deleteRole.result === 'DELETED', 'role deleted');
  }
  ok('roles', `${list.roles.totalItems} listed; create → permissions → delete`);
}

async function administrators({ run, ok }: SmokeContext) {
  const list = await run(AdministratorListDocument, { options: { take: 50 } });
  const roleId = await createSmokeRole(run, await defaultChannelId(run));
  try {
    const email = `smoke-admin-${stamp()}@example.com`;
    const { createAdministrator } = await run(CreateAdministratorDocument, {
      input: { firstName: 'Smoke', lastName: 'Admin', emailAddress: email, password: `pw-${stamp()}`, roleIds: [roleId] },
    });
    try {
      await run(UpdateAdministratorDocument, {
        input: { id: createAdministrator.id, lastName: 'Admin (edited)', password: `pw2-${stamp()}`, roleIds: [roleId] },
      });
      const detail = await run(AdministratorDetailDocument, { id: createAdministrator.id });
      expect(detail.administrator?.lastName === 'Admin (edited)', 'administrator updated');
      expect(detail.administrator?.user.identifier === email, 'administrator identifier is the email');
      expect(detail.administrator?.user.roles.some((r) => r.id === roleId), 'administrator role assigned');
    } finally {
      const del = await run(DeleteAdministratorDocument, { id: createAdministrator.id });
      expect(del.deleteAdministrator.result === 'DELETED', 'administrator deleted');
    }
  } finally {
    await run(DeleteRoleDocument, { id: roleId });
  }
  ok('administrators', `${list.administrators.totalItems} listed; create → update → delete`);
}

async function apiKeys({ run, ok }: SmokeContext) {
  const list = await run(ApiKeyListDocument, { options: { take: 50 } });
  const roleId = await createSmokeRole(run, await defaultChannelId(run));
  try {
    const name = `Smoke key ${stamp()}`;
    const { createApiKey } = await run(CreateApiKeyDocument, {
      input: { roleIds: [roleId], translations: [{ languageCode: 'en', name }] },
    });
    // Only check presence; the secret is never printed.
    expect(createApiKey.apiKey.length > 10, 'api key secret returned');
    const id = createApiKey.entityId;
    try {
      const before = await run(ApiKeyDetailDocument, { id });
      const tr = before.apiKey?.translations[0];
      expect(tr, 'api key translation');
      await run(UpdateApiKeyDocument, {
        input: { id, translations: [{ id: tr.id, languageCode: tr.languageCode, name: `${name} (edited)` }] },
      });
      const detail = await run(ApiKeyDetailDocument, { id });
      expect(detail.apiKey?.name === `${name} (edited)`, 'api key updated');
      expect(detail.apiKey?.user.roles.some((r) => r.id === roleId), 'api key role');
      const { rotateApiKey } = await run(RotateApiKeyDocument, { id });
      expect(rotateApiKey.apiKey.length > 10 && rotateApiKey.apiKey !== createApiKey.apiKey, 'api key rotated');
    } finally {
      const del = await run(DeleteApiKeysDocument, { ids: [id] });
      expect(del.deleteApiKeys.every((d) => d.result === 'DELETED'), 'api key deleted');
    }
  } finally {
    await run(DeleteRoleDocument, { id: roleId });
  }
  ok('api keys', `${list.apiKeys.totalItems} listed; create → update → rotate → delete`);
}

async function globalSettings({ run, ok }: SmokeContext) {
  const { globalSettings: original } = await run(GlobalSettingsDetailDocument);
  const extra = original.availableLanguages.includes('de') ? 'fr' : 'de';
  try {
    unwrapResult(
      (
        await run(UpdateGlobalSettingsDocument, {
          input: {
            availableLanguages: [...original.availableLanguages, extra],
            trackInventory: !original.trackInventory,
            outOfStockThreshold: original.outOfStockThreshold + 7,
          },
        })
      ).updateGlobalSettings,
    );
    const { globalSettings: changed } = await run(GlobalSettingsDetailDocument);
    expect(changed.availableLanguages.includes(extra), 'global languages updated');
    expect(changed.trackInventory === !original.trackInventory, 'global trackInventory updated');
    expect(changed.outOfStockThreshold === original.outOfStockThreshold + 7, 'global threshold updated');
  } finally {
    unwrapResult(
      (
        await run(UpdateGlobalSettingsDocument, {
          input: {
            availableLanguages: original.availableLanguages,
            trackInventory: original.trackInventory,
            outOfStockThreshold: original.outOfStockThreshold,
          },
        })
      ).updateGlobalSettings,
    );
  }
  const { globalSettings: restored } = await run(GlobalSettingsDetailDocument);
  expect(
    restored.availableLanguages.join() === original.availableLanguages.join() &&
      restored.trackInventory === original.trackInventory &&
      restored.outOfStockThreshold === original.outOfStockThreshold,
    'global settings restored',
  );
  ok('global settings', `${original.availableLanguages.length} languages; change → verify → restore`);
}

async function profile({ run, ok }: SmokeContext) {
  const { activeAdministrator: me } = await run(ProfileDetailDocument);
  expect(me, 'active administrator');
  const original = me.firstName;
  try {
    await run(UpdateProfileDocument, { input: { firstName: `${original} Smoke` } });
    const after = await run(ProfileDetailDocument);
    expect(after.activeAdministrator?.firstName === `${original} Smoke`, 'profile updated');
  } finally {
    await run(UpdateProfileDocument, { input: { firstName: original } });
  }
  const restored = await run(ProfileDetailDocument);
  expect(restored.activeAdministrator?.firstName === original, 'profile restored');
  ok('profile', 'rename → verify → restore');
}

/** Dev-server write suites for this area group: name → suite. */
export const settingsASuites: Record<string, Suite> = {
  'settings-sellers': sellers,
  'settings-channels': channels,
  'settings-stock-locations': stockLocations,
  'settings-roles': roles,
  'settings-administrators': administrators,
  'settings-api-keys': apiKeys,
  'settings-global-settings': globalSettings,
  'settings-profile': profile,
};
