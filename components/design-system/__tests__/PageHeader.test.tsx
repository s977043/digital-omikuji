import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { PageHeader } from "../PageHeader";

describe("PageHeader", () => {
  it("experience tone でタイトルと補助アクションを表示する", () => {
    const { getByText } = render(
      <PageHeader
        title="新春デジタルおみくじ"
        subtitle="静かに引き、丁寧に受け取るための一枚"
        tone="experience"
        leadingAction={<Text>LEFT</Text>}
        trailingAction={<Text>RIGHT</Text>}
      />
    );

    expect(getByText("新春デジタルおみくじ")).toBeTruthy();
    expect(getByText("静かに引き、丁寧に受け取るための一枚")).toBeTruthy();
    expect(getByText("LEFT")).toBeTruthy();
    expect(getByText("RIGHT")).toBeTruthy();
  });

  it("document tone でもタイトルを表示する", () => {
    const { getByText } = render(<PageHeader title="プライバシーポリシー" tone="document" />);
    expect(getByText("プライバシーポリシー")).toBeTruthy();
  });
});
