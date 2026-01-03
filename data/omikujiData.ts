import { FortuneLevel } from '../types/omikuji';
import { ImageSourcePropType } from 'react-native';

// Placeholder image for now
const PLACEHOLDER_IMAGE = require('../assets/omikuji_cylinder.png');

export interface OmikujiMasterData {
  level: FortuneLevel;
  messages: string[];
  weight: number;
  image: ImageSourcePropType;
  color: string;
}

export const ACQUIRED_FORTUNES: OmikujiMasterData[] = [
  {
    level: 'daikichi',
    weight: 5,
    image: PLACEHOLDER_IMAGE,
    color: '#FFD700', // Gold
    messages: [
      "最高の運気です。新しいことに挑戦するチャンス！",
      "願望は叶います。迷わず進みましょう。",
      "待ち人来ます。素敵な出会いが期待できそう。",
      "金運上昇中。思わぬ臨時収入があるかも。",
      "健康運良好。エネルギッシュに活動できます。"
    ]
  },
  {
    level: 'chukichi',
    weight: 15,
    image: PLACEHOLDER_IMAGE,
    color: '#FF8C00', // DarkOrange
    messages: [
      "運気は上昇気流に乗っています。",
      "努力が実を結ぶ時期です。",
      "旅行運が良いです。少し遠出してみては？",
      "商売繁盛の兆しあり。",
      "学問に励むと良い結果が出ます。"
    ]
  },
  {
    level: 'shokichi',
    weight: 20,
    image: PLACEHOLDER_IMAGE,
    color: '#32CD32', // LimeGreen
    messages: [
      "ささやかな幸せが訪れます。",
      "焦らずコツコツと積み重ねることが大切。",
      "友人との会話にツキがあります。",
      "失せ物が見つかるかもしれません。",
      "体調管理に気をつければ順調です。"
    ]
  },
  {
    level: 'kichi',
    weight: 25,
    image: PLACEHOLDER_IMAGE,
    color: '#4169E1', // RoyalBlue
    messages: [
      "平穏な一日が過ごせそうです。",
      "現状維持が吉となります。",
      "困ったときは周囲に相談しましょう。",
      "適度な運動が運気を高めます。",
      "感謝の気持ちを忘れないように。"
    ]
  },
  {
    level: 'suekichi',
    weight: 20,
    image: PLACEHOLDER_IMAGE,
    color: '#9370DB', // MediumPurple
    messages: [
      "今は耐える時。やがて運が開けます。",
      "急がば回れ。慎重な行動を心がけて。",
      "古い友人に連絡を取ると良いことが。",
      "部屋の掃除をして気分転換を。",
      "小さな親切が幸運を呼びます。"
    ]
  },
  {
    level: 'kyo',
    weight: 10,
    image: PLACEHOLDER_IMAGE,
    color: '#808080', // Gray
    messages: [
      "無理は禁物。今は静観しましょう。",
      "言葉遣いに注意が必要です。",
      "忘れ物に気をつけて。",
      "予期せぬ出費があるかも。財布の紐は固く。",
      "疲れが溜まりやすいです。早めの休息を。"
    ]
  },
  {
    level: 'daikyo',
    weight: 5,
    image: PLACEHOLDER_IMAGE,
    color: '#2F4F4F', // DarkSlateGray
    messages: [
      "嵐の前の静けさ。用心深く行動を。",
      "自己主張は控えめに。聞き役に徹して。",
      "健康第一。無理なスケジュールは見直して。",
      "信頼関係を大切に。誤解を招かないように。",
      "夜明け前が一番暗い。必ず朝は来ます。"
    ]
  },
];
