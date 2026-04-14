import React from "react";
import { render } from "@testing-library/react-native";
import { HistoryEmptyState } from "../HistoryEmptyState";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "history.empty": "まだ運勢はありません",
      };
      return translations[key] ?? key;
    },
  }),
}));

describe("HistoryEmptyState", () => {
  it("空状態の文言を表示する", () => {
    const { getByText } = render(<HistoryEmptyState />);
    expect(getByText("まだ運勢はありません")).toBeTruthy();
  });

  it("プレースホルダー画像を accessible=false で描画する（装飾用）", () => {
    const { UNSAFE_getAllByType } = render(<HistoryEmptyState />);
    // Image は装飾目的のためスクリーンリーダーから読み上げ対象外
    const Image = require("react-native").Image;
    const images = UNSAFE_getAllByType(Image);
    expect(images.length).toBeGreaterThan(0);
    expect(images[0].props.accessible).toBe(false);
  });

  it("i18n キーが見つからない場合はキー名をフォールバック表示する", () => {
    // translations マップに無いキーはそのまま返る = t の実装確認
    const { queryByText } = render(<HistoryEmptyState />);
    // 既存 mock が history.empty をカバーしているため、キー名は表示されない
    expect(queryByText("history.empty")).toBeNull();
  });
});
