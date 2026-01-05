---
applyTo: '**/*.{tsx,ts}'
---

# React Native / Expo instructions

- Use NativeWind v4 `className` props for styling (not inline styles)
- Use Moti (`<MotiView />`) for animations
- Use `expo-sensors` (Accelerometer) for shake gesture
- Use `expo-haptics` for tactile feedback
- Use functional components with Hooks
- Prefer TypeScript types over implicit `any`
- Use `async/await` for asynchronous operations
- Implement `try/catch` with user feedback for errors
- Keep functions small and testable
- When changing behavior:
  - Update/extend tests
  - Keep backward compatibility unless explicitly requested
