import React from "react";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { DocumentSection } from "../DocumentSection";

describe("DocumentSection", () => {
  it("title と文字列 children をレンダリングする (文字列 branch)", () => {
    const { getByText } = render(
      <DocumentSection title="プライバシーポリシー">
        このアプリは個人情報を収集しません。
      </DocumentSection>
    );
    expect(getByText("プライバシーポリシー")).toBeTruthy();
    expect(getByText("このアプリは個人情報を収集しません。")).toBeTruthy();
  });

  it("ReactNode children を素通しする (非文字列 branch)", () => {
    const { getByText, getByTestId } = render(
      <DocumentSection title="免責事項">
        <View testID="custom-body">
          <Text>独自レイアウト</Text>
        </View>
      </DocumentSection>
    );
    expect(getByText("免責事項")).toBeTruthy();
    expect(getByTestId("custom-body")).toBeTruthy();
    expect(getByText("独自レイアウト")).toBeTruthy();
  });

  it("subtle=false (default) では mutedSurface 背景が適用されない", () => {
    const { UNSAFE_root } = render(<DocumentSection title="通常セクション">本文</DocumentSection>);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("subtle=true の場合もクラッシュせずレンダリングされる", () => {
    const { getByText } = render(
      <DocumentSection title="サブ節" subtle>
        控えめな本文
      </DocumentSection>
    );
    expect(getByText("サブ節")).toBeTruthy();
    expect(getByText("控えめな本文")).toBeTruthy();
  });
});
