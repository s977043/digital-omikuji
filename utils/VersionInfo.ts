/**
 * バージョン情報を取得するユーティリティ
 * デプロイバージョン、ビルド時刻などを提供
 */

import Constants from "expo-constants";

export interface VersionInfo {
  packageVersion: string;
  buildTime: string;
  commitHash?: string;
  environment: "development" | "production" | "unknown";
}

export const getVersionInfo = (): VersionInfo => {
  // expo-constants から app.json のバージョンを動的に取得
  const packageVersion = Constants.expoConfig?.version ?? "unknown";

  // ビルド時刻（開発環境の場合は現在時刻）
  const isDevelopment = process.env.NODE_ENV === "development";
  const buildTime = isDevelopment
    ? new Date().toISOString()
    : process.env.BUILD_TIME || "BUILD_TIME_NOT_SET";

  // コミットハッシュ（環境変数から取得可能）
  const commitHash = process.env.COMMIT_HASH || undefined;

  // 環境判定
  const environment = isDevelopment ? "development" : "production";

  return {
    packageVersion,
    buildTime,
    commitHash,
    environment,
  };
};

/**
 * バージョン情報をコンソールに出力
 * 開発者ツールで確認可能（目立たない場所に表示）
 */
export const logVersionInfo = (): void => {
  const version = getVersionInfo();

  const versionString = [
    `🚀 Digital Omikuji v${version.packageVersion}`,
    `📅 Build: ${new Date(version.buildTime).toLocaleString("ja-JP")}`,
    version.commitHash ? `📍 Commit: ${version.commitHash.substring(0, 8)}` : "",
    `🌍 Env: ${version.environment}`,
  ]
    .filter(Boolean)
    .join(" | ");

  console.log("%c" + versionString, "color: #4CAF50; font-weight: bold; font-size: 12px;");
};

/**
 * バージョン情報を取得して返す（フッター表示用）
 */
export const getVersionDisplay = (): string => {
  const version = getVersionInfo();
  return `v${version.packageVersion}`;
};
