import { FortuneLevel } from "../types/omikuji";
import { ImageSourcePropType } from "react-native";

// Placeholder image for now
const PLACEHOLDER_IMAGE = require("../assets/omikuji_cylinder.png");

export interface OmikujiMasterData {
  level: FortuneLevel;
  messages: string[];
  weight: number;
  image: ImageSourcePropType;
  color: string;
  details: {
    label: string;
    text: string;
  }[];
}

export const ACQUIRED_FORTUNES: OmikujiMasterData[] = [
  {
    level: "daikichi",
    weight: 5,
    image: PLACEHOLDER_IMAGE,
    color: "#FFD700", // Gold
    messages: [
      "最高の運気です。新しいことに挑戦するチャンス！",
      "願望は叶います。迷わず進みましょう。",
      "待ち人来ます。素敵な出会いが期待できそう。",
      "金運上昇中。思わぬ臨時収入があるかも。",
      "健康運良好。エネルギッシュに活動できます。"
    ],
    details: [
      { label: "願望", text: "思うがままに叶うでしょう。" },
      { label: "待人", text: "音信あり。すぐに来ます。" },
      { label: "失物", text: "出ます。高い所を探してみて。" },
      { label: "商売", text: "利益あり。進んで吉。" },
      { label: "学問", text: "安心して勉学に励みなさい。" }
    ]
  },
  {
    level: "chukichi",
    weight: 15,
    image: PLACEHOLDER_IMAGE,
    color: "#FF8C00", // DarkOrange
    messages: [
      "運気は上昇気流に乗っています。",
      "努力が実を結ぶ時期です。",
      "旅行運が良いです。少し遠出してみては？",
      "商売繁盛の兆しあり。",
      "学問に励むと良い結果が出ます。"
    ],
    details: [
      { label: "願望", text: "叶いますが、油断は禁物。" },
      { label: "待人", text: "来ます。楽しみに待ちましょう。" },
      { label: "失物", text: "見つかりにくいですが、出ます。" },
      { label: "商売", text: "利益ありますが、使いすぎに注意。" },
      { label: "学問", text: "努力すれば結果はついてきます。" }
    ]
  },
  {
    level: "shokichi",
    weight: 20,
    image: PLACEHOLDER_IMAGE,
    color: "#32CD32", // LimeGreen
    messages: [
      "ささやかな幸せが訪れます。",
      "焦らずコツコツと積み重ねることが大切。",
      "友人との会話にツキがあります。",
      "失せ物が見つかるかもしれません。",
      "体調管理に気をつければ順調です。"
    ],
    details: [
      { label: "願望", text: "小さな願いなら叶うでしょう。" },
      { label: "待人", text: "来るでしょう。連絡を待て。" },
      { label: "失物", text: "家のどこかにあります。" },
      { label: "商売", text: "焦らず、誠実に取り組めば吉。" },
      { label: "学問", text: "基礎を固める時期です。" }
    ]
  },
  {
    level: "kichi",
    weight: 25,
    image: PLACEHOLDER_IMAGE,
    color: "#4169E1", // RoyalBlue
    messages: [
      "平穏な一日が過ごせそうです。",
      "現状維持が吉となります。",
      "困ったときは周囲に相談しましょう。",
      "適度な運動が運気を高めます。",
      "感謝の気持ちを忘れないように。"
    ],
    details: [
      { label: "願望", text: "叶うまで時間がかかります。" },
      { label: "待人", text: "遅れますが、来ます。" },
      { label: "失物", text: "外にあるかもしれません。" },
      { label: "商売", text: "現状維持を心がけて。" },
      { label: "学問", text: "日々の積み重ねが大事です。" }
    ]
  },
  {
    level: "suekichi",
    weight: 20,
    image: PLACEHOLDER_IMAGE,
    color: "#9370DB", // MediumPurple
    messages: [
      "今は耐える時。やがて運が開けます。",
      "急がば回れ。慎重な行動を心がけて。",
      "古い友人に連絡を取ると良いことが。",
      "部屋の掃除をして気分転換を。",
      "小さな親切が幸運を呼びます。"
    ],
    details: [
      { label: "願望", text: "今は叶いにくいです。" },
      { label: "待人", text: "来るのは遅くなるでしょう。" },
      { label: "失物", text: "出にくいです。" },
      { label: "商売", text: "今は利益を追わない方が吉。" },
      { label: "学問", text: "今は我慢の時。後で開花します。" }
    ]
  },
  {
    level: "kyo",
    weight: 10,
    image: PLACEHOLDER_IMAGE,
    color: "#808080", // Gray
    messages: [
      "無理は禁物。今は静観しましょう。",
      "言葉遣いに注意が必要です。",
      "忘れ物に気をつけて。",
      "予期せぬ出費があるかも。財布の紐は固く。",
      "疲れが溜まりやすいです。早めの休息を。"
    ],
    details: [
      { label: "願望", text: "今は叶いません。" },
      { label: "待人", text: "来ません。" },
      { label: "失物", text: "出ません。" },
      { label: "商売", text: "損をしないように注意。" },
      { label: "学問", text: "スランプ気味。気分転換を。" }
    ]
  },
  {
    level: "daikyo",
    weight: 5,
    image: PLACEHOLDER_IMAGE,
    color: "#2F4F4F", // DarkSlateGray
    messages: [
      "嵐の前の静けさ。用心深く行動を。",
      "自己主張は控えめに。聞き役に徹して。",
      "健康第一。無理なスケジュールは見直して。",
      "信頼関係を大切に。誤解を招かないように。",
      "夜明け前が一番暗い。必ず朝は来ます。"
    ],
    details: [
      { label: "願望", text: "諦めた方が良いかもしれません。" },
      { label: "待人", text: "来ません。期待しないこと。" },
      { label: "失物", text: "絶対に出ません。" },
      { label: "商売", text: "赤字覚悟。耐え忍ぶ時。" },
      { label: "学問", text: "再出発のつもりで基礎から。" }
    ]
  },
];
