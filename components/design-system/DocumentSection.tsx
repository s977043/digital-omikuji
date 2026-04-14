import React from "react";
import { Text, View } from "react-native";
import { getComponentTokens, getStringToken } from "../../design-system";
import { SurfaceCard } from "./SurfaceCard";

interface DocumentSectionProps {
  title: string;
  children: React.ReactNode;
  subtle?: boolean;
}

export function DocumentSection({ title, children, subtle = false }: DocumentSectionProps) {
  const tokens = getComponentTokens<{
    titleColor: string;
    bodyColor: string;
    mutedSurface: string;
  }>("document.section");

  const bodyFont = getStringToken("primitive.typography.family.system");

  return (
    <SurfaceCard
      variant="documentPanel"
      style={{
        backgroundColor: subtle ? tokens.mutedSurface : undefined,
      }}
    >
      <Text
        style={{
          color: tokens.titleColor,
          fontSize: 21,
          fontWeight: "700",
          marginBottom: 10,
        }}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <View style={{ gap: 10 }}>
        {typeof children === "string" ? (
          <Text
            style={{
              color: tokens.bodyColor,
              fontSize: 16,
              lineHeight: 26,
              fontFamily: bodyFont,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </SurfaceCard>
  );
}
