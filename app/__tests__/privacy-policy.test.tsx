import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import PrivacyPolicyScreen from "../privacy-policy";

// Mocks
jest.mock("expo-router", () => {
  const router = {
    back: jest.fn(),
    canGoBack: jest.fn(),
    replace: jest.fn(),
  };

  return {
    Link: "Link",
    Stack: { Screen: () => null },
    router,
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
// No additional mocks needed for privacy-policy

const { router: mockRouter } = jest.requireMock("expo-router") as {
  router: {
    back: jest.Mock;
    canGoBack: jest.Mock;
    replace: jest.Mock;
  };
};

describe("PrivacyPolicyScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.canGoBack.mockReturnValue(false);
  });

  it("renders correctly", () => {
    const { getByText } = render(<PrivacyPolicyScreen />);
    expect(getByText("プライバシーポリシー")).toBeTruthy();
    expect(getByText("はじめに")).toBeTruthy();
  });

  it("uses router.back when navigation history exists", () => {
    mockRouter.canGoBack.mockReturnValue(true);
    const { getByText } = render(<PrivacyPolicyScreen />);

    fireEvent.press(getByText("← 戻る"));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("falls back to home when opened directly", () => {
    mockRouter.canGoBack.mockReturnValue(false);
    const { getByText } = render(<PrivacyPolicyScreen />);

    fireEvent.press(getByText("← 戻る"));

    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });
});
