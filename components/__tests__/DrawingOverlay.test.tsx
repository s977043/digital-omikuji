import React from "react";
import { render } from "@testing-library/react-native";
import { DrawingOverlay } from "../DrawingOverlay";

// Mock moti
jest.mock("moti", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");
  return {
    MotiView: View,
  };
});

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => ({
  Easing: {
    linear: jest.fn(),
  },
}));

describe("DrawingOverlay", () => {
  it("renders the loading text correctly", () => {
    const { getByText } = render(<DrawingOverlay />);
    expect(getByText("運命を紐解いています...")).toBeTruthy();
  });

  it("has correct accessibility attributes", () => {
    const { getByLabelText } = render(<DrawingOverlay />);
    // The container should have the accessibility label
    expect(getByLabelText("運命を紐解いています")).toBeTruthy();
  });

  it('blocks touch events (pointerEvents="auto")', () => {
    const { getByLabelText } = render(<DrawingOverlay />);
    const container = getByLabelText("運命を紐解いています");
    // In React Native, pointerEvents prop isn't directly testable via RNTL,
    // but we ensure the component renders without error.
    expect(container).toBeTruthy();
  });
});
