import { useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/api/session';
import { Button } from '@/components/button';
import { InlineError } from '@/components/inline-error';
import { Text } from '@/components/text';
import { TextField } from '@/components/text-field';
import { useTheme } from '@/theme';

type InputRef = ComponentRef<typeof TextInput>;

export function LoginScreen() {
  const { colors, radius, spacing } = useTheme();
  const { state, login } = useSession();
  const [serverUrl, setServerUrl] = useState(state.apiUrl);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const usernameRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);

  const canSubmit = serverUrl.trim() && username.trim() && password;

  async function onSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login(serverUrl, username.trim(), password);
      // The root layout's Stack.Protected guard swaps to the app once logged in.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { padding: spacing[6], gap: spacing[6] }]}>
          <View style={{ gap: spacing[2] }}>
            <View
              style={[
                styles.brandMark,
                { backgroundColor: colors.brand, borderRadius: radius.md, marginBottom: spacing[2] },
              ]}
            />
            <Text variant="title">Sign in to Vendure</Text>
            <Text variant="body" color="mutedForeground">
              Connect to any Vendure server with an administrator account.
            </Text>
          </View>

          <View
            style={{
              gap: spacing[4],
              padding: spacing[5],
              backgroundColor: colors.card,
              borderRadius: radius.xl,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
            }}>
            <TextField
              label="Server"
              value={serverUrl}
              onChangeText={setServerUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              textContentType="URL"
              returnKeyType="next"
              onSubmitEditing={() => usernameRef.current?.focus()}
              placeholder="https://shop.example.com/admin-api"
              hint="Your Vendure Admin API URL"
            />
            <TextField
              ref={usernameRef}
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <TextField
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />
            {error ? <InlineError message={error} /> : null}
            <Button title="Sign in" size="lg" onPress={onSubmit} loading={submitting} disabled={!canSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', maxWidth: 520, width: '100%', alignSelf: 'center' },
  // Brand moment: a small Vendure Blue mark (brand color is rationed to identity).
  brandMark: { width: 28, height: 28 },
});
