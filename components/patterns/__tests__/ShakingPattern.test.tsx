import React from "react";
import { render } from "@testing-library/react-native";
import { ShakingPattern } from "../ShakingPattern";

describe("ShakingPattern", () => {
  it("renders the ritual prompt text", () => {
    const { getByText } = render(<ShakingPattern />);
    expect(getByText("念を込めて...")).toBeTruthy();
  });

  it("renders with reducedMotion without crashing", () => {
    const { getByText } = render(<ShakingPattern reducedMotion />);
    expect(getByText("念を込めて...")).toBeTruthy();
  });
});
