import { Text } from "react-native";
import { getVersionDisplay } from "../utils/VersionInfo";

/**
 * デプロイバージョン表示コンポーネント
 * 画面右下に薄いテキストで表示
 */
export const VersionDisplay = () => (
  <Text
    className="absolute bottom-2 right-2 p-1 text-xs text-white/40 font-mono"
    accessibilityLabel={`アプリバージョン: ${getVersionDisplay()}`}
  >
    {getVersionDisplay()}
  </Text>
);
