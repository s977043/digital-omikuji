import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button", () => {
  it("renders label text", () => {
    const { getByText } = render(<Button label="テストラベル" onPress={jest.fn()} />);
    expect(getByText("テストラベル")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="押す" onPress={onPress} />);
    fireEvent.press(getByText("押す"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="無効" onPress={onPress} disabled />);
    fireEvent.press(getByText("無効"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders icon when provided", () => {
    const { getByText } = render(<Button label="アイコン付き" icon="📱" onPress={jest.fn()} />);
    expect(getByText("📱")).toBeTruthy();
  });

  describe("variants", () => {
    const variants = ["primaryRitual", "secondaryQuiet", "utilityWarm", "textLink"] as const;
    it.each(variants)("renders variant %s without crashing", (variant) => {
      const { getByText } = render(
        <Button label={`${variant} button`} variant={variant} onPress={jest.fn()} />
      );
      expect(getByText(`${variant} button`)).toBeTruthy();
    });
  });

  it("uses provided accessibilityLabel when given", () => {
    const { getByLabelText } = render(
      <Button label="表示" onPress={jest.fn()} accessibilityLabel="カスタムラベル" />
    );
    expect(getByLabelText("カスタムラベル")).toBeTruthy();
  });

  it("falls back to label for accessibilityLabel when not provided", () => {
    const { getByLabelText } = render(<Button label="フォールバック" onPress={jest.fn()} />);
    expect(getByLabelText("フォールバック")).toBeTruthy();
  });
});
