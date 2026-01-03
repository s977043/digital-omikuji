# GitHub Copilot Instructions for Digital Omikuji

You are an expert React Native, Expo, and TypeScript developer.
You are assisting with the "Digital Omikuji" application (2026 New Year Fortune Teller).
Please follow the canonical rules in `AGENTS.md`; this file highlights Copilot-specific context.

## 🚀 Project Context

- **Framework**: Expo SDK 52 (Managed Workflow)
- **Routing**: Expo Router v4 (File-based routing in `app/`)
- **Styling**: NativeWind v4 (Tailwind CSS)
  - Use `className` props on standard React Native components.
- **Animation**: Moti (powered by Reanimated)
  - Use `<MotiView />` for animations.
- **Language**: TypeScript (Strict Mode)

## 🛠 Feature specific context

- **Sensors**: Uses `expo-sensors` (Accelerometer) for the shake gesture.
- **Haptics**: Uses `expo-haptics` for tactile feedback.
- **Sharing**: Uses `react-native-view-shot` to capture and share images.
- **Assets**: Sounds and images are in `assets/`.

## 📝 Coding Guidelines

1. **Functional Components**: Use React Functional Components with Hooks.
2. **Type Safety**: Avoid `any`. Define interfaces for props and state.
3. **Async/Await**: Use `async/await` for asynchronous operations.
4. **Error Handling**: Implement `try/catch` and user feedback for errors.
5. **No Barrel Files**: Do not use `index.ts` to export everything from a directory (unless necessary for a specific pattern).

## 🤖 Agent Integration

For workflows, PR rules, and commands (pnpm), always refer to the root `AGENTS.md`.
Use this document only as a quick Copilot-facing reminder of the stack and style.

## ⛔ PROHIBITED ACTIONS

- **DO NOT** read or modify `node_modules/` or `**/*.lock` (pnpm-lock.yaml).
- **DO NOT** access `.env*`, `secrets/`, or any credentials.
- **DO NOT** commit directly to `main` or `develop`.
