export type OmikujiResult = '大吉' | '吉' | '中吉' | '小吉' | '凶';

export interface OmikujiFortune {
  result: OmikujiResult;
  message: string;
  weight: number; // 数値が大きいほど確率が高い
  color: string;
}

export const OMIKUJI_DATA: OmikujiFortune[] = [
  {
    result: '大吉',
    message: '2026年はあなたの黄金イヤー！夢が叶う最高の年になるでしょう。',
    weight: 10,
    color: '#FFD700', // 金色
  },
  {
    result: '吉',
    message: '良い運勢です。迷わず突き進めば道は開けます。',
    weight: 30,
    color: '#FF6347', // トマト色
  },
  {
    result: '中吉',
    message: '焦らず着実に。日々の積み重ねが大きな成果を生みます。',
    weight: 40,
    color: '#32CD32', // ライムグリーン
  },
  {
    result: '小吉',
    message: 'ささやかな幸せが訪れます。周りへの感謝を忘れずに。',
    weight: 30,
    color: '#87CEEB', // 空色
  },
  {
    result: '凶',
    message: '今は耐える時。慎重に行動すれば、災いは転じて福となります。',
    weight: 5,
    color: '#808080', // 灰色
  },
];
