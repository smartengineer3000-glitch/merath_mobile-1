# GitHub Copilot Workspace Instructions for Merath

## Purpose

These instructions help Copilot understand the Merath mobile codebase and produce useful, project-aligned suggestions.

## What this repository is

- A React Native + Expo mobile application built in TypeScript.
- Implements an Islamic inheritance calculator for the four Sunni madhabs.
- Uses React Navigation, React Context + hooks, and Expo features for export/sharing.
- Contains a large core calculation engine under `lib/inheritance/` and UI/screens under `components/` and `screens/`.

## Key files and directories

- `App.tsx` — application entry point.
- `package.json` — scripts, dependencies, and dev tooling.
- `app.config.ts` / `eas.json` — Expo and build configuration.
- `screens/` — top-level app screens.
- `components/` — reusable UI components and feature views.
- `lib/inheritance/` — core inheritance calculation engine and rule implementation.
- `lib/utils/` — validation, formatting, export, storage helpers.
- `__tests__/` — unit tests for calculations, components, hooks, and edge cases.
- `support documents/ARCHITECTURE.md` — architecture and design guidance.

## Recommended workflow for Copilot

- Prioritize changes in `lib/inheritance/` for calculation rules and domain logic.
- Keep UI updates localized to `components/` and `screens/`.
- Preserve existing app structure and naming conventions for hooks and context.
- When adding new tests, put them in `__tests__/` and follow existing file patterns.
- Prefer `npm run lint`, `npm run check`, and `npm test` to validate work.

## Build and test commands

Use these commands for development and validation:

- `npm install`
- `npm test` — run Vitest unit tests.
- `npm run lint` — run Expo/ESLint.
- `npm run check` — run TypeScript type-check only.
- `npm start` — start Expo development server.
- `npm run android` / `npm run ios` — launch platform-specific builds.

## Coding conventions

- TypeScript strict mode is expected. Avoid introducing `any`.
- Keep logic encapsulated in `lib/inheritance/` and use small helpers.
- Prefer declarative React + hooks for component behavior.
- Use English for code identifiers; UI may support Arabic and RTL features in text or assets.
- Match existing styles for component props and naming.
- When changing calculation behavior, add or update tests to cover the use case.

## What Copilot should avoid

- Do not modify `node_modules/`, `.expo/`, or generated build files.
- Do not change major Expo or React Native versions without full test coverage.
- Avoid large refactors unless the user explicitly asks for architecture or cleanup changes.
- Do not add new dependencies without user approval.
- Avoid breaking multilingual or RTL support when updating UI.

## Useful context for Pull Requests

- Keep PRs focused and small when possible.
- Mention the relevant madhab or inheritance rule when changing calculation code.
- Document any UI behavior changes in terms of user workflow.
- Confirm that added features maintain `237+` existing tests and run cleanly.

## Example prompts for this workspace

- `Help me add a new heir type to the inheritance calculator and update the calculation engine.`
- `Refactor `HeirSelector` to improve keyboard navigation and preserve current behavior.`
- `Write a Vitest test for the scenario where a father and siblings inherit together in the Hanafi madhab.`
- `Explain why `lib/inheritance/hijab-system.ts` exists and what rules it enforces.`

## Suggested next agent customization

Create a dedicated prompt or instruction for:

- `create-prompt inheritance-rule-update` — for safely proposing changes to the inheritance calculation logic.
- `create-prompt react-native-ui-fix` — for UI and layout changes in components and screens.
- `create-prompt test-suite-extension` — for adding new Vitest coverage around edge cases and calculation validation.
