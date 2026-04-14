import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { getComponentTokens, getStringToken } from "../../design-system";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tone?: "experience" | "document";
  leadingAction?: React.ReactNode;
  trailingAction?: React.ReactNode;
  actionPlacement?: "inline" | "stacked";
  style?: StyleProp<ViewStyle>;
}

export function PageHeader({
  title,
  subtitle,
  tone = "experience",
  leadingAction,
  trailingAction,
  actionPlacement = "inline",
  style,
}: PageHeaderProps) {
  const tokens = getComponentTokens<{
    titleColor: string;
    documentTitleColor: string;
    subtitleColor: string;
    documentSubtitleColor: string;
  }>("header.pageHeader");

  const titleColor = tone === "document" ? tokens.documentTitleColor : tokens.titleColor;
  const subtitleColor = tone === "document" ? tokens.documentSubtitleColor : tokens.subtitleColor;
  const titleFontFamily =
    tone === "document" ? undefined : getStringToken("primitive.typography.family.ritual");
  const titleStyle: TextStyle = {
    color: titleColor,
    fontSize: tone === "document" ? 28 : 24,
    fontWeight: tone === "document" ? "700" : undefined,
    letterSpacing: tone === "document" ? 0.2 : 1.2,
    fontFamily: titleFontFamily,
  };

  return (
    <View
      style={[
        {
          gap: 16,
        },
        style,
      ]}
    >
      {actionPlacement === "stacked" ? (
        <>
          {(leadingAction || trailingAction) && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                rowGap: 8,
              }}
            >
              <View style={{ flexShrink: 1 }}>{leadingAction}</View>
              {trailingAction ? <View style={{ flexShrink: 1 }}>{trailingAction}</View> : null}
            </View>
          )}
          <View style={{ flexShrink: 1, paddingLeft: 2 }}>
            <Text style={titleStyle}>{title}</Text>
            {subtitle ? (
              <Text style={{ color: subtitleColor, marginTop: 8, fontSize: 14 }}>{subtitle}</Text>
            ) : null}
          </View>
        </>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {leadingAction}
              <View style={{ flexShrink: 1 }}>
                <Text style={titleStyle} accessibilityRole="header">
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={{ color: subtitleColor, marginTop: 6, fontSize: 14 }}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          {trailingAction ? <View>{trailingAction}</View> : null}
        </View>
      )}
    </View>
  );
}
