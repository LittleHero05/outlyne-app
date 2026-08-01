import { ICONS } from "@/lib/assets";
import type { ActivityType } from "@/types";

export type ActivityDefinition = {
  id: ActivityType;
  label: string;
  iconSrc: string;
};

export const ACTIVITIES: ActivityDefinition[] = [
  { id: "reading", label: "Reading", iconSrc: ICONS.reading },
  { id: "workout", label: "Workout", iconSrc: ICONS.workout },
  { id: "habit", label: "Habit", iconSrc: ICONS.habit },
  { id: "recipe", label: "Recipe", iconSrc: ICONS.recipe },
];

export function getActivity(id: ActivityType): ActivityDefinition {
  const activity = ACTIVITIES.find((item) => item.id === id);
  if (!activity) {
    throw new Error(`Unknown activity: ${id}`);
  }
  return activity;
}
