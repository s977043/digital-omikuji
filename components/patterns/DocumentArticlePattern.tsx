import React from "react";
import { Text } from "react-native";
import { DocumentSection } from "../design-system/DocumentSection";

interface DocumentSubSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DocumentSubSection({ title, children }: DocumentSubSectionProps) {
  return (
    <DocumentSection title={title} subtle>
      {typeof children === "string" ? (
        <Text style={{ color: "#4B5563", fontSize: 16, lineHeight: 26 }}>{children}</Text>
      ) : (
        children
      )}
    </DocumentSection>
  );
}
