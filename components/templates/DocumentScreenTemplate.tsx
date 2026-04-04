import React from "react";
import { ScrollView, View } from "react-native";
import { getStringToken } from "../../design-system";

interface DocumentScreenTemplateProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function DocumentScreenTemplate({ header, children, footer }: DocumentScreenTemplateProps) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: getStringToken("semantic.surface.document.canvas") }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 32 }}
    >
      <View style={{ width: "100%", maxWidth: 960, alignSelf: "center" }}>
        {header}
        <View style={{ marginTop: 24, gap: 16 }}>{children}</View>
        {footer ? <View style={{ marginTop: 24 }}>{footer}</View> : null}
      </View>
    </ScrollView>
  );
}
