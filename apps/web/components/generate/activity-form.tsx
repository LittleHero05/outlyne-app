"use client";

import { HabitForm } from "@/components/generate/habit-form";
import { ReadingForm } from "@/components/generate/reading-form";
import { RecipeForm } from "@/components/generate/recipe-form";
import { WorkoutForm } from "@/components/generate/workout-form";
import type { ActivityDraft } from "@outlyne/core";

type ActivityFormProps = {
  draft: ActivityDraft;
  onChange: (draft: ActivityDraft) => void;
  onSubmit: () => void;
};

export function ActivityForm({ draft, onChange, onSubmit }: ActivityFormProps) {
  switch (draft.activity) {
    case "reading":
      return (
        <ReadingForm
          values={draft.details}
          onChange={(details) => onChange({ activity: "reading", details })}
          onSubmit={onSubmit}
        />
      );
    case "workout":
      return (
        <WorkoutForm
          values={draft.details}
          onChange={(details) => onChange({ activity: "workout", details })}
          onSubmit={onSubmit}
        />
      );
    case "habit":
      return (
        <HabitForm
          values={draft.details}
          onChange={(details) => onChange({ activity: "habit", details })}
          onSubmit={onSubmit}
        />
      );
    case "recipe":
      return (
        <RecipeForm
          values={draft.details}
          onChange={(details) => onChange({ activity: "recipe", details })}
          onSubmit={onSubmit}
        />
      );
  }
}
