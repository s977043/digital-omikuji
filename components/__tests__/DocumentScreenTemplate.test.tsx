import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { DocumentScreenTemplate } from "../templates/DocumentScreenTemplate";

describe("DocumentScreenTemplate", () => {
  it("renders header and children", () => {
    const { getByText } = render(
      <DocumentScreenTemplate header={<Text>ドキュメントヘッダー</Text>}>
        <Text>本文セクション</Text>
      </DocumentScreenTemplate>
    );
    expect(getByText("ドキュメントヘッダー")).toBeTruthy();
    expect(getByText("本文セクション")).toBeTruthy();
  });

  it("renders multiple children", () => {
    const { getByText } = render(
      <DocumentScreenTemplate header={<Text>h</Text>}>
        <Text>セクション1</Text>
        <Text>セクション2</Text>
      </DocumentScreenTemplate>
    );
    expect(getByText("セクション1")).toBeTruthy();
    expect(getByText("セクション2")).toBeTruthy();
  });

  it("renders footer when provided", () => {
    const { getByText } = render(
      <DocumentScreenTemplate header={<Text>h</Text>} footer={<Text>ドキュメントフッター</Text>}>
        <Text>body</Text>
      </DocumentScreenTemplate>
    );
    expect(getByText("ドキュメントフッター")).toBeTruthy();
  });

  it("does not render footer when not provided", () => {
    const { queryByText } = render(
      <DocumentScreenTemplate header={<Text>h</Text>}>
        <Text>body</Text>
      </DocumentScreenTemplate>
    );
    expect(queryByText(/フッター/)).toBeNull();
  });
});
