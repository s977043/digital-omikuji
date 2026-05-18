import React from "react";
import { View } from "react-native";
import { getStringToken } from "../../design-system";

interface SubScreenTemplateProps {
  header: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export function SubScreenTemplate({ header, content, footer }: SubScreenTemplateProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: getStringToken("semantic.surface.experience.canvas"),
        paddingHorizontal: 16,
        paddingTop: 48,
      }}
    >
      {header}
      <View style={{ flex: 1, marginTop: 20 }}>{content}</View>
      {footer ? <View style={{ paddingBottom: 12 }}>{footer}</View> : null}
    </View>
  );
}

/** @deprecated Use SubScreenTemplate instead */
export const HistoryScreenTemplate = SubScreenTemplate;
