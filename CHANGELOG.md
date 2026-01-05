# Changelog

All notable changes to this project will be documented in this file.

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
