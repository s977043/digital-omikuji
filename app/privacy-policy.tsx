import React from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { navigateBackOrReplace } from "../utils/navigation";
import { DocumentScreenTemplate } from "../components/templates/DocumentScreenTemplate";
import { PageHeader } from "../components/design-system/PageHeader";
import { Button } from "../components/design-system/Button";
import { DocumentSection } from "../components/design-system/DocumentSection";
import { getStringToken } from "../design-system";

export default function PrivacyPolicyScreen() {
  const footerColor = getStringToken("semantic.text.documentMuted");
  const header = (
    <PageHeader
      title="プライバシーポリシー"
      subtitle="本アプリにおける情報の扱いをまとめています"
      tone="document"
      actionPlacement="stacked"
      leadingAction={
        <Button label="← 戻る" onPress={() => navigateBackOrReplace(router)} variant="textLink" />
      }
    />
  );

  return (
    <DocumentScreenTemplate
      header={header}
      footer={
        <Text style={{ color: footerColor, textAlign: "center", fontSize: 13 }}>
          Copyright 2025 Digital Omikuji. All rights reserved.
        </Text>
      }
    >
      <DocumentSection title="はじめに">
        「デジタルおみくじ」（以下「本アプリ」）をご利用いただきありがとうございます。本プライバシーポリシーは、本アプリにおける個人情報の取り扱いについて説明するものです。
      </DocumentSection>

      <DocumentSection title="運営者情報">
        本アプリは個人開発者（s977043）により運営されています。
      </DocumentSection>

      <DocumentSection title="収集する情報">
        <DocumentSection title="1. デバイスセンサー情報" subtle>
          本アプリは、おみくじを引く動作を検出するために、お使いのデバイスの加速度センサーにアクセスします。センサーデータは一時的にのみ使用され、保存・送信されることはありません。
        </DocumentSection>
        <DocumentSection title="2. ローカルストレージ" subtle>
          おみくじ履歴（運勢、メッセージ、日時）をお使いのデバイス内にのみ保存します。アプリ内の「全削除」機能またはアンインストールにより削除できます。
        </DocumentSection>
        <DocumentSection title="3. ハプティックフィードバック" subtle>
          おみくじを引く際の触覚フィードバックのためにデバイスの振動機能を使用します。データ収集はありません。
        </DocumentSection>
        <DocumentSection title="4. 音声再生" subtle>
          効果音を再生するためにオーディオ機能を使用します。アプリ内のミュートボタンで音声をオフにできます。
        </DocumentSection>
      </DocumentSection>

      <DocumentSection title="収集しない情報">
        本アプリは以下の情報を収集しません。個人を特定できる情報、位置情報、カメラやマイクからのデータ、連絡先情報、使用状況の分析データ、広告識別子。
      </DocumentSection>

      <DocumentSection title="外部サービスへのデータ送信">
        本アプリは、基本的に外部サーバーへのデータ送信を行いません。シェア機能使用時は OS
        の標準シェア機能を使用し、シェア先のプライバシーポリシーが適用されます。
      </DocumentSection>

      <DocumentSection title="第三者へのデータ提供">
        本アプリは、収集したデータを第三者に販売、貸与、または提供することはありません。
      </DocumentSection>

      <DocumentSection title="免責事項">
        本アプリは娯楽（エンターテインメント）として提供されています。表示される運勢やメッセージはランダムに生成されたもので、実際の占い・鑑定・予言ではありません。医療・法律・投資等の専門的判断の根拠として使用しないでください。
      </DocumentSection>

      <DocumentSection title="お問い合わせ">
        本プライバシーポリシーに関するご質問は、GitHub リポジトリの Issue を通じてご連絡ください。
      </DocumentSection>
    </DocumentScreenTemplate>
  );
}
