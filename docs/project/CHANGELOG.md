# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-04-11

### Added

- **娯楽免責の明示**: ホーム画面フッター・プライバシーポリシー・ストア説明文に「本アプリは娯楽目的」の注記を追加（#181）
- **エラーハンドリング基盤**: `AppError` 型と `useErrorHandler` フックを新規導入。Sentry 連携とクロスプラットフォーム通知（Android Toast / iOS Alert / Web alert）を統一（#323）
- **データモデル拡張性**: `BaseFortune` / `FortuneType` ディスクリミナントユニオンを導入し、将来の占い種別追加（タロット等）に備えた型基盤を整備（#322）
- **E2E キャッシュ**: Expo Prebuild / Gradle / iOS Derived Data キャッシュを CI に追加。ビルド時間を大幅短縮（#147）

### Changed

- **状態管理の一元化**: `app/index.tsx` に散在していた AppState 遷移ロジックを `useAppStateMachine` カスタムフックに集約。211行 → 123行（#318）
- **design-system の責務整理**: `HistoryItemCard` / `PaperResultCard` から `getFortuneText` / `buildShareText` の直接依存を削除。pattern 層で business logic を集約するよう変更（#321）
- **コード品質改善**: 日付フォーマット重複の統合、`triggerHaptic()` への統一、未使用コード削除、トークン参照の整備
- **ストア文言**: 「本格的な占いアプリ」→「デジタルエンタメアプリ」へ表現を刷新（#181）
- **テストカバレッジ**: 75.75% → 82.2% に向上（目標 80% 達成）（#31）

### Fixed

- **Web クラッシュ**: React Native 0.84+ で Web 非サポートとなった `findNodeHandle` を除去。オーバーレイ表示時のクラッシュを解消（#309）
- **CI パイプライン復旧**: `ACCESS_TOKEN` シークレット未設定により全ワークフローが失敗していた `usage-guard` ジョブを削除。ラベル制御 + タイムアウトで安全性を確保（#147）
- **react-dom バージョン不一致**: 19.2.3 → 19.2.4 に統一し、Web ビルド時の React error #527 を解消
- **パッチの hunk ヘッダー**: `expo-modules-core@3.0.29.patch` の行数ズレを修正し `pnpm install` の失敗を解消

### Internal

- **テスト 21 suites / 115 tests all passed**（+51件の新規テスト）
- **Closed Issues**: #31, #147, #181, #309, #318, #321, #322, #323（8件）

## [1.1.0] - 2026-01-09

### Added

- **Digital Ritual Enrichment**: Enhanced haptic patterns during omikuji shaking for more realistic feedback.
- **Accessibility Improvements**: Added accessibility labels and hints to primary UI elements (Draw button, History, Mute).

### Changed

- **Sentry Trace Accuracy**: Updated app versioning to 1.1.0 to correctly sync with Sentry releases.

### Fixed

- Fixed a bug where the application version was hardcoded to 1.0.0 in `app.config.ts`, overriding the configuration in `app.json`.

## [1.0.0] - 2026-01-05

### Added

- **i18n Support**: Introduced internationalization support using `i18next`. Currently supports Japanese (ja) and English (en) UI text.
- **Enhanced Animations**: Added custom shake animations, result reveal effects, and haptic feedback (using `expo-haptics`).
- **History Feature**: Added a history screen to view past omikuji results.
- **Privacy Policy**: Added an in-app privacy policy screen.
- **Version Display**: Added version number display in the app.
- **AI Agent Config Optimization**: Single source pattern for all agent configs (Claude, Codex, Copilot, Gemini, Antigravity)
- **Claude Code Enhancements**: Extended permissions, PostToolUse hooks for auto-formatting, custom commands (`/check`, `/pr`)
- **Codex Configuration**: New `.codex/config.toml` and `.codex/AGENTS.md` with kickoff prompt
- **React Native Instructions**: `.github/instructions/react-native.instructions.md` for Copilot

### Changed

- **UI/UX**: Refined the main screen with a shrine-themed background and improved typography (Shippori Mincho).
- **Code Quality**: Integrated ESLint and Prettier for code consistency. Improved test coverage to 90%+.
- **Performance**: Optimized asset loading and animation performance using `moti` and `react-native-reanimated`.
- **Documentation**: Unified agent documentation with AGENTS.md as single source of truth

### Fixed

- Fixed memory leaks in sensor subscription.
- Resolved various linting errors and type safety issues.
- **PNG Format**: Converted omikuji_cylinder.png from JPEG to proper PNG format
- **Expo Localization**: Updated expo-localization to v16 with proper plugin configuration

## [0.1.0] - Initial Beta

- Basic omikuji functionality.
- Device sensor (accelerometer) integration for shake detection.
