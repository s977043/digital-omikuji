import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { HistoryScreenTemplate } from "../templates/HistoryScreenTemplate";

describe("HistoryScreenTemplate", () => {
  it("renders header and content", () => {
    const { getByText } = render(
      <HistoryScreenTemplate
        header={<Text>履歴ヘッダー</Text>}
        content={<Text>履歴コンテンツ</Text>}
      />
    );
    expect(getByText("履歴ヘッダー")).toBeTruthy();
    expect(getByText("履歴コンテンツ")).toBeTruthy();
  });

  it("renders footer when provided", () => {
    const { getByText } = render(
      <HistoryScreenTemplate
        header={<Text>ヘッダー</Text>}
        content={<Text>コンテンツ</Text>}
        footer={<Text>履歴フッター</Text>}
      />
    );
    expect(getByText("履歴フッター")).toBeTruthy();
  });

  it("does not render footer when not provided", () => {
    const { queryByText } = render(
      <HistoryScreenTemplate header={<Text>h</Text>} content={<Text>c</Text>} />
    );
    expect(queryByText(/フッター/)).toBeNull();
  });
});
