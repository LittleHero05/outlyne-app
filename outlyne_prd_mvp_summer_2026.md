# Outlyne — Product Requirements Document (PRD)

_Last updated: May 2026 — aligned with Figma draft and founder MVP decisions._

## Vision

Outlyne is a minimalist web app that generates aesthetic, shareable overlay cards for lifestyle activities such as reading, lifting, habits, and nutrition.

The product sits in the space between:

- quantified self
- creator tools
- social sharing
- lifestyle identity
- minimalist performance design

The core idea:

> Turn personal progress into beautiful social content.

The first version is intentionally simple.

Users manually input their activity data and instantly generate shareable overlay graphics designed for Instagram Stories or carousel posts.

The goal of the MVP is not advanced tracking. The goal is:

- delight
- speed
- aesthetics
- shareability
- consistency
- finishing and shipping

---

# MVP Build Phases

Development order is fixed for momentum and design quality.

## Phase A — Landing (first)

Ship a responsive marketing landing page that looks polished on **desktop web** and **mobile web** before building the generator.

### Landing requirements

- Match [Figma — Landing Page](https://www.figma.com/design/CsYsFgy7Sk71X51GvXlNV5/OutLyne?node-id=3-3) as visual source of truth
- **Hero (final copy):** “Running overlays, but for everything else” + subhead from Figma
- **Showcase section:** three example cards — **one per activity** (e.g. Reading, Workout, Habit), not three duplicates of the same card
- **How it works:** three steps + activity-select visual (per Figma)
- **Email capture section:** dedicated block to collect emails for launch / marketing (see Auth & Email)
- **CTA:** “Get Started Now” / “Start” → links to `/generate` (can 404 or “coming soon” until Phase B)
- **Footer:** minimal only (see Landing Footer)
- Meet **accessibility** baseline (see Accessibility)

## Phase B — Generate flow (second)

Build the end-to-end card generator after landing is approved.

- Match [Figma — Phone Flow](https://www.figma.com/design/CsYsFgy7Sk71X51GvXlNV5/OutLyne?node-id=125-165)
- Mobile-first UX; usable on desktop
- All **4 activity types** with distinct forms and card layouts
- Customize step + preview + download

---

# Product Positioning

## NOT

- a fitness tracker
- a dashboard app
- a social network
- an analytics-heavy platform
- an AI-first product

## YES

- a visual social-output engine
- a creator-friendly utility
- a lightweight lifestyle design tool
- a personal progress storytelling tool

---

# Product Name

# Outlyne

## Brand Keywords

- minimalist
- intentional
- progress
- performance
- lifestyle
- editorial
- clean
- creator-oriented

---

# MVP Scope

## Core Product Statement

Users input lifestyle/activity data, lightly customize outline color and export format, and download a high-quality overlay graphic optimized for Instagram sharing.

## Visual source of truth

**Figma is canonical** for UI layout, color, typography scale, spacing, and component styling.

- [Landing (web)](https://www.figma.com/design/CsYsFgy7Sk71X51GvXlNV5/OutLyne?node-id=3-3)
- [App flow (phone)](https://www.figma.com/design/CsYsFgy7Sk71X51GvXlNV5/OutLyne?node-id=125-165)

When PRD and Figma conflict, **follow Figma** unless explicitly noted here.

## Out of scope for MVP

- User accounts / sign-in
- Saved cards or history
- Social features
- Integrations (Strava, Goodreads, etc.)
- Native mobile app

---

# MVP Success Criteria

By the end of the MVP:

- landing page is responsive and polished on mobile + desktop
- users can generate cards in under 60 seconds
- cards feel polished and aesthetic
- exports are high quality (including transparent overlay when no photo uploaded)
- app works smoothly on mobile web
- **all 4 activity categories** work end-to-end
- email capture on landing stores signups reliably
- product is publicly usable on chosen domain
- creator (founder) uses it consistently in own content

---

# MVP Categories

Exactly **four** activity tiles on the select screen (2×2 grid on phone; layout adapts on wider screens).

| Tile label | Internal key |
|------------|----------------|
| Reading    | `reading`      |
| Workout    | `workout`      |
| Habit      | `habit`        |
| Recipe     | `recipe`       |

Activity icons: **placeholder** (shared brand mark) until founder supplies per-activity vector icons.

---

## 1. Reading

### Inputs (match Figma)

- Title (book title)
- Pages read
- Time (reading duration)
- Rating (optional)
- Upload image (optional) — background photo for card

### Not in MVP form (deferred)

- author
- session date

### Calculated stats

- reading pace (pages/hour) — computed from pages + time

### Visual elements

- activity icon (outline, color from customize step)
- stat overlay on photo **or** transparent Strava-style overlay
- minimalist typography per Figma Activity Card component

---

## 2. Gym / Workout

### Inputs

- workout type/split
- muscles hit
- sets completed
- workout duration
- calories burned (optional)
- PR achieved? (toggle)
- upload image (optional)

### Visual elements

- workout icon (custom SVG when provided)
- bold performance typography
- subtle metric hierarchy

---

## 3. Habits / Streaks

### Inputs

- habit name
- streak duration (days)
- completion status
- optional metric: minutes | steps | repetitions | sessions
- upload image (optional)

### Visual elements

- habit/streak icon (custom SVG when provided)
- minimalist streak emphasis

---

## 4. Recipe / Nutrition

### Inputs

- recipe title
- calories
- protein
- fiber
- optional carbs/fats
- upload image (optional)

### Visual elements

- nutrition/plate icon (custom SVG when provided)
- nutrition hierarchy

---

# Card background & export behavior

## With uploaded image

- User photo fills the card frame (per Figma examples)
- White stat text + outline icon overlay on top

## Without uploaded image (Strava-style)

- Export overlay **without photo background** — transparent PNG (and SVG where applicable)
- User composites onto any photo in Instagram / camera roll
- Stats + outline icon + typography only

This is a core MVP behavior, not a nice-to-have.

---

# Initial User Flow

## Step 1 — Choose activity type

Four tiles: Reading, Workout, Habit, Recipe.

## Step 2 — Input data

Mobile-friendly form per activity. Target: **30–45 seconds**.

Reading form fields: Title, Pages read, Time, Rating (optional), Upload image (optional).

## Step 3 — Customize (in MVP)

Minimal, fast controls:

### Outline color

- **6 preset colors** as radio-style **colored buttons**
- Selection updates live preview: outline color on icon, card borders, and accent strokes
- Preset hex values TBD in Figma tokens (implement as CSS variables)

### Export aspect ratio

- Instagram Story — **1080 × 1920** (primary)
- Carousel portrait — **1080 × 1350** (secondary)

No template marketplace. No drag-and-drop.

## Step 4 — Preview + download

- Preview screen per Figma Overlay Screen
- Primary action: **Download** (single button for MVP)
- Back control to edit inputs
- No separate “export success” screen required for MVP if download + preview feel complete

### Export formats (implementation)

- Generate via HTML component → raster/SVG pipeline (`html-to-image` or similar)
- **User-facing MVP:** Download only (no share sheet / copy link yet)
- Under the hood: prefer crisp output; PNG with alpha for transparent overlays; SVG where practical for future

---

# Design Direction

## Philosophy

Minimalist performance aesthetic — Strava-style overlays expanded across lifestyle activities.

**Figma palette (MVP):**

| Token            | Hex       | Usage                          |
|------------------|-----------|--------------------------------|
| Background blue  | `#b7d9ff` | Page / screen backgrounds      |
| Accent maroon    | `#6b2239` | Buttons, hero headline, icons  |
| Surface off-white| `#efefee` | Cards, inputs, hero panel      |
| Text primary     | `#110229` | Headings, nav                  |
| Text muted       | `#8f90a6` | Footer secondary               |

Avoid for MVP: gradients, glassmorphism, heavy visual clutter.

## Typography

- **Inter** — all UI and marketing (confirmed)
- Strong hierarchy; large stat numbers on overlay cards

## Layout

- Generous spacing, rounded corners per Figma
- Mobile-first generator; landing responsive across breakpoints

## Accessibility (required)

- WCAG **AA** contrast for text on `#b7d9ff`, `#efefee`, and `#6b2239` buttons (verify maroon/white button pairs)
- Visible focus states on links, buttons, form fields, color radios
- Semantic HTML: landmarks, headings, labels tied to inputs
- Alt text for meaningful images; decorative assets `alt=""`
- Touch targets ≥ 44×44px on mobile
- Respect `prefers-reduced-motion` for any Framer Motion usage
- Keyboard-operable nav and form flow

---

# Activity icons (founder-supplied)

## Practice

Designing **custom vector icons** per activity is good practice for Outlyne:

- Consistent brand silhouette language
- Crisp at any export size
- Distinct recognition in a 2×2 grid
- Full control vs generic icon packs

Ship with **one placeholder icon** for all four tiles until final assets are ready.

## Format for recolorable outlines

Provide icons in **SVG** with:

1. **`currentColor`** on strokes/fills that should change with the 6-color picker, **or**
2. Strokes with no hardcoded fill — e.g. `stroke="currentColor"` and `fill="none"` for outline style

**Do not** embed fixed hex colors inside the SVG if the outline must tint.

**Recommended export settings:**

- Single icon per file: `reading.svg`, `workout.svg`, `habit.svg`, `recipe.svg`
- `viewBox="0 0 24 24"` (or 32×32 — stay consistent across set)
- Clean paths; avoid raster embedded images
- Optional: unified stroke width (e.g. 1.5–2px at 24px)

**Avoid for tinting:** PNG/JPG icons, multi-color baked SVGs, Figma-exported SVGs with inline `#6b2239` on every path (harder to theme).

**In app:** Import as React components (`@svgr/webpack` or inline SVG) and set `color` / `className` from selected outline token.

---

# Landing page spec

## Sections (in order)

1. Header — logo, Overview / How it works / About anchors, **Start** CTA
2. Hero — final headline + subhead + logo mark
3. **Showcase** — “All achievements deserve to be shared” + **3 cards, 3 activities**
4. **How it works** — steps 01–03 + visual
5. **Email signup** — headline, short value prop, email field, submit (new section; style consistent with Figma)
6. CTA — Get Started Now
7. **Minimal footer**

## Landing footer (minimal)

- Outlyne logo / wordmark
- Optional: 1–2 social links (founder handles)
- © current year
- No multi-column “Features / Partners / Pricing” template links
- No Lorem ipsum

## Email capture (marketing)

- Collect email + consent-friendly copy (e.g. “Get notified when we launch new templates”)
- Store for marketing; **does not gate** the generator in MVP
- Implementation: Supabase `waitlist` table or lightweight API + email provider (setup in Phase A/B)

---

# Auth & email strategy (MVP)

## Decisions

| Topic              | MVP choice                                      |
|--------------------|-------------------------------------------------|
| Sign-in / accounts | **No** — fully usable without login             |
| Saved cards        | **No**                                          |
| Marketing email    | **Yes** — landing signup only                   |
| Email to generate  | **No** — do not require email to use the tool   |

## Rationale

Email-on-landing + no auth is the right MVP tradeoff: lower friction, faster ship, list building for launch. Add Supabase Auth in Phase 2 when saved cards, presets, or paid tiers need identity.

## Supabase (phased)

- **Not required for Phase A** if waitlist uses a simple API route + table later
- **Phase A or B:** create Supabase project; `waitlist` table (`email`, `created_at`, optional `source`)
- **Defer:** Auth, RLS for user data, card storage

Founder will be walked through Supabase + Vercel setup before production deploy.

---

# Export requirements

## Aspect ratios

- Story: 1080 × 1920 (default)
- Carousel: 1080 × 1350

## MVP user action

- **Download** only

## Technical

- HTML/React card component → export pipeline
- Transparent background when no user image
- Full-bleed card when user image provided

---

# Technical stack

## Framework

Next.js (App Router)

## Styling

- Tailwind CSS
- shadcn/ui
- Framer Motion (sparingly; honor reduced motion)

## Data (MVP)

- Supabase: **waitlist emails only** initially
- Next.js Route Handlers or Server Actions for waitlist POST

## Hosting

- Vercel (project to be created)
- Custom domain: **outlyneapp.com** (registrar: Cloudflare; connect to Vercel at deploy)

## Export generation

- `html-to-image` and/or similar
- DOM-based card preview = source of truth for export pixels

---

# Suggested folder structure

```txt
/app
  /(marketing)          # landing
  /generate             # Phase B
  /api
    /waitlist           # email signup
/components
  /cards
  /forms
  /ui
  /icons                # SVG activity icons
/lib
  /export
/styles
/types
```

---

# MVP features checklist

## Phase A — Landing

- [ ] Responsive landing (mobile + desktop)
- [ ] Figma-aligned hero, showcase (3 activities), how it works
- [ ] Email capture section + API persistence
- [ ] Minimal footer
- [ ] Accessibility pass (contrast, focus, semantics)

## Phase B — Generator

- [ ] Activity select (4 tiles)
- [ ] Per-activity forms
- [ ] Customize: 6 outline colors + aspect ratio
- [ ] Preview + Download
- [ ] Transparent export without image; photo card with image
- [ ] Placeholder icons → swap when founder assets ready

## Explicitly not in MVP

- Sign-in / OAuth
- Saved cards / history
- Social feed, comments, following
- AI, auto-imports, analytics dashboards
- Native app, push notifications
- Animation exports
- Template marketplace

---

# Future roadmap (post-MVP)

## Phase 2

- Supabase Auth
- Saved cards, presets, creator profiles

## Phase 3

- Integrations (Strava, Garmin, Goodreads, Apple Health)

## Phase 4

- Animated story exports

## Phase 5

- Freemium: watermark / premium templates / custom branding

---

# Figma design status

| Screen              | Status        | Notes                                      |
|---------------------|---------------|--------------------------------------------|
| Landing page        | Draft         | Showcase → 3 distinct activities at launch |
| Activity select     | Draft         | 4 tiles, not 6                             |
| Input (Reading)     | Draft         | Canonical for reading                      |
| Other activity forms| To design     | Before / during Phase B                    |
| Overlay / preview   | Draft         | Download + back                            |
| Customize step      | To design     | 6 color radios + ratio                     |
| Email section       | To design     | Add to landing file                        |

---

# Founder operating principles

## 1. Finish over expand

Never add a major feature before the current phase ships.

## 2. Aesthetic quality > backend complexity

## 3. Use your own product constantly

## 4. Ship before perfect

---

# Final product goal

Outlyne should feel like:

> Strava overlays expanded into a minimalist lifestyle identity system.

Not loud. Not gamified. Not productivity-bro.

Clean. Intentional. Personal. Shareable. Aesthetic. Useful.
