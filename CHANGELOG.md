# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-05

### Added

- **Drawing Overlay**: 抽選中の「儀式の間」演出を追加。振る→結果の間にアニメーション遷移を挿入。
- **Scroll UI Result**: 結果画面を巻物風UIに刷新。シェアで詳細コンテンツが解放されるゲート機能を実装。
- **Daily Limit**: 1日1回制限を導入。同日に再度アプリを開くと「本日の結果」を即座に表示。
- **History List Component**: 履歴画面をコンポーネント化し、UIを整理。
- **Design Guidelines**: `docs/design_guidelines.md` にデザイン指針（配色・フォント・アニメーション）を整備。

### Changed

- **Share Text Template**: Xシェア文言をテンプレート化。ハッシュタグ・UTMパラメータを自動付与。
- **README**: ドキュメントへのリンクを追加（Design Guidelines, Phase 1 Roadmap）。

### Fixed

- 履歴画面テストのi18nキー参照エラーを修正。
- Markdown lint エラー（trailing spaces, blank lines）を修正。

## [1.0.0] - 2026-01-04

### Added
- **i18n Support**: Introduced internationalization support using `i18next`. Currently supports Japanese (ja) and English (en) UI text.
- **Enhanced Animations**: Added custom shake animations, result reveal effects, and haptic feedback (using `expo-haptics`).
- **History Feature**: Added a history screen to view past omikuji results.
- **Privacy Policy**: Added an in-app privacy policy screen.
- **Version Display**: Added version number display in the app.

### Changed
- **UI/UX**: Refined the main screen with a shrine-themed background and improved typography (Shippori Mincho).
- **Code Quality**: Integrated ESLint and Prettier for code consistency. Improved test coverage to >80%.
- **Performance**: Optimized asset loading and animation performance using `moti` and `react-native-reanimated`.

### Fixed
- Fixed memory leaks in sensor subscription.
- Resolved various linting errors and type safety issues.

## [0.1.0] - Initial Beta
- Basic omikuji functionality.
- Device sensor (accelerometer) integration for shake detection.
