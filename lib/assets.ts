/** Static asset paths under /public */
export const BRAND = {
  logoMark: "/brand/logo-mark.svg",
  wordmark: "/brand/wordmark.svg",
  ratingStar: "/brand/RatingStar.svg",
} as const;

export const ICONS = {
  reading: "/icons/reading.svg",
  workout: "/icons/workout.svg",
  habit: "/icons/habit.svg",
  recipe: "/icons/recipe.svg",
} as const;

/** Fallback when an activity icon is missing */
export const ICON_PLACEHOLDER = BRAND.logoMark;
