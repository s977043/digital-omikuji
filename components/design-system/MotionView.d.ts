import React from "react";
import { View, ViewProps } from "react-native";

type MotionViewProps = ViewProps & {
  animate?: unknown;
  from?: unknown;
  transition?: unknown;
  exit?: unknown;
  state?: unknown;
};

export const MotionView: React.ForwardRefExoticComponent<
  MotionViewProps & React.RefAttributes<View>
>;
