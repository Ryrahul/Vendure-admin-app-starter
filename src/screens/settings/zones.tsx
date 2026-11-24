/**
 * Zones: list, create/edit (name, custom fields), members (countries) with add/remove,
 * delete. On an existing zone, member changes apply immediately (like the web dashboard);
 * on a new zone they are sent with the create.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AddMembersToZoneDocument,
  CreateZoneDocument,
  DeleteZoneDocument,
  RemoveMembersFromZoneDocument,
  UpdateZoneDocument,
  ZoneDetailDocument,
  ZoneListDocument,
} from '@/api/documents/zones';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { countryPicker } from '@/api/pickers/settings-b';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { ListRow } from '@/components/list-row';
import {
  DeleteSection,
  EntityListScreen,
  FormScroll,
  HeaderIconButton,
  QueryBoundary,
  SaveHeader,
} from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { ZoneDetailQuery } from '@/gql/graphql';
import { alertError, confirm } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

const COLLAPSED_MEMBERS = 8;

const canCreate = (can: (...p: string[]) => boolean) => can('CreateSettings', 'CreateZone');

export function ZoneListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={ZoneListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { name: 'ASC' as const },
          ...(term ? { filter: { name: { contains: term } } } : {}),
        },
      })}
      select={(r) => r.zones}
      noun={['zone', 'zones']}
      createHref={canCreate(can) ? '/more/zones/new' : undefined}
      row={(z) => ({ title: z.name, onPress: () => router.push(`/more/zones/${z.id}`) })}
    />
  );
}

type Zone = NonNullable<ZoneDetailQuery['zone']>;
type Member = Zone['members'][number];

export function ZoneDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(ZoneDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <ZoneForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.zone} noun="zone">
      {(zone) => (
        <ZoneForm
          key={zone.updatedAt}
          zone={zone}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function ZoneForm({ zone, refetch, refreshing }: { zone?: Zone; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('Zone');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateZoneDocument);
  const update = useVendureMutation(UpdateZoneDocument);
  const remove = useVendureMutation(DeleteZoneDocument);
  const addMembers = useVendureMutation(AddMembersToZoneDocument);
  const removeMembers = useVendureMutation(RemoveMembersFromZoneDocument);

  const [name, setName] = useState(zone?.name ?? '');
  const [cf, setCf] = useState(() => customFieldValues(defs, zone?.customFields));
  /** Members picked for a zone that isn't created yet. */
  const [draftMembers, setDraftMembers] = useState<Member[]>([]);
  const [dirty, setDirty] = useState(false);

  const canEdit = zone ? can('UpdateSettings', 'UpdateZone') : canCreate(can);
  const saving = create.isPending || update.isPending;
  const members = [...(zone?.members ?? draftMembers)].sort((a, b) => a.name.localeCompare(b.name));
  const busy = addMembers.isPending || removeMembers.isPending;
  const [showAllMembers, setShowAllMembers] = useState(false);
  const visibleMembers = showAllMembers ? members : members.slice(0, COLLAPSED_MEMBERS);

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const { customFields } = customFieldsInput(defs, cf);
    try {
      if (zone) {
        await update.mutateAsync({ input: { id: zone.id, name: name.trim(), customFields } });
      } else {
        const res = await create.mutateAsync({
          input: { name: name.trim(), memberIds: draftMembers.map((m) => m.id), customFields },
        });
        router.replace(`/more/zones/${res.createZone.id}`);
      }
      setDirty(false);
      await invalidate(ZoneListDocument, ZoneDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  const pickMembers = async () => {
    const existing = new Set(members.map((m) => m.id));
    // A draft zone edits its whole selection; an existing zone only adds (removal is per row, confirmed).
    const picked = await openPicker({
      title: 'Add countries',
      source: countryPicker,
      multiple: true,
      selectedItems: zone ? [] : members.map((m) => ({ id: m.id, title: m.name, code: m.code })),
    });
    if (!picked) return;
    const added = picked.filter((p) => !existing.has(p.id));
    if (!zone) {
      setDraftMembers(
        picked.map((p) => ({ __typename: 'Country', id: p.id, name: p.title, code: p.code ?? '', enabled: true })),
      );
      setDirty(true);
      return;
    }
    if (!added.length) return;
    try {
      await addMembers.mutateAsync({ zoneId: zone.id, memberIds: added.map((a) => a.id) });
      await invalidate(ZoneDetailDocument);
    } catch (e) {
      alertError(e, 'Could not add members');
    }
  };

  const removeMember = async (m: Member) => {
    if (!zone) {
      setDraftMembers((prev) => prev.filter((x) => x.id !== m.id));
      return;
    }
    const ok = await confirm({
      title: `Remove ${m.name}?`,
      message: `${m.name} will be removed from “${zone.name}”. Tax rates and shipping rules for this zone will no longer apply to it.`,
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (!ok) return;
    try {
      await removeMembers.mutateAsync({ zoneId: zone.id, memberIds: [m.id] });
      await invalidate(ZoneDetailDocument);
    } catch (e) {
      alertError(e, 'Could not remove member');
    }
  };

  return (
    <>
      <SaveHeader
        title={zone?.name ?? 'New zone'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={zone ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow
            label="Name"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setDirty(true);
            }}
            readOnly={!canEdit}
            autoFocus={!zone}
          />
        </Section>
        <Section
          title={`Members (${members.length})`}
          action={
            canEdit ? <Button title="Add" size="sm" variant="ghost" loading={busy} onPress={pickMembers} /> : undefined
          }>
          {members.length === 0 ? (
            <ListRow title="No members" subtitle="Add the countries this zone covers." />
          ) : (
            visibleMembers.map((m) => (
              <ListRow
                key={m.id}
                title={m.name}
                code={m.code}
                trailing={
                  <>
                    {!m.enabled ? <StatusBadge label="Disabled" tone="neutral" /> : null}
                    {canEdit ? (
                      <HeaderIconButton
                        label={`Remove ${m.name}`}
                        ios="minus.circle"
                        android="remove_circle_outline"
                        onPress={() => void removeMember(m)}
                      />
                    ) : null}
                  </>
                }
              />
            ))
          )}
          {members.length > COLLAPSED_MEMBERS ? (
            <ListRow
              title={showAllMembers ? 'Show less' : `Show all ${members.length}`}
              chevron={false}
              onPress={() => setShowAllMembers((v) => !v)}
            />
          ) : null}
        </Section>
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {zone ? (
          <Section title="Info">
            <ValueRow label="ID" value={zone.id} mono />
            <ValueRow label="Created" value={formatDate(zone.createdAt)} />
            <ValueRow label="Updated" value={formatDate(zone.updatedAt)} />
          </Section>
        ) : null}
        {zone ? (
          <DeleteSection
            label="Delete zone"
            message={`“${zone.name}” will be deleted. Zones used by tax rates or as a channel default can't be deleted.`}
            hidden={!can('DeleteSettings', 'DeleteZone')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: zone.id })).deleteZone);
              await invalidate(ZoneListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
