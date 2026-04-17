import type { ImageSourcePropType } from "react-native";
import { OmikujiResult, isFortuneLevel } from "../types/omikuji";

/**
 * レガシー履歴データ（type フィールドがない古いデータ）を
 * 新しい BaseFortune 形式にマイグレートする。
 *
 * 壊れた / 未知形式のペイロードは `null` を返し、呼び出し元で除外される。
 * 各フィールドを型ガードで検証してから明示的に OmikujiResult を組み立てる。
 */
export function migrateLegacyEntry(raw: unknown): OmikujiResult | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  // type は存在する場合のみ "omikuji" を許可（将来の占い種別は未対応）
  if (r.type !== undefined && r.type !== "omikuji") return null;

  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (!isFortuneLevel(r.level)) return null;
  if (typeof r.messageIndex !== "number" || !Number.isFinite(r.messageIndex)) return null;
  if (typeof r.color !== "string") return null;
  if (typeof r.createdAt !== "number" || !Number.isFinite(r.createdAt)) return null;
  if (r.image == null) return null;

  return {
    id: r.id,
    type: "omikuji",
    level: r.level,
    messageIndex: r.messageIndex,
    // ImageSourcePropType は number | { uri: string } | array 等の union。
    // 構造的検証は non-null のみ（各形式は RN 側 Image コンポーネントが扱う）
    image: r.image as ImageSourcePropType,
    color: r.color,
    createdAt: r.createdAt,
  };
}
