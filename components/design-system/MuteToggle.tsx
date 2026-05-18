import { Text, View } from "react-native";
import { getStringToken } from "../../design-system";
import { Button } from "./Button";

function BellIcon({ muted, color }: { muted: boolean; color: string }) {
  return (
    <View style={{ width: 20, height: 20, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 16, color, opacity: muted ? 0.5 : 1 }}>{muted ? "✕" : "♪"}</Text>
    </View>
  );
}

interface MuteToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export function MuteToggle({ isMuted, onToggle }: MuteToggleProps) {
  const iconColor = getStringToken("semantic.text.primary");

  return (
    <Button
      label={isMuted ? "OFF" : "ON"}
      iconElement={<BellIcon muted={isMuted} color={iconColor} />}
      onPress={onToggle}
      variant="secondaryQuiet"
      accessibilityLabel={isMuted ? "音声をオンにする" : "音声をオフにする"}
      style={{ minWidth: 96 }}
    />
  );
}
