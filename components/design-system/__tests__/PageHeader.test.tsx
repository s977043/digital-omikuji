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

  it("subtitle が未指定の場合は表示されない", () => {
    const { queryByText } = render(<PageHeader title="タイトルのみ" />);
    expect(queryByText(/サブタイトル/)).toBeNull();
  });

  describe("actionPlacement", () => {
    it("stacked レイアウトで leadingAction と trailingAction を表示する", () => {
      const { getByText } = render(
        <PageHeader
          title="運勢手帳"
          subtitle="これまで授かった運勢"
          actionPlacement="stacked"
          leadingAction={<Text>戻る</Text>}
          trailingAction={<Text>全削除</Text>}
        />
      );

      expect(getByText("運勢手帳")).toBeTruthy();
      expect(getByText("これまで授かった運勢")).toBeTruthy();
      expect(getByText("戻る")).toBeTruthy();
      expect(getByText("全削除")).toBeTruthy();
    });

    it("stacked レイアウトでアクションが無い場合もレンダリング可能", () => {
      const { getByText } = render(<PageHeader title="スタック単体" actionPlacement="stacked" />);
      expect(getByText("スタック単体")).toBeTruthy();
    });

    it("inline レイアウトで leadingAction のみ指定", () => {
      const { getByText, queryByText } = render(
        <PageHeader title="inline 単独" leadingAction={<Text>LEFT</Text>} />
      );
      expect(getByText("inline 単独")).toBeTruthy();
      expect(getByText("LEFT")).toBeTruthy();
      expect(queryByText("RIGHT")).toBeNull();
    });
  });

  describe("tone", () => {
    it("experience tone の場合は ritual font を使用する (デフォルト)", () => {
      const { getByText } = render(<PageHeader title="experience 既定" subtitle="副題" />);
      expect(getByText("experience 既定")).toBeTruthy();
      expect(getByText("副題")).toBeTruthy();
    });

    it("document tone の場合は title / subtitle ともに文書色を使用する", () => {
      const { getByText } = render(
        <PageHeader title="document tone" subtitle="文書の副題" tone="document" />
      );
      expect(getByText("document tone")).toBeTruthy();
      expect(getByText("文書の副題")).toBeTruthy();
    });
  });
});
