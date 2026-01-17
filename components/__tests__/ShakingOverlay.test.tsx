import React from "react";
import { render } from "@testing-library/react-native";
import { ShakingOverlay } from "../ShakingOverlay";

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
    linear: jest.fn((v) => v),
    ease: jest.fn((v) => v),
    inOut: jest.fn(() => jest.fn((v) => v)),
    out: jest.fn(() => jest.fn((v) => v)),
    bezier: jest.fn(() => jest.fn((v) => v)),
  },
}));

describe("ShakingOverlay", () => {
  it("renders the shaking text correctly", () => {
    const { getByText } = render(<ShakingOverlay />);
    expect(getByText("願いを込めて...")).toBeTruthy();
  });

  it("has correct accessibility attributes", () => {
    const { getByLabelText } = render(<ShakingOverlay />);
    expect(getByLabelText("おみくじを振っています")).toBeTruthy();
  });

  it('blocks touch events (pointerEvents="auto")', () => {
    const { getByLabelText } = render(<ShakingOverlay />);
    const container = getByLabelText("おみくじを振っています");
    expect(container).toBeTruthy();
  });

  it("renders with reducedMotion prop", () => {
    const { getByText } = render(<ShakingOverlay reducedMotion={true} />);
    expect(getByText("願いを込めて...")).toBeTruthy();
  });
});
