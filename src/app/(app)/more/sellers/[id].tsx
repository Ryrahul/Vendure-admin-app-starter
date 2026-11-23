import { useLocalSearchParams } from 'expo-router';

import { SellerDetailScreen } from '@/screens/settings/sellers';

export default function SellerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SellerDetailScreen id={id} />;
}
