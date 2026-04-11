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
});
