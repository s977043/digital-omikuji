import React, { useCallback } from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { getComponentTokens, getStringToken } from "../../design-system";
import { triggerHaptic } from "../../utils/haptics";

type ButtonVariant = "primaryRitual" | "secondaryQuiet" | "utilityWarm" | "textLink";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "secondaryQuiet",
  icon,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const tokens = getComponentTokens<{
    backgroundColor: string;
    pressedBackgroundColor: string;
    borderColor: string;
    textColor: string;
    paddingHorizontal: number;
    paddingVertical: number;
    minHeight: number;
    borderWidth: number;
    radius: number;
    textSize: number;
  }>(`button.${variant}`);

  const fontFamily =
    variant === "primaryRitual" ? getStringToken("primitive.typography.family.ritual") : undefined;

  const handlePress = useCallback(() => {
    if (variant !== "textLink") {
      triggerHaptic({ type: "impact", style: Haptics.ImpactFeedbackStyle.Light });
    }
    onPress();
  }, [variant, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? tokens.pressedBackgroundColor : tokens.backgroundColor,
          borderColor: tokens.borderColor,
          borderWidth: tokens.borderWidth,
          minHeight: tokens.minHeight,
          borderRadius: tokens.radius,
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.paddingVertical,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
          flexDirection: "row",
        },
        style,
      ]}
    >
      {icon ? (
        <Text style={{ color: tokens.textColor, marginRight: 8, fontSize: tokens.textSize - 1 }}>
          {icon}
        </Text>
      ) : null}
      <Text
        style={[
          {
            color: tokens.textColor,
            fontSize: tokens.textSize,
            fontWeight: variant === "textLink" ? "600" : "700",
            letterSpacing: variant === "primaryRitual" ? 1.6 : 0.4,
            fontFamily,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
