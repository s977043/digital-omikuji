import React from "react";
import { Platform } from "react-native";
import { render } from "@testing-library/react-native";
import { RevealStickStage } from "../RevealStickStage";

// MotionView を単純な View として mock（アニメーション検証は不要）
jest.mock("../MotionView", () => {
  const { View } = require("react-native");
  return { MotionView: View };
});

describe("RevealStickStage", () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = "ios";
  });

  it("奉納の文言が表示される", () => {
    const { getByText } = render(<RevealStickStage />);
    expect(getByText("新春\n奉納")).toBeTruthy();
  });

  it("reducedMotion=false (デフォルト) でもクラッシュせずレンダリングされる", () => {
    const { getByText } = render(<RevealStickStage reducedMotion={false} />);
    expect(getByText("新春\n奉納")).toBeTruthy();
  });

  it("reducedMotion=true でもクラッシュせずレンダリングされる", () => {
    const { getByText } = render(<RevealStickStage reducedMotion />);
    expect(getByText("新春\n奉納")).toBeTruthy();
  });

  it("Platform.OS='web' でもクラッシュせずレンダリングされる (boxShadow 分岐)", () => {
    (Platform as { OS: string }).OS = "web";
    const { getByText } = render(<RevealStickStage />);
    expect(getByText("新春\n奉納")).toBeTruthy();
  });

  it("Platform.OS='ios' でもクラッシュせずレンダリングされる (shadowColor 分岐)", () => {
    (Platform as { OS: string }).OS = "ios";
    const { getByText } = render(<RevealStickStage />);
    expect(getByText("新春\n奉納")).toBeTruthy();
  });

  it("Platform.OS='android' でもクラッシュせずレンダリングされる (elevation 分岐)", () => {
    (Platform as { OS: string }).OS = "android";
    const { getByText } = render(<RevealStickStage />);
    expect(getByText("新春\n奉納")).toBeTruthy();
  });
});
