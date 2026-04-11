import React from "react";
import { Platform, Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { SurfaceCard } from "../SurfaceCard";
import * as designSystem from "../../../design-system";

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style as Record<string, unknown>;
}

function getRootStyle(root: ReturnType<typeof render>): Record<string, unknown> {
  // SurfaceCard が描画する一番外側の View を取得
  const rootView = root.UNSAFE_getAllByType(View).find((v) => v.props.style);
  return flattenStyle(rootView?.props.style);
}

describe("SurfaceCard", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
    jest.restoreAllMocks();
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

    it("documentPanel をレンダリングできる", () => {
      const { getByText } = render(
        <SurfaceCard variant="documentPanel">
          <Text>document</Text>
        </SurfaceCard>
      );
      expect(getByText("document")).toBeTruthy();
    });
  });

  describe("platform shadow", () => {
    it("Platform.OS='web' + glassCard では boxShadow が style に含まれる", () => {
      (Platform as { OS: string }).OS = "web";
      const root = render(
        <SurfaceCard variant="glassCard">
          <Text>web shadow</Text>
        </SurfaceCard>
      );
      const style = getRootStyle(root);
      expect(style).toHaveProperty("boxShadow");
    });

    it("Platform.OS='ios' + glassCard では shadowColor 等が style に含まれる", () => {
      (Platform as { OS: string }).OS = "ios";
      const root = render(
        <SurfaceCard variant="glassCard">
          <Text>ios shadow</Text>
        </SurfaceCard>
      );
      const style = getRootStyle(root);
      expect(style).toHaveProperty("shadowColor");
      expect(style).not.toHaveProperty("boxShadow");
    });

    it("documentPanel variant は shadow を持たない (web でも boxShadow なし)", () => {
      (Platform as { OS: string }).OS = "web";
      const root = render(
        <SurfaceCard variant="documentPanel">
          <Text>no shadow</Text>
        </SurfaceCard>
      );
      const style = getRootStyle(root);
      expect(style).not.toHaveProperty("boxShadow");
      expect(style).not.toHaveProperty("shadowColor");
    });

    it("Platform.OS='web' で rawShadow フィールドが未定義でも `?? 0` fallback が効く", () => {
      (Platform as { OS: string }).OS = "web";
      const originalGetToken = designSystem.getToken;
      jest.spyOn(designSystem, "getToken").mockImplementation((layer, path) => {
        if (layer === "primitive" && path === "elevation.card") {
          return {};
        }
        return originalGetToken(layer, path);
      });

      const root = render(
        <SurfaceCard variant="paperCard">
          <Text>fallback</Text>
        </SurfaceCard>
      );
      const style = getRootStyle(root);
      expect(style.boxShadow).toBe("0px 0px 0px rgba(0, 0, 0, 0)");
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
