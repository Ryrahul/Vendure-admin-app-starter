/** Facet values on a product or variant: removable chips plus an "Add" picker. */
import { Pressable, View } from 'react-native';

import { openPicker } from '@/api/picker';
import { facetValuePicker } from '@/api/pickers/common';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';

export interface EditableFacetValue {
  id: string;
  name: string;
  facetName?: string;
}

export const toEditableFacetValues = (values: { id: string; name: string; facet: { name: string } }[]): EditableFacetValue[] =>
  values.map((v) => ({ id: v.id, name: v.name, facetName: v.facet.name }));

export function FacetValuesEditor({
  value,
  onChange,
  readOnly,
}: {
  value: EditableFacetValue[];
  onChange: (value: EditableFacetValue[]) => void;
  readOnly?: boolean;
}) {
  const { colors, spacing, radius } = useTheme();
  return (
    <Section
      title={`Facet values (${value.length})`}
      action={
        readOnly ? undefined : (
          <Button
            title="Add"
            variant="ghost"
            size="sm"
            onPress={async () => {
              const picked = await openPicker({
                title: 'Facet values',
                source: facetValuePicker,
                multiple: true,
                selected: value.map((v) => v.id),
                selectedItems: value.map((v) => ({ id: v.id, title: v.name, subtitle: v.facetName })),
              });
              if (!picked) return;
              // The picker returns the full selection.
              onChange(
                picked.map((p) => value.find((v) => v.id === p.id) ?? { id: p.id, name: p.title, facetName: p.subtitle }),
              );
            }}
          />
        )
      }>
      {value.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], padding: spacing[4] }}>
          {value.map((fv) => (
            <View
              key={fv.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[1.5],
                paddingLeft: spacing[2.5],
                paddingRight: readOnly ? spacing[2.5] : spacing[1.5],
                paddingVertical: spacing[1],
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.neutralSubtle,
              }}>
              <Text variant="caption" color="neutralSubtleForeground">
                {fv.facetName ? `${fv.facetName}: ` : ''}
                {fv.name}
              </Text>
              {!readOnly ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${fv.name}`}
                  hitSlop={8}
                  onPress={() => onChange(value.filter((v) => v.id !== fv.id))}>
                  <Icon ios="xmark.circle.fill" android="cancel" size={14} />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      ) : (
        <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
          No facet values.
        </Text>
      )}
    </Section>
  );
}
