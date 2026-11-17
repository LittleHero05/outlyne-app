import { ICONS } from "@/lib/assets";
import type { ActivityDraft } from "@outlyne/core";

/**
 * Sample drafts rendered with the real card components, so the landing
 * shows exactly what the generator produces.
 */
export const SHOWCASE_DRAFTS: ActivityDraft[] = [
  {
    activity: "reading",
    details: {
      title: "The Hunger Games",
      pagesRead: "101",
      time: "1hr 03min",
      rating: "4.5",
      imagePreviewUrl: null,
    },
  },
  {
    activity: "workout",
    details: {
      title: "Push Day",
      sets: "24",
      muscles: ["chest", "shoulders", "triceps"],
      imagePreviewUrl: null,
    },
  },
  {
    activity: "habit",
    details: {
      title: "Morning walk",
      days: "14",
      mode: "minutes",
      minutes: "32",
      imagePreviewUrl: null,
    },
  },
];

export const HOW_IT_WORKS_STEPS = [
  { id: "choose", number: "01", title: "Choose your activity" },
  { id: "input", number: "02", title: "Input activity details" },
  { id: "generate", number: "03", title: "Generate your overlay" },
  { id: "share", number: "04", title: "Share with everyone" },
] as const;

export type HowItWorksStepId = (typeof HOW_IT_WORKS_STEPS)[number]["id"];

export const ACTIVITY_TILES = [
  { label: "Reading", iconSrc: ICONS.reading },
  { label: "Workout", iconSrc: ICONS.workout },
  { label: "Habit", iconSrc: ICONS.habit },
  { label: "Recipe", iconSrc: ICONS.recipe },
] as const;
