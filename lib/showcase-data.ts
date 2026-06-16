import { ICONS } from "@/lib/assets";

export type ShowcaseStat = {
  label: string;
  value: string;
};

export type ShowcaseCardData = {
  id: string;
  activity: string;
  iconSrc: string;
  headlineLabel: string;
  headline: string;
  stats: [ShowcaseStat, ShowcaseStat];
  footerLabel: string;
  footerValue: string;
};

export const SHOWCASE_CARDS: ShowcaseCardData[] = [
  {
    id: "reading",
    activity: "Reading",
    iconSrc: ICONS.reading,
    headlineLabel: "Book title",
    headline: "The Hunger Games",
    stats: [
      { label: "Pages", value: "101" },
      { label: "Time", value: "1hr 03min" },
    ],
    footerLabel: "Pace",
    footerValue: "96 pgs/hr",
  },
  {
    id: "workout",
    activity: "Workout",
    iconSrc: ICONS.workout,
    headlineLabel: "Split",
    headline: "Push Day",
    stats: [
      { label: "Sets", value: "24" },
      { label: "Duration", value: "58 min" },
    ],
    footerLabel: "PR",
    footerValue: "Bench +10 lbs",
  },
  {
    id: "habit",
    activity: "Habit",
    iconSrc: ICONS.habit,
    headlineLabel: "Habit",
    headline: "Morning walk",
    stats: [
      { label: "Streak", value: "14 days" },
      { label: "Today", value: "Done" },
    ],
    footerLabel: "Minutes",
    footerValue: "32 min",
  },
];

export const HOW_IT_WORKS_STEPS = [
  { number: "01", title: "Choose your activity" },
  { number: "02", title: "Input activity details" },
  { number: "03", title: "Generate your overlay" },
] as const;

export const ACTIVITY_TILES = [
  { label: "Reading", iconSrc: ICONS.reading },
  { label: "Workout", iconSrc: ICONS.workout },
  { label: "Habit", iconSrc: ICONS.habit },
  { label: "Recipe", iconSrc: ICONS.recipe },
] as const;
