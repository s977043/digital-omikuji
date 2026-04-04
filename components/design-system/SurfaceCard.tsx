import React from "react";
import { Platform, StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { getComponentTokens, getToken } from "../../design-system";

type SurfaceVariant = "glassCard" | "paperCard" | "documentPanel";

interface SurfaceCardProps extends ViewProps {
  variant?: SurfaceVariant;
  style?: StyleProp<ViewStyle>;
}

export function SurfaceCard({
  variant = "glassCard",
  style,
  children,
  ...props
}: SurfaceCardProps) {
  const tokens = getComponentTokens<{
    backgroundColor: string;
    borderColor: string;
    padding: number;
    radius: number;
  }>(`surface.${variant}`);

  const rawShadow =
    variant === "glassCard" || variant === "paperCard"
      ? (getToken("primitive", "elevation.card") as ViewStyle)
      : undefined;
  const shadow =
    Platform.OS === "web" && rawShadow
      ? {
          boxShadow: `${rawShadow.shadowOffset?.width ?? 0}px ${rawShadow.shadowOffset?.height ?? 0}px ${rawShadow.shadowRadius ?? 0}px rgba(0, 0, 0, ${rawShadow.shadowOpacity ?? 0})`,
        }
      : rawShadow;

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: tokens.backgroundColor,
          borderColor: tokens.borderColor,
          borderWidth: 1,
          borderRadius: tokens.radius,
          padding: tokens.padding,
        },
        shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}
