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

## Accounts and saved cards (Supabase)

1. Copy `.env.example` to `.env.local` and fill in the project URL and the
   publishable (anon) key from Supabase → Project Settings → API.
2. Run `supabase/migrations/20261117000000_saved_cards.sql` once in the
   Supabase dashboard (SQL Editor → New query → Run). It creates the `cards`
   table, row level security so users only see their own cards, and the
   20-card free limit.
3. Make sign-in emails carry a code: Authentication → Emails → Magic Link
   template, and add `{{ .Token }}` (for example `Your Outlyne code: {{ .Token }}`).

Sign-in uses a one-time email code (6 to 10 digits, per the Supabase OTP length setting), which works in Expo Go. Sign in with Apple
needs an Apple Developer account and a development build, and comes later.
