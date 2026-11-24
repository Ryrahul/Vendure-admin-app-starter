/** Global settings: available languages, stock settings and GlobalSettings custom fields. */
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import { GlobalSettingsDetailDocument, UpdateGlobalSettingsDocument } from '@/api/documents/global-settings';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { unwrapResult, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { NumberRow, SwitchRow, ValueRow } from '@/components/form/fields';
import { FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import type { GlobalSettingsDetailQuery, LanguageCode } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { languageName, languageOptions } from './settings-a/codes';
import { MultiPickRow, useDirty } from './settings-a/shared';

const COLLAPSED_LANGUAGES = 5;

export function GlobalSettingsScreen() {
  const query = useVendureQuery(GlobalSettingsDetailDocument);
  return (
    <QueryBoundary query={query} pick={(d) => d.globalSettings} noun="global settings">
      {(settings) => (
        <GlobalSettingsForm
          key={settings.updatedAt}
          settings={settings}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function GlobalSettingsForm({
  settings,
  refetch,
  refreshing,
}: {
  settings: GlobalSettingsDetailQuery['globalSettings'];
  refetch: () => void;
  refreshing: boolean;
}) {
  const { can } = usePermissions();
  const defs = useCustomFields('GlobalSettings');
  const invalidate = useInvalidate();
  const update = useVendureMutation(UpdateGlobalSettingsDocument);
  const { dirty, setDirty, edit } = useDirty();

  const [languages, setLanguages] = useState<string[]>(settings.availableLanguages);
  const [trackInventory, setTrackInventory] = useState(settings.trackInventory);
  const [threshold, setThreshold] = useState<number | null>(settings.outOfStockThreshold);
  const [cf, setCf] = useState(() => customFieldValues(defs, settings.customFields));
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const visibleLanguages = showAllLanguages ? languages : languages.slice(0, COLLAPSED_LANGUAGES);

  const canEdit = can('UpdateSettings', 'UpdateGlobalSettings');

  const save = async () => {
    if (!languages.length) return alertError(new Error('Keep at least one language.'), 'No languages');
    const { customFields } = customFieldsInput(defs, cf);
    try {
      unwrapResult(
        (
          await update.mutateAsync({
            input: {
              availableLanguages: languages as LanguageCode[],
              trackInventory,
              outOfStockThreshold: threshold ?? 0,
              customFields,
            },
          })
        ).updateGlobalSettings,
      );
      setDirty(false);
      await invalidate(GlobalSettingsDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader dirty={dirty} saving={update.isPending} onSave={save} hidden={!canEdit} />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section
          title="Languages"
          footer="Languages content can be translated into. Each channel picks its own from this list; a channel’s default language can’t be removed."
          action={
            languages.length > COLLAPSED_LANGUAGES ? (
              <Button
                size="sm"
                variant="ghost"
                title={showAllLanguages ? 'Show less' : 'Show all'}
                onPress={() => setShowAllLanguages((v) => !v)}
              />
            ) : undefined
          }>
          <MultiPickRow
            label="Available languages"
            disabled={!canEdit}
            options={languageOptions()}
            value={languages.map((l) => ({ id: l, label: languageName(l) }))}
            onChange={(v) => {
              setLanguages(v.map((x) => x.id));
              setDirty(true);
            }}
          />
          {visibleLanguages.map((l) => (
            <ValueRow key={l} label={languageName(l)} value={l} mono />
          ))}
        </Section>
        <Section title="Stock" footer="Defaults for new product variants; variants and channels can override them.">
          <SwitchRow
            label="Track inventory"
            value={trackInventory}
            disabled={!canEdit}
            onValueChange={edit(setTrackInventory)}
          />
          <NumberRow
            label="Out-of-stock threshold"
            hint="Variants are out of stock when saleable stock falls to this level."
            integer
            value={threshold}
            readOnly={!canEdit}
            onChange={edit(setThreshold)}
          />
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
        <Section title="Info">
          <ValueRow label="Updated" value={formatDate(settings.updatedAt)} />
        </Section>
      </FormScroll>
    </>
  );
}
