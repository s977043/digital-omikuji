import React from "react";
import { ScrollView, Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { ExperienceScreenTemplate } from "../templates/ExperienceScreenTemplate";

describe("ExperienceScreenTemplate", () => {
  it("disables background interaction while overlay is active", () => {
    const { UNSAFE_getAllByType, UNSAFE_getByType, getByText } = render(
      <ExperienceScreenTemplate
        topBar={<Text>header</Text>}
        overlay={<Text>overlay</Text>}
        overlayLabel="儀式モーダル"
      >
        <Text>body</Text>
      </ExperienceScreenTemplate>
    );

    const scrollView = UNSAFE_getByType(ScrollView);
    const topBar = UNSAFE_getAllByType(View).find(
      (view) => view.props.testID === "experience-topbar"
    );

    expect(scrollView.props.scrollEnabled).toBe(false);
    expect(scrollView.props.pointerEvents).toBe("none");
    expect(scrollView.props.accessibilityElementsHidden).toBe(true);
    expect(scrollView.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(topBar).toBeTruthy();
    expect(topBar?.props.pointerEvents).toBe("none");
    expect(topBar?.props.accessibilityElementsHidden).toBe(true);
    expect(topBar?.props.importantForAccessibility).toBe("no-hide-descendants");
    const overlayView = UNSAFE_getAllByType(View).find(
      (view) => view.props.accessibilityLabel === "儀式モーダル"
    );
    expect(overlayView).toBeTruthy();
    expect(getByText("overlay")).toBeTruthy();
  });

  it("keeps background interaction enabled without overlay", () => {
    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <ExperienceScreenTemplate topBar={<Text>header</Text>}>
        <Text>body</Text>
      </ExperienceScreenTemplate>
    );

    const scrollView = UNSAFE_getByType(ScrollView);
    const topBar = UNSAFE_getAllByType(View).find(
      (view) => view.props.testID === "experience-topbar"
    );

    expect(scrollView.props.scrollEnabled).toBe(true);
    expect(scrollView.props.pointerEvents).toBe("auto");
    expect(scrollView.props.accessibilityElementsHidden).toBe(false);
    expect(scrollView.props.importantForAccessibility).toBe("auto");
    expect(topBar).toBeTruthy();
    expect(topBar?.props.pointerEvents).toBe("auto");
    expect(topBar?.props.accessibilityElementsHidden).toBe(false);
    expect(topBar?.props.importantForAccessibility).toBe("auto");
  });

  it("renders children content", () => {
    const { getByText } = render(
      <ExperienceScreenTemplate topBar={<Text>header</Text>}>
        <Text>本文コンテンツ</Text>
      </ExperienceScreenTemplate>
    );
    expect(getByText("本文コンテンツ")).toBeTruthy();
  });

  it("renders footer when provided", () => {
    const { getByText } = render(
      <ExperienceScreenTemplate topBar={<Text>header</Text>} footer={<Text>フッター内容</Text>}>
        <Text>body</Text>
      </ExperienceScreenTemplate>
    );
    expect(getByText("フッター内容")).toBeTruthy();
  });

  it("renders bottomLeftAction and bottomRightAction", () => {
    const { getByText } = render(
      <ExperienceScreenTemplate
        topBar={<Text>header</Text>}
        bottomLeftAction={<Text>左アクション</Text>}
        bottomRightAction={<Text>右アクション</Text>}
      >
        <Text>body</Text>
      </ExperienceScreenTemplate>
    );
    expect(getByText("左アクション")).toBeTruthy();
    expect(getByText("右アクション")).toBeTruthy();
  });

  it("renders only bottomLeftAction without right one", () => {
    const { getByText, queryByText } = render(
      <ExperienceScreenTemplate topBar={<Text>header</Text>} bottomLeftAction={<Text>左のみ</Text>}>
        <Text>body</Text>
      </ExperienceScreenTemplate>
    );
    expect(getByText("左のみ")).toBeTruthy();
    expect(queryByText("右のみ")).toBeNull();
  });

  it("renders without topBar", () => {
    const { getByText } = render(
      <ExperienceScreenTemplate>
        <Text>topBarなし</Text>
      </ExperienceScreenTemplate>
    );
    expect(getByText("topBarなし")).toBeTruthy();
  });
});
