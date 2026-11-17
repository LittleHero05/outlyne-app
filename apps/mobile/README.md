# @outlyne/mobile

Expo app for Outlyne. Routes live in `src/app` (Expo Router). Shared types,
tokens and formatters come from `@outlyne/core`.

```bash
npm install            # from the repo root
cd apps/mobile
npx expo start --ios   # Expo Go in the iOS Simulator
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Adding or upgrading native packages

Use `npx expo install <pkg>` (or `npx expo install --fix`) from this folder so
versions match the Expo SDK. In this npm workspace that can leave an older copy
hoisted at the repo root, which `expo-doctor` reports as a duplicate. When that
happens, reinstall cleanly from the repo root:

```bash
rm -rf package-lock.json node_modules apps/*/node_modules packages/*/node_modules
npm install
```

The root `package.json` pins `react-native` through `overrides` so the web app
never pulls a second copy.
