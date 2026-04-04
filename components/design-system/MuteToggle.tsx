import React from "react";
import { Button } from "./Button";

interface MuteToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export function MuteToggle({ isMuted, onToggle }: MuteToggleProps) {
  return (
    <Button
      label={isMuted ? "OFF" : "ON"}
      icon={isMuted ? "🔕" : "🔔"}
      onPress={onToggle}
      variant="secondaryQuiet"
      accessibilityLabel={isMuted ? "音声をオンにする" : "音声をオフにする"}
      style={{ minWidth: 96 }}
    />
  );
}
