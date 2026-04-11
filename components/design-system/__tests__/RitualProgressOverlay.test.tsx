import React from "react";
import { render } from "@testing-library/react-native";
import { RitualProgressOverlay } from "../RitualProgressOverlay";

jest.mock("../MotionView", () => {
  const { View } = require("react-native");
  return { MotionView: View };
});

describe("RitualProgressOverlay", () => {
  it("デフォルトの label を表示する", () => {
    const { getByText } = render(<RitualProgressOverlay />);
    expect(getByText("運命を紐解いています...")).toBeTruthy();
  });

  it("固定のサブタイトルを表示する", () => {
    const { getByText } = render(<RitualProgressOverlay />);
    expect(getByText("新しい年の運を静かに選び取っています")).toBeTruthy();
  });

  it("カスタム label を指定できる", () => {
    const { getByText } = render(<RitualProgressOverlay label="抽選中です" />);
    expect(getByText("抽選中です")).toBeTruthy();
  });

  it("reducedMotion=false (デフォルト) でもクラッシュせずレンダリングされる", () => {
    const { getByText } = render(<RitualProgressOverlay reducedMotion={false} />);
    expect(getByText("運命を紐解いています...")).toBeTruthy();
  });

  it("reducedMotion=true でもクラッシュせずレンダリングされる", () => {
    const { getByText } = render(<RitualProgressOverlay reducedMotion />);
    expect(getByText("運命を紐解いています...")).toBeTruthy();
  });

  it("accessibilityLabel は末尾の '...' が除去される", () => {
    const { getByLabelText } = render(<RitualProgressOverlay label="処理中..." />);
    expect(getByLabelText("処理中")).toBeTruthy();
  });

  it("デフォルト label でも '...' を除いた accessibilityLabel が設定される", () => {
    const { getByLabelText } = render(<RitualProgressOverlay />);
    expect(getByLabelText("運命を紐解いています")).toBeTruthy();
  });
});
