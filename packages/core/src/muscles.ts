export type MuscleGroupId =
  | "chest"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "core"
  | "back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves";

export type MuscleGroup = {
  id: MuscleGroupId;
  label: string;
};

/** Order matters: this is the chip order in the Workout form. */
export const MUSCLE_GROUPS: MuscleGroup[] = [
  { id: "chest", label: "Chest" },
  { id: "shoulders", label: "Shoulders" },
  { id: "back", label: "Back" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "forearms", label: "Forearms" },
  { id: "core", label: "Core" },
  { id: "glutes", label: "Glutes" },
  { id: "quads", label: "Quads" },
  { id: "hamstrings", label: "Hamstrings" },
  { id: "calves", label: "Calves" },
];

export function getMuscleLabel(id: MuscleGroupId): string {
  return MUSCLE_GROUPS.find((group) => group.id === id)?.label ?? id;
}

export function formatMuscleList(ids: MuscleGroupId[]): string {
  return MUSCLE_GROUPS.filter((group) => ids.includes(group.id))
    .map((group) => group.label)
    .join(" · ");
}
