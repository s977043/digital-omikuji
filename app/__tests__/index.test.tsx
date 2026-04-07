import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import IndexScreen from "../index";

const mockDrawFortune = jest.fn();
const mockResetFortune = jest.fn();

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("../../hooks/useOmikujiLogic", () => ({
  useOmikujiLogic: () => ({
    fortune: {
      id: "fortune-id",
      level: "daikichi",
      messageIndex: 0,
      image: { uri: "test.png" },
      color: "#FFD700",
      createdAt: 1234567890,
    },
    history: [],
    drawFortune: mockDrawFortune,
    resetFortune: mockResetFortune,
    loadHistory: jest.fn(),
    hasDrawnToday: false,
  }),
}));

jest.mock("../../components/VersionDisplay", () => ({
  VersionDisplay: () => <></>,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, string | string[]> = {
        "common.share": "シェア",
        "common.close": "閉じる",
        "fortune.shareTitle": "おみくじをシェア",
        "fortune.tie": "結ぶ",
        "fortune.keep": "持ち帰る",
        "fortune.toastTie": "運勢を結びました",
        "fortune.toastKeep": "運勢を持ち帰りました",
        "fortune.tiedTitle": "おみくじを結びました",
        "fortune.tiedMessage": "願いが届きますように...",
        "fortune.levels.daikichi": "大吉",
        "fortune.messages.daikichi": ["最高の運気です。新しいことに挑戦するチャンス！"],
        "fortune.detailLabels.wish": "願望",
        "fortune.detailLabels.waitingPerson": "待人",
        "fortune.detailLabels.lostItem": "失物",
        "fortune.detailLabels.business": "商売",
        "fortune.detailLabels.study": "学問",
        "fortune.detailLabels.health": "健康",
        "fortune.detailLabels.love": "恋愛",
        "fortune.details.daikichi.wish": "思うがままに叶うでしょう。",
        "fortune.details.daikichi.waitingPerson": "音信あり。すぐに来ます。",
        "fortune.details.daikichi.lostItem": "出ます。高い所を探してみて。",
        "fortune.details.daikichi.business": "利益あり。進んで吉。",
        "fortune.details.daikichi.study": "安心して勉学に励みなさい。",
        "fortune.details.daikichi.health": "絶好調。何をしても体がついてきます。",
        "fortune.details.daikichi.love": "運命の出会いの予感。積極的に。",
      };
      const value = translations[key];
      if (options?.returnObjects && Array.isArray(value)) {
        return value;
      }
      return value || key;
    },
  }),
}));

jest.mock("../../utils/SoundManager", () => ({
  soundManager: {
    initialize: jest.fn(),
    loadSound: jest.fn(),
    playSound: jest.fn(),
    setMute: jest.fn(),
    unloadAll: jest.fn(),
  },
}));

describe("IndexScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("初期表示で主導線と補助導線が見える", async () => {
    const { getByText } = render(<IndexScreen />);

    await waitFor(() => {
      expect(getByText("新春デジタルおみくじ")).toBeTruthy();
      expect(getByText("おみくじを引く")).toBeTruthy();
      expect(getByText("履歴")).toBeTruthy();
      expect(getByText("ON")).toBeTruthy();
    });
  });

  it("ミュート切り替えと履歴遷移ができる", async () => {
    const { getByText } = render(<IndexScreen />);

    await waitFor(() => expect(getByText("ON")).toBeTruthy());

    fireEvent.press(getByText("ON"));
    expect(getByText("OFF")).toBeTruthy();

    fireEvent.press(getByText("履歴"));

    const { router } = require("expo-router");
    expect(router.push).toHaveBeenCalledWith("/history");
  });

  it("抽選フローが待機から結果表示まで進む", async () => {
    const { getByText, queryByText } = render(<IndexScreen />);

    await waitFor(() => expect(getByText("おみくじを引く")).toBeTruthy());

    fireEvent.press(getByText("おみくじを引く"));

    await waitFor(() => {
      expect(getByText("念を込めて...")).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(1600);
    });

    await waitFor(() => {
      expect(getByText("運命を紐解いています...")).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    await waitFor(() => {
      expect(getByText("新春\n奉納")).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(getByText("大吉")).toBeTruthy();
      expect(queryByText("念を込めて...")).toBeNull();
    });
  });
});
