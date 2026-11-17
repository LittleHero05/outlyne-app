# Outlyne — Expo / App Store plan

_Drafted 2026-11-16. Decisions confirmed with founder: keep the Next.js site for
marketing and web generator; build a separate Expo app that shares types and
logic; "same design, native rendering" is acceptable; the native app needs
sign-up and saved cards from day one._

## 1. Shape of the project

Turn this repo into a small monorepo so the two apps share one source of truth
for data shapes and formatting, without sharing UI code.

```
outlyne/
  apps/
    web/        ← this Next.js app, moved as-is
    mobile/     ← new Expo app (Expo Router, TypeScript)
  packages/
    core/       ← shared, UI-free code
  package.json  ← npm workspaces
```

`packages/core` holds what already exists in `lib/` and `types/` with no DOM
dependency:

| Today                          | Moves to `packages/core`                |
|--------------------------------|-----------------------------------------|
| `types/index.ts`               | `src/types.ts` (ActivityDraft and co.)  |
| `lib/muscles.ts`               | `src/muscles.ts`                        |
| `lib/customize.ts`             | `src/customize.ts` (outline colors)     |
| `lib/constants.ts`             | `src/constants.ts` (brand tokens)       |
| `readingPace`, `formatRating`, `formatStreak`, `formatMinutes`, `formatServings` | `src/format.ts` |

Everything that touches the DOM (`html-to-image`, object URLs, the cards and
forms) stays in `apps/web`. The Expo app rebuilds the same screens with native
primitives, reading from `@outlyne/core`.

## 2. Native rendering of the card

The web card is a DOM node captured by `html-to-image`. Native has no DOM, so:

- Build the card as a React Native `View` tree, styled with the same tokens.
- Capture it with `react-native-view-shot` at 1080×1920 with a transparent
  background. This is the same "component is the source of pixels" idea as web.
- The body map and activity icons become `react-native-svg` components. The
  muscle region coordinates in `components/generate/body-map.tsx` port one to
  one, since they are plain SVG shapes.
- Convert the four activity icons in `public/icons/` to `currentColor` SVG
  components once, and use the same files on web (replaces the CSS mask trick).
- Photo background: `expo-image-picker` for the photo, rendered as an `Image`
  under the stats inside the captured view.
- Share: `expo-sharing` opens the system share sheet with the PNG, which is the
  native equivalent of today's `navigator.share` path. Also offer "Save to
  Photos" through `expo-media-library`.

## 3. Accounts and saved cards

Supabase is already in the project for the waitlist, so extend it rather than
adding a second backend.

- **Auth:** Supabase Auth with email magic link plus Sign in with Apple
  (required by App Store review when any third-party login is offered; it is
  the easiest native login anyway). Use `@supabase/supabase-js` with
  `expo-secure-store` for session persistence.
- **Schema:**

  ```sql
  create table cards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    activity text not null,            -- reading | workout | habit | recipe
    details jsonb not null,            -- the ActivityDraft.details object
    outline_color text not null,
    photo_path text,                   -- Supabase Storage path, nullable
    created_at timestamptz default now()
  );
  alter table cards enable row level security;
  create policy "own cards" on cards for all using (auth.uid() = user_id);
  ```

- **Storage:** bucket `card-photos`, private, RLS by `user_id` prefix. Store
  the user's photo, not the rendered PNG, so cards can be re-rendered with a new
  outline color later.
- **Limits:** keep a free cap (for example 20 saved cards) enforced by a Postgres
  policy or trigger, so a paid tier is a one-line change later.
- The web app can stay account-free for now. When it gains accounts, it reads
  the same table.

## 4. Screens in the Expo app

Mirror the four-step web flow with Expo Router:

```
app/
  (auth)/sign-in.tsx
  (tabs)/
    index.tsx          ← Activity select (2×2 grid)
    cards.tsx          ← Saved cards grid, tap to re-open
    profile.tsx
  generate/
    [activity].tsx     ← form
    customize.tsx
    preview.tsx        ← render, save, share
```

Keep the form state in a small store (Zustand or React context) keyed by
`ActivityDraft`, exactly as `GenerateFlow` does on web.

## 5. Build and release

- Managed Expo workflow with EAS Build and EAS Submit. No custom native code is
  required by anything above.
- Set up `eas.json` with `development`, `preview` (internal TestFlight) and
  `production` profiles.
- App Store needs: Apple Developer account, bundle id (suggest
  `com.outlyne.app`), privacy policy URL on outlyneapp.com, App Privacy answers
  (email, photos used on-device, no tracking), and screenshots for 6.7" and
  6.1" iPhones. The generator itself makes good screenshot content.
- Review risk is low: it is a utility, no in-app purchase yet, no user-generated
  public content.

## 6. Order of work

1. ~~Monorepo move and `packages/core` extraction~~ Done 2026-11-16. The
   Vercel project's Root Directory must be set to `apps/web`.
2. ~~Expo app scaffold with Expo Router, theme tokens, activity select, and
   all four forms reading from `@outlyne/core`~~ Done 2026-11-16 in
   `apps/mobile` (SDK 58, Expo Router in `src/app`, Expo Go for dev).
3. ~~Native card plus view-shot export and share sheet~~ Done 2026-11-17 for
   all four activities. Verified in the iPhone 17 Pro simulator: Save to Photos
   writes a 1080×1920 PNG with a fully transparent background, and Share opens
   the iOS share sheet. Known gap: the shared file has a random name because
   view-shot ignores `fileName` on iOS; copy it to a named file before sharing
   if that matters.
4. Supabase Auth with Apple sign-in and the `cards` table. Save after export.
5. ~~Icons and Workout body map in `react-native-svg`~~ Done 2026-11-17. Icon
   and body-map shapes now live in `@outlyne/core` as plain data (`shapes.ts`,
   `body-map.ts`); web and mobile both draw from it. The web activity icons
   still use the PNG-mask approach and can move to the shared data next.
6. Saved cards screen, profile, TestFlight, then App Store submission.

## 7. Open decisions

- Whether the web generator should require an account at the same time, or
  stay free and anonymous until the native app has shipped.
- Free-tier card limit and whether a paid tier is in scope for launch.
- Icon redraw: the current SVGs have a baked-in maroon stroke. Converting them
  to `currentColor` is a small task that unblocks native tinting.
