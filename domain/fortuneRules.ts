/**
 * 今日の日付を YYYY-MM-DD 形式で返す。
 *
 * この値は「1 日 1 回制限」の判定基準として使用される。
 * デバイスのローカルタイムゾーンに依存する設計である点に注意:
 * タイムゾーン変更・国境越えユーザーの挙動、将来 UTC 切替する場合の方針は
 * `docs/guides/TIMEZONE_POLICY.md` を参照。
 */
export function getTodayString(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

/**
 * 既に今日引いたかどうかを判定する。
 *
 * 判定は「最後に引いた日付の文字列が今日の日付文字列と一致する」だけで行う。
 * 日付生成をインジェクションできるので、境界値テストが容易。
 */
export function canDrawToday(
  lastDrawDate: string | null,
  today: string = getTodayString()
): boolean {
  if (lastDrawDate == null) return true;
  return lastDrawDate !== today;
}
