import React from "react";
import { render } from "@testing-library/react-native";
import { VersionDisplay } from "../VersionDisplay";

jest.mock("../../utils/VersionInfo", () => ({
  getVersionDisplay: () => "v1.0.0",
}));

describe("VersionDisplay", () => {
  it("renders version", () => {
    const { getByText } = render(<VersionDisplay />);
    expect(getByText("v1.0.0")).toBeTruthy();
  });
});
