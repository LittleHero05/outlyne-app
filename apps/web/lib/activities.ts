import type { ActivityType } from "@outlyne/core";

export type ActivityDefinition = {
  id: ActivityType;
  label: string;
};

export const ACTIVITIES: ActivityDefinition[] = [
  { id: "reading", label: "Reading" },
  { id: "workout", label: "Workout" },
  { id: "habit", label: "Habit" },
  { id: "recipe", label: "Recipe" },
];

export function getActivity(id: ActivityType): ActivityDefinition {
  const activity = ACTIVITIES.find((item) => item.id === id);
  if (!activity) {
    throw new Error(`Unknown activity: ${id}`);
  }
  return activity;
}
