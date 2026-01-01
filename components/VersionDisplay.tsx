import { View, Text } from 'react-native';
import { getVersionDisplay } from '../utils/VersionInfo';

/**
 * デプロイバージョン表示コンポーネント
 * 画面右下に薄いテキストで表示
 */
export const VersionDisplay = () => (
  <View className="absolute bottom-2 right-2 p-1">
    <Text className="text-xs text-white/40 font-mono">
      {getVersionDisplay()}
    </Text>
  </View>
);
