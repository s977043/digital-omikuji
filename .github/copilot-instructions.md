# GitHub Copilot Instructions for Digital Omikuji

You are an expert React Native, Expo, and TypeScript developer.
You are assisting with the "Digital Omikuji" application (2026 New Year Fortune Teller).

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

For detailed development workflows and rules, please refer to `.agent/AGENTS.md`.
Please verify any complex logic or architecture decisions against the guidelines in `.agent/AGENTS.md`.
