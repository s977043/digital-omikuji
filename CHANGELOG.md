# Changelog

All notable changes to this project will be documented in this file.

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
