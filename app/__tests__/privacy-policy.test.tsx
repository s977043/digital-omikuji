import React from "react";
import { render } from "@testing-library/react-native";
import PrivacyPolicyScreen from "../privacy-policy";

// Mocks
jest.mock("expo-router", () => ({
    Link: "Link",
    Stack: { Screen: () => null },
    router: { back: jest.fn() },
}));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock version display
jest.mock("../components/VersionDisplay", () => ({
    VersionDisplay: () => null,
}));

describe("PrivacyPolicyScreen", () => {
    it("renders correctly", () => {
        const { getByText } = render(<PrivacyPolicyScreen />);
        expect(getByText("プライバシーポリシー")).toBeTruthy();
    });
});
