import React, { forwardRef } from "react";
import { View, ViewProps } from "react-native";

type MotionViewProps = ViewProps & {
  animate?: unknown;
  from?: unknown;
  transition?: unknown;
  exit?: unknown;
  state?: unknown;
};

export const MotionView = forwardRef<View, MotionViewProps>(function MotionView(
  { animate: _animate, from: _from, transition: _transition, exit: _exit, state: _state, ...rest },
  ref
) {
  return <View ref={ref} {...rest} />;
});
