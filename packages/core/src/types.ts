import type { OutlineColorId } from "./customize";
import type { MuscleGroupId } from "./muscles";

export type ActivityType = "reading" | "workout" | "habit" | "recipe";

export type GeneratorStep = "select" | "details" | "customize" | "preview";

type WithPhoto = {
  /** Object URL for an optional background photo */
  imagePreviewUrl: string | null;
};

export type ReadingDetails = WithPhoto & {
  title: string;
  pagesRead: string;
  time: string;
  rating: string;
};

export type WorkoutDetails = WithPhoto & {
  title: string;
  sets: string;
  muscles: MuscleGroupId[];
};

export type HabitMode = "complete" | "minutes";

export type HabitDetails = WithPhoto & {
  title: string;
  days: string;
  mode: HabitMode;
  minutes: string;
};

export type RecipeSource = "homemade" | "author";

export type RecipeDetails = WithPhoto & {
  title: string;
  /** Homemade, or credit a recipe author by name */
  source: RecipeSource;
  author: string;
  cookTime: string;
  servings: string;
  rating: string;
};

export type DetailsByActivity = {
  reading: ReadingDetails;
  workout: WorkoutDetails;
  habit: HabitDetails;
  recipe: RecipeDetails;
};

/** One in-progress card: which activity plus its form values. */
export type ActivityDraft = {
  [K in ActivityType]: { activity: K; details: DetailsByActivity[K] };
}[ActivityType];

export const EMPTY_READING_DETAILS: ReadingDetails = {
  title: "",
  pagesRead: "",
  time: "",
  rating: "",
  imagePreviewUrl: null,
};

export const EMPTY_WORKOUT_DETAILS: WorkoutDetails = {
  title: "",
  sets: "",
  muscles: [],
  imagePreviewUrl: null,
};

export const EMPTY_HABIT_DETAILS: HabitDetails = {
  title: "",
  days: "",
  mode: "complete",
  minutes: "",
  imagePreviewUrl: null,
};

export const EMPTY_RECIPE_DETAILS: RecipeDetails = {
  title: "",
  source: "homemade",
  author: "",
  cookTime: "",
  servings: "",
  rating: "",
  imagePreviewUrl: null,
};

export function createEmptyDraft(activity: ActivityType): ActivityDraft {
  switch (activity) {
    case "reading":
      return { activity, details: EMPTY_READING_DETAILS };
    case "workout":
      return { activity, details: EMPTY_WORKOUT_DETAILS };
    case "habit":
      return { activity, details: EMPTY_HABIT_DETAILS };
    case "recipe":
      return { activity, details: EMPTY_RECIPE_DETAILS };
  }
}

export type CustomizeOptions = {
  outlineColorId: OutlineColorId;
};
