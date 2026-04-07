# Agent Learnings

Non-obvious, reusable knowledge gained during development sessions.
This file is the persistent memory for AI coding agents working on this repository.

## Rules

- **Write** only non-obvious, reusable insights (not temporary logs or task notes).
- **Never** include secrets, credentials, personal information, or ephemeral status.
- **Format** each entry with: Context, Problem, Solution, Example (optional), References (optional).
- **Review** before adding: if the answer is obvious from code or docs, don't add it here.
- **Update or remove** entries that become stale (e.g., after dependency upgrades).
- **Keep it concise**: each entry should be scannable in under 30 seconds.

---

## Entries

### 1. Reanimated v4 Jest Setup — Mock Order Matters

- **Context**: Jest unit tests with Moti / Reanimated v4 animations on Node.js
- **Problem**: `WorkletsError: Native part doesn't seem initialized` when running tests
- **Solution**: `react-native-worklets` must be mocked **before** `require("react-native-reanimated").setUpTests()` is called. The order in `jest.setup.js` is critical — reversing it causes the error.
- **Example**:

  ```javascript
  // jest.setup.js — correct order
  jest.mock("react-native-worklets", () => ({ /* mock */ }));
  require("react-native-reanimated").setUpTests(); // AFTER worklets mock
  ```

- **References**: [AGENTS.md section 10](./AGENTS.md), [jest.setup.js](./jest.setup.js)

### 2. pnpm + Expo — transformIgnorePatterns Require .pnpm

- **Context**: Jest test configuration with pnpm as package manager
- **Problem**: `SyntaxError: Cannot use import statement outside a module` for Expo/RN packages
- **Solution**: pnpm uses a `.pnpm` flat directory structure. `transformIgnorePatterns` must include `.pnpm` in the negative lookahead, otherwise Jest skips transformation of symlinked packages.
- **Example**:

  ```javascript
  // jest.config.js
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm|react-native|@react-native|expo|@expo|moti|react-native-reanimated|react-native-css-interop|react-native-worklets|react-native-worklets-core))"
  ],
  ```

- **References**: [jest.config.js](./jest.config.js)

### 3. React 19 — Separate act() Blocks for Sequential State Updates

- **Context**: Testing hooks that perform multiple async state updates (e.g., reset then draw)
- **Problem**: Wrapping two sequential state updates in a single `act()` causes flaky tests or missed updates in React 19
- **Solution**: Split each state update into its own `act()` block, then use `waitFor()` to assert the final state. React 19 batches updates differently, and a single `act()` may not flush intermediate states.
- **Example**:

  ```typescript
  // Separate act() blocks
  await act(async () => { await result.current.debugResetDailyLimit(); });
  await act(async () => { await result.current.drawFortune(); });
  await waitFor(() => { expect(result.current.fortune).not.toBeNull(); });
  ```

- **References**: [AGENTS.md section 10](./AGENTS.md)
