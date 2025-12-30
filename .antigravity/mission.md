# Mission: Autonomous Migration & Development of "2026 Omikuji App"

## 1. Meta-Instruction (Behavior Protocol)

You are the **Lead Mobile Engineer & DevOps Specialist**.
Your goal is to migrate the current repository (`s977043/digital-omikuji`) from Remix to **React Native (Expo)** and build the "2026 New Year Omikuji" app.
Execute the roadmap below **sequentially and autonomously**.

**Protocol:**

1.  **Chain of Thought:** Briefly state your plan before each phase.
2.  **Self-Correction:** If a command fails (e.g., Docker build), analyze, fix, and retry up to 3 times.
3.  **No Interruption:** Proceed through **Phase 1 -> Phase 2 -> Phase 3 -> Phase 4** automatically.

---

## 2. Execution Roadmap

### Phase 1: Migration & Infrastructure (The Foundation)

- **Legacy Archiving:**
  1.  Create a folder `_legacy_remix_2025`.
  2.  Move **ALL** current files/folders (except `.git`) into it.
  3.  Create a `README.md` inside it: "Archived Remix version."
- **Project Initialization:**
  1.  Initialize a new Expo project in root (`.`) using **TypeScript** and **Expo Router**.
  2.  Install **NativeWind** (Tailwind CSS) and `expo-sensors`.
- **Docker Environment:**
  1.  Create `Dockerfile` (Node 20, install `eas-cli` & `git`).
  2.  Create `compose.yaml`:
      - Service: `app`
      - Ports: `8081:8081`
      - Volumes: `.:/app` AND anonymous volume `/app/node_modules` (Crucial!).
      - Env: `CHOKIDAR_USEPOLLING=true`, `APP_VARIANT=development`.

### Phase 2: Core Logic (The Brain)

- **Weighted Algorithm:**
  1.  Create `constants/OmikujiData.ts`: Define results with `weight` (Dai-kichi: 5, Kyo: 1, etc.) and 2026 messages.
  2.  Create `hooks/useOmikujiLogic.ts`: Implement weighted random selection.
  3.  **Constraint:** Separate logic from UI for testability.

### Phase 3: UX & Animation (The Experience)

- **State Machine:** Implement flow: `IDLE` -> `SHAKING` -> `REVEALING` -> `RESULT`.
- **UI Implementation (Moti):**
  1.  **Top Screen:** Show "Shake to Draw".
  2.  **Reveal Animation:** An Omikuji stick slides UP from the bottom (common for all results).
  3.  **Result Screen:**
      - **Dai-kichi (大吉):** Spring animation ("Boing" effect) + Golden gradient background.
      - **Others:** Standard fade-in.
- **Debug Feature:** Add a visible **"Shake (Debug)" button** on screen (only if `APP_VARIANT=development`) to simulate shaking without physical device movement.

### Phase 4: Configuration & Delivery (The Polish)

- **EAS Config:**
  1.  Create `app.config.ts`: Switch `bundleIdentifier` and `name` based on `process.env.APP_VARIANT`.
- **Documentation:**
  1.  Update root `README.md`: Explain how to start with `docker compose up` and how to connect via Expo Go (Tunnel).

---

## 3. Technical Constraints

- **Stack:** Expo SDK (Latest), TypeScript, NativeWind, Moti.
- **Style:** Clean Architecture.
- **Security:** No hardcoded secrets.

## 4. START EXECUTION

**Acknowledge this plan and immediately BEGIN PHASE 1.**
