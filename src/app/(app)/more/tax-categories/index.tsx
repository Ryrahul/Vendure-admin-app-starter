import { Stack } from 'expo-router';

import { TaxCategoryListScreen } from '@/screens/settings/tax-categories';

export default function TaxCategoriesRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tax categories' }} />
      <TaxCategoryListScreen />
    </>
  );
}
