import { useLocalSearchParams } from 'expo-router';

import { StockLocationDetailScreen } from '@/screens/settings/stock-locations';

export default function StockLocationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StockLocationDetailScreen id={id} />;
}
