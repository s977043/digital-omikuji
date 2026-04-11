import React from "react";
import { Platform, Text } from "react-native";
import { render } from "@testing-library/react-native";
import { SurfaceCard } from "../SurfaceCard";

describe("SurfaceCard", () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = "ios";
  });

  it("renders children", () => {
    const { getByText } = render(
      <SurfaceCard>
        <Text>子コンテンツ</Text>
      </SurfaceCard>
    );
    expect(getByText("子コンテンツ")).toBeTruthy();
  });

  describe("variants", () => {
    it("glassCard (default) をレンダリングできる", () => {
      const { getByText } = render(
        <SurfaceCard>
          <Text>glass</Text>
        </SurfaceCard>
      );
      expect(getByText("glass")).toBeTruthy();
    });

    it("paperCard をレンダリングできる", () => {
      const { getByText } = render(
        <SurfaceCard variant="paperCard">
          <Text>paper</Text>
        </SurfaceCard>
      );
      expect(getByText("paper")).toBeTruthy();
    });

    it("documentPanel をレンダリングできる (shadow なし)", () => {
      const { getByText } = render(
        <SurfaceCard variant="documentPanel">
          <Text>document</Text>
        </SurfaceCard>
      );
      expect(getByText("document")).toBeTruthy();
    });
  });

  describe("platform shadow", () => {
    it("Platform.OS='web' で boxShadow に変換される", () => {
      (Platform as { OS: string }).OS = "web";
      const { getByText } = render(
        <SurfaceCard variant="paperCard">
          <Text>web shadow</Text>
        </SurfaceCard>
      );
      expect(getByText("web shadow")).toBeTruthy();
    });

    it("Platform.OS='ios' では raw shadow スタイルを使う", () => {
      (Platform as { OS: string }).OS = "ios";
      const { getByText } = render(
        <SurfaceCard variant="glassCard">
          <Text>ios shadow</Text>
        </SurfaceCard>
      );
      expect(getByText("ios shadow")).toBeTruthy();
    });

    it("documentPanel variant は shadow を持たない", () => {
      (Platform as { OS: string }).OS = "web";
      const { getByText } = render(
        <SurfaceCard variant="documentPanel">
          <Text>no shadow</Text>
        </SurfaceCard>
      );
      expect(getByText("no shadow")).toBeTruthy();
    });
  });

  it("追加 style を受け入れる", () => {
    const { getByText } = render(
      <SurfaceCard style={{ margin: 10 }}>
        <Text>スタイル追加</Text>
      </SurfaceCard>
    );
    expect(getByText("スタイル追加")).toBeTruthy();
  });
});
