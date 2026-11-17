# Outlyne

Shareable overlay cards for reading, workouts, habits and recipes.

## Layout

```
apps/
  web/        Next.js site and web generator (deployed to Vercel)
packages/
  core/       UI-free types, design tokens, muscle groups and formatters
              shared by the web app and the upcoming Expo app
docs/
  expo-plan.md
```

npm workspaces. One lockfile at the root.

## Develop

```bash
npm install
npm run dev        # Next dev server for apps/web on http://localhost:3000
npm run build
npm run lint
npm run typecheck  # every workspace
```

Environment variables for the web app live in `apps/web/.env.local`
(see `apps/web/.env.example`).

## Deploying

The Vercel project's **Root Directory** must be `apps/web`. Vercel installs
from the repo root so the `@outlyne/core` workspace link resolves.
