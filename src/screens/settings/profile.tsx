/** Profile: the signed-in administrator's name, email, password and custom fields. */
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import { CurrentUserDocument } from '@/api/documents/auth';
import { AdministratorDetailDocument, AdministratorListDocument } from '@/api/documents/administrators';
import { ProfileDetailDocument, UpdateProfileDocument } from '@/api/documents/profile';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { useInvalidate } from '@/api/mutations';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import type { ProfileDetailQuery } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { roleLabel } from './roles';
import { useDirty } from './settings-a/shared';

export function ProfileScreen() {
  const query = useVendureQuery(ProfileDetailDocument);
  return (
    <QueryBoundary query={query} pick={(d) => d.activeAdministrator} noun="profile">
      {(admin) => (
        <ProfileForm
          key={admin.updatedAt}
          admin={admin}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

type Admin = NonNullable<ProfileDetailQuery['activeAdministrator']>;

function ProfileForm({ admin, refetch, refreshing }: { admin: Admin; refetch: () => void; refreshing: boolean }) {
  const defs = useCustomFields('Administrator');
  const invalidate = useInvalidate();
  const update = useVendureMutation(UpdateProfileDocument);
  const { dirty, setDirty, edit } = useDirty();

  const [firstName, setFirstName] = useState(admin.firstName);
  const [lastName, setLastName] = useState(admin.lastName);
  const [email, setEmail] = useState(admin.emailAddress);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cf, setCf] = useState(() => customFieldValues(defs, admin.customFields));

  const mismatch = !!password && !!confirmPassword && password !== confirmPassword;

  const save = async () => {
    if (!firstName.trim() || !lastName.trim())
      return alertError(new Error('First and last name are required.'), 'Missing name');
    if (!email.trim()) return alertError(new Error('Email address is required.'), 'Missing email');
    if (password && password !== confirmPassword)
      return alertError(new Error('The passwords don’t match.'), 'Check password');
    const { customFields } = customFieldsInput(defs, cf);
    try {
      await update.mutateAsync({
        input: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailAddress: email.trim(),
          customFields,
          ...(password ? { password } : {}),
        },
      });
      setPassword('');
      setConfirmPassword('');
      setDirty(false);
      await invalidate(
        ProfileDetailDocument,
        CurrentUserDocument,
        AdministratorListDocument,
        AdministratorDetailDocument,
      );
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader dirty={dirty} saving={update.isPending} onSave={save} />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow label="First name" value={firstName} onChangeText={edit(setFirstName)} />
          <TextRow label="Last name" value={lastName} onChangeText={edit(setLastName)} />
          <TextRow
            label="Email address"
            hint="Also your sign-in identifier."
            value={email}
            onChangeText={edit(setEmail)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
        </Section>
        <Section title="Password" footer="Leave empty to keep your current password.">
          <TextRow
            label="New password"
            value={password}
            onChangeText={edit(setPassword)}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <TextRow
            label="Confirm new password"
            value={confirmPassword}
            error={mismatch ? 'The passwords don’t match.' : undefined}
            onChangeText={edit(setConfirmPassword)}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
          />
        </Section>
        <CustomFieldsSection
          defs={defs}
          values={cf}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        <Section title="Info">
          <ValueRow label="Roles" value={admin.user.roles.map((r) => roleLabel(r)).join(', ')} />
          <ValueRow label="Last sign-in" value={admin.user.lastLogin ? formatDate(admin.user.lastLogin) : '—'} />
          <ValueRow label="Created" value={formatDate(admin.createdAt)} />
        </Section>
      </FormScroll>
    </>
  );
}
