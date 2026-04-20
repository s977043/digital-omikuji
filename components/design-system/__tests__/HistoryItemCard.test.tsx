import React from "react";
import { render } from "@testing-library/react-native";
import { HistoryItemCard } from "../HistoryItemCard";
import { OmikujiResult } from "../../../types/omikuji";

describe("HistoryItemCard", () => {
  const baseItem: OmikujiResult = {
    id: "entry-1",
    type: "omikuji",
    level: "daikichi",
    messageIndex: 0,
    image: { uri: "test.png" },
    color: "#FFD700",
    createdAt: new Date("2026-04-11T09:30:00+09:00").getTime(),
  };

  it("fortuneTitle と fortuneMessage を表示する", () => {
    const { getByText } = render(
      <HistoryItemCard item={baseItem} fortuneTitle="大吉" fortuneMessage="最高の運気です" />
    );
    expect(getByText("大吉")).toBeTruthy();
    expect(getByText("最高の運気です")).toBeTruthy();
  });

  it("createdAt を ja-JP ロケールで整形して表示する", () => {
    const { getByText } = render(
      <HistoryItemCard item={baseItem} fortuneTitle="大吉" fortuneMessage="メッセージ" />
    );
    const expected = new Date(baseItem.createdAt).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    expect(getByText(expected)).toBeTruthy();
  });

  it.each([
    ["daikichi", "大吉"],
    ["chukichi", "中吉"],
    ["kyo", "凶"],
  ] as const)("level=%s でも render できる", (level, title) => {
    const { getByText } = render(
      <HistoryItemCard item={{ ...baseItem, level }} fortuneTitle={title} fortuneMessage="本文" />
    );
    expect(getByText(title)).toBeTruthy();
  });

  it.each([
    ["suekichi", "末吉"],
    ["daikyo", "大凶"],
    ["kichi", "吉"],
    ["shokichi", "小吉"],
  ] as const)("残りの全 level=%s も render できる", (level, title) => {
    const { getByText } = render(
      <HistoryItemCard item={{ ...baseItem, level }} fortuneTitle={title} fortuneMessage="本文" />
    );
    expect(getByText(title)).toBeTruthy();
  });

  it("fortuneMessage が空文字でもクラッシュせずレンダリングされる", () => {
    const { getByText } = render(
      <HistoryItemCard item={baseItem} fortuneTitle="大吉" fortuneMessage="" />
    );
    expect(getByText("大吉")).toBeTruthy();
  });
});
