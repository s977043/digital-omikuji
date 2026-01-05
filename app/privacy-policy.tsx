import { ScrollView, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 max-w-3xl mx-auto">
        <Text className="text-3xl font-bold text-gray-900 mb-2">プライバシーポリシー</Text>
        <Text className="text-gray-500 mb-6">最終更新日: 2025年1月1日</Text>

        <Section title="はじめに">
          「デジタルおみくじ」（以下「本アプリ」）をご利用いただきありがとうございます。本プライバシーポリシーは、本アプリにおける個人情報の取り扱いについて説明するものです。
        </Section>

        <Section title="運営者情報">
          本アプリは個人開発者（s977043）により運営されています。
        </Section>

        <Section title="収集する情報">
          <SubSection title="1. デバイスセンサー情報">
            本アプリは、おみくじを引く動作を検出するために、お使いのデバイスの加速度センサーにアクセスします。センサーデータは一時的にのみ使用され、保存・送信されることはありません。
          </SubSection>
          <SubSection title="2. ローカルストレージ">
            おみくじ履歴（運勢、メッセージ、日時）をお使いのデバイス内にのみ保存します。アプリ内の「全削除」機能またはアンインストールにより削除できます。
          </SubSection>
          <SubSection title="3. ハプティックフィードバック">
            おみくじを引く際の触覚フィードバックのためにデバイスの振動機能を使用します。データ収集はありません。
          </SubSection>
          <SubSection title="4. 音声再生">
            効果音を再生するためにオーディオ機能を使用します。アプリ内のミュートボタンで音声をオフにできます。
          </SubSection>
        </Section>

        <Section title="収集しない情報">
          本アプリは以下の情報を収集しません：個人を特定できる情報、位置情報、カメラやマイクからのデータ、連絡先情報、使用状況の分析データ、広告識別子。
        </Section>

        <Section title="外部サービスへのデータ送信">
          本アプリは、基本的に外部サーバーへのデータ送信を行いません。シェア機能使用時はOSの標準シェア機能を使用し、シェア先のプライバシーポリシーが適用されます。
        </Section>

        <Section title="第三者へのデータ提供">
          本アプリは、収集したデータを第三者に販売、貸与、または提供することはありません。
        </Section>

        <Section title="お問い合わせ">
          本プライバシーポリシーに関するご質問は、GitHubリポジトリのIssueを通じてご連絡ください。
        </Section>

        <Text className="text-gray-400 text-center mt-8 text-sm">
          Copyright 2025 Digital Omikuji. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-2">{title}</Text>
      {typeof children === "string" ? (
        <Text className="text-gray-700 leading-6">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-3 ml-2">
      <Text className="text-lg font-semibold text-gray-700 mb-1">{title}</Text>
      <Text className="text-gray-600 leading-6">{children}</Text>
    </View>
  );
}
